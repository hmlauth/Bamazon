// REQUIRES
const keys = require('./keys');

// GLOBALS
const config = {
    host: keys.mysql.host,
    port: keys.mysql.port,
    user: keys.mysql.username,
    password: keys.mysql.password,
    database: keys.mysql.password
};

// EXPORTS
module.exports = config;