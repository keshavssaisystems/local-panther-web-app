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

export function ScheduleInterviewList({
  candidateList,
  postNotesData,
  postInviteData,
  cancelScheduleData,
  postMessageData,
}) {
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
      width: "200px",
    },
    {
      name: "Skills",
      id: "skills",
      selector: (row) =>
        row.candidateskills === "" ? "-" : row.candidateskills,
      sortable: true,
      width: "270px",
    },
    {
      name: "Scheduled time",
      sortable: true,
      selector: (row) =>
        moment(
          moment(row.scheduledate).format("YYYY-MM-DD") + "T" + row.starttime
        )
          .tz("America/New_York")
          .format("MM/DD/YYYY h:mm a"),
    },
    {
      name: "Duration",
      selector: (row) => (row.duration === "" ? "-" : row.duration),
      sortable: true,
    },
    {
      name: "Interview mode",
      selector: (row) => (row.format === "" ? "-" : row.format),
      sortable: true,
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
              {/* <DropdownItem>
                <i className="dropdown-icon lnr-layers"> </i>
                <span>Candidate detail</span>
              </DropdownItem> */}
              <DropdownItem>
                <i className="dropdown-icon lnr-trash"> </i>
                <span>Delete</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
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
            selectableRows
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
      />
    </>
  );
}
