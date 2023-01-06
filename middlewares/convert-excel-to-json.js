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
        contactNumber: row[5].toString()
      };
      userObjArray.push(tempObj);
    });
  });
  req.body = {
    users: userObjArray
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
        paperSetName: row[0],
        questionDescription: row[1],
        options: [
          {
            answerDescription: row[2],
            isCorrect: row[3]
          },
          {
            answerDescription: row[4],
            isCorrect: row[5]
          },
          {
            answerDescription: row[6],
            isCorrect: row[7]
          },
          {
            answerDescription: row[8],
            isCorrect: row[9]
          }
        ]
      };
      questionAnswersObj.push(tempObj);
    });
  });
  req.body = {
    questionAnswers: questionAnswersObj
  };

  next();
};

module.exports = {
  convertUserExcelToJson,
  convertQuestionExcelToJson
};
