'use strict';

const Subject =  require('../models/subject.js');
const Question  = require('../models/question.js');
const Batch  = require('../models/batch.js');
const Student  = require('../models/student.js');


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

        //get student object 
        const student = yield Student.get(this.params.id);
        if (!student) this.throw(404, 'Student not found');

        const context = student;
        context.subjects= subjects ;

        yield this.render('templates/student-subjects-list', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};

/**
 * GET /subjects/:id - render view-member page
 */
 subjects.view = function*() {
    const subject = yield Subject.get(this.params.sid);
    if (!subject) this.throw(404, 'Subject not found');

    //get student object 
    const student = yield Student.get(this.params.id);
    if (!student) this.throw(404, 'Student not found');
    
    //Getting questions to display
    const sql = `Select * 
                From Question 
                Where SubjectId = ? `;
    const result = yield this.db.query(sql,this.params.sid);

   

    //getting all batches
    const sql1= `Select *  
                From Batch
                Where SubjectId = ? `;
    const result1 = yield this.db.query(sql1,this.params.sid);

    let allBatches=[];
    for (let i = 0 ; i<result1[0].length;i++){
        allBatches.push(result1[0][i].BatchId);
    }
    this.body = allBatches;
    

    //getting batches of this student
    const sql2= `Select *  
                From StudentBatch
                Where StudentId = ? `;
    const result2 = yield this.db.query(sql2,this.params.id);

    let studentBatches=[];
    for (let i = 0 ; i<result2[0].length;i++){
        studentBatches.push(result2[0][i].BatchId);
    }
    this.body=studentBatches;

    //intersection of allBatches and studentBatches
    let requiredBatches = [];
    for (let i = 0 ; i < studentBatches.length; i++){
        if (allBatches.indexOf(studentBatches[i]) != -1 )
            requiredBatches.push(studentBatches[i]);
    }

    this.body= requiredBatches;

    //creating batches array to pass as context
    let batches = [];
    for (let i = 0; i < requiredBatches.length; i++){
        let batch = {
            BatchId:'',
            Teachername:''
        };

        let bid = requiredBatches[i];
        let sql = 'Select TeacherId From TeacherBatch where BatchId = ?';
        const result1 = yield GLOBAL.db.query(sql,bid);
        const teacherId = result1[0][0].TeacherId;

        let sql1 = 'Select Firstname, Lastname From Teacher where TeacherId=?';
        const result2 = yield GLOBAL.db.query(sql1,teacherId);
        let teacherName = result2[0][0].Firstname + ' '+ result2[0][0].Lastname;

        batch.BatchId = bid;
        batch.Teachername = teacherName;
        batches.push(batch);
    }

    //passing required values to context and rendering page with the context
    const context = student;
    context.questions = result[0];
    context.batches = batches;
    context.SubjectId = this.params.sid;
    yield this.render('templates/student-subjects-view.html', context);
};
