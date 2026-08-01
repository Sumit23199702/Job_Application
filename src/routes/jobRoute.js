const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getJobById,
  deleteJob,
  updateJob,
} = require("../controllers/jobController");
const auth = require("../middlewares/auth");
const authorizeJob = require("../middlewares/authorizeJob");

router.post("/create", auth, createJob);
router.get("/allJobs", auth, getAllJobs);
router.get("/job-detail/:id", auth, getJobById);

router.delete("/delete/:id", auth, authorizeJob, deleteJob);
router.put("/update/:id", auth, authorizeJob, updateJob);

module.exports = router;


