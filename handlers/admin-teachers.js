'use strict';

const User =  require('../models/user.js');
const Teacher  = require('../models/teacher.js');

const teachers = module.exports = {};


/**
 * GET /teachers - render list-teachers page.
 *
 * Results can be filtered with URL query strings eg /teachers?firstname=alice.
 */
 teachers.list = function*() {
    let sql = 'Select * From Teacher';

    try {

        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const teachers = result[0];

        const context = { teachers: teachers };
        yield this.render('templates/admin-teachers-list', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * GET /teachers/add - render add-member page
 */
 teachers.add = function*() {
    const context = this.flash.formdata || {}; // failed validation? fill in previous values
    yield this.render('templates/admin-teachers-add', context);
};

/**
 * POST /teachers - process add-member
 */
 teachers.processAdd = function*() {

    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try {
        const userVals = {Email:this.request.body.Email,Password:this.request.body.Email,Role:'teacher'};
        const userId = yield User.insert(userVals);
        const teachersVals ={
            Firstname:this.request.body.Firstname,
            Lastname:this.request.body.Lastname,
            UserId:userId
        };

        const newid = yield Teacher.insert(teachersVals);
        this.redirect('/admin/teachers');

    } catch (e) {
        // stay on same page to report error (with current filled fields)
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};


/**
 * GET /teachers/:id - render view-member page
 */
 teachers.view = function*() {
    const teacher = yield Teacher.get(this.params.id);
    if (!teacher) this.throw(404, 'Teacher not found');

    //Getting login details
    const sql = `Select Email, Password 
    From User 
    Where UserId = ? `;
    const result = yield this.db.query(sql,teacher.UserId);

    //setting context to render the view
    const context = teacher;
    context.Email=result[0][0].Email;
    context.Password=result[0][0].Password; 

    // context.teams = teams;
    yield this.render('templates/admin-teachers-view', context);
};

/**
 * GET /teachers/:id/delete1 - render delete-member page
 */
 teachers.delete1 = function*() {
     try{
        let teacher = yield Teacher.get(this.params.id);
        let userId = teacher.UserId;
        // this.body = userId;
        yield this.db.query('Delete From TeacherBatch Where TeacherId = ?',this.params.id);
        
        yield Teacher.delete(this.params.id);
        yield User.delete(userId);
        this.redirect('/admin/teachers');

    }catch (e) {
        // stay on same page to report error
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }
};

/**
 * GET /teachers/:id/delete - render delete-member page
 */
 teachers.delete = function*() {
    const teacher = yield Teacher.get(this.params.id);
    if (!teacher) this.throw(404, 'Member not found');

    const context = teacher;
    yield this.render('templates/admin-teachers-delete', context);
};

/**
 * POST /teachers/:id/delete - process delete member
 */
 teachers.processDelete = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/login'+this.url);
    try {
        const teacher = yield Teacher.get(this.params.id);

        //Store value of user id of teacher
        var userId= teacher.UserId;
        yield Teacher.delete(this.params.id);
        yield User.delete(userId);

        // return to list of teachers
        this.redirect('/admin/teachers');

    } catch (e) {
        // stay on same page to report error
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }
};

/**
 * GET /teachers/:id/edit - render edit-teacher page
 */
teachers.edit = function*() {
    // member details
    let teacher = yield Teacher.get(this.params.id);
    if (!teacher) this.throw(404, 'Member not found');


    const context = teacher;
    yield this.render('templates/admin-teachers-edit', context);
};

/**
 * POST /members/:id/edit - process edit-member
 */
teachers.processEdit = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/');

    // update member details
    if ('Firstname' in this.request.body) {
        try {

            yield Teacher.update(this.params.id, this.request.body);

            // return to list of members
            this.redirect('/admin/teachers');

        } catch (e) {
            // stay on same page to report error (with current filled fields)
            this.flash = { formdata: this.request.body, _error: e.message };
            this.redirect(this.url);
        }
    }
};