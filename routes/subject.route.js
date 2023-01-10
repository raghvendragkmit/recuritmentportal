const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const subjectController = require('../controllers/subject.controller');
const subjectSerializer = require('../serializers/subject.serializer');
const subjectValidator = require('../validators/subject.validator');
const genericResponse = require('../helpers/common-function.helper');

router.post(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	subjectValidator.subjectNameSchema,
	subjectController.createSubject,
	subjectSerializer.subjectNameId,
	genericResponse.sendResponse
);

router.get(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	subjectController.getAllSubject,
	subjectSerializer.getAllSubject,
	genericResponse.sendResponse
);

router.delete(
	'/:subjectId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	subjectValidator.subjectIdSchema,
	subjectController.deleteSubject,
	genericResponse.sendResponse
);

router.patch(
	'/:subjectId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	subjectValidator.subjectIdSchema,
	subjectValidator.subjectNameSchema,
	subjectController.updateSubject,
	subjectSerializer.subjectNameId,
	genericResponse.sendResponse
);

module.exports = router;
