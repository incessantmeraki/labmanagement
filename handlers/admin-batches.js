'use strict';

const Batch =  require('../models/batch.js');
const Subject  = require('../models/subject.js');

const batches = module.exports = {};


/**
 * GET /students - render list-students page.
 *
 * Results can be filtered with URL query strings eg /students?firstname=alice.
 */
 batches.view = function*() {
    let sql1 = 'Select TeacherId From TeacherBatch where BatchId = ?';
    let sql2 = 'Select StudentId From StudentBatch where BatchId =?';
    let sql3 = 'Select Firstname, Lastname From Student where StudentId=?';
    let sql4 = 'Select Firstname, Lastname From Teacher where TeacherId=?';

    const result1 = yield GLOBAL.db.query(sql1,this.params.id);
    const teacherId = result1[0][0].TeacherId;

    const result2 = yield GLOBAL.db.query(sql2,this.params.id);
    const students = result2[0];
        // this.body =students;

        let result = {
            Teacher:{},
            Students:[]
        };

        let teacherName = yield GLOBAL.db.query(sql4,teacherId)
        result.Teacher.TeacherId= teacherId;
        result.Teacher.Teachername = teacherName[0][0].Firstname+' '+ teacherName[0][0].Lastname;


        this.body=students;

        for (var i = 0 ; i < students.length; i++){
            let student = {};
            let studentId = students[i].StudentId;
            student.StudentId = studentId;
            let studentName= yield GLOBAL.db.query(sql3,studentId);
            student.Studentname = studentName[0][0].Firstname + ' ' + studentName[0][0].Lastname;
            result.Students.push(student);
        }

        const context = { 
            teachers: result.Teacher,
            students: result.Students 
        };
        context.BatchId = this.params.id;
        yield this.render('templates/admin-batches-view', context);    

    };

/**
 * GET /admin/batches/:bid/delete/student/:sid - deletes student from batch
 */
 batches.deleteStudent = function*() {

    try{

        yield GLOBAL.db.query('Delete From StudentBatch Where BatchId = ? and StudentId = ?', [this.params.bid, this.params.sid]);
        this.redirect('/admin/batches/'+this.params.bid);

    }catch (e) {
        // stay on same page to report error
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }

};

/**
 * GET /admin/batches/:bid/edit/teacher/:tid - render add-batches page
 */
 batches.editTeacher = function*() {
    let sql1 = 'Select * From Teacher';

    try {

        const result1 = yield this.db.query({ sql: sql1, namedPlaceholders: true });
        const teachers = result1[0];

        const context = { 
            teachers: teachers,
        };
        // this.body=students;
        yield this.render('templates/admin-batches-edit-teacher', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * GET /admin/batches/:bid/edit/teacher/:tid - render add-batches page
 */
 batches.processEditTeacher = function*() {
    let sql = 'Update TeacherBatch Set TeacherId = ? Where BatchId=? and TeacherId=?';

    try {

        yield this.db.query(sql,[this.request.body.TeacherId,
            this.params.bid,this.params.tid]);

        this.redirect('/admin/batches/'+this.params.bid);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * GET /admin/batches/:bid/add/student - render add students to batches page
 */
 batches.addStudents = function*() {
    let sql1 = 'Select * From StudentBatch Where BatchId = ?';

    try {

        const result1 = yield this.db.query(sql1,this.params.id);

        let studs = result1[0].map(function(t){return t.StudentId})
        if (studs.length == 0) studs = [0];

        let sql2 = `Select * from Student where StudentId Not in (${studs.join(',')})`;
        const result2 = yield this.db.query(sql2);

        const context = { 
            students: result2[0]
        };
        yield this.render('templates/admin-batches-add-student', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * POST /batches - add students to batches
 */
 batches.processAddStudents = function*() {

    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try {
        
        //inserting into studentbatch
        const  students = this.request.body.StudentId;
        for(let i=0;  i < students.length;i++){
            const studentBatch = {
                StudentId: students[i],
                BatchId: this.params.id
            };
            yield GLOBAL.db.query('Insert into StudentBatch Set ?',studentBatch);
        }   
        
        this.redirect('/admin/batches/'+this.params.id);
    } catch (e) {
        // stay on same page to report error (with current filled fields)
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};

/**
 * GET /admin/batches/:id/delete/ -deletes batch from subject
 */
batches.delete = function*() {

    try{
        const result = yield GLOBAL.db.query('Select SubjectId from Batch where BatchId = ?',this.params.id);
        const subjectId = result[0][0].SubjectId;
        yield GLOBAL.db.query('Delete From StudentBatch Where BatchId = ?',this.params.id);
        yield GLOBAL.db.query('Delete From TeacherBatch Where BatchId = ?',this.params.id);
        yield GLOBAL.db.query('Delete from Batch Where Batchid = ? ',this.params.id);
        this.redirect('/admin/subjects/'+subjectId);

    }catch (e) {
        // stay on same page to report error
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }
 };   