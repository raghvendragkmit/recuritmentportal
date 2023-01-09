/* eslint-disable no-unused-vars */
const questionAnswerServices = require('../services/question-answer.service');
const { commonErrorHandler } = require('../helpers/common-function.helper');
const { convertExcelToJson } = require('../helpers/common-function.helper');

const createQuestionAnswer = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await questionAnswerServices.createQuestionAnswer(
			payload
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const getQuestionAnswerById = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await questionAnswerServices.getQuestionAnswerById(
			payload,
			params
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const createQuestionAnswers = async (req, res, next) => {
	try {
		const { body: payload } = req;
		const response = await questionAnswerServices.createQuestionAnswers(
			payload
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

const getAllQuestionAnswer = async (req, res, next) => {
	try {
		const { body: payload, query } = req;
		const response = await questionAnswerServices.getAllQuestionAnswer(
			query
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const updateQuestionAnswer = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await questionAnswerServices.updateQuestionAnswer(
			payload,
			params
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const deleteQuestionAnswer = async (req, res, next) => {
	try {
		const { body: payload, params } = req;
		const response = await questionAnswerServices.deleteQuestionAnswer(
			payload,
			params
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

const questionAnswerByFile = async (req, res, next) => {
	try {
		const { body: payload, file } = req;
		console.log(file);
		const response = await questionAnswerServices.questionAnswerByFile(
			payload
		);
		res.data = response;
		next();
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

module.exports = {
	createQuestionAnswer,
	getAllQuestionAnswer,
	createQuestionAnswers,
	getQuestionAnswerById,
	deleteQuestionAnswer,
	updateQuestionAnswer,
	questionAnswerByFile,
};
