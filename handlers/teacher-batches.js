'use strict';

const Subject =  require('../models/subject.js');
const Question  = require('../models/question.js');
const Batch  = require('../models/batch.js');
const Teacher  = require('../models/teacher.js');
const Student  = require('../models/student.js');


const batches = module.exports = {};


/**
 * GET /batches - render list-batches page.
 *
 * Results can be filtered with URL query strings eg /batches?firstname=alice.
 */
 batches.list = function*() {
    let sql = `Select * From TeacherBatch where teacherId = ? `;

    try {

        const result = yield this.db.query(sql,this.params.id);
        const batches = result[0];

        //get teacher object 
        const teacher = yield Teacher.get(this.params.id);
        if (!teacher) this.throw(404, 'Teacher not found');

        const context = teacher;
        context.batches= batches ;

        yield this.render('templates/teacher-batches-list', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * GET /batches/:id - render view-member page
 */
 batches.view = function*() {
    //get student id of respective batch
    const sql1 = `Select * From Batch where BatchId = ?`;
    const result1= yield this.db.query(sql1,this.params.bid);
    const subId = result1[0][0].SubjectId;

    //get teacher object 
    const teacher = yield Teacher.get(this.params.id);
    if (!teacher) this.throw(404, 'Teacher not found');

    //Getting questions to display
    const sql2 = `Select * 
                From Question 
                Where SubjectId = ? `;
    const result2 = yield this.db.query(sql2,subId);
    this.body = result2[0];

    //get students in this particular batch
    const students = [];
    const sql3 = `Select * from StudentBatch where BatchId = ? `;
    const result3 = yield this.db.query(sql3, this.params.bid);
    for ( let i = 0 ; i < result3[0].length; i++){
        let student = {
            StudentId : '',
            Studentname : ''
        };
        const sId = result3[0][i].StudentId;
        const sql = `Select * from Student where StudentId = ?`;
        const result = yield this.db.query(sql,sId);
        student. StudentId = result[0][0].StudentId;
        student. Studentname = result[0][0].Firstname + ' '+ result[0][0].Lastname;
        students.push(student);
    }    
    this.body = students;
    
   
    //Getting subject name
    const sql4 = `Select SubjectName from Subject where SubjectId = ?`;
    const result4 = yield this.db.query(sql4,subId);

    
    // //passing required values to context and rendering page with the context
    const context = teacher;
    context.questions = result2[0];
    context.students = students;
    context.Subjectname = result4[0][0].SubjectName;
    yield this.render('templates/teacher-batches-view.html', context);
};
