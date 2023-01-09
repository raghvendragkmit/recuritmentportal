const groupServices = require('../services/group.service');
const { commonErrorHandler } = require('../helpers/common-function.helper');

const createGroup = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await groupServices.createGroup(payload);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const deleteGroup = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await groupServices.deleteGroup(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const getAllGroup = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await groupServices.getAllGroup(payload);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const updateGroup = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await groupServices.updateGroup(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const addUserToGroup = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await groupServices.addUserToGroup(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const deleteUserFromGroup = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await groupServices.deleteUserFromGroup(
			payload,
			params
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const getAllUserFromGroup = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await groupServices.getAllUserFromGroup(
			payload,
			params
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const addUsersToGroup = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await groupServices.addUsersToGroup(payload, params);

		if (response.error) {
			throw new Error(response.error);
		}
		res.data = response.data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

module.exports = {
	createGroup,
	deleteGroup,
	getAllGroup,
	updateGroup,
	addUserToGroup,
	deleteUserFromGroup,
	getAllUserFromGroup,
	addUsersToGroup,
};
