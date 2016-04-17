/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Login handlers (invoked by router to render templates)                                         */
/*                                                                                                */
/* All functions here either render or redirect, or throw.                                        */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const student = module.exports = {};
const Student  = require('../models/student.js');

/**
 * GET / - render main student page
 */
student.main = function*() {
    if(this.passport.user.Role != 'student') return this.redirect('/');
    //Getting Student details
    const sql = `Select * 
                From Student 
                Where UserId = ? `;
    const result = yield this.db.query(sql,this.passport.user.UserId);
    //setting context to render the view
    const context = result[0][0];

    // context.teams = teams;
    this.redirect('/student/'+result[0][0].StudentId);
};

/**
 * GET / - render main student page
 */
student.mainRedirect = function*() {
    const student = yield Student.get(this.params.id);
    if (!student) this.throw(404, 'Student not found');
    yield this.render('templates/student-index',student);
};


/**
 * GET /logout - logout user
 */
student.getLogout = function*() {
    this.logout();
    this.session = null;
    this.redirect('/');
};