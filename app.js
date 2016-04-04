'use strict';
/* eslint no-shadow:0 *//* app is already declared in the upper scope */

const koa          = require('koa');               // Koa framework
const body         = require('koa-body');          // body parser
const compose      = require('koa-compose');       // middleware composer
const compress     = require('koa-compress');      // HTTP compression
const responseTime = require('koa-response-time'); // X-Response-Time middleware
const session      = require('koa-session');       // session for passport login, flash messages
const mysql        = require('mysql-co');          // MySQL (co wrapper for mysql2)
const handlebars   = require('koa-handlebars');
const flash        = require('koa-flash');
const passport     = require('koa-passport');
const serve        = require('koa-static');

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


if (!module.parent) {
    /* eslint no-console: 0 */
    app.listen(process.env.PORT||3000);
    const db = require('./config/db-'+app.env+'.json').db.database;
    console.log(process.version+' listening on port '+(process.env.PORT||3000)+' ('+app.env+'/'+db+')');
}


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
