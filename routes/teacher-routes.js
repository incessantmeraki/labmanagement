/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Contains all the routes that follows /teacher                                                   */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';

const router = require('koa-router')(); // router middleware for koa

const teacher = require('../handlers/teacher.js')
const subjects = require('../handlers/student-subjects.js')
const batches = require('../handlers/teacher-batches.js')


//routes for main student page
router.get('/teacher', teacher.main);          
router.get('/teacher/:id', teacher.mainRedirect);          
router.get('/teacher/:id/logout', teacher.getLogout)

//routes for subjects
router.get('/teacher/:id/batches/',             batches.list);          
router.get('/teacher/:id/batch/:bid',             batches.view);          



module.exports = router.middleware();

/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
