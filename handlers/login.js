'use strict';

const passport = require('koa-passport'); // authentication

const handler = module.exports = {};

/**
 * GET /login - render login page
 *
 * Allow url after the 'login', to specify a redirect after a successful login
 */
handler.getLogin = function*() {
    const context = this.flash.formdata || {}; // failed login? fill in previous values

    yield this.render('templates/index', context);
};


/**
 * POST /login - process login
 */
handler.postLogin = function* postLogin(next) {
    try {
        // qv github.com/rkusa/koa-passport/blob/master/test/authenticate.js
        // for remember-me function, qv examples in github.com/jaredhanson/passport-local

        const ctx = this; // capture 'this' to pass into callback

        yield* passport.authenticate('local', function*(err, user) {
            if (err) this.throw(err.status||500, err.message);
            if (user) {
                // passport successfully authenticated user: log them in
                yield ctx.login(user);

                let url = ctx.captures[0] ? ctx.captures[0] : '/';
                
                url += ctx.request.body['role'];
                ctx.body = user;
                ctx.redirect(url);
            } else {
                // login failed: redisplay login page with login fail message
                const loginfailmsg = 'E-mail / password not recognised';
                ctx.flash = { formdata: ctx.request.body, loginfailmsg: loginfailmsg };
                ctx.redirect(ctx.url);
            }
        }).call(this, next);

    } catch (e) {
        this.throw(e.status||500, e.message);
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
