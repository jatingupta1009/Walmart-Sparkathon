// middleware/setFamilyId.js
const userModel = require("../model/userModel");

const setFamilyId = async (req, res, next) => {
  const user = await userModel.findById(req.userId);
  if (user && user.familyId) {
    req.familyId = user.familyId;
  }
  next();
};

module.exports = setFamilyId;
