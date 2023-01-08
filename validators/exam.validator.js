const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

module.exports = {
	createExamSchema: async (req, res, next) => {
		const schema = Joi.object({
			subjectName: Joi.string().min(1).required(),
			examStartTime: Joi.string()
				.regex(/^([0-9]{2}:)([0-9]{2}:)([0-9]{2})$/)
				.required(),
			examEndTime: Joi.string()
				.regex(/^([0-9]{2}:)([0-9]{2}:)([0-9]{2})$/)
				.required(),
			examDate: Joi.string()
				.regex(/^([0-9]{4}-)([0-9]{2}-)([0-9]{2})$/)
				.required(),
			examPassingPercentage: Joi.number().min(33).precision(2),
		});
		validateRequest(req, res, next, schema, 'body');
	},
	examIdSchema: async (req, res, next) => {
		const schema = Joi.object({
			examId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},
	submitExam: async (req, res, next) => {
		let service = Joi.object().keys({
			questionId: Joi.string().guid().required(),
			answer: Joi.string()
				.valid('option1', 'option2', 'option3', 'option4')
				.required(),
		});

		const schema = Joi.object({
			examId: Joi.string().guid().required(),
			response: Joi.array().items(service),
		});
		validateRequest(req, res, next, schema, 'body');
	},
	examLogResponse: async (req, res, next) => {
		const schema = Joi.object({
			examId: Joi.string().guid().required(),
			questionId: Joi.string().guid().required(),
			answerId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'body');
	},
};
