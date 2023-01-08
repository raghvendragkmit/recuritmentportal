'use strict';
const { Model, Sequelize } = require('sequelize');
// eslint-disable-next-line no-unused-vars
module.exports = (sequelize, DataTypes) => {
	class ExamUserResponse extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			ExamUserResponse.belongsTo(models.ExamUserPaperSetMapping, {
				foreignKey: 'exam_user_attempt_id',
				targetKey: 'id',
				as: 'exam_user_attempt',
			});
			ExamUserResponse.belongsTo(models.QuestionAnswer, {
				foreignKey: 'question_answer_id',
				targetKey: 'id',
				as: 'questions',
			});
		}
	}
	ExamUserResponse.init(
		{
			exam_user_attempt_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'exam_user_paper_set_mapping',
					key: ' id',
				},
			},

			question_answer_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'question_answer',
					key: 'id',
				},
			},

			answer: {
				allowNull: false,
				type: Sequelize.STRING,
			},

			is_correct: {
				allowNull: false,
				type: Sequelize.BOOLEAN,
			},
		},
		{
			sequelize,
			modelName: 'ExamUserResponse',
			tableName: 'exam_user_response',
			paranoid: true,
		}
	);
	return ExamUserResponse;
};
