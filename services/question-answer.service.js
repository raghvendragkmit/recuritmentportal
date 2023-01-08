/* eslint-disable no-unused-vars */
const models = require('../models');
const { sequelize } = require('../models');
const _ = require('lodash');

const createQuestionAnswer = async (payload) => {
	const questionExist = await models.QuestionAnswer.findOne({
		where: { question: payload.question },
	});

	if (questionExist) {
		throw new Error('Question already exist');
	}

	const option1 = payload.option1;
	const option2 = payload.option2;
	const option3 = payload.option3;
	const option4 = payload.option4;
	const correctOption = payload.correctOption;

	const questionCreated = await models.QuestionAnswer.create({
		question: payload.question,
		option1: option1,
		option2: option2,
		option3: option3,
		option4: option4,
		correct_option: correctOption,
	});

	if (!questionCreated) {
		throw new Error('question not created');
	}

	return 'Question answer created successfully';
};

const createQuestionAnswers = async (payload) => {
	const questionObject = payload.questionAnswers;
	const trans = await sequelize.transaction();
	try {
		for (let key in questionObject) {
			// eslint-disable-next-line no-prototype-builtins
			const item = questionObject[key];
			const questionExist = await models.QuestionAnswer.findOne(
				{
					where: { question: item.question },
				},
				{ transaction: trans }
			);

			if (questionExist) {
				throw new Error('Question already exist');
			}

			const option1 = item.option1;
			const option2 = item.option2;
			const option3 = item.option3;
			const option4 = item.option4;
			const correctOption = item.correctOption;

			const questionCreated = await models.QuestionAnswer.create(
				{
					question: item.question,
					option1: option1,
					option2: option2,
					option3: option3,
					option4: option4,
					correct_option: correctOption,
				},
				{ transaction: trans }
			);

			if (!questionCreated) {
				throw new Error('question not created');
			}
		}

		await trans.commit();
		return { data: 'Question Answer Created Successfully', error: null };
	} catch (error) {
		await trans.rollback();
		return { data: null, error: error.message };
	}
};

const getAllQuestionAnswer = async (query) => {
	const questionAnswers = await models.QuestionAnswer.findAll();
	console.log(questionAnswers);
	return questionAnswers;
};

const getQuestionAnswerById = async (payload, params) => {
	const questionId = params.questionId;
	const questionAnswer = await models.QuestionAnswer.findOne({
		where: { id: questionId },
	});

	if (!questionAnswer) {
		throw new Error('question not found');
	}
	return questionAnswer;
};

const updateQuestionAnswer = async (payload, params) => {
	const questionId = params.questionId;
	const questionExist = await models.QuestionAnswer.findOne({
		where: { id: questionId },
	});

	if (!questionExist) {
		throw new Error('question not found');
	}

	const questionPayload = {};

	for (let key in payload) {
		payload[key] && (questionPayload[key] = payload[key]);
	}

  if (questionPayload.correctOption) {
    questionPayload.correct_option = questionPayload.correctOption;
		delete questionPayload.correctOption;
	}

	await models.QuestionAnswer.update(questionPayload, {
		where: {
			id: questionId,
		},
	});
	return 'question answer updated successfully';
};

const deleteQuestionAnswer = async (payload, params) => {
	const questionId = params.questionId;
	const questionExist = await models.QuestionAnswer.findOne({
		where: { id: questionId },
	});
	if (!questionExist) {
		throw new Error('question not found');
	}

	const questionInPaperSet = await models.PaperSetQuestionAnswerMapping.count(
		{
			where: { question_answer_id: questionId },
		}
	);

	if (questionInPaperSet > 0) {
		throw new Error('question is in paper set');
	}

	await models.QuestionAnswer.destroy({
		where: { id: questionId },
	});
	return 'question answer deleted successfully';
};

const questionAnswerByFile = async (payload, file) => {
	const response = await createQuestionAnswers(payload);
	if (response.error) {
		throw new Error(response.error);
	}
	return 'Question Answers uploaded successfully';
};

module.exports = {
	createQuestionAnswer,
	getAllQuestionAnswer,
	getQuestionAnswerById,
	createQuestionAnswers,
	updateQuestionAnswer,
	deleteQuestionAnswer,
	questionAnswerByFile,
};
