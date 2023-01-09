const _ = require('lodash');

const commonErrorHandler = async (
	req,
	res,
	message,
	statusCode = 500,
	error = null
) => {
	let errorMessage = 'Something went wrong. Please try again';
	if (message) {
		errorMessage = message;
	}

	if (error && error.message) {
		errorMessage = error.message;
	}
	req.error = error;

	const response = {
		statusCode,
		data: {},
		message: errorMessage,
	};

	res.status(statusCode).json(response);
};

const generateRandom = (length = 32, alphanumeric = true) => {
	let data = '';
	let keys = '';

	if (alphanumeric) {
		keys = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
	} else {
		keys = '0123456789';
	}

	for (let i = 0; i < length; i += 1) {
		data += keys.charAt(Math.floor(Math.random() * keys.length));
	}

	return data;
};

const sendResponse = async (req, res) => {
	const response = {
		statusCode: 200,
		data: res.data || {},
		message: 'Success',
	};
	return res.status(200).json(response);
};

const camelCaseToSnakeCase = (obj) => {
	if (typeof obj === 'string') obj = JSON.parse(obj);
	const newObj = {};
	for (let prop in obj) {
		newObj[_.snakeCase(prop)] =
			typeof obj[prop] === 'object'
				? camelCaseToSnakeCase(obj[prop])
				: obj[prop];
	}
	return newObj;
};

module.exports = {
	commonErrorHandler,
	generateRandom,
	sendResponse,
	camelCaseToSnakeCase,
};
