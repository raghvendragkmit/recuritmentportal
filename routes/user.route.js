const { Router } = require('express');
const userController = require('../controllers/user.controller');
const examController = require('../controllers/exam.controller');
const genericResponse = require('../helpers/common-function.helper');
const authMiddleware = require('../middlewares/auth');
const userValidator = require('../validators/user.validator');
const examValidator = require('../validators/exam.validator');
const examSerializer = require('../serializers/exam.serializer');
const router = Router();

router.post(
	'/login',
	userValidator.loginSchema,
	userController.loginUser,
	genericResponse.sendResponse
);

router.get(
	'/refresh-token',
	authMiddleware.checkRefreshToken,
	userController.refreshToken,
	genericResponse.sendResponse
);

router.post(
	'/forget-password',
	userValidator.forgetPassword,
	userController.forgetPassword,
	genericResponse.sendResponse
);

router.post(
	'/reset-password/:token',
	userValidator.resetPasswordTokenSchema,
	userValidator.resetPasswordSchema,
	userController.resetPasswordByToken,
	genericResponse.sendResponse
);

router.post(
	'/reset-password',
	authMiddleware.checkAccessToken,
	userValidator.resetPasswordSchema,
	userController.resetPassword,
	genericResponse.sendResponse
);

router.get(
	'/upcoming-exams',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyUser,
	examController.getAllUpcomingExam,
	examSerializer.upcomingExam,
	genericResponse.sendResponse
);

router.post(
	'/start-exam/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyUser,
	examValidator.examIdSchema,
	examController.startExam,
	examSerializer.examQuestionAnswer,
	genericResponse.sendResponse
);

router.post(
	'/submit-exam',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyUser,
	examValidator.submitExam,
	examController.submitExam,
	genericResponse.sendResponse
);

router.get(
	'/exam-result/:examId',
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

router.post(
	'/logout',
	authMiddleware.checkAccessToken,
	userController.logOutUser,
	genericResponse.sendResponse
);

module.exports = router;
