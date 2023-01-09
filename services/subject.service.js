const models = require('../models');

const createSubject = async (payload) => {
	const subjectExist = await models.Subject.findOne({
		where: { subject_name: payload.subjectName },
	});
	if (subjectExist) {
		throw new Error('subject already exist');
	}

	const subjectPayload = {
		subject_name: payload.subjectName,
	};
	const subjectCreated = await models.Subject.create(subjectPayload);
	return subjectCreated;
};

const deleteSubject = async (payload, params) => {
	const subjectId = params.subjectId;
	const subjectExist = await models.Subject.findOne({
		where: { id: subjectId },
	});
	if (!subjectExist) {
		throw new Error('subject not found');
	}

	const paperSetExist = await models.PaperSet.count({
		where: { subject_id: subjectId },
	});
	if (paperSetExist > 0) {
		throw new Error('paper sets exist for subject');
	}

	await models.Subject.destroy({ where: { id: subjectId } });
	return 'subject deleted successfully';
};

const getAllSubject = async () => {
	const subjects = await models.Subject.findAll({
		attributes: { exclude: ['deleted_at', 'created_at', 'updated_at'] },
	});
	return subjects;
};

const updateSubject = async (payload, params) => {
	const subjectId = params.subjectId;
	const subjectName = payload.subjectName;
	const subjectExist = await models.Subject.findOne({
		where: { id: subjectId },
	});
	if (!subjectExist) {
		throw new Error('subject not found');
	}

	if (subjectName == subjectExist.subject_name) {
		throw new Error('subject name already exist');
	}

	const subjectPayload = {
		subject_name: payload.subjectName,
	};
	await models.Subject.update(subjectPayload, {
		where: { id: subjectExist.dataValues.id },
	});

	const subjectUpdated = await models.Subject.findOne({
		where: { id: subjectId },
	});
	return {
		id: subjectId,
		subject_name: subjectName,
	};
};

module.exports = {
	createSubject,
	deleteSubject,
	getAllSubject,
	updateSubject,
};
