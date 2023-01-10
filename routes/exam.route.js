const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const genericResponse = require('../helpers/common-function.helper');
const examSerializer = require('../serializers/exam.serializer');
const examController = require('../controllers/exam.controller');
const examValidator = require('../validators/exam.validator');

router.post(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.createExamSchema,
	examController.createExam,
	genericResponse.sendResponse
);

router.delete(
	'/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.examIdSchema,
	examController.deleteExam,
	genericResponse.sendResponse
);

router.patch(
	'/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.examIdSchema,
	examValidator.createExamSchema,
	examController.updateExam,
	genericResponse.sendResponse
);

router.get(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examController.getAllExam,
	examSerializer.allExam,
	genericResponse.sendResponse
);

router.post(
	'/:examId/group/:groupId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examController.addGroupToExam,
	genericResponse.sendResponse
);

router.delete(
	'/:examId/group/:groupId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examController.deleteGroupFromExam,
	genericResponse.sendResponse
);

router.get(
	'/result/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.examIdSchema,
	examController.examResult,
	examSerializer.examResult,
	genericResponse.sendResponse
);

router.post(
	'/publish/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.examIdSchema,
	examController.publishResult,
	genericResponse.sendResponse
);

router.get(
	'/upcoming',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyUser,
	examController.getAllUpcomingExam,
	examSerializer.upcomingExam,
	genericResponse.sendResponse
);

router.post(
	'/start/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyUser,
	examValidator.examIdSchema,
	examController.startExam,
	examSerializer.examQuestionAnswer,
	genericResponse.sendResponse
);

router.post(
	'/submit/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyUser,
	examValidator.examIdSchema,
	examController.submitExam,
	genericResponse.sendResponse
);

router.get(
	'/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyUser,
	examValidator.examIdSchema,
	examController.checkResult,
	examSerializer.userResult,
	genericResponse.sendResponse
);

router.post(
	'/log-exam-response',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyUser,
	examController.logResponse,
	genericResponse.sendResponse
);

module.exports = router;
