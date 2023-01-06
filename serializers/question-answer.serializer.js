const questionAnswer = async (req, res, next) => {
  const data = res.data || null;

  const response = {
    id: data.id,
    questionDescription: data.question_description,
    paperSetId: data.paper_set_id
  };

  const answers = [];

  data.answers.forEach((answer) => {
    const tempAnswer = {
      id: answer.id,
      answerDescription: answer.answer_description,
      isCorrect: answer.is_correct
    };
    answers.push(tempAnswer);
  });

  response.answers = answers;
  res.data = response;
  next();
};

const questionAnswers = async (req, res, next) => {
  const data = res.data || null;
  const response = [];
  data.forEach((question) => {
    const tempQuestion = {
      id: question.id,
      questionDescription: question.question_description,
      paperSetId: question.paper_set_id
    };

    const answers = [];

    question.answers.forEach((answer) => {
      const tempAnswer = {
        id: answer.id,
        answerDescription: answer.answer_description,
        isCorrect: answer.is_correct
      };
      answers.push(tempAnswer);
    });

    tempQuestion.answers = answers;
    response.push(tempQuestion);
  });

  res.data = response;
  next();
};
module.exports = {
  questionAnswer,
  questionAnswers
};
