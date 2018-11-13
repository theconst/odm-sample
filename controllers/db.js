'use strict';

const orm = require('cache-simple-orm');

const connectionString = process.env.DSN;

if (!connectionString) {
    console.error("Set DSN environmental variable to launch the server");
    process.exit(1);
}

module.exports = orm({
    'dsn': connectionString,
    'loggerLevel': 'debug',
    'defaultNamespace': 'Sample',
});

