'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class QuestionAnswer extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			QuestionAnswer.belongsToMany(models.PaperSet, {
				through: models.PaperSetQuestionAnswerMapping,
				foreignKey: 'question_answer_id',
				sourceKey: 'id',
			});
		}
	}
	QuestionAnswer.init(
		{
			question: {
				type: Sequelize.TEXT,
				allowNull: false,
			},
			option1: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			option2: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			option3: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			option4: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			correct_option1: {
				type: Sequelize.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			modelName: 'QuestionAnswer',
			tableName: 'question_answer',
			paranoid: true,
		}
	);
	return QuestionAnswer;
};
