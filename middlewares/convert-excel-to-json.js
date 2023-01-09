const readXlsxFile = require('read-excel-file/node');
const fs = require('fs');
const { generateRandom } = require('../helpers/common-function.helper');

const convertUserExcelToJson = async (req, res, next) => {
	const userObjArray = [];
	const path = 'uploads/' + req.file.originalname;
	await readXlsxFile(fs.createReadStream(path)).then((rows) => {
		rows.shift();
		rows.forEach((row) => {
			const tempObj = {
				firstName: row[0],
				lastName: row[1],
				email: row[2],
				role: row[3],
				password: generateRandom(10, true),
				organization: row[4],
				contactNumber: row[5].toString(),
			};
			userObjArray.push(tempObj);
		});
	});
	req.body = {
		users: userObjArray,
	};
	next();
};

const convertQuestionExcelToJson = async (req, res, next) => {
	const questionAnswersObj = [];
	const path = 'uploads/' + req.file.originalname;
	await readXlsxFile(fs.createReadStream(path)).then((rows) => {
		rows.shift();
		rows.forEach((row) => {
			const tempObj = {
				question: row[0],
				option1: row[1],
				option2: row[2],
				option3: row[3],
				option4: row[4],
				correctOption: row[5],
			};
			questionAnswersObj.push(tempObj);
		});
	});
	req.body = {
		questionAnswers: questionAnswersObj,
	};

	next();
};

module.exports = {
	convertUserExcelToJson,
	convertQuestionExcelToJson,
};
