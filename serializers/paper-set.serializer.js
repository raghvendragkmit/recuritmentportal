const createPaperSet = async (req, res, next) => {
	const data = res.data || null;

	const response = {
		id: data.id,
		subjectId: data.subject_id,
		paperSetName: data.paper_set_name,
		marksPerQuestion: data.marks_per_question,
		negativeMarksPerWrongAnswer: data.negative_marks_per_question,
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
			negativeMarksPerWrongAnswer: obj.negative_marks_per_question,
		};
		response.push(tempObj);
	});

	res.data = response;
	next();
};

const questionAnswers = async (req, res, next) => {
	const data = res.data || null;
	const response = [];

	console.log(data[0]), '------>';

	data.forEach((obj) => {
		const tempObj = {
			id: obj.questionAnswer.id,
			question: obj.questionAnswer.question,
			option1: obj.questionAnswer.option1,
			option2: obj.questionAnswer.option2,
			option3: obj.questionAnswer.option3,
			option4: obj.questionAnswer.option4,
		};
		response.push(tempObj);
	});

	res.data = response;
	next();
};

const paperSetNameId = async (req, res, next) => {
	const data = res.data || null;

	const response = {
		id: data.id,
		subjectId: data.subjects.id,
		paperSetName: data.paper_set_name,
		marksPerQuestion: data.marks_per_question,
		negativeMarksPerWrongAnswer: data.negative_marks_per_question,
		totalQuestions: data.total_questions,
	};

	res.data = response;
	next();
};

const paperSetQuestionAnswerSchema = async (req, res, next) => {
	const data = res.data || null;

	const response = {
		questionAnswerId: data.question_answer_id,
		paperSetId: data.paper_set_id,
	};

	res.data = response;
	next();
};

module.exports = {
	createPaperSet,
	getALlPaperSet,
	questionAnswers,
	paperSetNameId,
	paperSetQuestionAnswerSchema,
};
