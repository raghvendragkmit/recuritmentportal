require('dotenv').config({ path: __dirname + '/../.env' });
module.exports = {
	development: {
		username: process.env.DB_USERNAME,
		password: null,
		database: process.env.DB_DBNAME,
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
	},
	test: {
		username: 'root',
		password: null,
		database: 'database_test',
		host: '127.0.0.1',
		dialect: 'mysql',
	},
	production: {
		username: 'root',
		password: null,
		database: 'database_production',
		host: '127.0.0.1',
		dialect: 'mysql',
	},
};
