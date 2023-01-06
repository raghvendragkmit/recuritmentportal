const createUser = async (req, res, next) => {
  const data = res.data || null;

  const response = {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    role: data.role,
    organization: data.organization,
    contactNumber: data.contactNumber
  };

  res.data = response;
  next();
};

const getAllUser = async (req, res, next) => {
  const data = res.data || null;

  const response = [];

  data.forEach((obj) => {
    const tempObj = {
      id: obj.id,
      firstName: obj.first_name,
      lastName: obj.last_name,
      email: obj.email,
      role: obj.role,
      organization: obj.organization,
      contactNumber: obj.contactNumber
    };
    response.push(tempObj);
  });

  res.data = response;
  next();
};

module.exports = {
  createUser,
  getAllUser
};
