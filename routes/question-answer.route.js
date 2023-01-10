const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const questionAnswerController = require('../controllers/question-answer.controller');
const questionAnswerSerializer = require('../serializers/question-answer.serializer');
const { fileUpload } = require('../helpers/file-upload.helper');
const fileUploadValidator = require('../validators/file-upload.validator');
const fileMiddleware = require('../middlewares/convert-excel-to-json');
const questionAnswerValidator = require('../validators/question-answer.validator');
const genericResponse = require('../helpers/common-function.helper');

router.post(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionAnswerSchema,
	questionAnswerController.createQuestionAnswer,
	genericResponse.sendResponse
);

router.post(
	'/all',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionAnswersSchema,
	questionAnswerController.createQuestionAnswers,
	genericResponse.sendResponse
);

router.get(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerController.getAllQuestionAnswer,
	questionAnswerSerializer.questionAnswers,
	genericResponse.sendResponse
);

router.get(
	'/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionIdSchema,
	questionAnswerController.getQuestionAnswerById,
	questionAnswerSerializer.questionAnswer,
	genericResponse.sendResponse
);

router.delete(
	'/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionIdSchema,
	questionAnswerController.deleteQuestionAnswer,
	genericResponse.sendResponse
);

router.patch(
	'/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionIdSchema,
	questionAnswerValidator.questionAnswerUpdateSchema,
	questionAnswerController.updateQuestionAnswer,
	genericResponse.sendResponse
);

router.post(
	'/file',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	fileUpload.single('myfile'),
	fileUploadValidator.fileSchema,
	fileMiddleware.convertQuestionExcelToJson,
	questionAnswerValidator.questionAnswersSchema,
	questionAnswerController.questionAnswerByFile,
	genericResponse.sendResponse
);

router.get(
	'/subject/:subjectId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerController.questionAnswerBySubject,
	questionAnswerSerializer.questionAnswerBySubject,
	genericResponse.sendResponse
);
module.exports = router;
