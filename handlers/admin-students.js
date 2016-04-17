'use strict';

const User =  require('../models/user.js');
const Student  = require('../models/student.js');

const students = module.exports = {};


/**
 * GET /students - render list-students page.
 *
 * Results can be filtered with URL query strings eg /students?firstname=alice.
 */
 students.list = function*() {
    // build sql query including any query-string filters; eg ?field1=val1&field2=val2 becomes
    // "Where field1 = :field1 And field2 = :field2"
    let sql = 'Select * From Student';

    try {

        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const students = result[0];

        const context = { students: students };
        yield this.render('templates/admin-students-list', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * GET /students/add - render add-member page
 */
 students.add = function*() {
    const context = this.flash.formdata || {}; // failed validation? fill in previous values
    yield this.render('templates/admin-students-add', context);
};

/**
 * POST /students - process add-member
 */
 students.processAdd = function*() {

    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try {
        const userVals = {Email:this.request.body.Email,Password:this.request.body.Email,Role:'student'};
        const userId = yield User.insert(userVals);
        const studentsVals ={
            Firstname:this.request.body.Firstname,
            Lastname:this.request.body.Lastname,
            Semester:this.request.body.Semester,
            UserId:userId
        };

        const newid = yield Student.insert(studentsVals);
        this.redirect('/admin/students');

    } catch (e) {
        // stay on same page to report error (with current filled fields)
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};


/**
 * GET /students/:id - render view-member page
 */
 students.view = function*() {
    const student = yield Student.get(this.params.id);
    if (!student) this.throw(404, 'Student not found');
  
    //Getting login details
    const sql = `Select Email, Password 
    From User 
    Where UserId = ? `;
    const result = yield this.db.query(sql,student.UserId);

    //setting context to render the view
    const context = student;
    context.Email=result[0][0].Email;
    context.Password=result[0][0].Password; 

    // context.teams = teams;
    yield this.render('templates/admin-students-view', context);
};



/**
 * GET /students/:id/delete - render delete-member page
 */
 students.delete = function*() {
    const student = yield Student.get(this.params.id);
    if (!student) this.throw(404, 'Member not found');

    const context = student;
    yield this.render('templates/admin-students-delete', context);
};

/**
 * POST /students/:id/delete - process delete member
 */
 students.processDelete = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    try {
        const student = yield Student.get(this.params.id);

        //Store value of user id of student
        var userId= student.UserId;
        yield Student.delete(this.params.id);
        yield User.delete(userId);

        // return to list of students
        this.redirect('/admin/students');

    } catch (e) {
        // stay on same page to report error
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }
};

/**
 * GET /students/:id/edit - render edit-student page
 */
students.edit = function*() {
    // member details
    let student = yield Student.get(this.params.id);
    if (!student) this.throw(404, 'Member not found');

    const context = student;
    yield this.render('templates/admin-students-edit', context);
};

/**
 * POST /students/:id/edit - process edit-member
 */
students.processEdit = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/');

    // update member details
    if ('Firstname' in this.request.body) {
        try {

            yield Student.update(this.params.id, this.request.body);

            // return to list of members
            this.redirect('/admin/students');

        } catch (e) {
            // stay on same page to report error (with current filled fields)
            this.flash = { formdata: this.request.body, _error: e.message };
            this.redirect(this.url);
        }
    }
};