/*
 * 2022 Tarpeeksi Hyvae Soft
 *
 * Software: Lintulista's server
 * 
 */

"use strict";

const fs = require("fs");
const {LL_Assert} = require("./assert.js");

module.exports = {
    LL_DBExecutor: file_database_executor(),
};

const dbBasePath = "./database/";

// Creates a Lintulista database executor interface that provides facilities for executing
// queries into a flat file database.
//
// This interface is intended to be used by Lintulista's database interface and not directly
// by other parts of the codebase.
function file_database_executor()
{
    return {
        // Throws on error; caller should catch. Caller is responsible for argument validation.
        get_column_value: async function(columnName = "", listKey = "")
        {
            return get_db_file_contents(listKey)[columnName];
        },

        // Throws on error; caller should catch. Caller is responsible for argument validation.
        set_column_value: async function(columnName = "", newValue, listKey = "")
        {
            const fileContents = get_db_file_contents(listKey);
            fileContents[columnName] = newValue;
            fs.writeFileSync(name_of_db_file(listKey), JSON.stringify(fileContents), {encoding: "utf8", flag: "w"});
        },
    };

    function name_of_db_file(listKey = "") {
        return `${dbBasePath}/${listKey}.json`;
    }

    function get_db_file_contents(listKey = "") {
        const fileContents = fs.readFileSync(name_of_db_file(listKey));
        LL_Assert(typeof fileContents == "object");
        return JSON.parse(fileContents);
    }
}
