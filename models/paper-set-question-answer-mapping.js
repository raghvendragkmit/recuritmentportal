'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PaperSetQuestionAnswerMapping extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			PaperSetQuestionAnswerMapping.belongsTo(models.PaperSet, {
				foreignKey: 'paper_set_id',
				targetKey: 'id',
				as: 'paperSets',
			});

			PaperSetQuestionAnswerMapping.belongsTo(models.QuestionAnswer, {
				foreignKey: 'question_answer_id',
				targetKey: 'id',
				as: 'questionAnswer',
			});
		}
	}
	PaperSetQuestionAnswerMapping.init(
		{
			paper_set_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'paper_set',
					key: 'id',
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
		},
		{
			sequelize,
			modelName: 'PaperSetQuestionAnswerMapping',
		}
	);
	return PaperSetQuestionAnswerMapping;
};
