'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable(
			'exam_group_mapping',
			{
				id: {
					allowNull: false,
					primaryKey: true,
					type: Sequelize.UUID,
					defaultValue: Sequelize.literal('uuid_generate_v4()'),
				},

				exam_id: {
					allowNull: false,
					type: Sequelize.UUID,
					references: {
						model: 'exam',
						key: 'id',
					},
				},
				group_id: {
					allowNull: false,
					type: Sequelize.UUID,
					references: {
						model: 'group',
						key: 'id',
					},
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
			},
			{
				uniqueKeys: {
					actions_unique: {
						fields: ['exam_id', 'group_id'],
					},
				},
			}
		);
	},
	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable('exam_group_mapping');
	},
};
