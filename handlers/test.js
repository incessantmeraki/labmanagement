'use strict';

const User     = require('../models/user.js');

const members = module.exports = {};


/**
 * GET /members - render list-members page.
 *
 * Results can be filtered with URL query strings eg /members?firstname=alice.
 */
members.list = function*() {
    // build sql query including any query-string filters; eg ?field1=val1&field2=val2 becomes
    // "Where field1 = :field1 And field2 = :field2"
    let sql = 'Select * From User';

    try {

        const result = yield this.db.query({ sql: sql, namedPlaceholders: true }, this.query);
        const members = result[0];

        const context = { members: members };
        yield this.render('templates/users-list', context);

    } catch (e) {
        switch (e.code) {
            case 'ER_BAD_FIELD_ERROR': this.throw(403, 'Unrecognised Member field'); break;
            default: this.throw(e.status||500, e.message); break;
        }
    }
};
