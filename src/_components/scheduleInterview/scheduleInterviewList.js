import React, { useState } from "react";
import {
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { InterviewDetailsModal } from "./interviewDetailsModal";
import moment from "moment-timezone";
import { useSelector } from "react-redux";
import { UpdateScheduleInterviewModal } from "./updateScheduleInterviewModal";
import { getTimezoneDateTime } from "_helpers/helper";

export function ScheduleInterviewList({
  candidateList,
  postNotesData,
  postInviteData,
  cancelScheduleData,
  postMessageData,
  acceptInterview,
  rejectInterview,
  getUpdatedFormData,
  postFeedbackData,
}) {
  const durationOptions = useSelector(
    (state) => state.scheduleInterview.duration
  );
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const customStyles = {
    headRow: {
      style: {
        borderTopWidth: "0px",
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightWidth: "0px",
        },
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightWidth: "0px",
          cursor: "pointer",
        },
      },
    },
  };
  const [openModal, setOpenModal] = useState(false);
  const columns = (clickHandler) => [
    {
      name: "Candidate",
      selector: (row) => row.candidatename,
      sortable: true,
      width: "17%",
    },
    {
      name: "Job title",
      id: "jobtitle",
      selector: (row) => (row.jobtitle === "" ? "-" : row.jobtitle),
      sortable: true,
      width: "30%",
    },
    {
      name: "Scheduled time",
      sortable: true,
      selector: (row) =>
        getTimezoneDateTime(
          moment(row.scheduledate).format("YYYY-MM-DD") + "T" + row.starttime,
          "MM/DD/YYYY h:mm a"
        ),
      width: "20%",
    },
    {
      name: "Duration",
      selector: (row) => (row.duration === "" ? "-" : row.duration),
      sortable: true,
      width: "10%",
    },
    {
      name: "Interview mode",
      selector: (row) => (row.format === "" ? "-" : row.format),
      sortable: true,
      width: "15%",
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="d-block w-100 text-center">
          <UncontrolledButtonDropdown direction="start">
            <DropdownToggle
              className="btn-icon btn-icon-only btn btn-link"
              color="link"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </DropdownToggle>
            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
              {row.scheduledate !== null && (
                <DropdownItem
                  value={row.scheduleinterviewid}
                  onClick={(e) => openInterviewDeatils(row)}
                >
                  <i className="dropdown-icon lnr-layers"> </i>
                  <span value={row.scheduleinterviewid}>Interview detail</span>
                </DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      width: "8%",
    },
  ];

  const handleButtonClick = () => {
    console.log("clicked");
  };
  const [selectedJobDetails, setSelectedJobDetails] = useState({});
  const openInterviewDeatils = (data) => {
    setOpenModal(true);
    setSelectedJobDetails(data);
  };

  const handleRowClick = (data) => {};
  const onCloseIdModal = () => {
    setOpenModal(false);
  };
  return (
    <>
      <Row>
        <Col md="12">
          <DataTable
            onRowClicked={handleRowClick}
            columns={columns(handleButtonClick)}
            data={candidateList}
            persistTableHead
            customStyles={customStyles}
            pagination
          />
        </Col>
      </Row>
      <InterviewDetailsModal
        isOpen={openModal}
        type={selectedJobDetails.format}
        onClose={() => onCloseIdModal()}
        interviewDetail={selectedJobDetails}
        postNotesData={(e) => postNotesData(e)}
        postInviteData={(e) => postInviteData(e)}
        cancelScheduleData={(e) => cancelScheduleData(e)}
        postMessageData={(e) => postMessageData(e)}
        acceptInterview={(e) => acceptInterview(e)}
        rejectInterview={(e) => rejectInterview(e)}
        editScheduledInterview={(e) => {
          setShowEditScheduleModal(true);
          onCloseIdModal();
        }}
        postFeedbackData={(e) => postFeedbackData(e)}
      />
      <UpdateScheduleInterviewModal
        interviewData={selectedJobDetails}
        durationOptions={durationOptions}
        postData={(e) => {
          getUpdatedFormData(e);
        }}
        isOpen={showEditScheduleModal}
        onClose={() => setShowEditScheduleModal(false)}
      />
    </>
  );
}
