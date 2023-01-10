/* eslint-disable no-unused-vars */
const userServices = require('../services/user.service');
const { commonErrorHandler } = require('../helpers/common-function.helper');

const createUser = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await userServices.createUser(payload);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const loginUser = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await userServices.loginUser(payload);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 401, error);
	}
};

const deleteUser = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await userServices.deleteUser(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const getAllUser = async (req, res, next) => {
	try {
		const { body: payload, query } = req;
		const response = await userServices.getAllUser(query);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const refreshToken = async (req, res, next) => {
	try {
		const { body: payload } = req;

		const data = await userServices.refreshToken(payload);
		res.data = data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const forgetPassword = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const data = await userServices.forgetPassword(payload);
		res.data = data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const resetPasswordByToken = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const data = await userServices.resetPasswordByToken(payload, params);
		res.data = data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const adminResetPassword = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const data = await userServices.adminResetPassword(payload);
		res.data = data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const resetPassword = async (req, res, next) => {
	try {
		const { body: payload, user } = req;
		const data = await userServices.resetPassword(payload, user);
		res.data = data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const logOutUser = async (req, res, next) => {
	try {
		const { body: payload, user } = req;
		const data = await userServices.logOutUser(payload, user);
		res.data = data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const userByFile = async (req, res, next) => {
	try {
		const { body: payload, groupName } = req;
		const response = await userServices.userByFile(payload, groupName);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

module.exports = {
	createUser,
	loginUser,
	deleteUser,
	getAllUser,
	refreshToken,
	forgetPassword,
	resetPassword,
	resetPasswordByToken,
	adminResetPassword,
	logOutUser,
	userByFile,
};
