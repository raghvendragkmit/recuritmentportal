'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable('exam', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID,
				defaultValue: Sequelize.literal('uuid_generate_v4()'),
			},
			subject_id: {
				allowNull: false,
				type: Sequelize.UUID,
				references: {
					model: 'subject',
					key: 'id',
				},
			},
			exam_start_time: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			exam_end_time: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			exam_passing_percentage: {
				allowNull: false,
				type: Sequelize.DECIMAL,
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
			},
			deleted_at: {
				allowNull: true,
				type: Sequelize.DATE,
				defaultValue: null,
			},
		});
	},
	// eslint-disable-next-line no-unused-vars
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('exam');
	},
};
