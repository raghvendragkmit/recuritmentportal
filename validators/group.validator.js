const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');
module.exports = {
	groupNameSchema: async (req, res, next) => {
		const schema = Joi.object({
			groupName: Joi.string().required(),
		});
		validateRequest(req, res, next, schema, 'body');
	},
	groupIdSchema: async (req, res, next) => {
		const schema = Joi.object({
			groupId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},

	groupUserIdSchema: async (req, res, next) => {
		const schema = Joi.object({
			groupId: Joi.string().guid().required(),
			userId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},
};
