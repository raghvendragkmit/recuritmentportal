const models = require('../models');
const { sequelize } = require('../models');
const { Op } = require('sequelize');
const { camelCaseToSnakeCase } = require('../helpers/common-function.helper');

const createPaperSet = async (payload) => {
	const subjectExist = await models.Subject.findOne({
		where: { subject_name: payload.subjectName },
	});
	if (!subjectExist) {
		throw new Error('subject not found');
	}

	if (payload.paperSetName == paperSetNameExist.paper_set_name) {
		throw new Error('paperSet name already exist');
	}

	const paperSetPayload = {
		paper_set_name: payload.paperSetName,
		subject_id: subjectExist.dataValues.id,
		marks_per_question: payload.marksPerQuestion,
		negative_marks_per_question: payload.negativeMarksPerWrongAnswer,
	};
	const paperSetCreated = await models.PaperSet.create(paperSetPayload);
	return paperSetCreated;
};

const deletePaperSet = async (payload, params) => {
	const paperSetId = params.paperSetId;
	const questionsInPaperSet =
		await models.PaperSetQuestionAnswerMapping.count({
			where: { paper_set_id: paperSetId },
		});

	if (questionsInPaperSet > 0) {
		throw new Error('cannot delete paperSet having questions');
	}
	await models.PaperSet.destroy({ where: { id: paperSetId } });
	return 'PaperSet deleted successfully';
};

const getAllPaperSet = async () => {
	const paperSets = await models.PaperSet.findAll({
		include: [
			{
				model: models.Subject,
				as: 'subjects',
				attributes: ['id', 'subject_name'],
			},
		],
	});
	return paperSets;
};

const getAllPaperSetQuestions = async (payload, params) => {
	const paperSetId = params.paperSetId;

	const paperSetExist = await models.PaperSet.findOne({
		where: {
			id: paperSetId,
		},
	});

	if (!paperSetExist) {
		throw new Error('paper set not found');
	}
	const paperSets = await models.PaperSetQuestionAnswerMapping.findAll({
		where: { paper_set_id: paperSetId },
		include: [
			{
				model: models.QuestionAnswer,
				as: 'questionAnswer',
			},
		],
	});

	return paperSets;
};

const updatePaperSet = async (payload, params) => {
	const paperSetId = params.paperSetId;
	payload = camelCaseToSnakeCase(payload);
	const paperSetExist = await models.PaperSet.findOne({
		where: { id: paperSetId },
	});
	if (!paperSetExist) {
		throw new Error('Paper Set not found');
	}

	if (paperSetExist.paper_set_name == payload.paper_set_name) {
		throw new Error('Paper Set name already exist');
	}

	await models.PaperSet.update(payload, {
		where: { id: paperSetExist.dataValues.id },
	});

	return {
		id: paperSetId,
		paper_set_name: paperSetName,
		marks_per_question: positiveMarks,
		negative_marks_per_wrong_answer: negativeMarks,
	};
};

const addQuestionToPaperSet = async (params) => {
	const trans = await sequelize.transaction();
	const paperSetId = params.paperSetId;
	const questionId = params.questionId;

	const paperSetExist = await models.PaperSet.findOne(
		{
			where: { id: paperSetId },
		},
		{ transaction: trans }
	);

	if (!paperSetExist) {
		throw new Error('Paper Set not fouund');
	}

	const questionAnswerExist = await models.QuestionAnswer.findOne(
		{
			where: { id: questionId },
		},
		{ transaction: trans }
	);

	if (!questionAnswerExist) {
		throw new Error('Question Answer not found');
	}

	const questionInPaperSet =
		await models.PaperSetQuestionAnswerMapping.findOne(
			{
				where: {
					[Op.and]: [
						{ paper_set_id: paperSetId },
						{ question_answer_id: questionId },
					],
				},
			},
			{ transaction: trans }
		);

	if (questionInPaperSet) {
		throw new Error('question already in paper set');
	}

	try {
		const questionAddedToPaperSet =
			await models.PaperSetQuestionAnswerMapping.create(
				{
					question_answer_id: questionId,
					paper_set_id: paperSetId,
				},
				{ transaction: trans }
			);

		await models.PaperSet.update(
			{ total_questions: paperSetExist.total_questions + 1 },
			{
				where: { id: paperSetId },
			},
			{ transaction: trans }
		);

		await trans.commit();

		return questionAddedToPaperSet;
	} catch (error) {
		trans.rollback();
		throw new Error(error.message);
	}
};

const deleteQuestionFromPaperSet = async (payload, params) => {
	const trans = await sequelize.transaction();
	try {
		const paperSetId = params.paperSetId;
		const questionId = params.questionId;

		const paperSetExist = await models.PaperSet.findOne(
			{
				where: { id: paperSetId },
			},
			{ transaction: trans }
		);

		if (!paperSetExist) {
			throw new Error('Paper Set not fouund');
		}

		const questionAnswerExist = await models.QuestionAnswer.findOne(
			{
				where: { id: questionId },
			},
			{ transaction: trans }
		);

		if (!questionAnswerExist) {
			throw new Error('Question Answer not found');
		}

		const questionInPaperSet =
			await models.PaperSetQuestionAnswerMapping.findOne(
				{
					where: {
						[Op.and]: [
							{ paper_set_id: paperSetId },
							{ question_answer_id: questionId },
						],
					},
				},
				{ transaction: trans }
			);

		if (!questionInPaperSet) {
			throw new Error('question not in paper set');
		}

		const questionAddedToPaperSet =
			await models.PaperSetQuestionAnswerMapping.destroy(
				{
					where: {
						[Op.and]: [
							{ question_answer_id: questionId },
							{ paper_set_id: paperSetId },
						],
					},
				},
				{ transaction: trans }
			);

		await models.PaperSet.update(
			{ total_questions: paperSetExist.total_questions - 1 },
			{
				where: { id: paperSetId },
			},
			{ transaction: trans }
		);

		await trans.commit();
		return { data: 'question answer deleted from paper set', error: null };
	} catch (error) {
		await trans.rollback();
		return { data: null, error: error.message };
	}
};

const addQuestionsToPaperSet = async (payload, params) => {
	const trans = await sequelize.transaction();
	try {
		const paperSetId = params.paperSetId;
		const questionAnswers = payload.questionAnswers;

		const paperSetExist = await models.PaperSet.findOne(
			{
				where: {
					id: paperSetId,
				},
			},
			{ transaction: trans }
		);

		if (!paperSetExist) {
			throw new Error('paper set not found');
		}

		for (let key in questionAnswers) {
			const questionAnswerId = questionAnswers[key].questionId;

			const questionAnswerExist = await models.QuestionAnswer.findOne(
				{
					where: {
						id: questionAnswerId,
					},
				},
				{ transaction: trans }
			);

			if (!questionAnswerExist) {
				throw new Error('question  not found');
			}

			const questionInPaperSet =
				await models.PaperSetQuestionAnswerMapping.findOne(
					{
						where: {
							[Op.and]: [
								{ paper_set_id: paperSetId },
								{ question_answer_id: questionAnswerId },
							],
						},
					},
					{ transaction: trans }
				);

			if (questionInPaperSet) {
				throw new Error('Question already in paper set');
			}

			const questionAddedToPaper =
				await models.PaperSetQuestionAnswerMapping.create(
					{
						paper_set_id: paperSetId,
						question_answer_id: questionAnswerId,
					},
					{ transaction: trans }
				);

			if (!questionAddedToPaper) {
				throw new Error('error in adding question to paper set');
			}
		}

		await models.PaperSet.update(
			{
				total_questions:
					paperSetExist.total_questions +
					payload.questionAnswers.length,
			},
			{
				where: {
					id: paperSetId,
				},
			},
			{ transaction: trans }
		);
		await trans.commit();
		return { data: 'Questions added to paper set', error: null };
	} catch (error) {
		await trans.rollback();
		return { data: null, error: error.message };
	}
};

module.exports = {
	createPaperSet,
	getAllPaperSet,
	deletePaperSet,
	getAllPaperSetQuestions,
	updatePaperSet,
	addQuestionToPaperSet,
	deleteQuestionFromPaperSet,
	addQuestionsToPaperSet,
};
