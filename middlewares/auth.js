/* eslint-disable no-undef */
const jwt = require('jsonwebtoken');
const models = require('../models');
const redisClient = require('../helpers/redis.helper');
const { commonErrorHandler } = require('../helpers/common-function.helper');
require('dotenv').config();

const checkAccessToken = async (req, res, next) => {
	try {
		const header = req.headers['authorization'];
		const accessToken = header ? header.split(' ')[1] : null;
		if (!accessToken) {
			throw new Error('Access denied');
		}
		const decodedJwt = jwt.verify(
			accessToken,
			process.env.SECRET_KEY_ACCESS
		);
		const user = await models.User.findOne({
			where: {
				id: decodedJwt.userId,
			},
		});
		if (!user) {
			throw new Error('User Not found');
		}
		req.user = user;

		console.log('bwbihcwvciv');

		next();
	} catch (error) {
		if (error.message == 'Access denied') {
			return commonErrorHandler(req, res, error.message, 400, error);
		}
		commonErrorHandler(req, res, error.message, 404, error);
	}
};

const checkRefreshToken = async (req, res, next) => {
	try {
		const header = req.headers['authorization'];
		const refreshToken = header ? header.split(' ')[1] : null;
		if (!refreshToken) {
			throw new Error('Access denied');
		}
		const decodedJwt = jwt.verify(
			refreshToken,
			process.env.SECRET_KEY_REFRESH
		);
		let userId = decodedJwt.userId;
		let key = userId + '-refresh-token';
		let cachedRefreshToken = await redisClient.get(key);
		if (cachedRefreshToken !== refreshToken)
			throw new Error('Login Required');

		req.body.userId = userId;
		req.body.token = refreshToken;
		next();
	} catch (error) {
		if (error.message == 'Access denied') {
			commonErrorHandler(req, res, error.message, 400, error);
		}
		commonErrorHandler(req, res, error.message, 401, error);
	}
};

const verifyAdmin = async (req, res, next) => {
	try {
		if (req.user.role == 'admin') {
			next();
		} else {
			throw new Error('admin access required');
		}
	} catch (error) {
		commonErrorHandler(req, res, error.message, 403, error);
	}
};

const verifyUser = async (req, res, next) => {
	try {
		if (req.user.role == 'user') {
			next();
		} else {
			throw new Error('user not authorised');
		}
	} catch (error) {
		commonErrorHandler(req, res, error.message, 403, error);
	}
};

module.exports = {
	checkAccessToken,
	checkRefreshToken,
	verifyAdmin,
	verifyUser,
};
