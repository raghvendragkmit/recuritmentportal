const models = require('../models');
const { Op } = require('sequelize');
const { throttle } = require('lodash');
const { sequelize } = require('../models');
const { ErrorReply } = require('redis');
const createGroup = async (payload) => {
	const groupExist = await models.Group.findOne({
		where: { group_name: payload.groupName },
	});
	if (groupExist) {
		throw new Error('group already exist');
	}

	const groupPayload = {
		group_name: payload.groupName,
	};
	const groupCreated = await models.Group.create(groupPayload);
	return groupCreated;
};

const deleteGroup = async (payload, params) => {
	const groupId = params.groupId;
	const groupExist = await models.Group.findOne({
		where: { id: groupId },
	});
	if (!groupExist) {
		throw new Error('group not found');
	}

	const userGroupExist = await models.GroupUserMapping.count({
		where: { group_id: groupId },
	});
	if (userGroupExist > 0) {
		throw new Error('group has users cannot delete');
	}

	await models.Group.destroy({ where: { id: groupId } });
	return 'group deleted successfully';
};

const getAllGroup = async () => {
	const groups = await models.Group.findAll({
		attributes: { exclude: ['deleted_at', 'created_at', 'updated_at'] },
	});
	return groups;
};

const updateGroup = async (payload, params) => {
	const groupId = params.groupId;
	const groupName = payload.groupName;
	const groupExist = await models.Group.findOne({
		where: { id: groupId },
	});
	if (!groupExist) {
		throw new Error('Group not found');
	}

	const groupNameExist = await models.Group.findOne({
		where: { group_name: groupName },
	});

	if (groupNameExist) {
		throw new Error('group name already exist');
	}

	const groupPayload = {
		group_name: payload.groupName,
	};
	await models.Group.update(groupPayload, {
		where: { id: groupExist.dataValues.id },
	});

	const groupUpdated = await models.Group.findOne({
		where: { id: groupId },
	});
	return groupUpdated;
};

const addUserToGroup = async (payload, params) => {
	const groupId = params.groupId;
	const userId = params.userId;
	const groupExist = await models.Group.findOne({
		where: { id: groupId },
	});
	if (!groupExist) {
		throw new Error('Group not found');
	}

	const userExist = await models.User.findOne({
		where: { id: userId },
	});

	if (!userExist) {
		throw new Error('user not found');
	}

	const userInGroup = await models.GroupUserMapping.findOne({
		where: {
			[Op.and]: [{ user_id: userId }, { group_id: groupId }],
		},
	});

	if (userInGroup) {
		throw new Error(`User already in group ${groupExist.group_name}`);
	}

	const userAddedToGroup = await models.GroupUserMapping.create({
		user_id: userId,
		group_id: groupId,
	});
	return userAddedToGroup;
};

const deleteUserFromGroup = async (payload, params) => {
	const groupId = params.groupId;
	const userId = params.userId;
	const groupExist = await models.Group.findOne({
		where: { id: groupId },
	});
	if (!groupExist) {
		throw new Error('Group not found');
	}

	const userExist = await models.User.findOne({
		where: { id: userId },
	});

	if (!userExist) {
		throw new Error('user not found');
	}

	const userInGroup = await models.GroupUserMapping.findOne({
		where: {
			[Op.and]: [{ user_id: userId }, { group_id: groupId }],
		},
	});

	if (!userInGroup) {
		throw new Error(`User not in group ${groupExist.group_name}`);
	}

	await models.GroupUserMapping.destroy({
		where: {
			[Op.and]: [{ user_id: userId }, { group_id: groupId }],
		},
	});
	return 'user deleted successfully';
};

const getAllUserFromGroup = async (payload, params) => {
	const groupId = params.groupId;

	const groupExist = await models.Group.findOne({
		where: {
			id: groupId,
		},
	});

	if (!groupExist) {
		throw new Error('group not found');
	}

	const usersInGroup = await models.GroupUserMapping.findAll({
		where: {
			group_id: groupId,
		},
		include: [
			{
				model: models.User,
				as: 'users',
			},
		],
	});

	if (!usersInGroup) {
		throw new Error(`no users in ${groupExist.group_name}}`);
	}

	return usersInGroup;
};

const addUsersToGroup = async (payload, params) => {
	const trans = await sequelize.transaction();
	try {
		const groupId = params.groupId;
		const users = payload.users;

		const groupExist = await models.Group.findOne(
			{
				where: {
					id: groupId,
				},
			},
			{ transaction: trans }
		);

		if (!groupExist) {
			throw new Error('Group not found');
		}

		for (let key in users) {
			const userId = users[key].userId;

			const userExist = await models.User.findOne(
				{
					where: {
						id: userId,
					},
				},
				{ transaction: trans }
			);

			if (!userExist) {
				throw new Error('user not found');
			}

			const userInGroup = await models.GroupUserMapping.findOne(
				{
					where: {
						[Op.and]: [{ user_id: userId }, { group_id: groupId }],
					},
				},
				{ transaction: trans }
			);

			if (userInGroup) {
				throw new Error('User already in group');
			}

			const userAddedToGroup = await models.GroupUserMapping.create(
				{
					user_id: userId,
					group_id: groupId,
				},
				{ transaction: trans }
			);

			if (!userAddedToGroup) {
				throw new Error('error in adding user to group');
			}
		}
		await trans.commit();
		return { data: 'Users added to group', error: null };
	} catch (error) {
		await trans.rollback();
		return { data: null, error: error.message };
	}
};

module.exports = {
	createGroup,
	deleteGroup,
	getAllGroup,
	updateGroup,
	addUserToGroup,
	deleteUserFromGroup,
	getAllUserFromGroup,
	addUsersToGroup,
};
