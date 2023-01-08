const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const { validateRequest } = require('../helpers/validate.helper');

const complexityOptions = {
	min: 4,
	max: 16,
	lowerCase: 1,
	upperCase: 1,
};

module.exports = {
	createUserSchema: async (req, res, next) => {
		const schema = Joi.object({
			firstName: Joi.string().min(1).required(),
			lastName: Joi.string().min(1).required(),
			email: Joi.string().email().lowercase().required(),
			password: passwordComplexity(complexityOptions).required(),
			organization: Joi.string().min(1).required(),
			role: Joi.string().valid('admin', 'user').required(),
			contactNumber: Joi.string()
				.length(10)
				.pattern(/^[0-9]+$/)
				.required(),
		});

		validateRequest(req, res, next, schema, 'body');
	},

	createUsersSchema: async (req, res, next) => {
		const userObject = Joi.object().keys({
			firstName: Joi.string().min(1).required(),
			lastName: Joi.string().min(1).required(),
			email: Joi.string().email().lowercase().required(),
			password: passwordComplexity(complexityOptions).required(),
			organization: Joi.string().min(1).required(),
			role: Joi.string().valid('user').required(),
			contactNumber: Joi.string()
				.length(10)
				.pattern(/^[0-9]+$/)
				.required(),
		});

		const schema = Joi.object({
			users: Joi.array().items(userObject),
		});

		validateRequest(req, res, next, schema, 'body');
	},

	loginSchema: async (req, res, next) => {
		const schema = Joi.object({
			email: Joi.string().email().lowercase().required(),
			password: Joi.string().required(),
		});
		validateRequest(req, res, next, schema, 'body');
	},

	userIdSchema: async (req, res, next) => {
		const schema = Joi.object({
			userId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},

	forgetPassword: async (req, res, next) => {
		const schema = Joi.object({
			email: Joi.string().email().lowercase().required(),
		});
		validateRequest(req, res, next, schema, 'body');
	},

	resetPasswordTokenSchema: async (req, res, next) => {
		const schema = Joi.object({
			token: Joi.string().alphanum().min(32).required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},

	resetPasswordSchema: async (req, res, next) => {
		const schema = Joi.object({
			password: passwordComplexity(complexityOptions).required(),
		});
		validateRequest(req, res, next, schema, 'body');
	},
	adminResetUserPasswordSchema: async (req, res, next) => {
		const schema = Joi.object({
			email: Joi.string().email().lowercase().required(),
			password: passwordComplexity(complexityOptions).required(),
		});
		validateRequest(req, res, next, schema, 'body');
	},
	limitPageSchema: async (req, res, next) => {
		const schema = Joi.object({
			page: Joi.number().positive().allow(0).required(),
			limit: Joi.number().positive().min(1).required(),
		});
		validateRequest(req, res, next, schema, 'query');
	},
};
