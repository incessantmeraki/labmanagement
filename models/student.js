/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Student model                                                                                   */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const ModelError = require('./modelerror.js');

const Student = module.exports = {};


/**
 * Returns Student details (convenience wrapper for single Student details).
 *
 * @param   {number} id - Student id or undefined if not found.
 * @returns {Object} Student details.
 */
Student.get = function*(id) {
    const result = yield GLOBAL.db.query('Select * From Student Where StudentId = ?', id);
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
Student.getBy = function*(field, value) {
    try {

        const sql = `Select * From Student Where ${field} = ? Order By Firstname, Lastname`;

        const result = yield GLOBAL.db.query(sql, value);
        const members = result[0];

        return members;

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': throw ModelError(403, 'Unrecognised Student field '+field);
            default: throw ModelError(500, e.message);
        }
    }
};


/**
 * Creates new Student record.
 *
 * @param   {Object} values - Student details.
 * @returns {number} New Student id.
 * @throws  Error on validation or referential integrity errors.
 */
Student.insert = function*(values) {
    // validation - somewhat artificial example serves to illustrate principle
    if (values.Firstname==null && values.Lastname==null) {
        throw ModelError(403, 'Firstname or Lastname must be supplied');
    }

    try {

        const result = yield GLOBAL.db.query('Insert Into Student Set ?', values);
        //console.log('Student.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for Student.update - just use default MySQL messages for now
            case 'ER_BAD_NULL_ERROR':
            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_DEFAULT_FOR_FIELD':
                throw ModelError(403, e.message); // Forbidden
            case 'ER_DUP_ENTRY':
                throw ModelError(409, e.message); // Conflict
            default:
f                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Update Student details.
 *
 * @param  {number} id - Student id.
 * @param  {Object} values - Student details.
 * @throws Error on validation or referential integrity errors.
 */
Student.update = function*(id, values) {
     // validation - somewhat artificial example serves to illustrate principle
    if (values.Firstname==null && values.Lastname==null) {
        throw ModelError(403, 'Firstname or Lastname must be supplied');
    }

    try {

        yield GLOBAL.db.query('Update Student Set ? Where StudentId = ?', [values, id]);
        //console.log('Student.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Student.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                Lib.logException('Student.update', e);
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Student record.
 *
 * @param  {number} id - Student id.
 * @throws Error on referential integrity errors.
 */
Student.delete = function*(id) {
    try {

        yield GLOBAL.db.query('Delete From Student Where StudentId = ?', id);
        //console.log('Student.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
                // related record exists in TeamMember
                throw ModelError(403, 'Student belongs to batch(s)'); // Forbidden
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
