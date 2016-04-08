/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Contains all the routes that follows /admin                                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const admin = require('../handlers/admin.js')
const students = require('../handlers/admin-students.js')
const teachers = require('../handlers/admin-teachers.js')
const subjects = require('../handlers/admin-subjects.js')
const batches = require('../handlers/admin-batches.js')


//routes for main admin page
router.get('/admin', admin.main);          
router.get('/admin/logout', admin.getLogout)


//routes for students
router.get('/admin/students',             students.list);          
router.get('/admin/students/add',         students.add);           
router.post('/admin/students/add',        students.processAdd);   
router.get('/admin/students/:id',         students.view); 
router.get('/admin/students/:id/delete',  students.delete);        
router.post('/admin/students/:id/delete', students.processDelete); 
router.get('/admin/students/:id/edit',    students.edit);         
router.post('/admin/students/:id/edit',   students.processEdit); 
/*
 

//routes for teachers
router.get('/admin/teachers',             admin.list);          
router.get('/admin/teachers/add',         admin.add);           
router.get('/admin/teachers/:id',         admin.view);          
router.get('/admin/teachers/:id/edit',    admin.edit);          
router.get('/admin/teachers/:id/delete',  admin.delete);        
router.post('/admin/teachers/add',        admin.processAdd);    
router.post('/admin/teachers/:id/edit',   admin.processEdit);   
router.post('/admin/teachers/:id/delete', admin.processDelete); 

//routes for Subjects
router.get('/admin/subjects',             admin.list);          
router.get('/admin/subjects/add',         admin.add);           
router.get('/admin/subjects/:id',         admin.view);          
router.get('/admin/subjects/:id/edit',    admin.edit);          
router.get('/admin/subjects/:id/delete',  admin.delete);       
router.post('/admin/subjects/add',        admin.processAdd);    
router.post('/admin/subjects/:id/edit',   admin.processEdit);   
router.post('/admin/subjects/:id/delete', admin.processDelete); 

//routes for batches
router.get('/admin/batches',             admin.list);          
router.get('/admin/batches/add',         admin.add);           
router.get('/admin/batches/:id',         admin.view);          
router.get('/admin/batches/:id/edit',    admin.edit);          
router.get('/admin/batches/:id/delete',  admin.delete);        
router.post('/admin/batches/add',        admin.processAdd);    
router.post('/admin/batches/:id/edit',   admin.processEdit);   
router.post('/admin/batches/:id/delete', admin.processDelete); 
*/
module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
