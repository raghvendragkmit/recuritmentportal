const examServices = require('../services/exam.service');
const { commonErrorHandler } = require('../helpers/common-function.helper');

const createExam = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await examServices.createExam(payload);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const deleteExam = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await examServices.deleteExam(payload, params);
		if (response.error) {
			throw new Error(response.error);
		}
		res.data = response.data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const getAllExam = async (req, res, next) => {
	try {
		const { body: payload, query } = req;
		const response = await examServices.getAllExam(query);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const getAllUpcomingExam = async (req, res, next) => {
	try {
		const { body: payload, user } = req;
		const response = await examServices.getAllUpcomingExam(payload, user);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const startExam = async (req, res, next) => {
	try {
		// eslint-disable-next-line no-unused-vars
		const { body: payload, params, user } = req;
		const response = await examServices.startExam(payload, user, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const submitExam = async (req, res, next) => {
	try {
		const { user, params } = req;
		const response = await examServices.submitExam(user, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const logResponse = async (req, res, next) => {
	try {
		const { body: payload, user } = req;
		const response = await examServices.logResponse(payload, user);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const examResult = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await examServices.examResult(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const publishResult = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await examServices.publishResult(payload, params);
		if (response.error) {
			throw new Error(response.error);
		}
		res.data = response.data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const checkResult = async (req, res, next) => {
	try {
		const { body: payload, params, user } = req;
		const response = await examServices.checkResult(payload, user, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const updateExam = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await examServices.updateExam(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const addGroupToExam = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await examServices.addGroupToExam(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const deleteGroupFromExam = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await examServices.deleteGroupFromExam(
			payload,
			params
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

module.exports = {
	createExam,
	deleteExam,
	getAllExam,
	getAllUpcomingExam,
	startExam,
	submitExam,
	logResponse,
	examResult,
	publishResult,
	checkResult,
	updateExam,
	addGroupToExam,
	deleteGroupFromExam,
};
