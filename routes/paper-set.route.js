const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const genericResponse = require('../helpers/common-function.helper');
const paperSetController = require('../controllers/paper-set.controller');
const paperSetValidator = require('../validators/paper-set.validator');
const paperSetSerializer = require('../serializers/paper-set.serializer');

router.post(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.createPaperSetSchema,
	paperSetController.createPaperSet,
	paperSetSerializer.createPaperSet,
	genericResponse.sendResponse
);

router.get(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetController.getAllPaperSet,
	paperSetSerializer.getALlPaperSet,
	genericResponse.sendResponse
);

router.patch(
	'/:paperSetId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.paperSetIdSchema,
	paperSetValidator.updatePaperSetSchema,
	paperSetController.updatePaperSet,
	paperSetSerializer.paperSetNameId,
	genericResponse.sendResponse
);

router.delete(
	'/:paperSetId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.paperSetIdSchema,
	paperSetController.deletePaperSet,
	genericResponse.sendResponse
);

router.get(
	'/:paperSetId/question-answers',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.paperSetIdSchema,
	paperSetController.getAllPaperSetQuestions,
	paperSetSerializer.questionAnswers,
	genericResponse.sendResponse
);

router.post(
	'/:paperSetId/question-answer/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.paperSetIdQuestionAnswerIdSchema,
	paperSetController.addQuestionToPaperSet,
	paperSetSerializer.paperSetQuestionAnswerSchema,
	genericResponse.sendResponse
);

router.delete(
	'/:paperSetId/question-answer/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.paperSetIdQuestionAnswerIdSchema,
	paperSetController.deleteQuestionFromPaperSet,
	genericResponse.sendResponse
);

router.post(
	'/:paperSetId/question-answers',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.paperSetIdSchema,
	paperSetValidator.questionAnswersPaperSetSchema,
	paperSetController.addQuestionsToPaperSet,
	genericResponse.sendResponse
);

module.exports = router;
