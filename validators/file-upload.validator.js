const { commonErrorHandler } = require('../helpers/common-function.helper');

const fileSchema = async (req, res, next) => {
	try {
		if (req.file && req.file.originalname.match(/\.xlsx/)) {
			next();
		} else {
			throw new Error('please upload xlsx file');
		}
	} catch (error) {
		commonErrorHandler(req, res, error.message, 400, error);
	}
};

module.exports = {
	fileSchema,
};
