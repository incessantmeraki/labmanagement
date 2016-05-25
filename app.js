'use strict';

const koa          = require('koa');               // Koa framework
const body         = require('koa-body');          // body parser
const compose      = require('koa-compose');       // middleware composer
const compress     = require('koa-compress');      // HTTP compression
const responseTime = require('koa-response-time'); // X-Response-Time middleware
const session      = require('koa-session');       // session for passport login, flash messages
const mysql        = require('mysql-co');          // MySQL (co wrapper for mysql2)
const handlebars   = require('koa-handlebars');    // handlebars templating
const flash        = require('koa-flash');         // flash messages
const passport     = require('koa-passport');      // authentication
const serve        = require('koa-static');        // static file serving middleware
const helmet       = require('koa-helmet');        // security header middleware


const app = module.exports = koa();


// return response time in X-Response-Time header
app.use(responseTime());


// HTTP compression
app.use(compress({}));


// parse request body into ctx.request.body
app.use(body());


// session for passport login, flash messages
app.keys = ['lab_management'];
app.use(session(app));


// MySQL connection pool TODO: how to catch connection exception eg invalid password?
const config = require('./config/db-'+app.env+'.json');
GLOBAL.connectionPool = mysql.createPool(config.db); // put in GLOBAL to pass to sub-apps

// set up MySQL connection
app.use(function* mysqlConnection(next) {
    // keep copy of this.db in GLOBAL for access from models
    this.db = GLOBAL.db = yield GLOBAL.connectionPool.getConnection();
    // traditional mode ensures not null is respected for unsupplied fields, ensures valid JavaScript dates, etc
    yield this.db.query('SET SESSION sql_mode = "TRADITIONAL"');

    yield next;

    this.db.release();
});


// use passport authentication (local auth)
require('./passport.js');
app.use(passport.initialize());
app.use(passport.session());


 // handle thrown or uncaught exceptions anywhere down the line
app.use(function* handleErrors(next) {
    try {

        yield next;

    } catch (e) {
        let context = null;
        this.status = e.status || 500;
        switch (this.status) {
            case 404: // Not Found
                context = { msg: e.message=='Not Found'?null:e.message };
                yield this.render('templates/404-not-found', context);
                break;
            case 403: // Forbidden
            case 409: // Conflict
                yield this.render('templates/400-bad-request', e);
                break;
            case 500: // Internal Server Error
                context = app.env=='production' ? {} : { e: e };
                yield this.render('templates/500-internal-server-error', context);
                this.app.emit('error', e, this); // github.com/koajs/examples/blob/master/errors/app.js
                break;
        }
    }
});


// handlebars templating
app.use(handlebars({
    extension:   ['html', 'handlebars'],
    viewsDir:    '.',
    partialsDir: './templates/partials',
}));


//flash messages
app.use(flash());


// helmet security headers
app.use(helmet());
app.use(serve('public', { maxage: 1000*60*60 }));


//---------- Routing ----------//

app.use(require('./routes/index-routes.js'));

//verify user has authenticated
app.use(function* authSecureRoutes(next) {
    if (this.isAuthenticated()) {
        yield next;
    } else {
        this.redirect('/');
    }
});



// app.use(require('./routes/index-routes.js'));
app.use(require('./routes/admin-routes.js'));
app.use(require('./routes/student-routes.js'));
app.use(require('./routes/teacher-routes.js'));



// end of the line: 404 status for any resource not found
app.use(function* notFound(next) {
    yield next; // actually no next...

    this.status = 404;
    yield this.render('templates/404-not-found');
});


if (!module.parent) {
    app.listen(process.env.PORT||3000);
    const db = require('./config/db-'+app.env+'.json').db.database;
    console.log(process.version+' listening on port '+(process.env.PORT||3000)+' ('+app.env+'/'+db+')');
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
