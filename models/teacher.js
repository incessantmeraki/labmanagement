/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Teacher model                                                                                   */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const ModelError = require('./modelerror.js');

const Teacher = module.exports = {};


/**
 * Returns Teacher details (convenience wrapper for single Teacher details).
 *
 * @param   {number} id - Teacher id or undefined if not found.
 * @returns {Object} Teacher details.
 */
Teacher.get = function*(id) {
    const result = yield GLOBAL.db.query('Select * From Teacher Where TeacherId = ?', id);
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
Teacher.getBy = function*(field, value) {
    try {

        const sql = `Select * From Teacher Where ${field} = ? Order By Firstname, Lastname`;

        const result = yield GLOBAL.db.query(sql, value);
        const members = result[0];

        return members;

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': throw ModelError(403, 'Unrecognised Teacher field '+field);
            default: throw ModelError(500, e.message);
        }
    }
};


/**
 * Creates new Teacher record.
 *
 * @param   {Object} values - Teacher details.
 * @returns {number} New Teacher id.
 * @throws  Error on validation or referential integrity errors.
 */
Teacher.insert = function*(values) {
    // validation - somewhat artificial example serves to illustrate principle
    if (values.Firstname==null && values.Lastname==null) {
        throw ModelError(403, 'Firstname or Lastname must be supplied');
    }

    try {

        const result = yield GLOBAL.db.query('Insert Into Teacher Set ?', values);
        //console.log('Teacher.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for Teacher.update - just use default MySQL messages for now
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
 * Update Teacher details.
 *
 * @param  {number} id - Teacher id.
 * @param  {Object} values - Teacher details.
 * @throws Error on validation or referential integrity errors.
 */
Teacher.update = function*(id, values) {
     // validation - somewhat artificial example serves to illustrate principle
    if (values.Firstname==null && values.Lastname==null) {
        throw ModelError(403, 'Firstname or Lastname must be supplied');
    }

    try {

        yield GLOBAL.db.query('Update Teacher Set ? Where TeacherId = ?', [values, id]);
        //console.log('Teacher.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Teacher.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Teacher record.
 *
 * @param  {number} id - Teacher id.
 * @throws Error on referential integrity errors.
 */
Teacher.delete = function*(id) {
    try {

        yield GLOBAL.db.query('Delete From Teacher Where TeacherId = ?', id);
        //console.log('Teacher.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
                // related record exists in TeamMember
                throw ModelError(403, 'Teacher belongs to Batch'); // Forbidden
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
