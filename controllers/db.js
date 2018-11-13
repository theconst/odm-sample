'use strict';

const orm = require('cache-simple-orm');

const connectionString = process.env.DSN;

if (!connectionString) {
    console.error("Set DSN environmental variable to launch the server");
}

module.exports = orm({
    'dsn': connectionString,
    'loggerLevel': 'debug',
    'defaultNamespace': 'Sample',
});

