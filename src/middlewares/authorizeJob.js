const jobModel = require("../models/jobModel");
const { isValidObjectId } = require("../utils/validator");

const authorizeJob = async (req, res, next) => {
  try {
    let id = req.params.id;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ msg: "Invalid Id" });
    }

    let job = await jobModel.findById(id);
    if (!job) {
      return res.status(404).json({ msg: "Job Not Found" });
    }

    if (job.userId.toString() !== req.userId) {
      return res.status(403).json({ msg: "You are Not Authorised" });
    }

    req.job = job;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

module.exports = authorizeJob;
