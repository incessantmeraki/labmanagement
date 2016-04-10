/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Question model                                                                                   */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const ModelError = require('./modelerror.js');

const Question = module.exports = {};


/**
 * Returns Question details (convenience wrapper for single Question details).
 *
 * @param   {number} id - Question id or undefined if not found.
 * @returns {Object} Question details.
 */
Question.get = function*(id) {
    const result = yield GLOBAL.db.query('Select * From Question Where QuestionId = ?', id);
    const members = result[0];
    return members[0];
};


/**
 * Returns Members with given field matching given value (convenience wrapper for simple filter).
 *
 * @param   {string}        field - Field to be matched.
 * @param   {string!number} value - Value to match against field.
 * @returns {Object[]}      Members details.
 */
Question.getBy = function*(field, value) {
    try {

        const sql = `Select * From Question Where ${field} = ? `;

        const result = yield GLOBAL.db.query(sql, value);
        const members = result[0];

        return members;

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': throw ModelError(403, 'Unrecognised Question field '+field);
            default: throw ModelError(500, e.message);
        }
    }
};


/**
 * Creates new Question record.
 *
 * @param   {Object} values - Question details.
 * @returns {number} New Question id.
 * @throws  Error on validation or referential integrity errors.
 */
Question.insert = function*(values) {
    // validation - somewhat artificial example serves to illustrate principle
    if (values.Question==null) {
        throw ModelError(403, 'Question must be supplied');
    }

    try {

        const result = yield GLOBAL.db.query('Insert Into Question Set ?', values);
        //console.log('Question.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for Question.update - just use default MySQL messages for now
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message); // Forbidden
            case 'ER_DUP_ENTRY':
                throw ModelError(409, e.message); // Conflict
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Update Question details.
 *
 * @param  {number} id - Question id.
 * @param  {Object} values - Question details.
 * @throws Error on validation or referential integrity errors.
 */
Question.update = function*(id, values) {
     // validation - somewhat artificial example serves to illustrate principle
    if (values.Question==null) {
        throw ModelError(403, 'Question must be supplied');
    }

    try {

        yield GLOBAL.db.query('Update Question Set ? Where QuestionId = ?', [values, id]);
        //console.log('Question.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Question.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                Lib.logException('Question.update', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Question record.
 *
 * @param  {number} id - Question id.
 * @throws Error on referential integrity errors.
 */
Question.delete = function*(id) {
    try {

        yield GLOBAL.db.query('Delete From Question Where QuestionId = ?', id);
        //console.log('Question.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
                // related record exists in TeamMember
                throw ModelError(403, 'Submission for this question has been made'); // Forbidden
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
