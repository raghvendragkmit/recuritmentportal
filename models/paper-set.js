'use strict';
const { Model, Sequelize } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
	class PaperSet extends Model {
		/**
		 * Helper method for defining associations.
		 * This method is not a part of Sequelize lifecycle.
		 * The `models/index` file will call this method automatically.
		 */
		static associate(models) {
			// define association here
			PaperSet.belongsTo(models.Subject, {
				foreignKey: 'subject_id',
				targetKey: 'id',
				as: 'subjects',
			});

			PaperSet.belongsToMany(models.QuestionAnswer, {
				through: models.PaperSetQuestionAnswerMapping,
				foreignKey: 'paper_set_id',
				sourceKey: 'id',
			});
		}
	}
	PaperSet.init(
		{
			subject_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'subject',
					key: 'id',
				},
			},

			paper_set_name: {
				allowNull: false,
				type: Sequelize.STRING,
			},
			marks_per_question: {
				allowNull: false,
				type: Sequelize.FLOAT,
			},
			negative_marks_per_question: {
				allowNull: false,
				type: Sequelize.FLOAT,
			},
		},
		{
			sequelize,
			modelName: 'PaperSet',
			tableName: 'paper_set',
			paranoid: true,
		}
	);
	return PaperSet;
};
