const models = require('../models');
// eslint-disable-next-line no-unused-vars
const { sequelize } = require('../models');
const { Op } = require('sequelize');

const createPaperSet = async (payload) => {
	const subjectExist = await models.Subject.findOne({
		where: { subject_name: payload.subjectName },
	});
	if (!subjectExist) {
		throw new Error('subject not found');
	}

	const paperSetNameExist = await models.PaperSet.findOne({
		where: { paper_set_name: payload.paperSetName },
	});
	if (paperSetNameExist) {
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
	const paperSetName = payload.paperSetName;
	const positiveMarks = payload.marksPerQuestion;
	const negativeMarks = payload.negativeMarksPerWrongAnswer;
	const paperSetExist = await models.PaperSet.findOne({
		where: { id: paperSetId },
	});
	if (!paperSetExist) {
		throw new Error('Paper Set not found');
	}

	const paperSetNameExist = await models.PaperSet.findOne({
		where: { paper_set_name: paperSetName },
	});

	if (paperSetNameExist) {
		throw new Error('Paper Set name already exist');
	}

	const paperSetPayload = {
		paper_set_name: payload.paperSetName,
		marks_per_question: positiveMarks,
		negative_marks_per_question: negativeMarks,
	};
	await models.PaperSet.update(paperSetPayload, {
		where: { id: paperSetExist.dataValues.id },
	});

	const paperSetUpdated = await models.PaperSet.findOne({
		where: { id: paperSetId },
	});

	console.log(paperSetUpdated, '------------>');
	return paperSetUpdated;
};

const addQuestionToPaperSet = async (payload, params) => {
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

		if (questionInPaperSet) {
			throw new Error('question already in paper set');
		}

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

		return { data: questionAddedToPaperSet, error: null };
	} catch (error) {
		trans.rollback();
		return { data: null, error: error.message };
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

module.exports = {
	createPaperSet,
	getAllPaperSet,
	deletePaperSet,
	getAllPaperSetQuestions,
	updatePaperSet,
	addQuestionToPaperSet,
	deleteQuestionFromPaperSet,
};
