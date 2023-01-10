const { Router } = require('express');
const userController = require('../controllers/user.controller');
const genericResponse = require('../helpers/common-function.helper');
const authMiddleware = require('../middlewares/auth');
const userValidator = require('../validators/user.validator');
const userSerializer = require('../serializers/user.serializer');
const { fileUpload } = require('../helpers/file-upload.helper');
const fileUploadValidator = require('../validators/file-upload.validator');
const fileMiddleware = require('../middlewares/convert-excel-to-json');
const router = Router();


router.post(
	'/',
	authMiddleware.checkAccessToken,
	authMiddleware.verifyAdmin,
	userValidator.createUserSchema,
	userController.createUser,
	userSerializer.createUser,
	genericResponse.sendResponse
);

router.delete(
	'/:userId',
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
	'/file',
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

router.post(
	'/logout',
	authMiddleware.checkAccessToken,
	userController.logOutUser,
	genericResponse.sendResponse
);


module.exports = router;
