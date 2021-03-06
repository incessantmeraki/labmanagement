/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Contains all the routes that follows /student                                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const student = require('../handlers/student.js')
const subjects = require('../handlers/student-subjects.js')


//routes for main student page
router.get('/student', student.main);          
router.get('/student/:id', student.mainRedirect);          
router.get('/student/:id/logout', student.getLogout)

//routes for subjects
router.get('/student/:id/subjects/',             subjects.list);          
router.get('/student/:id/subject/:sid',             subjects.view);          



module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
