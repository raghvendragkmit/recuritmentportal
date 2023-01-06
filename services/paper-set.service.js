const models = require('../models');
// eslint-disable-next-line no-unused-vars
const { sequelize } = require('../models');

const createPaperSet = async (payload) => {
  const subjectExist = await models.Subject.findOne({
    where: { subject_name: payload.subjectName }
  });
  if (!subjectExist) {
    throw new Error('subject not found');
  }

  const paperSetNameExist = await models.PaperSet.findOne({
    where: { paper_set_name: payload.paperSetName }
  });
  if (paperSetNameExist) {
    throw new Error('paperSet name already exist');
  }

  const paperSetPayload = {
    paper_set_name: payload.paperSetName,
    subject_id: subjectExist.dataValues.id,
    marks_per_question: payload.marksPerQuestion,
    negative_marks_per_question: payload.negativeMarksPerWrongAnswer
  };
  const paperSetCreated = await models.PaperSet.create(paperSetPayload);
  return paperSetCreated;
};

const deletePaperSet = async (payload, params) => {
  const paperSetId = params.paperSetId;
  const questionPaperSetExist = await models.Question.findOne({
    where: { paper_set_id: paperSetId }
  });
  if (questionPaperSetExist) {
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
        attributes: ['id', 'subject_name']
      }
    ],
    attributes: {
      exclude: ['created_at', 'updated_at', 'deleted_at', 'subject_id']
    }
  });
  return paperSets;
};

const getAllPaperSetQuestions = async (payload, params) => {
  const paperSetId = params.paperSetId;
  const paperSets = await models.Question.findAll({
    where: { paper_set_id: paperSetId },
    include: [
      {
        model: models.Answer,
        as: 'answers'
      }
    ]
  });
  return paperSets;
};

const updatePaperSet = async (payload, params) => {
  const paperSetId = params.paperSetId;
  const paperSetName = payload.paperSetName;
  const positiveMarks = payload.marksPerQuestion;
  const negativeMarks = payload.negativeMarksPerWrongAnswer;
  const paperSetExist = await models.PaperSet.findOne({
    where: { id: paperSetId }
  });
  if (!paperSetExist) {
    throw new Error('Paper Set not found');
  }

  const paperSetNameExist = await models.PaperSet.findOne({
    where: { paper_set_name: paperSetName }
  });

  if (paperSetNameExist) {
    throw new Error('Paper Set name already exist');
  }

  const paperSetPayload = {
    paper_set_name: payload.paperSetName,
    marks_per_question: positiveMarks,
    negative_marks_per_question: negativeMarks
  };
  await models.PaperSet.update(paperSetPayload, {
    where: { id: paperSetExist.dataValues.id }
  });

  const paperSetUpdated = await models.PaperSet.findOne({
    where: { id: paperSetId }
  });
  return paperSetUpdated;
};

module.exports = {
  createPaperSet,
  getAllPaperSet,
  deletePaperSet,
  getAllPaperSetQuestions,
  updatePaperSet
};
