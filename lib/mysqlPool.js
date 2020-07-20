/*
 * Reusable MySQL connection pool for making queries throughout the rest of
 * the app.
 */

const mysql = require("mysql2/promise");

const mysqlPool = mysql.createPool({
	connectionLimit: 10,
	host: process.env.MYSQL_HOST || "192.168.99.100",
	port: process.env.MYSQL_PORT || 3308,
	database: process.env.MYSQL_DATABASE || "tarpaulin",
	user: process.env.MYSQL_USER || "tarpaulin",
	password: process.env.MYSQL_PASSWORD || "pop123",
});

module.exports = mysqlPool;
