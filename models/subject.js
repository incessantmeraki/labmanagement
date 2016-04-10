/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Subject model                                                                                   */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const ModelError = require('./modelerror.js');

const Subject = module.exports = {};


/**
 * Returns Subject details (convenience wrapper for single Subject details).
 *
 * @param   {number} id - Subject id or undefined if not found.
 * @returns {Object} Subject details.
 */
Subject.get = function*(id) {
    const result = yield GLOBAL.db.query('Select * From Subject Where SubjectId = ?', id);
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
Subject.getBy = function*(field, value) {
    try {

        const sql = `Select * From Subject Where ${field} = ? Order By Subjectname`;

        const result = yield GLOBAL.db.query(sql, value);
        const members = result[0];

        return members;

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': throw ModelError(403, 'Unrecognised Subject field '+field);
            default: throw ModelError(500, e.message);
        }
    }
};


/**
 * Creates new Subject record.
 *
 * @param   {Object} values - Subject details.
 * @returns {number} New Subject id.
 * @throws  Error on validation or referential integrity errors.
 */
Subject.insert = function*(values) {
    // validation - somewhat artificial example serves to illustrate principle
    if (values.Subjectname==null ) {
        throw ModelError(403, 'Subjectname must be supplied');
    }

    try {

        const result = yield GLOBAL.db.query('Insert Into Subject Set ?', values);
        //console.log('Subject.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for Subject.update - just use default MySQL messages for now
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
 * Update Subject details.
 *
 * @param  {number} id - Subject id.
 * @param  {Object} values - Subject details.
 * @throws Error on validation or referential integrity errors.
 */
Subject.update = function*(id, values) {
     // validation - somewhat artificial example serves to illustrate principle
    if (values.Subjectname==null ) {
        throw ModelError(403, 'Subjectname must be supplied');
    }

    try {

        yield GLOBAL.db.query('Update Subject Set ? Where SubjectId = ?', [values, id]);
        //console.log('Subject.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Subject.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Subject record.
 *
 * @param  {number} id - Subject id.
 * @throws Error on referential integrity errors.
 */
Subject.delete = function*(id) {
    try {

        yield GLOBAL.db.query('Delete From Subject Where SubjectId = ?', id);
        //console.log('Subject.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
                // related record exists in TeamMember
                throw ModelError(403, 'Subject belongs to batch(s) and questions'); // Forbidden
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
