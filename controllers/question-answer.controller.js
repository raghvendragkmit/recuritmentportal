/* eslint-disable no-unused-vars */
const questionAnswerServices = require('../services/question-answer.service');
const { commonErrorHandler } = require('../helpers/common-function.helper');
const { convertExcelToJson } = require('../helpers/common-function.helper');

const createQuestionAnswer = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await questionAnswerServices.createQuestionAnswer(payload);
    if (response.error) {
      throw new Error(response.error);
    }
    res.data = response.data;
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
    const response = await questionAnswerServices.getAllQuestionAnswer(query);
    if (response.error) {
      throw new Error(response.error);
    }
    res.data = response.data;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const updateQuestionDescription = async (req, res, next) => {
  try {
    const { body: payload, params } = req;
    const response = await questionAnswerServices.updateQuestionDescription(
      payload,
      params
    );
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deleteQuestionById = async (req, res, next) => {
  try {
    const { body: payload, params } = req;
    const response = await questionAnswerServices.deleteQuestionById(
      payload,
      params
    );
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deleteAnswerById = async (req, res, next) => {
  try {
    const { body: payload, params } = req;
    const response = await questionAnswerServices.deleteAnswerById(
      payload,
      params
    );
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const updateAnswerDescription = async (req, res, next) => {
  try {
    const { body: payload, params } = req;
    const response = await questionAnswerServices.updateAnswerDescription(
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
    const { body: payload } = req;
    const response = await questionAnswerServices.questionAnswerByFile(payload);
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
  updateQuestionDescription,
  updateAnswerDescription,
  getQuestionAnswerById,
  deleteQuestionById,
  deleteAnswerById,
  questionAnswerByFile
};
