const JobTypeModel = require('../models/JobTypeModel');
const moment = require('moment');

// ✅ Get Job Type List with Filters, Pagination, and Search
exports.getJobTypeList = async (query) => {
    const { dateFilter, fromDate, toDate, searchFilter, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;
    const filter = {};

    if (searchFilter) {
        filter.job_type_name = { $regex: searchFilter, $options: 'i' };
    }

    if (dateFilter) {
        const today = moment().startOf('day');
        const now = moment().endOf('day');
        let startDate, endDate;

        switch (dateFilter) {
            case 'today': startDate = today.unix(); endDate = now.unix(); break;
            case 'yesterday': startDate = today.subtract(1, 'days').unix(); endDate = now.subtract(1, 'days').unix(); break;
            case 'this_week': startDate = moment().startOf('week').unix(); endDate = moment().endOf('week').unix(); break;
            case 'this_month': startDate = moment().startOf('month').unix(); endDate = moment().endOf('month').unix(); break;
            case 'custom':
                if (fromDate && toDate) {
                    startDate = moment(fromDate, 'YYYY-MM-DD').startOf('day').unix();
                    endDate = moment(toDate, 'YYYY-MM-DD').endOf('day').unix();
                }
                break;
        }
        if (startDate && endDate) filter.job_type_created_at = { $gte: startDate, $lte: endDate };
    }

    const total = await JobTypeModel.countDocuments(filter);
    const data = await JobTypeModel.find(filter).skip(skip).limit(limit).sort({ job_type_created_at: -1 });

    return { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit), data };
};

// ✅ Create Job Type
exports.createJobType = async (data) => {
    const exists = await JobTypeModel.findOne({ job_type_name: data.job_type_name });
    if (exists) return { status: false, message: 'Job type name already exists' };

    const newType = new JobTypeModel({ job_type_name: data.job_type_name, job_type_status: data.job_type_status || 0 });
    await newType.save();

    return { status: 200, message: 'Job type created successfully', jsonData: newType };
};

// ✅ Update Job Type
exports.updateJobType = async (id, data) => {
    const allowed = ['job_type_name', 'job_type_status'];
    const updateData = {};
    allowed.forEach(field => { if (data[field] !== undefined) updateData[field] = data[field]; });

    const updated = await JobTypeModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return { status: 404, message: 'Job type not found' };

    return { updated };
};
