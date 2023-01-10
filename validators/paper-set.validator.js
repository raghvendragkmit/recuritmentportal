const Joi = require('joi');
const { validateRequest } = require('../helpers/validate.helper');

module.exports = {
	createPaperSetSchema: async (req, res, next) => {
		const schema = Joi.object({
			subjectName: Joi.string().min(1).required(),
			paperSetName: Joi.string().min(1).required(),
			marksPerQuestion: Joi.number().min(1).precision(2).required(),
			negativeMarksPerWrongAnswer: Joi.number()
				.min(0)
				.precision(2)
				.required(),
		});

		validateRequest(req, res, next, schema, 'body');
	},

	paperSetIdSchema: async (req, res, next) => {
		const schema = Joi.object({
			paperSetId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},

	questionAnswersPaperSetSchema: async (req, res, next) => {
		const questionAnswers = Joi.object().keys({
			questionId: Joi.string().guid().required(),
		});
		const schema = Joi.object({
			questionAnswers: Joi.array().items(questionAnswers),
		});
		validateRequest(req, res, next, schema, 'body');
	},

	updatePaperSetSchema: async (req, res, next) => {
		const schema = Joi.object({
			paperSetName: Joi.string().min(1),
			marksPerQuestion: Joi.number().min(1).precision(2),
			negativeMarksPerWrongAnswer: Joi.number().min(0).precision(2),
		});

		validateRequest(req, res, next, schema, 'body');
	},

	paperSetIdQuestionAnswerIdSchema: async (req, res, next) => {
		const schema = Joi.object({
			paperSetId: Joi.string().guid().required(),
			questionId: Joi.string().guid().required(),
		});
		validateRequest(req, res, next, schema, 'params');
	},
};
