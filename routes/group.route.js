const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const genericResponse = require('../helpers/common-function.helper');
const groupController = require('../controllers/group.controller');
const groupValidator = require('../validators/group.validator');
const groupSerializer = require('../serializers/group.serializer');

router.post(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupNameSchema,
	groupController.createGroup,
	groupSerializer.groupNameId,
	genericResponse.sendResponse
);

router.delete(
	'/:groupId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupIdSchema,
	groupController.deleteGroup,
	genericResponse.sendResponse
);

router.get(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupController.getAllGroup,
	groupSerializer.getAllGroup,
	genericResponse.sendResponse
);

router.post(
	'/:groupId/user/:userId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupUserIdSchema,
	groupController.addUserToGroup,
	groupSerializer.groupUser,
	genericResponse.sendResponse
);

router.delete(
	'/:groupId/user/:userId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupUserIdSchema,
	groupController.deleteUserFromGroup,
	genericResponse.sendResponse
);

router.get(
	'/:groupId/users',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupIdSchema,
	groupController.getAllUserFromGroup,
	groupSerializer.userFromGroup,
	genericResponse.sendResponse
);

router.patch(
	'/:groupId',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupIdSchema,
	groupValidator.groupNameSchema,
	groupController.updateGroup,
	groupSerializer.groupNameId,
	genericResponse.sendResponse
);

router.post(
	'/:groupId/users',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	groupValidator.groupIdSchema,
	groupValidator.groupUsersSchema,
	groupController.addUsersToGroup,
	genericResponse.sendResponse
);

module.exports = router;
