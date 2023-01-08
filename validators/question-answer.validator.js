const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');
module.exports = {
	questionAnswerSchema: async (req, res, next) => {
		const schema = Joi.object({
			question: Joi.string().min(1).required(),
			option1: Joi.string().min(1).required(),
			option2: Joi.string().min(1).required(),
			option3: Joi.string().min(1).required(),
			option4: Joi.string().min(1).required(),
			correctOption: Joi.string()
				.valid('option1', 'option2', 'option3', 'option4')
				.required(),
		});
		validateRequest(req, res, next, schema, 'body');
	},
	questionIdSchema: async (req, res, next) => {
		const schema = Joi.object({
			questionId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},

	questionAnswerUpdateSchema: async (req, res, next) => {
		const schema = Joi.object({
			question: Joi.string().min(1),
			option1: Joi.string().min(1),
			option2: Joi.string().min(1),
			option3: Joi.string().min(1),
			option4: Joi.string().min(1),
			correctOption: Joi.string().valid(
				'option1',
				'option2',
				'option3',
				'option4'
			),
		});
		validateRequest(req, res, next, schema, 'body');
	},
	answerDescriptionSchema: async (req, res, next) => {
		const schema = Joi.object({
			answerDescription: Joi.string().min(1).required(),
		});
		validateRequest(req, res, next, schema, 'body');
	},
	answerIdSchema: async (req, res, next) => {
		const schema = Joi.object({
			answerId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},
	questionAnswersSchema: async (req, res, next) => {
		const questionAnswer = Joi.object().keys({
			question: Joi.string().min(1).required(),
			option1: Joi.string().min(1).required(),
			option2: Joi.string().min(1).required(),
			option3: Joi.string().min(1).required(),
			option4: Joi.string().min(1).required(),
			correctOption: Joi.string()
				.valid('option1', 'option2', 'option3', 'option4')
				.required(),
		});

		const schema = Joi.object({
			questionAnswers: Joi.array().items(questionAnswer),
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
