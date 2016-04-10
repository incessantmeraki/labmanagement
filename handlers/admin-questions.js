'use strict';

const Question  = require('../models/question.js');

const questions = module.exports = {};

/**
 * GET /questions/:id/delete - render delete-member page
 */
 questions.delete = function*() {
    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try{
        const question = yield Question.get(this.params.id);
        const subjectId= question.SubjectId;
        // this.body=question;
        // if (!question) this.throw(404, 'Member not found');
        yield Question.delete(this.params.id);
        this.redirect('/admin/subjects/'+subjectId);
    }catch (e) {
        // stay on same page to report error
        this.flash = { _error: e.message };
        this.redirect(this.url);
    }

};



/**
 * GET /subjects/:id/questions/add - render add-question page
 */
 questions.edit = function*() {
    // member details
    let question = yield Question.get(this.params.id);
    if (!question) this.throw(404, 'Member not found');
    
    const context = question;
    yield this.render('templates/admin-questions-edit', context);
};

/**
 * POST /subjects - process add-member
 */
 questions.processEdit = function*() {

    if (this.passport.user.Role != 'admin') return this.redirect('/');

    try {
        const question = yield Question.get(this.params.id);
        const subjectId= question.SubjectId;
        const questionQuery = {
            Question: this.request.body.Question,
            SubjectId: subjectId
        };
        // this.body=questionQuery;
        yield Question.update(this.params.id,questionQuery);
        this.redirect('/admin/subjects/'+subjectId);
    } catch (e) {
        // stay on same page to report error (with current filled fields)
        this.flash = { formdata: this.request.body, _error: e.message };
        this.redirect(this.url);
    }
};