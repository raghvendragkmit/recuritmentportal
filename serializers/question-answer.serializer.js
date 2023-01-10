const questionAnswer = async (req, res, next) => {
	const data = res.data || null;

	const response = {
		id: data.id,
		question: data.question,
		option1: data.option1,
		option2: data.option2,
		option3: data.option3,
		option4: data.option4,
		correctOption: data.correct_option1,
	};
	res.data = response;
	next();
};

const questionAnswers = async (req, res, next) => {
	const data = res.data || null;
	const response = [];

	data.forEach((obj) => {
		const tempObj = {
			id: obj.id,
			question: obj.question,
			option1: obj.option1,
			option2: obj.option2,
			option3: obj.option3,
			option4: obj.option4,
			correctOption: obj.correct_option1,
			subject_name: obj.subjects.subject_name,
			subject_id: obj.subjects.id,
		};
		response.push(tempObj);
	});

	res.data = response;
	next();
};

const questionAnswerBySubject = async (req, res, next) => {
	const data = res.data || null;
	const response = [];

	data.forEach((questionAnswer) => {
		const tempObj = {
			id: questionAnswer.id,
			question: questionAnswer.question,
			option1: questionAnswer.option1,
			option2: questionAnswer.option2,
			option3: questionAnswer.option3,
			option4: questionAnswer.option4,
			correctOption: questionAnswer.correct_option,
		};
		response.push(tempObj);
	});

	res.data = response;
	next();
};
module.exports = {
	questionAnswer,
	questionAnswers,
	questionAnswerBySubject,
};
