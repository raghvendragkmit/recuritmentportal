const createPaperSet = async (req, res, next) => {
  const data = res.data || null;

  const response = {
    id: data.id,
    subjectId: data.subject_id,
    paperSetName: data.paper_set_name,
    marksPerQuestion: data.marks_per_question,
    negativeMarksPerWrongAnswer: data.negative_marks_per_question
  };

  res.data = response;
  next();
};

const getALlPaperSet = async (req, res, next) => {
  const data = res.data || null;

  const response = [];

  data.forEach((obj) => {
    const tempObj = {
      id: obj.id,
      subjectId: obj.subjects.id,
      subjectName: obj.subjects.subject_name,
      paperSetName: obj.paper_set_name,
      marksPerQuestion: obj.marks_per_question,
      negativeMarksPerWrongAnswer: obj.negative_marks_per_question
    };
    response.push(tempObj);
  });

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

const paperSetNameId = async (req, res, next) => {
  const data = res.data || null;

  const response = {
    id: data.id,
    subjectName: data.paper_set_name
  };

  res.data = response;
  next();
};

module.exports = {
  createPaperSet,
  getALlPaperSet,
  questionAnswers,
  paperSetNameId
};
