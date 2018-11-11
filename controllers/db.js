'use strict';

const orm = require('cache-simple-orm');

module.exports = orm({
    'dsn': 'DSN=CacheWinHost',
    'loggerLevel': 'debug',
    'defaultNamespace': 'Sample',
});

