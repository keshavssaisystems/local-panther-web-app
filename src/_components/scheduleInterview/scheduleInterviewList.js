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
import { ScheduleInterviewModal } from "./scheduleInterviewModal";
import { InterviewDetail } from "./interviewDetail";
import { InterviewDetailsModal } from "./interviewDetailsModal";

export function ScheduleInterviewList() {
  const [interviewDetails, setInterviewDetails] = useState(false);
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
  const [state, setState] = useState({
    activeTab: "1",
    transform: true,
    isDetailPage: false,
  });
  const columns = (clickHandler) => [
    {
      name: "Candidate",
      selector: (row) => row.candidate,
      sortable: true,
    },
    {
      name: "Skills",
      id: "skills",
      selector: (row) => row.skills,
      sortable: true,
    },
    {
      name: "Experience",
      selector: (row) => row.experience,
      sortable: true,
    },
    {
      name: "Job",
      selector: (row) => row.jobTitle,
      sortable: true,
    },
    {
      name: "Scheduled time",
      sortable: true,
      cell: (row) => <ScheduleInterviewModal candidateData={row.scheduled} />,
    },
    {
      name: "Interview mode",
      selector: (row) => row.mode,
      sortable: true,
    },
    {
      name: "Action",
      cell: () => (
        <div className="d-block w-100 text-center">
          <UncontrolledButtonDropdown direction="start">
            <DropdownToggle
              className="btn-icon btn-icon-only btn btn-link"
              color="link"
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </DropdownToggle>
            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
              <DropdownItem onClick={() => setOpenModal(true)}>
                <i className="dropdown-icon lnr-layers"> </i>
                <span>Interview detail</span>
              </DropdownItem>
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

  const data = [
    {
      candidate: "Ajay Singh",
      skills: "Java, Mysql, Sql",
      experience: "5+ Years",
      jobTitle: "Java Developer",
      scheduled: "25/09/2023 3:30 PM",
      mode: "Telephonic",
    },
    {
      candidate: "Ramesh Kumar",
      skills: "React, Node JS, Express JS",
      experience: "2+ Years",
      jobTitle: "Node Developer",
      scheduled: "25/09/2023 2:00 PM",
      mode: "Video",
    },
    {
      candidate: "Ajit Yadav",
      skills: "Java, Mysql",
      experience: "3+ Years",
      jobTitle: "Java Developer",
      scheduled: "",
      mode: "Telephonic",
    },
    {
      candidate: "Abhay Singh",
      skills: "Java, Mysql",
      experience: "1+ Year",
      jobTitle: "Java Developer",
      scheduled: "",
      mode: "Video",
    },
  ];

  const handleButtonClick = () => {
    console.log("clicked");
  };

  const handleRowClick = (data) => {
    // console.log('e :>> ', data);
    setState({ isDetailPage: true });
  };

  return (
    <>
      <Row>
        <Col md="12">
          <DataTable
            onRowClicked={handleRowClick}
            columns={columns(handleButtonClick)}
            data={data}
            selectableRows
            persistTableHead
            customStyles={customStyles}
          />
        </Col>
      </Row>
      <InterviewDetailsModal isOpen={openModal} type={"video"} />
    </>
  );
}
