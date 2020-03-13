const Nationality = require('../models').nationalities;

exports.list = async (req, res, next) => {
  try {
    const nationalities = await Nationality.findAll();
    return res.json({
      code: 200,
      data: nationalities,
    });
  } catch (error) {
    return next(error);
  }
};
