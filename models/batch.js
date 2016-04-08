/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/* Batch model                                                                                   */
/*                                                                                                */
/* All database modifications go through the model; most querying is in the handlers.             */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

'use strict';


const ModelError = require('./modelerror.js');

const Batch = module.exports = {};


/**
 * Returns Batch details (convenience wrapper for single Batch details).
 *
 * @param   {number} id - Batch id or undefined if not found.
 * @returns {Object} Batch details.
 */
Batch.get = function*(id) {
    const result = yield GLOBAL.db.query('Select * From Batch Where BatchId = ?', id);
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
Batch.getBy = function*(field, value) {
    try {

        const sql = `Select * From Batch Where ${field} = ?`;

        const result = yield GLOBAL.db.query(sql, value);
        const members = result[0];

        return members;

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': throw ModelError(403, 'Unrecognised Batch field '+field);
            default: throw ModelError(500, e.message);
        }
    }
};


/**
 * Creates new Batch record.
 *
 * @param   {Object} values - Batch details.
 * @returns {number} New Batch id.
 * @throws  Error on validation or referential integrity errors.
 */
Batch.insert = function*(values) {
    // validation - somewhat artificial example serves to illustrate principle
    /*if (values.Subjectname==null ) {
        throw ModelError(403, 'Subjectname must be supplied');
    }
    */

    try {

        const result = yield GLOBAL.db.query('Insert Into Batch Set ?', values);
        //console.log('Batch.insert', result.insertId, new Date); // eg audit trail?
        return result[0].insertId;

    } catch (e) {
        switch (e.code) {
            // recognised errors for Batch.update - just use default MySQL messages for now
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
 * Update Batch details.
 *
 * @param  {number} id - Batch id.
 * @param  {Object} values - Batch details.
 * @throws Error on validation or referential integrity errors.
 */
Batch.update = function*(id, values) {
     // validation - somewhat artificial example serves to illustrate principle
    /*
    if (values.Firstname==null && values.Lastname==null) {
        throw ModelError(403, 'Firstname or Lastname must be supplied');
    }
    */
    try {

        yield GLOBAL.db.query('Update Batch Set ? Where BatchId = ?', [values, id]);
        //console.log('Batch.update', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_NULL_ERROR':
            case 'ER_DUP_ENTRY':
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
            case 'ER_NO_REFERENCED_ROW_2':
                // recognised errors for Batch.update - just use default MySQL messages for now
                throw ModelError(403, e.message); // Forbidden
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/**
 * Delete Batch record.
 *
 * @param  {number} id - Batch id.
 * @throws Error on referential integrity errors.
 */
Batch.delete = function*(id) {
    try {

        yield GLOBAL.db.query('Delete From Batch Where BatchId = ?', id);
        //console.log('Batch.delete', id, new Date); // eg audit trail?

    } catch (e) {
        switch (e.code) {
            case 'ER_ROW_IS_REFERENCED_': // trailing underscore?
            case 'ER_ROW_IS_REFERENCED_2':
                // related record exists in TeamMember
                throw ModelError(403, 'Batch is used by teacher/student'); // Forbidden
            default:
                throw ModelError(500, e.message); // Internal Server Error
        }
    }
};


/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
