/* eslint-disable no-unused-vars */
const moment = require('moment');
const { sequelize } = require('../models');
const { Op } = require('sequelize');
const models = require('../models');

const createExam = async (payload) => {
	const subjectExist = await models.Subject.findOne({
		where: { subject_name: payload.subjectName },
	});
	if (!subjectExist) {
		throw new Error('subject not found');
	}

	const paperSetExist = await models.PaperSet.count({
		where: {
			[Op.and]: [
				{ subject_id: subjectExist.id },
				{ total_questions: { [Op.gt]: 0 } },
			],
		},
	});

	if (paperSetExist == 0) {
		throw new Error('no paperset with question');
	}

	const currentTime = Date.parse(new Date());
	const startTime = Date.parse(payload.examStartTime);
	const endTime = Date.parse(payload.examEndTime);

	if (startTime <= currentTime) {
		throw new Error('examStartTime must be greater than current time');
	}

	if (startTime >= endTime) {
		throw new Error('examEndTime must be greater than examStartTime');
	}

	const examPayload = {
		subject_id: subjectExist.id,
		exam_start_time: startTime,
		exam_end_time: endTime,
		exam_passing_percentage: payload.examPassingPercentage,
	};

	const examCreated = await models.Exam.create(examPayload);

	return {
		id: examCreated.id,
		subjectId: examCreated.subject_id,
		examStartTime: examCreated.exam_start_time,
		examEndTime: examCreated.exam_end_time,
	};
};

const deleteExam = async (payload, params) => {
	const trans = await sequelize.transaction();
	try {
		const examId = params.examId;
		const currentTime = new Date();
		const examExist = await models.Exam.findOne(
			{
				where: {
					id: examId,
				},
			},
			{ transaction: trans }
		);
		if (currentTime > examExist.exam_start_time) {
			throw new Error('Cannot delete exam');
		}

		await models.Exam.destroy(
			{
				where: { id: examId },
			},
			{ transaction: trans }
		);

		await models.ExamGroupMapping.destroy(
			{
				where: { exam_id: examExist.id },
			},
			{ transaction: trans }
		);

		await trans.commit();
		return { data: 'exam deleted successfully', error: null };
	} catch (error) {
		await trans.rollback();
		return { data: null, error: error.message };
	}
};

const getAllExam = async (query) => {
	const exams = await models.Exam.findAll({
		include: [
			{
				model: models.Subject,
				as: 'subjects',
			},
		],
	});
	return exams;
};

const getAllUpcomingExam = async (payload, user) => {
	const userId = user.id;

	const allUserGroups = await models.GroupUserMapping.findAll({
		where: {
			user_id: userId,
		},
	});

	if (!allUserGroups || allUserGroups.length == 0) {
		throw new Error('user not added to group');
	}

	const groupIdArray = [];
	allUserGroups.forEach((group) => {
		groupIdArray.push(group.group_id);
	});

	const allGroupExams = await models.ExamGroupMapping.findAll({
		where: {
			group_id: { [Op.in]: [...groupIdArray] },
		},
	});

	if (!allGroupExams || allGroupExams.length == 0) {
		throw new Error('Group has not enrolled in exam');
	}

	console.log(allGroupExams);

	const allExamId = [];
	allGroupExams.forEach((exam) => {
		allExamId.push(exam.exam_id);
	});

	const allUpcomingExams = await models.Exam.findAll({
		where: {
			[Op.and]: [
				{
					id: { [Op.in]: [...allExamId] },
					exam_end_time: { [Op.gt]: new Date() },
				},
			],
		},
	});

	return allUpcomingExams;
};

const startExam = async (payload, user, params) => {
	const examId = params.examId;
	const userId = user.id;

	const examExist = await models.Exam.findOne({
		where: {
			id: examId,
		},
	});

	if (!examExist) {
		throw new Error('exam not found');
	}

	const userExist = await models.User.findOne({
		where: {
			id: userId,
		},
	});

	if (!userExist) {
		throw new Error('user not found');
	}

	const userGroups = await models.GroupUserMapping.findAll({
		where: {
			user_id: userId,
		},
	});

	if (!userGroups || userGroups.length == 0) {
		throw new Error('User not in groups');
	}

	const allGroupId = [];
	userGroups.forEach((group) => {
		allGroupId.push(group.group_id);
	});

	const groupExams = await models.ExamGroupMapping.findAll({
		where: { group_id: { [Op.in]: [...allGroupId] } },
	});

	if (!groupExams || groupExams.length == 0) {
		throw new Error('group not enrolled in exams');
	}

	const allExamId = [];
	groupExams.forEach((exam) => {
		allExamId.push(exam.exam_id);
	});

	if (!allExamId.includes(examExist.id)) {
		throw new Error('Invalid exam');
	}

	const examUserMappingExist = await models.ExamUserPaperSetMapping.findOne({
		where: {
			[Op.and]: [{ exam_id: examId }, { user_id: userId }],
		},
	});

	if (examUserMappingExist) {
		throw new Error('cannot attempt exam twice');
	}

	const currentTime = new Date();

	if (currentTime > examExist.exam_end_time) {
		throw new Error('exam finished');
	} else if (currentTime < examExist.exam_start_time) {
		throw new Error('exam not started yet');
	}

	const paperSet = await models.PaperSet.findAll({
		order: sequelize.random(),
		limit: 1,
		where: {
			[Op.and]: [
				{ subject_id: examExist.subject_id },
				{
					total_questions: { [Op.gt]: 0 },
				},
			],
		},
	});

	const paperSetId = paperSet[0].dataValues.id;

	const questionSets = await models.PaperSetQuestionAnswerMapping.findAll({
		where: { paper_set_id: paperSetId },
		include: [
			{
				model: models.QuestionAnswer,
				as: 'questionAnswer',
			},
		],
	});

	const userExamMappingCreated = await models.ExamUserPaperSetMapping.create({
		exam_id: examId,
		user_id: userId,
		paper_set_id: paperSetId,
		total_questions: questionSets.length,
		start_time: new Date().toUTCString(),
	});

	if (!userExamMappingCreated) {
		throw new Error('Somthing went wrong');
	}
	return questionSets;
};

const submitExam = async (user, params) => {
	const trans = await sequelize.transaction();
	try {
		const examId = params.examId;
		const userId = user.id;

		const examUserMappingExist =
			await models.ExamUserPaperSetMapping.findOne(
				{
					where: {
						[Op.and]: [{ exam_id: examId }, { user_id: userId }],
					},
					attributes: { include: ['id'] },
					include: [
						{
							model: models.PaperSet,
							as: 'paper_sets',
						},
						{
							model: models.Exam,
							as: 'exams',
						},
					],
				},
				{ transaction: trans }
			);

		if (!examUserMappingExist) {
			throw new Error('exam, user not found');
		}

		if (examUserMappingExist.submit_time != null) {
			throw new Error('exam submitted');
		}

		const attempt_id = examUserMappingExist.dataValues.id;

		const correctAnswers = await models.ExamUserResponse.count(
			{
				where: {
					[Op.and]: [
						{ exam_user_attempt_id: attempt_id },
						{ is_correct: true },
					],
				},
			},
			{ transaction: trans }
		);

		const questionsAttempted = await models.ExamUserResponse.count(
			{
				where: {
					exam_user_attempt_id: attempt_id,
				},
			},
			{ transaction: trans }
		);

		const marksPerQuestion =
			examUserMappingExist.paper_sets.marks_per_question;
		const negativeMarksPerWrongAnswer =
			examUserMappingExist.paper_sets.negative_marks_per_question;

		let totalMarksObtained =
			marksPerQuestion * correctAnswers -
			(questionsAttempted - correctAnswers) * negativeMarksPerWrongAnswer;

		if (totalMarksObtained < 0) {
			totalMarksObtained = 0;
		}
		const passingPercentage =
			examUserMappingExist.exams.exam_passing_percentage;
		const totalQuestions = examUserMappingExist.total_questions;
		const percentageObtained =
			(totalMarksObtained / totalQuestions) * marksPerQuestion * 100;
		const studenResult =
			percentageObtained >= passingPercentage ? true : false;

		const updatedResult = await models.ExamUserPaperSetMapping.update(
			{
				total_question_attempted: questionsAttempted,
				total_correct_answers: correctAnswers,
				total_marks_obtained: totalMarksObtained,
				submit_time: new Date(),
				result: studenResult,
			},
			{
				where: {
					id: attempt_id,
				},
			},
			{ transaction: trans }
		);
		await trans.commit();
		return 'Exam Submitted successfully';
	} catch (error) {
		await trans.rollback();
		throw new Error(error.message);
	}
};

const logResponse = async (payload, user) => {
	const trans = await sequelize.transaction();
	try {
		const examId = payload.examId;
		const userId = user.id;
		const questionId = payload.questionId;
		const answer = payload.answer;

		console.log(userId);

		const examUserMappingExist =
			await models.ExamUserPaperSetMapping.findOne(
				{
					where: {
						[Op.and]: [{ exam_id: examId }, { user_id: userId }],
					},
					attributes: { include: ['id'] },
					include: [
						{
							model: models.Exam,
							as: 'exams',
						},
						{
							model: models.PaperSet,
							as: 'paper_sets',
						},
					],
				},
				{ transaction: trans }
			);

		if (!examUserMappingExist) {
			throw new Error('exam not started');
		}

		if (examUserMappingExist.submit_time != null) {
			throw new Error('exam submitted');
		}

		if (
			Date.parse(examUserMappingExist.exams.exam_end_time) <
			Date.parse(new Date())
		) {
			throw new Error('Cannot submit after submit time');
		}

		const paperSetId = examUserMappingExist.paper_sets.id;

		const attempt_id = examUserMappingExist.dataValues.id;

		const questionExist =
			await models.PaperSetQuestionAnswerMapping.findOne(
				{
					where: {
						[Op.and]: [
							{ question_answer_id: questionId },
							{ paper_set_id: paperSetId },
						],
					},
					include: [
						{
							model: models.QuestionAnswer,
							as: 'questionAnswer',
						},
					],
				},
				{ transaction: trans }
			);

		if (questionExist.questionAnswer == null) {
			throw new Error('Invalid input');
		}

		const correctAnswer = questionExist.questionAnswer.correct_option;

		const alreadySubmitted = await models.ExamUserResponse.findOne(
			{
				where: {
					[Op.and]: [
						{ exam_user_attempt_id: attempt_id },
						{ question_answer_id: questionId },
					],
				},
			},
			{ transaction: trans }
		);

		if (alreadySubmitted) {
			await models.ExamUserResponse.update(
				{
					answer: answer,
					is_correct: correctAnswer == answer,
				},
				{
					where: {
						[Op.and]: [
							{ exam_user_attempt_id: attempt_id },
							{ question_answer_id: questionId },
						],
					},
				},
				{ transaction: trans }
			);
		} else {
			await models.ExamUserResponse.create(
				{
					answer: answer,
					is_correct: correctAnswer == answer,
					exam_user_attempt_id: attempt_id,
					question_answer_id: questionId,
				},
				{ transaction: trans }
			);
		}

		await trans.commit();
		return 'response logged successfully';
	} catch (error) {
		await trans.rollback();
		throw new Error(error.message);
	}
};

const examResult = async (payload, params) => {
	const examId = params.examId;
	const currentTime = new Date();

	const examExist = await models.Exam.findOne({
		where: {
			id: examId,
		},
	});

	if (!examExist) {
		throw new Error('Exam not found');
	}

	if (currentTime <= examExist.exam_end_time) {
		throw new Error('cannot get result now');
	}

	const allResults = await models.ExamUserPaperSetMapping.findAll({
		where: {
			exam_id: examId,
		},
		include: [
			{
				model: models.User,
				as: 'users',
			},
		],
		attributes: { exclude: ['created_at', 'updated_at', 'deleted_at'] },
	});

	return allResults;
};

const publishResult = async (payload, params) => {
	const trans = await sequelize.transaction();
	try {
		const examId = params.examId;
		const currentTime = new Date();
		const examExist = await models.Exam.findOne(
			{
				where: {
					id: examId,
				},
			},
			{ transaction: trans }
		);

		if (!examExist) {
			throw new Error('exam not found');
		}

		if (currentTime <= examExist.exam_end_time) {
			throw new Error('cannot publish result now');
		}

		const resultPublished = await models.ExamUserPaperSetMapping.update(
			{
				publish_result: true,
			},
			{
				where: {
					[Op.and]: [
						{ exam_id: examId },
						{ result: { [Op.not]: null } },
					],
				},
			},
			{ transaction: trans }
		);
		if (!resultPublished) {
			throw new Error('error in publishing result');
		}
		await trans.commit();
		return { data: 'results published successfully', error: null };
	} catch (error) {
		await trans.rollback();
		return { data: null, error: error.message };
	}
};

const checkResult = async (payload, user, params) => {
	const examId = params.examId;
	const userId = user.id;

	const isResultPublished = await models.ExamUserPaperSetMapping.findOne({
		where: {
			[Op.and]: [
				{ user_id: userId },
				{ exam_id: examId },
				{ publish_result: true },
			],
		},
		include: [
			{
				model: models.User,
				as: 'users',
			},
		],
	});

	if (!isResultPublished) {
		throw new Error('results not published yet');
	}

	return isResultPublished;
};

const updateExam = async (payload, params) => {
	const examId = params.examId;

	const examExist = await models.Exam.findOne({
		where: {
			id: examId,
		},
	});

	if (!examExist) {
		throw new Error('exam not found');
	}

	const time = new Date();

	if (time > examExist.start_time) {
		throw new Error('exam started');
	}

	const subjectExist = await models.Subject.findOne({
		where: { subject_name: payload.subjectName },
	});
	if (!subjectExist) {
		throw new Error('subject not found');
	}

	if (payload.examStartTime >= payload.examEndTime) {
		throw new Error('examEndTime must be greater than examStartTime');
	}

	const startTime = new String(payload.examStartTime).split(':');
	const endTime = new String(payload.examEndTime).split(':');
	const dateArray = new String(payload.examDate).split('-');

	const currentDate = moment().format('YYYY-MM-DD');

	const currentTime = moment().format('HH:mm:ss');
	if (payload.examDate < currentDate) {
		throw new Error('please pick an upcoming date');
	} else if (
		payload.examDate == currentDate &&
		payload.examStartTime <= currentTime
	) {
		throw new Error('please pick valid time');
	}

	const start_time =
		dateArray[0] +
		'-' +
		dateArray[1] +
		'-' +
		dateArray[2] +
		' ' +
		startTime[0] +
		':' +
		startTime[1] +
		':' +
		startTime[2];
	const end_time =
		dateArray[0] +
		'-' +
		dateArray[1] +
		'-' +
		dateArray[2] +
		' ' +
		endTime[0] +
		':' +
		endTime[1] +
		':' +
		endTime[2];

	const start_date_time = Date.parse(start_time);
	const end_date_time = Date.parse(end_time);

	const examPayload = {
		subject_id: subjectExist.id,
		exam_start_time: start_date_time,
		exam_end_time: end_date_time,
		exam_date: payload.examDate,
		exam_passing_percentage: payload.examPassingPercentage,
	};

	const examCreated = await models.Exam.update(examPayload, {
		where: {
			id: examId,
		},
	});

	return 'exam updated successfully';
};

const addGroupToExam = async (payload, params) => {
	const examId = params.examId;
	const groupId = params.groupId;

	const examExist = await models.Exam.findOne({
		where: {
			id: examId,
		},
	});

	if (!examExist) {
		throw new Error('Exam not found');
	}

	const groupExist = await models.Group.findOne({
		where: {
			id: groupId,
		},
	});

	if (!groupExist) {
		throw new Error('group not found');
	}

	const usersInGroup = await models.GroupUserMapping.count({
		where: {
			group_id: groupId,
		},
	});

	if (usersInGroup == 0) {
		throw new Error('group with 0 users cannot enroll in exam');
	}

	const currentTime = new Date();

	if (currentTime > examExist.end_time) {
		throw new Error('exam ended');
	} else if (currentTime > examExist.start_time) {
		throw new Error('cannot add group to exam while exam is live');
	}

	const groupAlreadyInExam = await models.ExamGroupMapping.findOne({
		where: {
			[Op.and]: [
				{
					exam_id: examId,
					group_id: groupId,
				},
			],
		},
	});

	if (groupAlreadyInExam) {
		throw new Error('group has already enrolled in exam');
	}

	const groupAddToExam = models.ExamGroupMapping.create({
		exam_id: examId,
		group_id: groupId,
	});

	return 'group added to exam';
};

const deleteGroupFromExam = async (payload, params) => {
	const groupId = params.groupId;
	const examId = params.examId;

	const examExist = await models.Exam.findOne({
		where: {
			id: examId,
		},
	});

	if (!examExist) {
		throw new Error('Exam not found');
	}

	const groupExist = await models.Group.findOne({
		where: {
			id: groupId,
		},
	});

	if (!groupExist) {
		throw new Error('group not found');
	}

	const groupDeletedFromExam = await models.ExamGroupMapping.destroy({
		where: {
			[Op.and]: [{ exam_id: examId }, { group_id: groupId }],
		},
	});

	if (!groupDeletedFromExam) {
		throw new Error('Group has not enrolled in exam');
	}
	return 'group deleted from exam';
};

module.exports = {
	createExam,
	deleteExam,
	getAllExam,
	getAllUpcomingExam,
	startExam,
	submitExam,
	logResponse,
	examResult,
	publishResult,
	checkResult,
	updateExam,
	addGroupToExam,
	deleteGroupFromExam,
};
