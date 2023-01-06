const subjectNameId = async (req, res, next) => {
  const data = res.data || null;

  const response = {
    id: data.id,
    subjectName: data.subject_name
  };

  res.data = response;
  next();
};

const getAllSubject = async (req, res, next) => {
  const data = res.data || null;

  const response = [];

  data.forEach((obj) => {
    const tempObj = {
      id: obj.id,
      subjectName: obj.subject_name
    };
    response.push(tempObj);
  });

  res.data = response;
  next();
};
module.exports = {
  subjectNameId,
  getAllSubject
};
