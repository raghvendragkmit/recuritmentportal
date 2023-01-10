const examResult = async (req, res, next) => {
	const data = res.data || null;

	const response = [];

	data.forEach((result) => {
		const studentResult = result.result ? 'Pass' : 'Fail';
		const tempObj = {
			userId: result.user_id,
			firstName: result.users.first_name,
			lastName: result.users.last_name,
			paperSetId: result.paper_set_id,
			startTime: result.start_time,
			submitTime: result.submit_time,
			totalQuestions: result.total_questions,
			totalQuestionAttempted: result.total_question_attempted,
			totalCorrectAnswers: result.total_correct_answers,
			totalMarksObtained: result.total_marks_obtained,
			result: studentResult,
		};
		response.push(tempObj);
	});
	res.data = response;
	next();
};

const examQuestionAnswer = async (req, res, next) => {
	const data = res.data || null;
	const response = [];

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

const userResult = async (req, res, next) => {
	const data = res.data || null;
	const studentResult = data.result ? 'Pass' : 'Fail';
	const response = {
		userId: data.user_id,
		firstName: data.users.first_name,
		lastName: data.users.last_name,
		paperSetId: data.paper_set_id,
		startTime: data.start_time,
		submitTime: data.submit_time,
		totalQuestions: data.total_questions,
		totalQuestionAttempted: data.total_question_attempted,
		totalCorrectAnswers: data.total_correct_answers,
		totalMarksObtained: data.total_marks_obtained,
		result: studentResult,
	};
	res.data = response;
	next();
};

const upcomingExam = async (req, res, next) => {
	const data = res.data || null;
	const response = [];
	data.forEach((exam) => {
		const tempObj = {
			id: exam.id,
			subjectId: exam.subject_id,
			examStartTime: exam.exam_start_time,
			examEndTime: exam.exam_end_time,
			examPassingPercentage: exam.exam_passing_percentage,
		};
		response.push(tempObj);
	});

	res.data = response;
	next();
};

const allExam = async (req, res, next) => {
	const data = res.data || null;
	const response = [];
	data.forEach((exam) => {
		const tempObj = {
			id: exam.id,
			subjectId: exam.subject_id,
			subjectName: exam.subjects.subject_name,
			examStartTime: exam.exam_start_time,
			examEndTime: exam.exam_end_time,
			examPassingPercentage: exam.exam_passing_percentage,
		};
		response.push(tempObj);
	});

	res.data = response;
	next();
};

module.exports = {
	examResult,
	examQuestionAnswer,
	userResult,
	upcomingExam,
	allExam,
};
