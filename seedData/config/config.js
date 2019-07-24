// REQUIRES
const keys = require('../../config/keys');

// GLOBALS
const config = {
    host: keys.mysql.host,
    port: keys.mysql.port,
    user: keys.mysql.user,
    password: keys.mysql.password,
    database: keys.mysql.database
};

// EXPORTS
module.exports = config;