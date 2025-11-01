const JobTypeService = require('../service/JobTypeService');

// ✅ Get Job Type List
exports.getJobTypeList = async (req, res) => {
    try {
        const result = await JobTypeService.getJobTypeList(req.query);
        res.status(200).json({ status: 200, message: 'Job type list fetched successfully', jsonData: result });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};

// ✅ Create Job Type
exports.createJobType = async (req, res) => {
    try {
        const { job_type_name, job_type_status } = req.body;
        if (!job_type_name) return res.status(400).json({ status: false, message: 'Job type name is required' });

        const result = await JobTypeService.createJobType({ job_type_name, job_type_status });
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ status: false, message: 'Internal server error', error: error.message });
    }
};

// ✅ Update Job Type
exports.updateJobType = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await JobTypeService.updateJobType(id, req.body);
        if (result.status === 404) return res.status(404).json({ status: false, message: 'Job type not found' });

        res.status(200).json({ status: 200, message: 'Job type updated successfully', jsonData: result.updated });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Internal server error', error: error.message });
    }
};
