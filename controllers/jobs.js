const { StatusCodes } = require("http-status-codes");
const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const { id } = req.user;
  const jobs = await Job.find({ createdBy: id }).sort("-createdAt");

  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getJob = async (req, res) => {
  const {
    user: { id: userId },
    params: { jobId },
  } = req;

  const job = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  }).select("status company position");

  if (!job) {
    throw new NotFoundError(`The job with id: ${jobId} was not found`);
  }

  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  const { body } = req;
  body.createdBy = req.user.id;
  const job = await Job.create(body);

  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    user: { id: userId },
    params: { jobId },
    body,
  } = req;

  if (!body.company || !body.position) {
    throw new BadRequestError("Fields company and position can not be blanked");
  }

  const job = await Job.findByIdAndUpdate(
    { _id: jobId, createdBy: userId },
    body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    user: { id: userId },
    params: { jobId },
  } = req;

  const job = await Job.findByIdAndRemove({ _id: jobId, createdBy: userId });

  res.status(StatusCodes.OK).json({ job });
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
