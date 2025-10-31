const monngoose = require('mongoose');

const JobSchema = new monngoose.Schema({

    // BASIC DETAILS

    job_title: { type: String, required: true },
    job_short_desc: { type: String, required: true },
    job_category: { type: Number, required: true },
    job_sub_category: { type: Number, required: true },
    job_advertisement_no: { type: String, required: true },
    job_organization: { type: String, required: true }, // Name of recruiting organization
    job_type: { type: Number, required: true }, // Full-time, Part-time, Internship, etc.
    job_sector: { type: Number, required: true }, // Public, Private, NGO, etc.
    job_logo: { type: String, required: false },
    job_posted_date: { type: Number, default: () => Math.floor(Date.now() / 1000) },

    // IMPORTANT DATES
    job_start_date: { type: Number, required: true },
    job_end_date: { type: Number, required: true },
    job_notification_release_date: { type: Number, required: true },
    job_fees_pmt_last_date: { type: Number, required: false },
    job_correction_start_date: { type: Number, required: false },
    job_correction_end_date: { type: Number, required: false },
    job_reopen_start_date: { type: Number, required: false },
    job_reopen_end_date: { type: Number, required: false },
    job_last_date_extended: { type: Number, required: false },
    job_fees_pmt_last_date_extended: { type: Number, required: false },
    job_exam_date: { type: Number, required: false },
    job_exam_date_extended: { type: Number, required: false },
    job_pre_exam_date: { type: Number, required: false },
    job_main_exam_date: { type: Number, required: false },
    job_interview_date: { type: Number, required: false },
    job_skill_test_date: { type: Number, required: false },
    job_physical_test_date: { type: Number, required: false },
    job_admit_card_release_date: { type: Number, required: false },
    job_interview_call_letter_date: { type: Number, required: false },
    job_physical_test_admit_card_date: { type: Number, required: false },
    job_result_declaration_date: { type: Number, required: false },
    job_pre_result_declaration_date: { type: Number, required: false },
    job_main_result_declaration_date: { type: Number, required: false },
    job_final_result_declaration_date: { type: Number, required: false },
    job_verification_date: { type: Number, required: false },
    job_joining_date: { type: Number, required: false },
    job_print_last_date: { type: Number, required: false },
    job_re_exam_date: { type: Number, required: false },
    job_answer_key_release_date: { type: Number, required: false },
    job_objection_start_date: { type: Number, required: false },
    job_objection_end_date: { type: Number, required: false },

    // APPLICATION FEES
    job_fees_general: { type: Number, required: false },
    job_fees_obc: { type: Number, required: false },
    job_fees_sc: { type: Number, required: false },
    job_fees_st: { type: Number, required: false },
    job_fees_ex_serviceman: { type: Number, required: false },
    job_fees_pwd: { type: Number, required: false },
    job_fees_ews: { type: Number, required: false },

    // ELIGIBILITY CRITERIA
    job_eligibility_age_min: { type: Number, required: false },
    job_eligibility_age_max: { type: Number, required: false },
    job_eligibility_qualifications: { type: [String], required: false },
    job_eligibility_experience: { type: String, required: false }, // 0 = Civil Engineering (CE), 1 = Electrical Engineering (EE), 2 = Electronics and Communication (EC), 3 = Computer Science and Information Technology (CS), 4 = Mechanical Engineering (ME), 5 = Chemical Engineering (CH), 6 = Architecture and Planning (AR), 7 = Biotechnology (BT), 8 = Environmental Science and Engineering (ES), 9 = Engineering Sciences (XE)
    job_extra_criteria: { type: String, required: false },

    // JOB VACANCY DETAILS
    job_vacancy_total: { type: Number, required: true },
    job_vacancy_for_general: { type: Number, required: false },
    job_vacancy_for_obc: { type: Number, required: false },
    job_vacancy_for_sc: { type: Number, required: false },
    job_vacancy_for_st: { type: Number, required: false },
    job_vacancy_for_ex_serviceman: { type: Number, required: false },
    job_vacancy_for_pwd: { type: Number, required: false },
    job_vacancy_for_ews: { type: Number, required: false },

    // JOB PAYMENT OPTIONS
    job_pmt_debit_card: { type: Boolean, required: false },
    job_pmt_credit_card: { type: Boolean, required: false },
    job_pmt_net_banking: { type: Boolean, required: false },
    job_pmt_upi: { type: Boolean, required: false },
    job_pmt_wallets: { type: Boolean, required: false },
    job_pmt_e_challan: { type: Boolean, required: false },

    // JOB SALARY DETAILS
    job_salary_min: { type: Number, required: false },
    job_salary_max: { type: Number, required: false },
    job_salary_allowance: { type: Number, required: false },
    job_salary_inhand: { type: Number, required: false },
    job_salary_bond_condition: { type: String, required: false },

    // IMPORTANT LINKS
    job_important_links: { type: Map, of: String, required: false },

});
