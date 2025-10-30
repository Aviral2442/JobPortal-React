import { useNavigate } from "react-router-dom";
import JobList from "./components/JobList";
import { Nav, NavItem, NavLink, TabContainer, TabPane } from "react-bootstrap";
import ComponentCard from "../../components/ComponentCard";
import axios from "axios";
import { useState } from "react";

const Page = () => {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);

  const handleAddJob = async () => {
    try {
      setCreating(true);
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/jobs/draft`, {
        postName: "Untitled Job",
        organization: "",
        advtNumber: "",
      });
      const jobId = res?.data?.jobId || res?.data?._id;
      navigate("/admin/jobs/add", { state: { jobId } });
    } catch (e) {
      navigate("/admin/jobs/add"); // fallback
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="mt-4 pb-3">
      <TabContainer defaultActiveKey="Job-List">
        <Nav className="nav-tabs nav-bordered mb-3">
          <NavItem>
            <NavLink eventKey="Job-List" id="1">Job List</NavLink>
          </NavItem>
        </Nav>
        <ComponentCard
          className="py-2"
          title="List"
          isLink={
            <button
              type="button"
              className="btn btn-link p-0"
              onClick={handleAddJob}
              disabled={creating}
            >
              {creating ? "Creating..." : "+ Add Job"}
            </button>
          }
        >
          <TabPane eventKey="Job-List">
            <JobList />
          </TabPane>
        </ComponentCard>
      </TabContainer>
    </div>
  );
};

export default Page;
