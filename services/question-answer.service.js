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
	const subjectId = payload.subjectId;

	const subjectExist = await models.Subject.findOne({
		where: {
			id: subjectId,
		},
	});

	if (!subjectExist) {
		throw new Error('subject not found');
	}

	const questionCreated = await models.QuestionAnswer.create({
		question: payload.question,
		option1: option1,
		option2: option2,
		option3: option3,
		option4: option4,
		correct_option: correctOption,
		subject_id: subjectId,
	});
	return 'Question answer created successfully';
};

const createQuestionAnswers = async (payload) => {
	const questionObject = payload.questionAnswers;
	const trans = await sequelize.transaction();
	try {
		for (let key in questionObject) {
			const item = questionObject[key];
			const questionExist = await models.QuestionAnswer.findOne(
				{
					where: { question: item.question },
				},
				{ transaction: trans }
			);

			const subjectExist = await models.Subject.findOne({
				where: {
					id: item.subjectId,
				},
			});

			console.log(item);

			if (!questionExist && subjectExist) {
				const option1 = item.option1;
				const option2 = item.option2;
				const option3 = item.option3;
				const option4 = item.option4;
				const correctOption = item.correctOption;
				const subjectId = item.subjectId;

				const questionCreated = await models.QuestionAnswer.create(
					{
						question: item.question,
						option1: option1,
						option2: option2,
						option3: option3,
						option4: option4,
						correct_option: correctOption,
						subject_id: subjectId,
					},
					{ transaction: trans }
				);
			}
		}
		await trans.commit();
		return 'Question Answer Created Successfully';
	} catch (error) {
		await trans.rollback();
		throw new Error(error.message);
	}
};

const getAllQuestionAnswer = async (query) => {
	const questionAnswers = await models.QuestionAnswer.findAll({
		include: [
			{
				model: models.Subject,
				as: 'subjects',
			},
		],
	});
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

	const questionPayload = { ...payload };

	if (questionPayload.correctOption) {
		questionPayload.correct_option = questionPayload.correctOption;
		delete questionPayload.correctOption;
	}

	if (questionPayload.subjectId) {
		const subjectExist = await models.Subject.findOne({
			where: {
				id: questionPayload.subjectId,
			},
		});

		if (!subjectExist) {
			throw new Error('Subject not found');
		}
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

const questionAnswerBySubject = async (params) => {
	const subjectId = params.subjectId;
	const questionAnswer = await models.QuestionAnswer.findAll({
		subject_id: subjectId,
	});

	if (!questionAnswer) {
		throw new Error('No question answer found');
	}
	return questionAnswer;
};

module.exports = {
	createQuestionAnswer,
	getAllQuestionAnswer,
	getQuestionAnswerById,
	createQuestionAnswers,
	updateQuestionAnswer,
	deleteQuestionAnswer,
	questionAnswerByFile,
	questionAnswerBySubject,
};
