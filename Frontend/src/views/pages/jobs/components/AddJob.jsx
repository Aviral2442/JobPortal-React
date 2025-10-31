import { useState, useMemo } from "react";
import { Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { Form, Button, Row, Col, Card, Table, Alert, Image } from "react-bootstrap";
import axios from "axios";
import SnowEditor from "@/components/SnowEditor";
import { useNavigate } from "react-router-dom";
import ComponentCard from "@/components/ComponentCard";
import FileUploader from "@/components/FileUploader";
import { FaRegTrashAlt } from "react-icons/fa";

// Axios instance
const api = axios.create();
api.interceptors.request.use((config) => {
  config.baseURL = import.meta.env?.VITE_BASE_URL || "";
  return config;
});

// Validation Schema
const jobValidationSchema = Yup.object({
  _id: Yup.string(),
  metaDetails: Yup.object({
    title: Yup.string().required("Meta Title is required"),
    description: Yup.string(),
    keywords: Yup.string(),
    schemas: Yup.string(),
  }),
  postName: Yup.string().required("Post Title is required"),
  organization: Yup.string().required("Organization is required"),
  advtNumber: Yup.string(),
  jobType: Yup.string().required(),
  sector: Yup.string().required(),
  shortDescription: Yup.string(),
  expiryDate: Yup.date(),
  dates: Yup.array().of(
    Yup.object({
      label: Yup.string().required("Date label is required"),
      date: Yup.date().required("Date is required"),
    })
  ),
  fees: Yup.array().of(
    Yup.object({
      category: Yup.string().required("Category is required"),
      fee: Yup.number().required("Fee is required").min(0),
    })
  ),
  vacancies: Yup.array().of(
    Yup.object({
      postName: Yup.string().required("Post name is required"),
      total: Yup.number().min(0).required(),
      UR: Yup.number().min(0),
      EWS: Yup.number().min(0),
      OBC: Yup.number().min(0),
      SC: Yup.number().min(0),
      ST: Yup.number().min(0),
      PwBD: Yup.number().min(0),
      extraRequirements: Yup.string(),
    })
  ),
  eligibility: Yup.object({
    qualification: Yup.string().required(),
    finalYearEligible: Yup.string(),
    ageMin: Yup.number().min(0),
    ageMax: Yup.number().min(0),
    ageRelaxation: Yup.string(),
    gateRequired: Yup.string(),
    gateCodes: Yup.string(),
    extraRequirements: Yup.string(),
  }),
  salary: Yup.object({
    payScale: Yup.string(),
    inHand: Yup.number().min(0),
    allowances: Yup.string(),
  }),
  selection: Yup.array().of(Yup.string()),
  links: Yup.array().of(
    Yup.object({
      type: Yup.string(),
      label: Yup.string(),
      url: Yup.string().url("Must be a valid URL"),
    })
  ),
  howToApply: Yup.string(),
  logo: Yup.string(),
});

// Reusable Form Input Component
const FormInput = ({ name, label, type = "text", as, value, onChange, onBlur, touched, errors, ...props }) => (
  <Form.Group className="mb-2">
    <Form.Label>{label}</Form.Label>
    <Form.Control
      name={name}
      type={type}
      as={as}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      isInvalid={touched && errors}
      {...props}
    />
    <Form.Control.Feedback type="invalid">{errors}</Form.Control.Feedback>
  </Form.Group>
);

export default function AddJob() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [message, setMessage] = useState({ text: "", variant: "" });

  const requiredSections = [
    "basicDetails", "dates", "fees", "vacancies",
    "eligibility", "salary", "selection", "links",
    "howToApply", "metaDetails"
  ];
  const [sectionsTracking, setSectionsTracking] = useState(
    Object.fromEntries(requiredSections.map((s) => [s, false]))
  );

  const initialValues = useMemo(() => ({
    _id: "",
    metaDetails: { title: "", description: "", keywords: "", schemas: "" },
    postName: "",
    organization: "",
    advtNumber: "",
    jobType: "Permanent",
    sector: "Central Govt",
    shortDescription: "",
    Advertisement_Number: "",
    category: "",
    subCategory: "",
    expiryDate: "",
    dates: [
      { label: "Application Start Date", date: "" },
      { label: "Application End Date", date: "" },
    ],
    fees: [
      { category: "General / UR", fee: "" },
      { category: "OBC", fee: "" },
      { category: "SC", fee: "" },
      { category: "ST", fee: "" },
    ],
    vacancies: [{
      postName: "", total: 0, UR: 0, EWS: 0, OBC: 0, SC: 0, ST: 0, PwBD: 0, extraRequirements: ""
    }],
    eligibility: {
      qualification: "Graduate",
      finalYearEligible: "Yes",
      ageMin: 0,
      ageMax: 0,
      ageRelaxation: "",
      gateRequired: "Yes",
      gateCodes: "",
      extraRequirements: "",
    },
    salary: { payScale: "", inHand: "", allowances: "" },
    selection: ["Shortlisting / Written Test", "Document Verification"],
    links: [{ type: "Apply Online", label: "Apply Online", url: "" }],
    howToApply: "",
    logo: "",
  }), []);

  const ensureJobId = async (values, setFieldValue) => {
    if (values._id) return values._id;

    const minimal = {
      postName: values.postName || "Untitled Job",
      organization: values.organization || "",
      advtNumber: values.advtNumber || "",
      metaDetails: values.metaDetails,
    };

    const fd = new FormData();
    fd.append("jobData", JSON.stringify(minimal));
    if (logoFile) fd.append("logo", logoFile);

    try {
      const res = await api.post(`/api/jobs`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const id = res?.data?.jobId || res?.data?._id;
      if (id) {
        setFieldValue("_id", id);
        setMessage({ text: "Job created.", variant: "success" });
      }
      return id;
    } catch (error) {
      setMessage({ text: error.response?.data?.error || "Error creating job", variant: "danger" });
      return null;
    }
  };

  const uploadLogo = async (values, setFieldValue) => {
    const id = await ensureJobId(values, setFieldValue);
    if (!id || !logoFile) {
      setMessage({ text: "Select a logo to upload.", variant: "warning" });
      return;
    }

    const fd = new FormData();
    fd.append("jobId", id);
    fd.append("files", logoFile);

    try {
      await api.post(`/api/jobs/files`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      setLogoFile(null);
      setLogoPreview("");
      setMessage({ text: "Logo uploaded.", variant: "success" });
    } catch (e) {
      setMessage({ text: "Error uploading logo", variant: "danger" });
    }
  };

  const maybeRedirect = (state) => {
    if (requiredSections.every((s) => state[s])) {
      setTimeout(() => navigate("/admin/jobs"), 500);
    }
  };

  const saveSection = async (section, values, setFieldValue) => {
    const id = await ensureJobId(values, setFieldValue);
    if (!id) return;

    const sectionData = {
      metaDetails: values.metaDetails,
      basicDetails: {
        postName: values.postName,
        organization: values.organization,
        advtNumber: values.advtNumber,
        jobType: values.jobType,
        sector: values.sector,
        shortDescription: values.shortDescription,
        expiryDate: values.expiryDate || "",
      },
      dates: values.dates,
      fees: values.fees,
      vacancies: values.vacancies,
      eligibility: values.eligibility,
      salary: values.salary,
      selection: values.selection,
      links: values.links,
      howToApply: values.howToApply,
    }[section];

    if (section === "files") {
      if (uploadedFiles.length === 0) {
        setMessage({ text: "Select files to upload.", variant: "warning" });
        return;
      }
      const fd = new FormData();
      uploadedFiles.forEach((file) => fd.append("files", file));
      fd.append("jobId", id);

      try {
        await api.post(`/api/jobs/files`, fd, { headers: { "Content-Type": "multipart/form-data" } });
        setUploadedFiles([]);
        setMessage({ text: "Files uploaded successfully!", variant: "success" });
        setSectionsTracking((prev) => {
          const updated = { ...prev, files: true };
          maybeRedirect(updated);
          return updated;
        });
      } catch (error) {
        setMessage({ text: "Error uploading files", variant: "danger" });
      }
      return;
    }

    try {
      await api.post(`/api/jobs/save-section`, { jobId: id, section, data: sectionData });
      setMessage({ text: `${section} saved successfully!`, variant: "success" });

      if (requiredSections.includes(section)) {
        setSectionsTracking((prev) => {
          const updated = { ...prev, [section]: true };
          maybeRedirect(updated);
          return updated;
        });
      }
    } catch (error) {
      setMessage({ text: error.response?.data?.error || `Error saving ${section}`, variant: "danger" });
    }
  };

  const deleteSectionItem = async (section, index, values, arrayHelpers) => {
    if (!values._id) return;

    try {
      await api.delete(`/api/jobs/${values._id}/section/${section}/${index}`);
      arrayHelpers.remove(index);
      setMessage({ text: `${section} item deleted successfully!`, variant: "success" });
    } catch (error) {
      setMessage({ text: `Error deleting ${section} item`, variant: "danger" });
    }
  };

  return (
    <div className="mb-4 pt-4">
      <Card.Body>
        {message.text && (
          <Alert variant={message.variant} onClose={() => setMessage({ text: "", variant: "" })} dismissible>
            {message.text}
          </Alert>
        )}

        <Formik
          initialValues={initialValues}
          validationSchema={jobValidationSchema}
          onSubmit={(values) => console.log("Form submitted:", values)}
        >
          {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
            <Form onSubmit={(e) => e.preventDefault()}>
              {/* Basic Details */}
              <ComponentCard className="mb-3" title="Basic Job Details" isCollapsible defaultOpen={false}>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <FormInput
                        name="postName"
                        label="Post Title"
                        value={values.postName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.postName}
                        errors={errors.postName}
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="shortDescription"
                        label="Short Description"
                        as="textarea"
                        value={values.shortDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{ height: "37px" }}
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="AdvertisementNumber"
                        label="Advertisement Number"
                        value={values.shortDescription}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        errors={errors.postName}
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="organization"
                        label="Organization"
                        value={values.organization}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.organization}
                        errors={errors.organization}
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Job Type</Form.Label>
                        <Form.Select name="jobType" value={values.jobType} onChange={handleChange}>
                          <option>Permanent</option>
                          <option>Contract</option>
                          <option>Apprentice</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Sector</Form.Label>
                        <Form.Select name="sector" value={values.sector} onChange={handleChange}>
                          <option>Central Govt</option>
                          <option>State Govt</option>
                          <option>PSU</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Category</Form.Label>
                        <Form.Select name="category" value={values.category} onChange={handleChange}>
                          <option>Engineering</option>
                          <option>Medical</option>
                          <option>Management</option>
                          <option>Others</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Sub-Category</Form.Label>
                        <Form.Select name="subCategory" value={values.subCategory} onChange={handleChange}>
                          <option>Engineering</option>
                          <option>Medical</option>
                          <option>Management</option>
                          <option>Others</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Logo</Form.Label>
                        <div className="d-flex align-items-center gap-3">
                          <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              setLogoFile(file || null);
                              setLogoPreview(file ? URL.createObjectURL(file) : "");
                            }}
                          />
                          {logoPreview && <Image src={logoPreview} alt="Logo" height={40} />}
                          <Button
                            size="sm"
                            variant="outline-primary"
                            onClick={() => uploadLogo(values, setFieldValue)}
                            disabled={!logoFile}
                          >
                            Upload
                          </Button>
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("basicDetails", values, setFieldValue)}>
                      Save Basic Details
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* Important Dates */}
              <ComponentCard className="mb-3" title="Important Dates" isCollapsible>
                <Card.Body>
                  <FieldArray name="dates">
                    {(arrayHelpers) => (
                      <Table bordered size="sm">
                        <thead>
                          <tr>
                            <th>Label</th>
                            <th>Date</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.dates.map((field, idx) => (
                            <tr key={idx}>
                              <td>
                                <Form.Control
                                  className="border-0 shadow-none"
                                  name={`dates.${idx}.label`}
                                  value={field.label}
                                  onChange={handleChange}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="border-0 shadow-none"
                                  type="date"
                                  name={`dates.${idx}.date`}
                                  value={field.date}
                                  onChange={handleChange}
                                />
                              </td>
                              <td className="d-flex gap-2 justify-content-center">
                                <Button size="sm" onClick={() => arrayHelpers.push({ label: "", date: "" })}>
                                  +
                                </Button>
                                <Button
                                  size="sm"
                                  variant="light"
                                  onClick={() => deleteSectionItem("dates", idx, values, arrayHelpers)}
                                >
                                  <FaRegTrashAlt />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </FieldArray>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("dates", values, setFieldValue)}>
                      Save Dates
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* Application Fee */}
              <ComponentCard className="mb-3" title="Application Fee" isCollapsible>
                <Card.Body>
                  <FieldArray name="fees">
                    {(arrayHelpers) => (
                      <Table bordered size="sm">
                        <thead>
                          <tr>
                            <th>Category</th>
                            <th>Fee</th>
                            <th className="text-center">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.fees.map((f, idx) => (
                            <tr key={idx}>
                              <td>
                                <Form.Control
                                  className="border-0 shadow-none"
                                  name={`fees.${idx}.category`}
                                  value={f.category}
                                  onChange={handleChange}
                                />
                              </td>
                              <td>
                                <Form.Control
                                  className="border-0 shadow-none"
                                  type="number"
                                  name={`fees.${idx}.fee`}
                                  value={f.fee}
                                  onChange={handleChange}
                                />
                              </td>
                              <td className="d-flex gap-2 justify-content-center">
                                <Button size="sm" onClick={() => arrayHelpers.push({ category: "", fee: "" })}>
                                  +
                                </Button>
                                <Button
                                  size="sm"
                                  variant="light"
                                  onClick={() => deleteSectionItem("fees", idx, values, arrayHelpers)}
                                >
                                  <FaRegTrashAlt />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </FieldArray>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("fees", values, setFieldValue)}>
                      Save Fees
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* Vacancies */}
              <ComponentCard className="mb-3" title="Vacancies" isCollapsible>
                <Card.Body>
                  <FieldArray name="vacancies">
                    {(arrayHelpers) => (
                      <Table bordered size="sm" responsive>
                        <thead>
                          <tr>
                            <th>Post</th>
                            <th>Total</th>
                            <th>UR</th>
                            <th>EWS</th>
                            <th>OBC</th>
                            <th>SC</th>
                            <th>ST</th>
                            <th>PwBD</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {values.vacancies.map((v, idx) => (
                            <tr key={idx}>
                              {["postName", "total", "UR", "EWS", "OBC", "SC", "ST", "PwBD"].map((fld) => (
                                <td key={fld}>
                                  <Form.Control
                                    className="border-0 shadow-none"
                                    type={fld === "postName" ? "text" : "number"}
                                    name={`vacancies.${idx}.${fld}`}
                                    value={v[fld]}
                                    onChange={handleChange}
                                  />
                                </td>
                              ))}
                              <td className="d-flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => arrayHelpers.push({
                                    postName: "", total: 0, UR: 0, EWS: 0, OBC: 0, SC: 0, ST: 0, PwBD: 0
                                  })}
                                >
                                  +
                                </Button>
                                <Button
                                  size="sm"
                                  variant="light"
                                  onClick={() => deleteSectionItem("vacancies", idx, values, arrayHelpers)}
                                >
                                  <FaRegTrashAlt />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </FieldArray>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("vacancies", values, setFieldValue)}>
                      Save Vacancies
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* Eligibility */}
              <ComponentCard className="mb-3" title="Eligibility" isCollapsible>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <FormInput
                        name="eligibility.qualification"
                        label="Qualification"
                        value={values.eligibility.qualification}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Col>
                    <Col md={2}>
                      <FormInput
                        name="eligibility.ageMin"
                        label="Min Age"
                        type="number"
                        value={values.eligibility.ageMin}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Col>
                    <Col md={2}>
                      <FormInput
                        name="eligibility.ageMax"
                        label="Max Age"
                        type="number"
                        value={values.eligibility.ageMax}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Col>
                  </Row>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("eligibility", values, setFieldValue)}>
                      Save Eligibility
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* Salary */}
              <ComponentCard className="mb-3" title="Salary & Benefits" isCollapsible>
                <Card.Body>
                  <Row className="">
                    <Col md={4}>
                      <FormInput
                        name="salary.payScale"
                        label="Pay Scale"
                        value={values.salary.payScale}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="salary.inHand"
                        label="In Hand"
                        type="number"
                        value={values.salary.inHand}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <FormInput
                        name="salary.allowances"
                        label="Allowances"
                        value={values.salary.allowances}
                        onChange={handleChange}
                      />
                    </Col>
                  </Row>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("salary", values, setFieldValue)}>
                      Save Salary
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* Selection Process */}
              <ComponentCard className="mb-3" title="Selection Process" isCollapsible>
                <Card.Body>
                  <FieldArray name="selection">
                    {(arrayHelpers) => (
                      <>
                        {values.selection.map((s, idx) => (
                          <Row key={idx} className="mb-2">
                            <Col md={9}>
                              <Form.Control name={`selection.${idx}`} value={s} onChange={handleChange} />
                            </Col>
                            <Col md={3} className="d-flex gap-2">
                              <Button size="sm" onClick={() => arrayHelpers.push("")}>
                                + Add
                              </Button>
                              <Button
                                size="sm"
                                variant="light"
                                onClick={() => deleteSectionItem("selection", idx, values, arrayHelpers)}
                              >
                                <FaRegTrashAlt />
                              </Button>
                            </Col>
                          </Row>
                        ))}
                      </>
                    )}
                  </FieldArray>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("selection", values, setFieldValue)}>
                      Save Selection
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* Important Links */}
              <ComponentCard className="mb-3" title="Important Links" isCollapsible>
                <Card.Body>
                  <FieldArray name="links">
                    {(arrayHelpers) => (
                      <>
                        {values.links.map((l, idx) => (
                          <Row key={idx} className="mb-2">
                            <Col md={3}>
                              <Form.Control
                                name={`links.${idx}.type`}
                                value={l.type}
                                onChange={handleChange}
                                placeholder="Type"
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Control
                                name={`links.${idx}.url`}
                                value={l.url}
                                onChange={handleChange}
                                placeholder="URL"
                                type="url"
                              />
                            </Col>
                            <Col md={2} className="d-flex gap-2">
                              <Button size="sm" onClick={() => arrayHelpers.push({ type: "", label: "", url: "" })}>
                                +
                              </Button>
                              <Button
                                size="sm"
                                variant="light"
                                onClick={() => deleteSectionItem("links", idx, values, arrayHelpers)}
                              >
                                <FaRegTrashAlt />
                              </Button>
                            </Col>
                          </Row>
                        ))}
                      </>
                    )}
                  </FieldArray>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("links", values, setFieldValue)}>
                      Save Links
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* How To Apply */}
              <ComponentCard className="mb-3" title="How To Apply" isCollapsible>
                <Card.Body>
                  <SnowEditor value={values.howToApply} onChange={(v) => setFieldValue("howToApply", v)} />
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("howToApply", values, setFieldValue)}>
                      Save How To Apply
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* Files */}
              <ComponentCard className="mb-3" title="Files" isCollapsible>
                <Card.Body>
                  <FileUploader files={uploadedFiles} setFiles={setUploadedFiles} multiple maxFileCount={12} />
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("files", values, setFieldValue)}>
                      Upload Files
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>

              {/* SEO & Meta */}
              <ComponentCard className="mb-3" title="SEO & Meta Info" isCollapsible>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <FormInput
                        name="metaDetails.title"
                        label="Meta Title"
                        value={values.metaDetails.title}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        touched={touched.metaDetails?.title}
                        errors={errors.metaDetails?.title}
                      />
                    </Col>
                    <Col md={6}>
                      <FormInput
                        name="metaDetails.keywords"
                        label="Meta Keywords"
                        value={values.metaDetails.keywords}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Col>
                  </Row>
                  <div className="text-end mt-2">
                    <Button size="sm" onClick={() => saveSection("metaDetails", values, setFieldValue)}>
                      Save Meta Details
                    </Button>
                  </div>
                </Card.Body>
              </ComponentCard>
            </Form>
          )}
        </Formik>
      </Card.Body>
    </div>
  );
}