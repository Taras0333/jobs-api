const express = require("express");
const router = express();

const {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").get(getAllJobs).post(createJob);
router.route("/:jobId").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
