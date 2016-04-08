/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Login handlers (invoked by router to render templates)                                         */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const admin = module.exports = {};

/**
 * GET / - render main admin page
 */
admin.main = function*() {
    if(this.passport.user.Role != 'admin') return this.redirect('/');
    yield this.render('templates/admin-index');
};


/**
 * GET /logout - logout user
 */
admin.getLogout = function*() {
    this.logout();
    this.session = null;
    this.redirect('/');
};