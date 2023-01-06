/* eslint-disable no-unused-vars */
const models = require('../models');
const { sequelize } = require('../models');

const createQuestionAnswer = async (payload) => {
  const trans = await sequelize.transaction();
  try {
    const paperSetExist = await models.PaperSet.findOne(
      {
        where: { paper_set_name: payload.paperSetName }
      },
      { transaction: trans }
    );

    if (!paperSetExist) {
      throw new Error('paperSet not found');
    }

    const questionExist = await models.Question.findOne({
      where: { question_description: payload.questionDescription }
    });

    if (questionExist) {
      throw new Error('Question already exist');
    }

    const questionCreated = await models.Question.create(
      {
        question_description: payload.questionDescription,
        paper_set_id: paperSetExist.dataValues.id
      },
      { transaction: trans }
    );

    if (!questionCreated) {
      throw new Error('question not created');
    }

    const answerOptions = payload.options;
    let countTrue = 0;
    const answerArray = [];
    for (let i = 0; i < answerOptions.length; ++i) {
      const answerDescription = answerOptions[i].answerDescription;
      const isCorrect = answerOptions[i].isCorrect;
      if (isCorrect) {
        countTrue++;
      }
      if (countTrue > 1) {
        throw new Error('one out of 4 options must be true');
      }
      answerArray.push({
        answer_description: answerDescription,
        is_correct: isCorrect,
        question_id: questionCreated.id
      });
    }

    const answerCreated = await models.Answer.bulkCreate(answerArray, {
      transaction: trans
    });

    await trans.commit();
    return { data: 'Question answer created successfully ', error: null };
  } catch (error) {
    await trans.rollback();
    return { data: null, error: error.message };
  }
};

const createQuestionAnswers = async (payload) => {
  const questionObject = payload.questionAnswers;
  const trans = await sequelize.transaction();
  try {
    for (let key in questionObject) {
      // eslint-disable-next-line no-prototype-builtins
      // if (questionObject.hasOwnProperty(key)) {
      const item = questionObject[key];
      const paperSetExist = await models.PaperSet.findOne(
        {
          where: { paper_set_name: item.paperSetName }
        },
        { transaction: trans }
      );

      if (!paperSetExist) {
        throw new Error('paperSet not found');
      }

      const questionExist = await models.Question.findOne({
        where: { question_description: item.questionDescription }
      });

      if (questionExist) {
        throw new Error('Question already exist');
      }

      const questionCreated = await models.Question.create(
        {
          question_description: item.questionDescription,
          paper_set_id: paperSetExist.dataValues.id
        },
        { transaction: trans }
      );

      if (!questionCreated) {
        throw new Error('question not created');
      }

      const answerOptions = item.options;
      let countTrue = 0;
      const answerArray = [];
      for (let i = 0; i < answerOptions.length; ++i) {
        const answerDescription = answerOptions[i].answerDescription;
        const isCorrect = answerOptions[i].isCorrect;
        if (isCorrect) {
          countTrue++;
        }
        if (countTrue > 1) {
          throw new Error('one out of 4 options must be true');
        }
        answerArray.push({
          answer_description: answerDescription,
          is_correct: isCorrect,
          question_id: questionCreated.id
        });
      }
      const answerCreated = await models.Answer.bulkCreate(answerArray, {
        transaction: trans
      });
    }

    await trans.commit();
    return { data: 'Question Answer Created Successfully', error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
};

const getAllQuestionAnswer = async (query) => {
  const trans = await sequelize.transaction();
  try {
    let limit = query.page == 0 ? null : query.limit;
    let page = query.page < 2 ? 0 : query.page;
    const questions = await models.Question.findAll(
      {
        include: [
          {
            model: models.Answer,
            as: 'answers'
          }
        ],
        limit: limit,
        offset: page * limit
      },
      { transaction: trans }
    );

    await trans.commit();
    return { data: questions, error: null };
  } catch (error) {
    await trans.rollback();
    return { data: null, error: error.message };
  }
};

const getQuestionAnswerById = async (payload, params) => {
  const questionId = params.questionId;
  const questionAnswer = await models.Question.findOne({
    where: { id: questionId },
    include: [
      {
        model: models.Answer,
        as: 'answers',
        where: { question_id: questionId }
      }
    ]
  });

  if (!questionAnswer) {
    throw new Error('question not found');
  }
  return questionAnswer;
};

const updateQuestionDescription = async (payload, params) => {
  const questionId = params.questionId;
  const questionExist = await models.Question.findOne({
    where: { id: questionId }
  });
  if (!questionExist) {
    throw new Error('question not found');
  }
  const questionUpdated = await models.Question.update(
    {
      question_description: payload.questionDescription
    },
    { where: { id: questionId } }
  );

  return 'question description update success';
};

const updateAnswerDescription = async (payload, params) => {
  const answerId = params.answerId;
  const answerExist = await models.Answer.findOne({
    where: { id: answerId }
  });
  if (!answerExist) {
    throw new Error('answer not found');
  }
  const answerUpdated = await models.Answer.update(
    {
      answer_description: payload.answerDescription
    },
    { where: { id: answerId } }
  );

  return 'answer description update success';
};

const deleteAnswerById = async (payload, params) => {
  const trans = await sequelize.transaction();
  try {
    const answerId = params.answerId;
    const answerExist = await models.Answer.findOne(
      { where: { id: answerId } },
      { transaction: trans }
    );
    if (!answerExist) {
      throw new Error('answer not found');
    }
    await models.Answer.destroy(
      { where: { id: answerId } },
      { transaction: trans }
    );
    await trans.commit();
    return { data: 'asnwer deleted successfully', error: null };
  } catch (error) {
    await trans.rollback();
    return { data: null, error: error.message };
  }
};

const deleteQuestionById = async (payload, params) => {
  const trans = await sequelize.transaction();
  try {
    const questionId = params.questionId;
    const questionExist = await models.Question.findOne(
      { where: { id: questionId } },
      { transaction: trans }
    );
    if (!questionExist) {
      throw new Error('question not found');
    }
    await models.Question.destroy(
      { where: { id: questionId } },
      { transaction: trans }
    );
    await models.Answer.destroy(
      { where: { question_id: questionId } },
      { transaction: trans }
    );
    await trans.commit();
    return { data: 'question asnwer deleted successfully', error: null };
  } catch (error) {
    await trans.rollback();
    return { data: null, error: error.message };
  }
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
  updateQuestionDescription,
  updateAnswerDescription,
  deleteQuestionById,
  deleteAnswerById,
  questionAnswerByFile
};
