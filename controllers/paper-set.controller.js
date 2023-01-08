/* eslint-disable no-unused-vars */
const paperSetServices = require('../services/paper-set.service');
const { commonErrorHandler } = require('../helpers/common-function.helper');

const createPaperSet = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await paperSetServices.createPaperSet(payload);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const deletePaperSet = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await paperSetServices.deletePaperSet(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const getAllPaperSet = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await paperSetServices.getAllPaperSet();
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const getAllPaperSetQuestions = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await paperSetServices.getAllPaperSetQuestions(
			payload,
			params
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const updatePaperSet = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await paperSetServices.updatePaperSet(payload, params);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const addQuestionToPaperSet = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await paperSetServices.addQuestionToPaperSet(
			payload,
			params
		);
		if (response.error) {
			throw new Error(response.error);
		}
		res.data = response.data;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const deleteQuestionFromPaperSet = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await paperSetServices.deleteQuestionFromPaperSet(
			payload,
			params
		);
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
	createPaperSet,
	getAllPaperSet,
	deletePaperSet,
	getAllPaperSetQuestions,
	updatePaperSet,
	addQuestionToPaperSet,
	deleteQuestionFromPaperSet,
};
