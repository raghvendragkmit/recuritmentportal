/* eslint-disable no-undef */
const models = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendMail } = require('../helpers/mailer.helper');
const redisClient = require('../helpers/redis.helper');
const { sequelize } = require('../models');
const { generateRandom } = require('../helpers/common-function.helper');
const groupUserMapping = require('../models/group-user-mapping');

const createUser = async (payload) => {
	const userExist = await models.User.findOne({
		where: { email: payload.email },
	});
	if (userExist) {
		throw new Error('user already exist');
	}

	const userEmail = payload.email;
	const userPassword = payload.password;
	payload.password = await bcrypt.hash(payload.password, 10);

	const userPayload = {
		first_name: payload.firstName,
		last_name: payload.lastName,
		email: payload.email,
		password: payload.password,
		contact_number: payload.contactNumber,
		role: payload.role,
		organization: payload.organization,
	};

	const userCreated = await models.User.create(userPayload);

	const mailBody = `Login Credentails \nemail: ${userEmail}\npassword: ${userPassword}`;
	sendMail(mailBody, 'User login credentials', userEmail);

	return userCreated;
};

const loginUser = async (payload) => {
	const { email, password } = payload;

	const userExist = await models.User.findOne({
		where: {
			email: email,
		},
	});

	if (!userExist) {
		throw new Error(`user with ${email} is not authorised`);
	}

	let key = userExist.dataValues.id + '-refresh-token';
	let refreshToken = await redisClient.get(key);
	if (!refreshToken) {
		const match = await bcrypt.compare(
			password,
			userExist.dataValues.password
		);
		if (!match) {
			throw new Error('Wrong email or password');
		}
		refreshToken = jwt.sign(
			{ userId: userExist.dataValues.id },
			process.env.SECRET_KEY_REFRESH,
			{
				expiresIn: process.env.JWT_REFRESH_EXPIRATION,
			}
		);
	}

	const accessToken = jwt.sign(
		{ userId: userExist.dataValues.id },
		process.env.SECRET_KEY_ACCESS,
		{
			expiresIn: process.env.JWT_ACCESS_EXPIRATION,
		}
	);

	await redisClient.set(key, refreshToken, 60 * 24);

	return {
		id: userExist.id,
		email: userExist.email,
		accessToken: accessToken,
		refreshToken: refreshToken,
	};
};

const deleteUser = async (payload, params) => {
	const userId = params.userId;
	const userExist = await models.User.findOne({ where: { id: userId } });
	if (!userExist) {
		throw new Error('user not found');
	}

	const examUserMappingExist = await models.ExamUserMapping.findOne({
		where: { user_id: userId },
	});

	if (examUserMappingExist) {
		throw new Error('Cannot delete user, user has given exams');
	}

	await models.User.destroy({ where: { id: userId } });
	return 'user deleted successfully';
};

const getAllUser = async (query) => {
	let limit = query.page == 0 ? null : query.limit;
	let page = query.page < 2 ? 0 : query.page;

	const users = await models.User.findAll({
		limit: limit,
		offset: page * limit,
	});
	return users;
};

const refreshToken = async (payload) => {
	const { userId, token: refreshToken } = payload;

	let newAccessToken = jwt.sign(
		{ userId: userId },
		process.env.SECRET_KEY_ACCESS,
		{
			expiresIn: process.env.JWT_ACCESS_EXPIRATION,
		}
	);

	return {
		accessToken: newAccessToken,
		refreshToken,
	};
};

const forgetPassword = async (payload) => {
	const { email } = payload;
	const user = await models.User.findOne({
		where: {
			email: email,
		},
	});

	if (!user) {
		throw new Error('User Not Found!');
	}

	let randomToken = generateRandom(32, true);
	let resetPassawordLink = `${process.env.BASE_URL}/api/user/reset-password/${randomToken}`;
	let key = randomToken + '-reset-password-link';
	await redisClient.set(key, user.dataValues.id, 20);

	let recipient = email;
	let subject = 'Reset Password Link';
	let body = `Password Reset Link:- ${resetPassawordLink}`;

	await sendMail(body, subject, recipient);
	return 'send reset password link successfully';
};

const resetPasswordByToken = async (payload, params) => {
	const resetToken = params.token;
	const password = payload.password;
	let key = resetToken + '-reset-password-link';
	const cachedUserId = await redisClient.get(key);
	if (!cachedUserId) {
		throw new Error('Invalid Reset Link');
	}

	const userExist = await models.User.findOne({
		where: { id: cachedUserId },
	});
	if (!userExist) {
		throw new Error('User Not Found');
	}
	await redisClient.del(key);

	await models.User.update(
		{ password: await bcrypt.hash(password, 10) },
		{ where: { email: userExist.dataValues.email } }
	);
	const email_body = 'Password reset successfull';
	const email_subject = 'Password reset';
	await sendMail(email_body, email_subject, userExist.dataValues.email);
	return 'Password reset successfully';
};

const adminResetPassword = async (payload) => {
	const email = payload.email;
	const password = payload.password;

	const userExist = await models.User.findOne({ where: { email: email } });
	if (!userExist) {
		throw new Error('User Not Found');
	}

	await models.User.update(
		{ password: await bcrypt.hash(password, 10) },
		{ where: { email: userExist.dataValues.email } }
	);
	const email_body = `Admin reset password successfully \n Credentials \n email : ${email} \n password : ${password}`;
	const email_subject = 'Password reset';
	await sendMail(email_body, email_subject, userExist.dataValues.email);
	return 'Password reset successfully';
};

const resetPassword = async (payload, user) => {
	const email = user.email;
	const password = payload.password;

	await models.User.update(
		{ password: await bcrypt.hash(password, 10) },
		{ where: { email: email } }
	);
	const email_body = `Reset password successfully \n Credentials \n email : ${email} \n password : ${password}`;
	const email_subject = 'Password reset';
	await sendMail(email_body, email_subject, email);
	return 'Password reset successfully';
};

const logOutUser = async (payload, user) => {
	const userId = user.id;
	const refreshTokenKey = userId + '-refresh-token';
	const isCachedRefreshToken = redisClient.get(refreshTokenKey);

	if (isCachedRefreshToken) {
		redisClient.del(refreshTokenKey);
	}
	return 'logout successfully';
};

const userByFile = async (payload, groupName) => {
	const trans = await sequelize.transaction();
	try {
		let groupExist = await models.Group.findOne(
			{
				where: {
					group_name: groupName,
				},
			},
			{ transaction: trans }
		);

		if (!groupExist) {
			groupExist = await models.Group.create(
				{
					group_name: groupName,
				},
				{ transaction: trans }
			);
		}

		const userEmailPassword = [];
		for (let key of payload.users) {
			const hashPassword = await bcrypt.hash(key.password, 10);
			const userObject = {
				first_name: key.firstName,
				last_name: key.lastName,
				email: key.email,
				password: hashPassword,
				role: key.role,
				organization: key.organization,
				contact_number: key.contactNumber,
			};

			let userExist = await models.User.findOne({
				where: { email: key.email },
			});
			if (!userExist) {
				userExist = await models.User.create(
					userObject,
					{
						transaction: trans,
					},
					{ transaction: trans }
				);
				userEmailPassword.push({
					email: key.email,
					password: key.password,
				});
			}

			const addUserToGroup = await models.GroupUserMapping.create(
				{
					user_id: userExist.id,
					group_id: groupExist.id,
				},
				{ transaction: trans }
			);
		}
		await trans.commit();
		userEmailPassword.forEach((user) => {
			const mailBody = `Login Credentails \nemail: ${user.email}\npassword: ${user.password}`;
			sendMail(mailBody, 'User login credentials', user.email);
		});
		return 'users created successfully';
	} catch (error) {
		await trans.rollback();
		throw new Error(error.message);
	}
};

module.exports = {
	createUser,
	loginUser,
	deleteUser,
	getAllUser,
	refreshToken,
	resetPassword,
	resetPasswordByToken,
	forgetPassword,
	adminResetPassword,
	logOutUser,
	userByFile,
};
