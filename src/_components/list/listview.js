import React, { useState } from "react";
import memoize from "memoize-one";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  Col,
  Button,
} from "reactstrap";
import {
  IoIosCheckmark,
  IoIosClose,
  IoIosThumbsUp,
  IoIosHelp,
} from "react-icons/io";
import { AcceptModal } from "_components/modal/acceptmodal";
import { useNavigate } from "react-router-dom";
import { ScheduleInterviewModal } from "_components/scheduleInterview/scheduleInterviewModal";
import { InterviewDetailsModal } from "_components/scheduleInterview/interviewDetailsModal";

export const CandidateListView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const navigate = useNavigate();
  const onAcceptClick = () => {
    setShowAModal(true);
  };

  const showProfile = (candId) => {
    navigate(`/candidate-profile/${candId}`);
  };

  const onDeleteItem = () => {
    //delete functionality here
  };

  const onInterviewDetails = () => {
    setShowIDModal(true);
  };

  const onCloseIdModal = () => {
    setShowIDModal(false);
  };
  const renderButtons = () => {
    if (props.type === "liked" || props.type === "maybe") {
      return (
        <Row xs={3} sm={3} md={3} lg={3} xl={3} noGutters>
          <Col>
            <Button title="liked" className=" btn-icon" color="primary">
              <IoIosThumbsUp fontSize={"24px"}></IoIosThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button title="maybe" className=" btn-icon" color="primary">
              <IoIosHelp fontSize={"24px"}></IoIosHelp>
            </Button>
          </Col>
          <Col>
            <Button title="reject" className="btn-icon" color="danger">
              <IoIosClose fontSize={"24px"}></IoIosClose>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "applied") {
      return (
        <Row xs={4} sm={4} md={4} lg={4} xl={4} noGutters>
          <Col>
            <Button
              title="accept"
              onClick={() => onAcceptClick()}
              className="btn-icon"
              color="success"
            >
              <IoIosCheckmark fontSize={"24px"}></IoIosCheckmark>
            </Button>
          </Col>
          <Col>
            <Button title="liked" className=" btn-icon" color="primary">
              <IoIosThumbsUp fontSize={"24px"}></IoIosThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button title="maybe" className=" btn-icon" color="primary">
              <IoIosHelp fontSize={"24px"}></IoIosHelp>
            </Button>
          </Col>
          <Col>
            <Button title="reject" className="btn-icon" color="danger">
              <IoIosClose fontSize={"24px"}></IoIosClose>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "scheduled") {
      return (
        <Row xs={2} sm={2} md={2} lg={2} xl={2} noGutters>
          <Col>
            <Button
              title="accept"
              onClick={() => onAcceptClick()}
              className="btn-icon"
              color="success"
            >
              <IoIosCheckmark fontSize={"24px"}></IoIosCheckmark>
            </Button>
          </Col>
          <Col>
            <Button title="reject" className="btn-icon" color="danger">
              <IoIosClose fontSize={"24px"}></IoIosClose>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "accepted") {
      return (
        <Row xs={1} sm={1} md={1} lg={1} xl={1} noGutters>
          <Col>
            <Button title="reject" className="btn-icon" color="danger">
              <IoIosClose fontSize={"24px"}></IoIosClose>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "rejected") {
      return false;
    }
  };

  const renderMenu = (candidateid) => {
    return (
      <div className="d-block w-100 text-center">
        <UncontrolledButtonDropdown direction="start">
          <DropdownToggle
            className="btn-icon btn-icon-only btn btn-link"
            color="link"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </DropdownToggle>
          <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
            <DropdownItem onClick={() => showProfile(candidateid)}>
              <i className="dropdown-icon lnr-layers"></i>
              <span>Profile</span>
            </DropdownItem>

            <DropdownItem onClick={() => onInterviewDetails()}>
              <i className="dropdown-icon lnr-license"> </i>
              <span>Interview details</span>
            </DropdownItem>
            <DropdownItem onClick={() => onDeleteItem()}>
              <i className="dropdown-icon lnr-trash"></i>
              <span>Delete</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    );
  };

  const columns = memoize((clickHandler) => [
    {
      name: "Candidate",
      id: "Candidate",
      selector: (row) => row.firstname + " " + row.lastname,
      sortable: true,
    },
    {
      name: "Skills",
      selector: (row) => row.primaryskills + "," + row.secondaryskills,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.address,
      sortable: true,
    },

    {
      name: "Experience",
      selector: (row) => row.experienceyears,
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
      name: "Interest",
      width: "220px",
      cell: () => <div>{renderButtons()}</div>,
      ignoreRowClick: true,
      button: true,
    },
    {
      name: "Action",
      cell: (row) => <>{renderMenu(row.candidateid)}</>,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ]);

  const handleButtonClick = () => {
    console.log("clicked");
  };

  const handleRowClick = (data) => {
    console.log(data);
  };
  return (
    <>
      <DataTable
        onRowClicked={handleRowClick}
        data={props.data}
        columns={columns(handleButtonClick)}
        selectableRows
        persistTableHead
        pagination
      />
      <>
        {showAModal ? (
          <AcceptModal
            isAMOpen={showAModal}
            onAcceptYesClick={() => setShowAModal(false)}
            onAcceptNoClick={() => setShowAModal(false)}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showIDModal ? (
          <InterviewDetailsModal
            isOpen={showIDModal}
            type={"video"}
            onClose={() => onCloseIdModal()}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
};
