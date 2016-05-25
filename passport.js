/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Passport authentication                                                                       */
/*                                                                                                */
/*  see                                                                                           */
/*   - passportjs.org/guide/configure                                                             */
/*   - passportjs.org/guide/username-password                                                     */
/*   - toon.io/understanding-passportjs-authentication-flow                                       */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const co            = require('co');           // generator async control flow goodness
const passport      = require('koa-passport'); // authentication
const LocalStrategy = require('passport-local').Strategy;

const User = require('./models/user.js');


// serialise user: record authenticated user's id in session
passport.serializeUser(function(user, done) {
    done(null, user.UserId);
});


// deserialise user: restore user details to this.passport.user from id stored in session
passport.deserializeUser(function(id, done) {
    // koa-passport can't deserialize through generator functions, so use co to wrap yieldable calls
    co(function*() {
        // lookup user
        const user = yield User.get(id);
        return user || null;
    }).then(function(result) { done(null, result); }, done);
});


// use local strategy - passportjs.org/guide/username-password
passport.use(new LocalStrategy(function(username, password, done) {
    // LocalStrategy doesn't know about generator functions, so use co to wrap yieldable calls
    co(function*() {
        // lookup user
        const users = yield User.getBy('Email', username);
        if (users.length == 0) return false; // user not found
        const user = users[0];

        // verify password matches
        const match = (password ===user.Password);
        if (!match) return false; // no password match

        // validated ok, record return user details
        return user;
    }).then(function(result) { done(null, result); }, done);
}));



