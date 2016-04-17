/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Login handlers (invoked by router to render templates)                                         */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const teacher = module.exports = {};
const Teacher  = require('../models/teacher.js');

/**
 * GET / - render main teacher page
 */
teacher.main = function*() {
    if(this.passport.user.Role != 'teacher') return this.redirect('/');
    //Getting Teacher details
    const sql = `Select * 
                From Teacher 
                Where UserId = ? `;
    const result = yield this.db.query(sql,this.passport.user.UserId);
    //setting context to render the view
    const context = result[0][0];

    // context.teams = teams;
    this.redirect('/teacher/'+result[0][0].TeacherId);
};

/**
 * GET / - render main teacher page
 */
teacher.mainRedirect = function*() {
    const teacher = yield Teacher.get(this.params.id);
    if (!teacher) this.throw(404, 'Teacher not found');
    yield this.render('templates/teacher-index',teacher);
};


/**
 * GET /logout - logout user
 */
teacher.getLogout = function*() {
    this.logout();
    this.session = null;
    this.redirect('/');
};