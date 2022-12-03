/*
 * 2021 Tarpeeksi Hyvae Soft
 *
 * Software: Lintulista's server
 * 
 */

"use strict";

const {LL_Assert} = require("./assert.js");
const {LL_Respond} = require("./response.js");
const {LL_Database} = require("./database.js");

module.exports = {
    route: route_test,
};

// Throws on error; caller is expected to catch.
async function route_test({listKey, requestBody, response})
{
    const database = LL_Database(listKey);
    await test({response, database, requestBody});
    return;
}

async function test({response})
{
    const results = {
        unit: await require("./tests/run-unit-tests.js")(),
    };

    LL_Respond(200, response).json(results);

    return;
}
