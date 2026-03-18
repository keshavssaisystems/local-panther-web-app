import React, { useState, useEffect, useMemo } from "react";
import { Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { useNavigate } from "react-router-dom";
import { custJobListActions, hiringManagerActions } from "_store";
import { CardPagination } from "_components/common/cardpagination";
import { CloseJobReasonPopup } from "./closeJobReasonPopup";
import { AssignedJobHiringManagerModal } from "./assignedJobHiringManagerModal";
import closebutton from "../../../assets/utils/images/customer/closebutton.svg";
import editbutton from "../../../assets/utils/images/customer/editbutton.svg";
import "./custjoblistview.css";

export const CustJobListView = ({
  jobList,
  totalRows,
  current,
  page,
  handlePageChange,
  closeJob,
  getSelectedJob,
  isLoading = false,
  onSelectedJobsChange = null,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [closeConfirmation, setCloseConfirmation] = useState(false);
  const [selectedJobForClose, setSelectedJobForClose] = useState(null);
  const [assignListModal, setAssignListModal] = useState(false);
  const [selectedJobForAssignList, setSelectedJobForAssignList] = useState(null);

  const companyId = localStorage.getItem("companyid");

  useEffect(() => {
    if (onSelectedJobsChange) {
      onSelectedJobsChange(selectedJobs);
    }
  }, [selectedJobs, onSelectedJobsChange]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allJobIds = jobList.map((job) => job.jobid);
      setSelectedJobs(allJobIds);
    } else {
      setSelectedJobs([]);
    }
  };

  const handleSelectJob = (jobId) => {
    if (selectedJobs.includes(jobId)) {
      setSelectedJobs(selectedJobs.filter((id) => id !== jobId));
    } else {
      setSelectedJobs([...selectedJobs, jobId]);
    }
  };

  const isAllSelected =
    jobList.length > 0 && selectedJobs.length === jobList.length;
  

  // Generate columns dynamically
  const generateColumns = () => {
    const columns = [
      {
        name: (
          <input
            type="checkbox"
            checked={isAllSelected}
            onChange={handleSelectAll}
            className="table-checkbox"
          />
        ),
        id: "selector",
        cell: (row) => (
          
          <input
            type="checkbox"
            checked={selectedJobs.includes(row.jobid)}
            onChange={() => handleSelectJob(row.jobid)}
            className="table-checkbox"
          />
        ),
        width: "50px",
        center: true,
      },
      {
        name: <span className="table-title">Job Title</span>,
        selector: (row) => row.jobtitle || "-",
        cell: (row) => (
          <span className="table-cell" title={row.jobtitle}>
            <Button
              className="no-padding"
              color="link"
              onClick={() => getSelectedJob(row.jobid)}
            >
              {row.jobtitle}
            </Button>
          </span>
        ),
        minWidth: "200px",
        sortable: true,
      },
      {
        name: <span className="table-title">No of Openings</span>,
        selector: (row) => row.noofopenposition || "-",
        cell: (row) => (
          <span className="table-cell">
            {row.noofopenposition || "-"}
          </span>
        ),
        minWidth: "140px",
        sortable: true,
      },
      {
        name: <span className="table-title">Location</span>,
        selector: (row) =>
          row.cityname && row.statename
            ? `${row.cityname}, ${row.statename}`
            : "-",
        cell: (row) => (
          <span className="table-cell">
            {row.cityname && row.statename
              ? `${row.cityname}, ${row.statename}`
              : "-"}
          </span>
        ),
        minWidth: "150px",
        sortable: true,
      },
      {
        name: <span className="table-title">Experience</span>,
        selector: (row) => row.jobExperienceScheduleDtos?.[0]?.experiencelevel || "-",
        cell: (row) => (
          <span className="table-cell">
            {row.jobExperienceScheduleDtos?.[0]?.experiencelevel || "-"}
          </span>
        ),
        minWidth: "130px",
        sortable: true,
      },
      {
        name: <span className="table-title">Job Type</span>,
        selector: (row) => row.jobstatus || "-",
        cell: (row) => (
          <span className="table-cell">{row.jobstatus || "-"}</span>
        ),
        minWidth: "120px",
        sortable: true,
      },
      {
        name: <span className="table-title">Job Skills</span>,
        selector: (row) =>
          row.jobKeyQualificationDtos && row.jobKeyQualificationDtos.length > 0
            ? row.jobKeyQualificationDtos.map(q => q.skillname).join(", ")
            : "-",
        cell: (row) => (
          <span className="table-cell">
            <div className="skills-cell">
              {row.jobKeyQualificationDtos && row.jobKeyQualificationDtos.length > 0
                ? row.jobKeyQualificationDtos.slice(0, 2).map(q => q.skillname).join(", ") +
                  (row.jobKeyQualificationDtos.length > 2
                    ? ` +${row.jobKeyQualificationDtos.length - 2}`
                    : "")
                : "-"}
            </div>
          </span>
        ),
        minWidth: "180px",
      },
      {
        name: <span className="table-title">Actions</span>,
        cell: (row) => (
          <div className="actions-cell">
            <Button
              size="sm"
              className="action-icon-btn"
              title="Edit"
              onClick={() => navigate(`/customer-edit-job/${row.jobid}`)}
            >
              <img src={editbutton} alt="Edit" className="action-icon" />
            </Button>
            {!row.isclosed && (
              <Button
                size="sm"
                className="action-icon-btn"
                title="Close"
                onClick={() => {
                  setSelectedJobForClose(row);
                  setCloseConfirmation(true);
                }}
              >
                <img src={closebutton} alt="Close" className="action-icon" />
              </Button>
            )}
            {row.isclosed && (
              <span className="closed-badge">Closed</span>
            )}
            <Button
              size="sm"
              className="action-icon-btn"
              title="Hiring Manager Job Assign List"
              onClick={() => {
                setSelectedJobForAssignList(row.jobid);
                setAssignListModal(true);
              }}
            >
              <img src={editbutton} alt="Assign List" className="action-icon" />
            </Button>
          </div>
        ),
        minWidth: "180px",
        center: true,
      },
    ];

    return columns;
  };

  const columns = useMemo(() => generateColumns(), [selectedJobs, isAllSelected]);

  return (
    <>
      {/* <p className="mb-3 row-count">{totalRows} jobs</p> */}

      {/* List View Table */}
      <div className="table-scroll-wrapper">
        <div className="table-inner cust-job-list-view">
          <DataTable
            data={jobList}
            columns={columns}
            fixedHeader
            responsive
            borderless
            hover
            progressPending={isLoading}
          />
        </div>
      </div>

      {/* Pagination */}
      {jobList?.length > 0 ? (
        <div style={{ marginTop: "20px" }}>
          <CardPagination
            totalPages={current}
            pageIndex={page}
            onCallBack={(evt) => handlePageChange(evt)}
          />
        </div>
      ) : null}

      {/* Assigned Hiring Manager List Modal */}
      {assignListModal && selectedJobForAssignList && (
        <AssignedJobHiringManagerModal
          isOpen={assignListModal}
          toggle={() => {
            setAssignListModal(false);
            setSelectedJobForAssignList(null);
          }}
          jobId={selectedJobForAssignList}
        />
      )}

      {/* Close Job Confirmation Modal */}
      {closeConfirmation === true && selectedJobForClose && (
        <CloseJobReasonPopup
          isOpen={closeConfirmation}
          onClose={() => {
            setCloseConfirmation(false);
            setSelectedJobForClose(null);
          }}
          title={selectedJobForClose?.jobtitle}
          jobid={selectedJobForClose?.jobid}
          setCloseJob={(e) => {
            closeJob(e);
            setCloseConfirmation(false);
            setSelectedJobForClose(null);
          }}
        />
      )}
    </>
  );
};