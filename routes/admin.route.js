const { Router } = require('express');
const userController = require('../controllers/user.controller');
const subjectController = require('../controllers/subject.controller');
const questionAnswerController = require('../controllers/question-answer.controller');
const paperSetController = require('../controllers/paper-set.controller');
const examController = require('../controllers/exam.controller');
const groupController = require('../controllers/group.controller');
const genericResponse = require('../helpers/common-function.helper');
const authMiddleware = require('../middlewares/auth');
const userValidator = require('../validators/user.validator');
const subjectValidator = require('../validators/subject.validator');
const questionAnswerValidator = require('../validators/question-answer.validator');
const paperSetValidator = require('../validators/paper-set.validator');
const examValidator = require('../validators/exam.validator');
const groupValidator = require('../validators/group.validator');
const userSerializer = require('../serializers/user.serializer');
const subjectSerializer = require('../serializers/subject.serializer');
const questionAnswerSerializer = require('../serializers/question-answer.serializer');
const paperSetSerializer = require('../serializers/paper-set.serializer');
const examSerializer = require('../serializers/exam.serializer');
const groupSerializer = require('../serializers/group.serializer');
const { fileUpload } = require('../helpers/file-upload.helper');
const fileUploadValidator = require('../validators/file-upload.validator');
const fileMiddleware = require('../middlewares/convert-excel-to-json');
const router = Router();

router.post(
	'/question-answer',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionAnswerSchema,
	questionAnswerController.createQuestionAnswer,
	genericResponse.sendResponse
);

router.post(
	'/question-answers',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionAnswersSchema,
	questionAnswerController.createQuestionAnswers,
	genericResponse.sendResponse
);

router.get(
	'/question-answers',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerController.getAllQuestionAnswer,
	questionAnswerSerializer.questionAnswers,
	genericResponse.sendResponse
);

router.get(
	'/question-answer/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionIdSchema,
	questionAnswerController.getQuestionAnswerById,
	questionAnswerSerializer.questionAnswer,
	genericResponse.sendResponse
);

router.delete(
	'/question-answer/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionIdSchema,
	questionAnswerController.deleteQuestionAnswer,
	genericResponse.sendResponse
);

router.patch(
	'/question-answer/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	questionAnswerValidator.questionIdSchema,
	questionAnswerValidator.questionAnswerUpdateSchema,
	questionAnswerController.updateQuestionAnswer,
	genericResponse.sendResponse
);

router.post(
	'/exam',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.createExamSchema,
	examController.createExam,
	genericResponse.sendResponse
);

router.delete(
	'/exam/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.examIdSchema,
	examController.deleteExam,
	genericResponse.sendResponse
);

router.patch(
	'/exam/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.examIdSchema,
	examValidator.createExamSchema,
	examController.updateExam,
	genericResponse.sendResponse
);

router.get(
	'/exams',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examController.getAllExam,
	genericResponse.sendResponse
);

router.post(
	'/exam/:examId/group/:groupId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examController.addGroupToExam,
	genericResponse.sendResponse
);

router.delete(
	'/exam/:examId/group/:groupId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examController.deleteGroupFromExam,
	genericResponse.sendResponse
);

router.get(
	'/exam-results/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.examIdSchema,
	examController.examResult,
	examSerializer.examResult,
	genericResponse.sendResponse
);

router.post(
	'/publish-exam-results/:examId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	examValidator.examIdSchema,
	examController.publishResult,
	genericResponse.sendResponse
);

router.post(
	'/paper-set',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.createPaperSetSchema,
	paperSetController.createPaperSet,
	paperSetSerializer.createPaperSet,
	genericResponse.sendResponse
);

router.get(
	'/paper-sets',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetController.getAllPaperSet,
	paperSetSerializer.getALlPaperSet,
	genericResponse.sendResponse
);

router.patch(
	'/paper-set/:paperSetId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetController.updatePaperSet,
	paperSetSerializer.paperSetNameId,
	genericResponse.sendResponse
);

router.delete(
	'/paper-set/:paperSetId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetValidator.paperSetIdSchema,
	paperSetController.deletePaperSet,
	genericResponse.sendResponse
);

router.get(
	'/paper-set/:paperSetId/question-answers',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetController.getAllPaperSetQuestions,
	paperSetSerializer.questionAnswers,
	genericResponse.sendResponse
);

router.post(
	'/paper-set/:paperSetId/question-answer/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetController.addQuestionToPaperSet,
	genericResponse.sendResponse
);

router.delete(
	'/paper-set/:paperSetId/question-answer/:questionId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	paperSetController.deleteQuestionFromPaperSet,
	genericResponse.sendResponse
);

router.post(
	'/user',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	userValidator.createUserSchema,
	userController.createUser,
	userSerializer.createUser,
	genericResponse.sendResponse
);

router.delete(
	'/user/:userId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	userValidator.userIdSchema,
	userController.deleteUser,
	genericResponse.sendResponse
);

router.get(
	'/users',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	userValidator.limitPageSchema,
	userController.getAllUser,
	userSerializer.getAllUser,
	genericResponse.sendResponse
);

router.post(
	'/reset-user-password',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	userValidator.adminResetUserPasswordSchema,
	userController.adminResetPassword,
	genericResponse.sendResponse
);

router.post(
	'/subject',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	subjectValidator.subjectNameSchema,
	subjectController.createSubject,
	subjectSerializer.subjectNameId,
	genericResponse.sendResponse
);

router.get(
	'/subjects',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	subjectController.getAllSubject,
	subjectSerializer.getAllSubject,
	genericResponse.sendResponse
);

router.delete(
	'/subject/:subjectId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	subjectValidator.subjectIdSchema,
	subjectController.deleteSubject,
	genericResponse.sendResponse
);

router.patch(
	'/subject/:subjectId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	subjectValidator.subjectIdSchema,
	subjectValidator.subjectNameSchema,
	subjectController.updateSubject,
	subjectSerializer.subjectNameId,
	genericResponse.sendResponse
);

router.post(
	'/question-answer-file',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	fileUpload.single('myfile'),
	fileUploadValidator.fileSchema,
	fileMiddleware.convertQuestionExcelToJson,
	questionAnswerValidator.questionAnswersSchema,
	questionAnswerController.questionAnswerByFile,
	genericResponse.sendResponse
);

router.post(
	'/users-file',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	fileUpload.single('myfile'),
	fileUploadValidator.fileSchema,
	fileMiddleware.convertUserExcelToJson,
	userValidator.createUsersSchema,
	userController.userByFile,
	genericResponse.sendResponse
);

router.post(
	'/group',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupNameSchema,
	groupController.createGroup,
	groupSerializer.groupNameId,
	genericResponse.sendResponse
);

router.delete(
	'/group/:groupId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupIdSchema,
	groupController.deleteGroup,
	genericResponse.sendResponse
);

router.get(
	'/groups',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupController.getAllGroup,
	groupSerializer.getAllGroup,
	genericResponse.sendResponse
);

router.post(
	'/group/:groupId/user/:userId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupUserIdSchema,
	groupController.addUserToGroup,
	groupSerializer.groupUser,
	genericResponse.sendResponse
);

router.delete(
	'/group/:groupId/user/:userId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupUserIdSchema,
	groupController.deleteUserFromGroup,
	genericResponse.sendResponse
);

router.get(
	'/group/:groupId/users',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupIdSchema,
	groupController.getAllUserFromGroup,
	groupSerializer.userFromGroup,
	genericResponse.sendResponse
);

router.patch(
	'/group/:groupId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupIdSchema,
	groupValidator.groupNameSchema,
	groupController.updateGroup,
	groupSerializer.groupNameId,
	genericResponse.sendResponse
);

module.exports = router;
