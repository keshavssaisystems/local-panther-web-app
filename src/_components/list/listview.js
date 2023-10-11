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
import { ApplyModal } from "_components/modal/applymodal";
import {
  BsHandThumbsUp,
  BsQuestionCircle,
  BsCheckCircle,
  BsXCircle,
  BsClock,
} from "react-icons/bs";
import { useDispatch } from "react-redux";
import { customerCandidateListsActions } from "../../_containers/customer/candidatelists/customercandidatelists.slice";

export const CandidateListView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);
  const [currCRJId, setCurrCRJId] = useState("");
  const [showApModal, setShowApModal] = useState(false);
  const dispatch = useDispatch();

  const onAcceptClick = async (candidaterecommendedjobid) => {
    let res = await dispatch(
      customerCandidateListsActions.putAcceptedCandidate({
        id: candidaterecommendedjobid,
      })
    );

    if (res.payload.statusCode === 204) {
      setShowAModal(true);
    } else {
      //No action needed
    }
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

  const onRejectClick = (candidaterecommendedjobid) => {
    setCurrCRJId(candidaterecommendedjobid);
    setShowReModal(true);
  };
  const onApplyClick = () => {
    setShowApModal(true);
  };

  const onSubmitRejectModal = async (reasonid, comment) => {
    let userId = localStorage.getItem("userId");
    let res = await dispatch(
      customerCandidateListsActions.putRejectCandidate({
        id: currCRJId,
        customerrejectedcomment: comment,
        customerrejectedreasonid: reasonid,
        currentUserId: userId,
      })
    );

    setShowReModal(false);
    if (res.payload.statusCode === 204) {
      setShowRejSModal(true);
    } else {
      props.showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
    // setShowReModal(false);
    // setShowRejSModal(true);
  };
  const renderButtons = (candidaterecommendedjobid) => {
    if (props.type === "liked" || props.type === "maybe") {
      return (
        <Row xs={4} sm={4} md={4} lg={4} xl={4} noGutters>
          <Col>
            <Button
              active={props.type === "liked"}
              outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
              onClick={() => onActionClick("like", candidaterecommendedjobid)}
            >
              <BsHandThumbsUp></BsHandThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button
              active={props.type === "maybe"}
              outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="primary"
              onClick={() => onActionClick("maybe", candidaterecommendedjobid)}
            >
              <BsQuestionCircle></BsQuestionCircle>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick(candidaterecommendedjobid)}
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
              onClick={() => onAcceptClick(candidaterecommendedjobid)}
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
    } else if (props.type === "scheduled") {
      return (
        <Row xs={2} sm={2} md={2} lg={2} xl={2} noGutters>
          <Col>
            <Button
              outline
              size="sm"
              title="accept"
              onClick={() => onAcceptClick(candidaterecommendedjobid)}
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
              onClick={() => onAcceptClick(candidaterecommendedjobid)}
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
              active={props.type === "rejected"}
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
  const renderButtonsForCustomView = () => {
    if (props.type === "liked" || props.type === "maybe") {
      return (
        <Row xs={4} sm={4} md={4} lg={4} xl={4} noGutters>
          <Col>
            <Button
              title="apply"
              onClick={() => onApplyClick()}
              className="btn-icon"
              color="success"
              size="sm"
            >
              <BsCheckCircle></BsCheckCircle>
            </Button>
          </Col>
          <Col>
            <Button
              title="liked"
              className=" btn-icon"
              color="secondary"
              size="sm"
            >
              <BsHandThumbsUp></BsHandThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button
              title="maybe"
              className=" btn-icon"
              color="warning"
              size="sm"
            >
              <BsQuestionCircle></BsQuestionCircle>
            </Button>
          </Col>
          <Col>
            <Button
              title="reject"
              className="btn-icon"
              color="danger"
              size="sm"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "applied") {
      return (
        <Row xs={3} sm={3} md={3} lg={3} xl={3} noGutters>
          <Col>
            <Button
              title="liked"
              className=" btn-icon"
              color="secondary"
              size="sm"
            >
              <BsHandThumbsUp></BsHandThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button
              title="maybe"
              className=" btn-icon"
              color="warning"
              size="sm"
            >
              <BsQuestionCircle></BsQuestionCircle>
            </Button>
          </Col>
          <Col>
            <Button
              title="reject"
              className="btn-icon"
              color="danger"
              size="sm"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "Interview") {
      return (
        <Row xs={4} sm={4} md={4} lg={4} xl={4} noGutters>
          <Col>
            <Button
              title="apply"
              onClick={() => onApplyClick()}
              className="btn-icon"
              color="success"
              size="sm"
            >
              <BsCheckCircle></BsCheckCircle>
            </Button>
          </Col>
          <Col>
            <Button
              title="liked"
              className=" btn-icon"
              color="secondary"
              size="sm"
            >
              <BsHandThumbsUp></BsHandThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button
              title="maybe"
              className=" btn-icon"
              color="warning"
              size="sm"
            >
              <BsQuestionCircle></BsQuestionCircle>
            </Button>
          </Col>
          <Col>
            <Button
              title="reject"
              className="btn-icon"
              color="danger"
              size="sm"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "accepted") {
      return (
        <Row xs={1} sm={1} md={1} lg={1} xl={1} noGutters>
          <Col>
            <Button
              title="reject"
              className="btn-icon"
              color="danger"
              size="sm"
            >
              <BsXCircle></BsXCircle>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "rejected") {
      return (
        <Row xs={2} sm={2} md={2} lg={2} xl={2} noGutters>
          <Col>
            <Button
              title="liked"
              className=" btn-icon"
              color="secondary"
              size="sm"
            >
              <BsHandThumbsUp></BsHandThumbsUp>
            </Button>
          </Col>
          <Col>
            <Button
              title="maybe"
              className="btn-icon"
              color="warning"
              size="sm"
            >
              <BsQuestionCircle></BsQuestionCircle>
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
      wrap: true,
      width: 150,
    },
    {
      name: "Location",
      selector: (row) => row.locationaddress,
      sortable: true,
      wrap: true,
      width: 150,
    },

    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      wrap: true,
      width: 150,
    },

    {
      name: "Scheduled time",
      sortable: true,
      cell: (row) => <ScheduleInterviewModal candidateData={row} />,
      wrap: true,
      width: 150,
    },
    {
      name: "Interview mode",
      selector: (row) => row.mode,
      sortable: true,
      wrap: true,
      width: 150,
    },
    {
      name: "Interest",
      width: "220px",
      cell: (row) => <div>{renderButtons(row.candidaterecommendedjobid)}</div>,
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
      selector: (row) => row.jobid,
      sortable: true,
      maxWidth: "10px",
    },
    {
      name: "Title",
      selector: (row) => row.jobtitle,
      sortable: true,
      maxWidth: "150px",
      wrap: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
      sortable: true,
      wrap: true,
    },

    {
      name: "Location",
      selector: (row) => row.locationaddress,
      sortable: true,
      wrap: true,
      maxWidth: "150px",
    },
    {
      name: "Interest",
      width: "170px",
      cell: () => <div>{renderButtonsForCustomView(props)}</div>,
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
                <span>View</span>
              </DropdownItem>

              <DropdownItem>
                <i className="dropdown-icon lnr-license"> </i>
                <span>Interview details</span>
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

  const onActionClick = (type, candidaterecommendedjobid) => {
    props.onActionClick(candidaterecommendedjobid, type);
  };

  const onCloseRejSModal = () => {
    setShowRejSModal(false);
    props.updateList();
  };

  const onCloseAMModal = () => {
    setShowAModal(false);
    props.updateList();
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
      />

      <>
        {showAModal ? (
          <AcceptModal
            isAMOpen={showAModal}
            onAcceptYesClick={() => onCloseAMModal()}
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
            onOkClickRejSuccess={() => onCloseRejSModal(false)}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showApModal ? (
          <ApplyModal
            isAMOpen={showApModal}
            onApplyYesClick={() => setShowApModal(false)}
            onApplyNoClick={() => setShowApModal(false)}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
};
