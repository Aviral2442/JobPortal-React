const path = require("path");
const Job = require("../models/Job");

const toPublicPath = (absPath) => {
  const rel = absPath.replace(/\\/g, "/");
  if (rel.includes("/uploads/")) {
    const idx = rel.indexOf("/uploads/");
    return rel.slice(idx + 1);
  }
  const base = path.basename(rel);
  return `uploads/jobs/${base}`;
};

const createJobDraft = async (req, res) => {
  try {
    const { postName = "Untitled Job", organization = "", advtNumber = "" } = req.body || {};
    const draft = await Job.create({
      postName,
      organization,
      advtNumber,
      metaDetails: { title: "", description: "", keywords: "", schemas: "" },
      dates: [],
      fees: [],
      vacancies: [],
      eligibility: {},
      salary: {},
      selection: [],
      links: [],
      howToApply: "",
      files: [],
    });
    return res.status(201).json({ message: "Draft created", jobId: draft._id, job: draft });
  } catch (err) {
    console.error("Draft create error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

const createJob = async (req, res) => {
  try {
    const jobData = JSON.parse(req.body.jobData || "{}");

    if (req.files) {
      if (req.files.files) {
        jobData.files = req.files.files.map((f) => toPublicPath(f.path));
      }
      if (req.files.logo && req.files.logo[0]) {
        jobData.logo = toPublicPath(req.files.logo[0].path);
      }
    }

    jobData.metaDetails = jobData.metaDetails || { title: "", description: "", keywords: "", schemas: "" };
    jobData.eligibility = jobData.eligibility || {};
    jobData.howToApply = jobData.howToApply || "";
    jobData.selection = jobData.selection || [];
    jobData.links = jobData.links || [];
    jobData.dates = jobData.dates || [];
    jobData.fees = jobData.fees || [];
    jobData.vacancies = jobData.vacancies || [];
    jobData.salary = jobData.salary || { payScale: "", inHand: "", allowances: "" };

    const job = await Job.create(jobData);
    return res.status(201).json({ message: "Job created successfully", _id: job._id, job });
  } catch (error) {
    console.error("Create Job Error:", error);
    return res.status(400).json({ message: "Bad Request", error: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    return res.json(jobs);
  } catch (error) {
    console.error("Get Jobs Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ error: "Job not found" });
    return res.json(job);
  } catch (error) {
    console.error("Get Job Error:", error);
    return res.status(400).json({ error: "Invalid Job ID" });
  }
};

const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const jobData = JSON.parse(req.body.jobData || "{}");

    if (req.files) {
      if (req.files.files) jobData.files = req.files.files.map((f) => toPublicPath(f.path));
      if (req.files.logo && req.files.logo[0]) jobData.logo = toPublicPath(req.files.logo[0].path);
    }

    const job = await Job.findByIdAndUpdate(id, jobData, { new: true, runValidators: true });
    if (!job) return res.status(404).json({ error: "Job not found" });

    return res.status(200).json({ message: "Job updated successfully", job });
  } catch (error) {
    console.error("Update Job Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

// UPDATED: Section save with basicDetails mapped to top-level
const saveJobSection = async (req, res) => {
  try {
    const { jobId, section, data } = req.body;
    if (!jobId || !section) {
      return res.status(400).json({ error: "jobId and section are required" });
    }

    let updateDoc;
    if (section === "basicDetails") {
      const {
        postName,
        organization,
        advtNumber,
        jobType,
        sector,
        jobCategory,
        jobLocation,
        experience,
        modeOfExam,
        shortDescription,
        expiryDate,
      } = data || {};

      const topLevel = {};
      if (postName !== undefined) topLevel.postName = postName;
      if (organization !== undefined) topLevel.organization = organization;
      if (advtNumber !== undefined) topLevel.advtNumber = advtNumber;
      if (jobType !== undefined) topLevel.jobType = jobType;
      if (sector !== undefined) topLevel.sector = sector;
      if (jobCategory !== undefined) topLevel.jobCategory = jobCategory;
      if (jobLocation !== undefined) topLevel.jobLocation = jobLocation;
      if (experience !== undefined) topLevel.experience = experience;
      if (modeOfExam !== undefined) topLevel.modeOfExam = modeOfExam;
      if (shortDescription !== undefined) topLevel.shortDescription = shortDescription;
      if (expiryDate !== undefined) topLevel.expiryDate = expiryDate;

      updateDoc = { $set: topLevel };
    } else {
      // For all other sections, set by section path
      updateDoc = { $set: { [section]: data?.[section] ?? data } };
    }

    const updated = await Job.findByIdAndUpdate(jobId, updateDoc, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ error: "Job not found" });
    return res.status(200).json({ message: "Section saved", job: updated });
  } catch (error) {
    console.error("Save Section Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const uploadJobFiles = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: "jobId is required" });

    const filePaths = (req.files || []).map((f) => toPublicPath(f.path));
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    job.files = [...(job.files || []), ...filePaths];
    await job.save();

    return res.status(200).json({ message: "Files uploaded", files: job.files, job });
  } catch (error) {
    console.error("Upload Files Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  try {
    const removed = await Job.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: "Job not found" });
    return res.json({ message: "Job deleted" });
  } catch (error) {
    console.error("Delete Job Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteJobArrayItem = async (req, res) => {
  try {
    const { id, section, index } = req.params;

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (!Array.isArray(job[section])) {
      return res.status(400).json({ error: `${section} is not an array` });
    }

    const idx = Number(index);
    if (Number.isNaN(idx) || idx < 0 || idx >= job[section].length) {
      return res.status(400).json({ error: "Invalid index" });
    }

    job[section].splice(idx, 1);
    await job.save();

    return res.status(200).json({ message: `${section} item deleted`, job });
  } catch (error) {
    console.error("Delete Array Item Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createJobDraft, // optional
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  saveJobSection,
  uploadJobFiles,
  deleteJobArrayItem,
};
