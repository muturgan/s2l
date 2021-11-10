import mysql = require('mysql2/promise');

const DB_HOST = process.env.DB_HOST;
if (!DB_HOST) {
   throw new Error('DB_HOST enviroment variable is not set');
}
const DB_PORT = process.env.DB_PORT;
if (!DB_PORT) {
   throw new Error('DB_PORT enviroment variable is not set');
}
const dbPort = parseInt(DB_PORT, 10);
if (!dbPort) {
   throw new Error('incorrect DB_PORT value');
}
const DB_NAME = process.env.DB_NAME;
if (!DB_NAME) {
   throw new Error('DB_NAME enviroment variable is not set');
}
const DB_USER = process.env.DB_USER;
if (!DB_USER) {
   throw new Error('DB_USER enviroment variable is not set');
}
const DB_PASS = process.env.DB_PASS;
if (!DB_PASS) {
   throw new Error('DB_PASS enviroment variable is not set');
}
const DB_TIME = process.env.DB_TIME;
if (!DB_TIME) {
   throw new Error('DB_TIME enviroment variable is not set');
}

export const pool = mysql.createPool({
   host: DB_HOST,
   port: dbPort,
   database: DB_NAME,
   user: DB_USER,
   password: DB_PASS,
   timezone: DB_TIME,
});

export const checkDbConnection = async () => {
   await pool.query('select 1+1');
};
