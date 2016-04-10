'use strict';

const Subject =  require('../models/subject.js');
const Question  = require('../models/question.js');
const Batch  = require('../models/batch.js');

const subjects = module.exports = {};


/**
 * GET /subjects - render list-subjects page.
 *
 * Results can be filtered with URL query strings eg /subjects?firstname=alice.
 */
 subjects.list = function*() {
    // build sql query including any query-string filters; eg ?field1=val1&field2=val2 becomes
    // "Where field1 = :field1 And field2 = :field2"
    let sql = 'Select * From Subject';

    try {

        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const subjects = result[0];

        const context = { subjects: subjects };
        yield this.render('templates/admin-subjects-list', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * GET /subjects/add - render add-member page
 */
 subjects.add = function*() {
    const context = this.flash.formdata || {}; // failed validation? fill in previous values
    yield this.render('templates/admin-subjects-add', context);
};

/**
 * POST /subjects - process add-member
 */
 subjects.processAdd = function*() {

    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try {
        const newid = yield Subject.insert(this.request.body);
        this.redirect('/admin/subjects');

    } catch (e) {
        // stay on same page to report error (with current filled fields)
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};


/**
 * GET /subjects/:id - render view-member page
 */
 subjects.view = function*() {
    const subject = yield Subject.get(this.params.id);
    if (!subject) this.throw(404, 'Subject not found');

    //Getting questions to display
    const sql = `Select * 
    From Question 
    Where SubjectId = ? `;
    const result = yield this.db.query(sql,this.params.id);

    //Getting batches to display
    const sql1= `Select *  
    From Batch
    Where SubjectId = ? `;
    const result1 = yield this.db.query(sql1,this.params.id);

    const context = { questions: result[0] };
    context.batches = result1[0];
    // context.teams = teams;
    // this.body="reached here";
    this.body=result[0];
    context.SubjectId = this.params.id;
    yield this.render('templates/admin-subjects-view.html', context);
};



/**
 * GET /questions/:id/delete - render delete-member page
 */
 subjects.delete = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try{
        yield Subject.delete(this.params.id);
        this.redirect('/admin/subjects/');
    }catch (e) {
        // stay on same page to report error
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }

};

/**
 * GET /subjects/:id/edit - render edit-student page
 */
 subjects.edit = function*() {
    // member details
    let subject = yield Subject.get(this.params.id);
    if (!subject) this.throw(404, 'Member not found');

    const context = subject;
    yield this.render('templates/admin-subjects-edit', context);
};

/**
 * POST /members/:id/edit - process edit-member
 */
 subjects.processEdit = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/');

    // update member details
    if ('Subjectname' in this.request.body) {
        try {

            yield Subject.update(this.params.id, this.request.body);

            // return to list of members
            this.redirect('/admin/subjects');

        } catch (e) {
            // stay on same page to report error (with current filled fields)
            this.flash = { formdata: this.request.body, _error: e.message };
            this.redirect(this.url);
        }
    }
};

/**
 * GET /subjects/:id/questions/add - render add-question page
 */
 subjects.addQuestions = function*() {
    const context = this.flash.formdata || {}; // failed validation? fill in previous values
    yield this.render('templates/admin-subjects-questions-add', context);
};

/**
 * POST /subjects - process add-member
 */
 subjects.processAddQuestions = function*() {

    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try {
        const questionQuery = {
            Question: this.request.body.Question,
            SubjectId: this.params.id
        };
        const newid = yield Question.insert(questionQuery);
        this.redirect('/admin/subjects/'+this.params.id);
    } catch (e) {
        // stay on same page to report error (with current filled fields)
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};

/**
 * GET /subjects/:id/batches/add - render add-batches page
 */
 subjects.addBatches = function*() {
    let sql1 = 'Select * From Teacher';
    let sql2 = 'Select * From Student';

    try {

        const result1 = yield this.db.query({ sql: sql1, namedPlaceholders: true }, this.query);
        const teachers = result1[0];

        const result2 = yield this.db.query({ sql: sql2, namedPlaceholders: true });
        const students = result2[0];

        const context = { 
            teachers: teachers,
            students: students 
        };
        // this.body=students;
        yield this.render('templates/admin-subjects-batches-add', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * POST /subjects - process add-member
 */
 subjects.processAddBatches = function*() {

    this.body = this.request.body;
    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try {
        const batchValue = {
            SubjectId: this.params.id
        };
        const newid = yield Batch.insert(batchValue);
        this.body = newid;

        //sql to insert into teacherbatch
        const teacherBatch = {
            TeacherId : this.request.body.TeacherId,
            BatchId : newid
        };
        // this.body= teacherBatch;
        yield GLOBAL.db.query('Insert Into TeacherBatch Set ?', teacherBatch);

        //inserting into studentbatch
        const  students = this.request.body.StudentId;
        for(let i=0;  i < students.length;i++){
            const studentBatch = {
                StudentId: students[i],
                BatchId: newid
            };
            yield GLOBAL.db.query('Insert into StudentBatch Set ?',studentBatch);
        }   
        
        this.redirect('/admin/subjects/'+this.params.id);
    } catch (e) {
        // stay on same page to report error (with current filled fields)
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};