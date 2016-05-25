/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Contains all the routes that follows /admin                                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const admin = require('../handlers/admin.js')
const students = require('../handlers/admin-students.js')
const teachers = require('../handlers/admin-teachers.js')
const subjects = require('../handlers/admin-subjects.js')
const questions = require('../handlers/admin-questions.js')
const batches = require('../handlers/admin-batches.js')


//routes for main admin page
router.get('/admin', admin.main);          
router.get('/admin/logout', admin.getLogout)


//routes for students
router.get('/admin/students',             students.list);          
router.get('/admin/students/add',         students.add);           
router.post('/admin/students/add',        students.processAdd);   
router.get('/admin/students/:id',         students.view); 
router.get('/admin/students/:id/delete',  students.delete1);        
// router.post('/admin/students/:id/delete', students.processDelete); 
router.get('/admin/students/:id/edit',    students.edit);         
router.post('/admin/students/:id/edit',   students.processEdit); 

 
 //routes for teachers
router.get('/admin/teachers',             teachers.list);          
router.get('/admin/teachers/add',         teachers.add);           
router.post('/admin/teachers/add',        teachers.processAdd);   
router.get('/admin/teachers/:id',         teachers.view); 
router.get('/admin/teachers/:id/delete',  teachers.delete1);        
// router.post('/admin/teachers/:id/delete', teachers.processDelete); 
router.get('/admin/teachers/:id/edit',    teachers.edit);         
router.post('/admin/teachers/:id/edit',   teachers.processEdit); 

//routes for subjects
router.get('/admin/subjects',             subjects.list);          
router.get('/admin/subjects/add',         subjects.add);           
router.post('/admin/subjects/add',        subjects.processAdd);    
router.get('/admin/subjects/:id/edit',    subjects.edit);          
router.post('/admin/subjects/:id/edit',   subjects.processEdit);   
router.get('/admin/subjects/:id',         subjects.view);          
router.get('/admin/subjects/:id/delete',  subjects.delete);       
     

// introducing routes of questions
router.get('/admin/subjects/:id/questions/add', subjects.addQuestions);          
router.post('/admin/subjects/:id/questions/add', subjects.processAddQuestions);     
router.get('/admin/questions/:id/edit', questions.edit);
router.post('/admin/questions/:id/edit', questions.processEdit);
router.get('/admin/questions/:id/delete', questions.delete);



//routes for batches
router.get('/admin/subjects/:id/batches/add', subjects.addBatches);          
router.post('/admin/subjects/:id/batches/add', subjects.processAddBatches);     
router.get('/admin/batches/:id',         batches.view);          
router.get('/admin/batches/:bid/delete/student/:sid',  batches.deleteStudent);        
router.get('/admin/batches/:bid/edit/teacher/:tid',    batches.editTeacher);          
router.post('/admin/batches/:bid/edit/teacher/:tid',   batches.processEditTeacher);   
router.get('/admin/batches/:id/add/student',    batches.addStudents);          
router.post('/admin/batches/:id/add/student',batches.processAddStudents)
router.get('/admin/batches/:id/delete',batches.delete)
/*

*/
module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
