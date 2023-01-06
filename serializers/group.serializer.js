const groupNameId = async (req, res, next) => {
	const data = res.data || null;

	const response = {
		id: data.id,
		groupName: data.group_name,
	};

	res.data = response;
	next();
};

const groupUser = async (req, res, next) => {
	const data = res.data || null;

	const response = {
		userId: data.user_id,
		groupId: data.group_id,
	};

	res.data = response;
	next();
};

const getAllGroup = async (req, res, next) => {
	const data = res.data || null;

	const response = [];

	data.forEach((obj) => {
		const tempObj = {
			id: obj.id,
			subjectGroup: obj.group_name,
		};
		response.push(tempObj);
	});

	res.data = response;
	next();
};

const userFromGroup = async (req, res, next) => {
	const data = res.data || null;

	const response = [];

	data.forEach((obj) => {
		const tempObj = {
			id: obj.users.id,
			firstName: obj.users.first_name,
			lastName: obj.users.last_name,
			email: obj.users.email,
			organization: obj.users.organization,
			role: obj.users.role,
		};
		response.push(tempObj);
	});

	res.data = response;
	next();
};
module.exports = {
	groupNameId,
	getAllGroup,
	groupUser,
	userFromGroup,
};
