import React, { useState } from "react";
import {
  Row,
  Col,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { ScheduleInterviewModal } from "./scheduleInterviewModal";
import { InterviewDetailsModal } from "./interviewDetailsModal";
import moment from "moment-timezone";

export function ScheduleInterviewList({
  candidateList,
  durationOptions,
  postData,
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
  const [openScheduleModal, setOpenScheduleModal] = useState(false);
  const columns = (clickHandler) => [
    {
      name: "Candidate",
      selector: (row) => row.candidatename,
      sortable: true,
    },
    {
      name: "Skills",
      id: "skills",
      selector: (row) =>
        row.candidateskills === "" ? "-" : row.candidateskills,
      sortable: true,
    },
    {
      name: "Scheduled time",
      sortable: true,
      cell: (row) => (
        <>
          {row.scheduledate === "" && (
            <Button
              color="link"
              className="pl-0"
              onClick={(e) => openScheduleModalPopup(e)}
            >
              {" "}
              Schedule{" "}
            </Button>
          )}
          {row.scheduledate !== "" &&
            moment(row.scheduledate)
              .tz("Etc/UTC")
              .format("MMM Do YYYY h:mm a") + " (UTC)"}
          <ScheduleInterviewModal
            candidateData={row}
            durationOptions={durationOptions}
            postData={(e) => postData(e)}
            isOpen={openScheduleModal}
            onClose={() => onCloseScheduleModal()}
          />
        </>
      ),
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
              {row.scheduledate !== "" && (
                <DropdownItem
                  value={row.scheduleinterviewid}
                  onClick={(e) => openInterviewDeatils(e)}
                >
                  <i className="dropdown-icon lnr-layers"> </i>
                  <span value={row.scheduleinterviewid}>Interview detail</span>
                </DropdownItem>
              )}
              <DropdownItem>
                <i className="dropdown-icon lnr-layers"> </i>
                <span>Candidate detail</span>
              </DropdownItem>
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

  const openInterviewDeatils = (event) => {
    setOpenModal(true);
    console.log(event.target.value);
  };

  const handleRowClick = (data) => {
    // console.log('e :>> ', data);
    // setState({ isDetailPage: true });
  };
  const onCloseIdModal = () => {
    setOpenModal(false);
  };
  const onCloseScheduleModal = () => {
    setOpenScheduleModal(false);
  };
  const openScheduleModalPopup = (event) => {
    setOpenScheduleModal(true);
    console.log(event.target.value);
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
        type={"video"}
        onClose={() => onCloseIdModal()}
        interviewDetail={
          candidateList.length !== undefined && candidateList.length > 0
            ? candidateList[0]
            : {}
        }
      />
    </>
  );
}
