const subjectServices = require('../services/subject.service');
const { commonErrorHandler } = require('../helpers/common-function.helper');

const createSubject = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await subjectServices.createSubject(payload);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const { body: payload, params } = req;
    const response = await subjectServices.deleteSubject(payload, params);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const getAllSubject = async (req, res, next) => {
  try {
    const { body: payload } = req;
    const response = await subjectServices.getAllSubject(payload);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const { body: payload, params } = req;
    const response = await subjectServices.updateSubject(payload, params);
    res.data = response;
    next();
  } catch (error) {
    commonErrorHandler(req, res, error.message, 400, error);
  }
};

module.exports = {
  createSubject,
  deleteSubject,
  getAllSubject,
  updateSubject
};
