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
import { ScheduleInterviewModal } from "_components/scheduleInterview/scheduleInterviewModal";
import { InterviewDetailsModal } from "_components/scheduleInterview/interviewDetailsModal";
import { RejectModal } from "_components/modal/rejectmodal";
import { RejectSuccessModal } from "_components/modal/rejectsuccessmodal";
import {
  BsBriefcase,
  BsListStars,
  BsAward,
  BsFillFlagFill,
  BsHandThumbsUp,
  BsFillHandThumbsUpFill,
  BsStar,
  BsQuestionCircle,
  BsCheckCircle,
  BsXCircle,
  BsClock,
  BsX,
} from "react-icons/bs";

export const CandidateListView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);

  const onAcceptClick = () => {
    setShowAModal(true);
  };

  const showProfile = (candId) => {
    // need updated path
    // navigate(`/candidate-profile/${candId}`);
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

  const onRejectClick = () => {
    setShowReModal(true);
  };

  const onSubmitRejectModal = (evt) => {
    setShowReModal(false);
    setShowRejSModal(true);
  };
  const renderButtons = () => {
    if (props.type === "liked" || props.type === "maybe") {
      return (
        <Row xs={4} sm={4} md={4} lg={4} xl={4} noGutters>
          <Col>
            <Button
              outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
            >
              <BsHandThumbsUp></BsHandThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="primary"
            >
              <BsQuestionCircle></BsQuestionCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick()}
              className="btn-icon"
              color="primary"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="schedule"
              className="btn-icon"
              color="primary"
            >
              <BsClock></BsClock>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "applied") {
      return (
        <Row xs={5} sm={5} md={5} lg={5} xl={5} noGutters>
          <Col>
            <Button
              outline
              size="sm"
              title="accept"
              onClick={() => onAcceptClick()}
              className="btn-icon"
              color="primary"
            >
              <BsCheckCircle></BsCheckCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
            >
              <BsHandThumbsUp></BsHandThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="primary"
            >
              <IoIosHelp fontSize={"24px"}></IoIosHelp>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick()}
              className="btn-icon"
              color="primary"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="schedule"
              className="btn-icon"
              color="primary"
            >
              <BsClock></BsClock>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "scheduled") {
      return (
        <Row xs={2} sm={2} md={2} lg={2} xl={2} noGutters>
          <Col>
            <Button
              outline
              size="sm"
              title="accept"
              onClick={() => onAcceptClick()}
              className="btn-icon"
              color="primary"
            >
              <BsCheckCircle></BsCheckCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick()}
              className="btn-icon"
              color="primary"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "accepted") {
      return (
        <Row xs={2} sm={2} md={2} lg={2} xl={2} noGutters>
          <Col>
            <Button
              outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick()}
              className="btn-icon"
              color="primary"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="schedule"
              className="btn-icon"
              color="primary"
            >
              <BsClock></BsClock>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "rejected") {
      return (
        <Row xs={5} sm={5} md={5} lg={5} xl={5} noGutters>
          <Col>
            <Button
              outline
              size="sm"
              title="accept"
              onClick={() => onAcceptClick()}
              className="btn-icon"
              color="primary"
            >
              <BsCheckCircle></BsCheckCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
            >
              <BsHandThumbsUp></BsHandThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="primary"
            >
              <BsQuestionCircle></BsQuestionCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick()}
              className="btn-icon"
              color="primary"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="schedule"
              className="btn-icon"
              color="primary"
            >
              <BsClock></BsClock>
            </Button>
          </Col>
        </Row>
      );
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
    // {
    //   name: "Skills",
    //   selector: (row) => row.primaryskills + "," + row.secondaryskills,
    //   sortable: true,
    // },
    {
      name: "Location",
      selector: (row) => row.locationaddress,
      sortable: true,
    },

    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },

    {
      name: "Scheduled time",
      sortable: true,
      cell: (row) => (
        <ScheduleInterviewModal candidateData={row.customerscheduleddatetime} />
      ),
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

  const columnsForCustomView = memoize((clickHandler) => [
    {
      name: "Job ID",
      id: "Candidate",
      selector: (row) => row.jobapplicationid,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
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
      name: "Interest",
      width: "170px",
      cell: () => (
        <div>
          <Row
            xs={5}
            sm={5}
            md={5}
            lg={5}
            xl={5}
            className="candidate-listview-tab"
          >
            <Col>
              <Button title="accept" className="btn-icon" color="success">
                <IoIosCheckmark fontSize={"20px"} className=""></IoIosCheckmark>
              </Button>
            </Col>
            <Col>
              <Button title="liked" className=" btn-icon" color="primary">
                <IoIosHelp fontSize={"20px"}></IoIosHelp>
              </Button>
            </Col>
            <Col>
              <Button
                title="reject"
                onClick={() => onRejectClick()}
                className="btn-icon"
                color="danger"
              >
                <IoIosClose fontSize={"20px"}></IoIosClose>
              </Button>
            </Col>

            <Col>
              <Button title="liked" className=" btn-icon" color="primary">
                <IoIosThumbsUp fontSize={"20px"}></IoIosThumbsUp>
              </Button>
            </Col>
          </Row>
        </div>
      ),
      ignoreRowClick: true,
      button: true,
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
              <DropdownItem>
                <i className="dropdown-icon lnr-layers"></i>
                <span>View interview details</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      ),
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
        columns={
          props.user === "customer"
            ? columns(handleButtonClick)
            : columnsForCustomView(handleButtonClick)
        }
        selectableRows
        persistTableHead
        // pagination
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
      <>
        {showReModal ? (
          <RejectModal
            isRMOpen={showReModal}
            onCancelReject={() => setShowReModal(false)}
            onSubmitReject={(evt) => onSubmitRejectModal(evt)}
            rejectDrpDwnList={props.rejectDrpDwnList}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showRejSModal ? (
          <RejectSuccessModal
            isRejectConfOpen={showRejSModal}
            onOkClickRejSuccess={() => setShowRejSModal(false)}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
};
