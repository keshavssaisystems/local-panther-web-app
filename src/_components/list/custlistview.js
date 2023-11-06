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
  ButtonGroup,
} from "reactstrap";
import { AcceptModal } from "_components/modal/acceptmodal";
import { ScheduleInterviewModal } from "_components/scheduleInterview/scheduleInterviewModal";
import { InterviewDetailsModal } from "_components/scheduleInterview/interviewDetailsModal";
import { RejectModal } from "_components/modal/rejectmodal";
import { RejectSuccessModal } from "_components/modal/rejectsuccessmodal";
import { BsClock } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { customerCandidateListsActions } from "../../_containers/customer/candidatelists/customercandidatelists.slice";
import customerIcons from "assets/utils/images/customer";
import "./custlistview.scss";
import moment from "moment";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import { getTimezoneDateTime } from "_helpers/helper";

export const CustCandidateListView = (props) => {
  const [showAModal, setShowAModal] = useState(false);
  const [showIDModal, setShowIDModal] = useState(false);
  const [showReModal, setShowReModal] = useState(false);
  const [showRejSModal, setShowRejSModal] = useState(false);
  const [currCRJId, setCurrCRJId] = useState("");
  const [showSchdIntModal, setShowSchdIntSModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState("");
  const [selectedIDData, setSelectedIDData] = useState("");
  const [showJDModal, setShowJDModal] = useState(false);
  const dispatch = useDispatch();

  const onAcceptClick = async (candidaterecommendedjobid) => {
    let res = await dispatch(
      customerCandidateListsActions.putAcceptedCandidate({
        id: candidaterecommendedjobid,
      })
    );

    if (res.payload.statusCode === 204) {
      props.showSweetAlert({ title: res.payload.message, type: "success" });
      props.updateList();
    } else {
      props.showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
  };

  const showJobDetail = (row) => {
    setSelectedRowData(row);
    setShowJDModal(true);
  };

  const onInterviewDetails = async (row) => {
    if (row?.scheduledInterviewDtos?.length > 0) {
      let res = await dispatch(
        customerCandidateListsActions.getScheduleIVList(
          row.scheduledInterviewDtos[0].scheduleinterviewid
        )
      );
      if (res.payload.statusCode === 200) {
        setSelectedIDData(res?.payload?.data?.scheduledInterviewList[0]);
        setShowIDModal(true);
      } else {
        //do nothing
      }
    }
  };

  const onCloseIdModal = () => {
    setShowIDModal(false);
  };

  const onRejectClick = (candidaterecommendedjobid) => {
    setCurrCRJId(candidaterecommendedjobid);
    setShowReModal(true);
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
  };

  const onScheduleClick = (row) => {
    setSelectedRowData(row);
    setShowSchdIntSModal(true);
  };

  const getFormData = (formData) => {
    postScheduledInterview(formData);
  };
  const postScheduledInterview = async function (formData) {
    let res = await dispatch(
      customerCandidateListsActions.postScheduleInterview(formData)
    );
    if (res.payload.statusCode === 201) {
      setShowSchdIntSModal(false);
      props.showSweetAlert({ title: res.payload.message, type: "success" });

      props.updateList();
    } else {
      props.showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
  };

  const returnSkills = (row) => {
    if (row?.candidateSkillDtos && row?.candidateSkillDtos?.length > 0) {
      return row?.candidateSkillDtos
        .map((element) => element.skillname)
        .join(", ");
    } else {
      return "";
    }
  };
  const renderButtons = (candidaterecommendedjobid, row) => {
    if (props.type === "liked" || props.type === "maybe") {
      return (
        <Row xs={3} sm={3} md={3} lg={3} xl={3} noGutters>
          {props.type !== "liked" ? (
            <Col>
              <Button
                disabled={props.type === "liked"}
                // outline
                size="sm"
                title="liked"
                className=" btn-icon"
                color="primary"
                onClick={() => onActionClick("like", candidaterecommendedjobid)}
              >
                <img src={customerIcons.list_liked} alt="list liked"></img>
              </Button>
            </Col>
          ) : (
            <></>
          )}
          {props.type !== "maybe" ? (
            <Col>
              <Button
                disabled={props.type === "maybe"}
                // outline
                size="sm"
                title="maybe"
                className=" btn-icon"
                color="warning"
                onClick={() =>
                  onActionClick("maybe", candidaterecommendedjobid)
                }
              >
                <img src={customerIcons.list_maybe} alt="list maybe"></img>
              </Button>
            </Col>
          ) : (
            <></>
          )}
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick(candidaterecommendedjobid)}
              className="btn-icon"
              color="danger"
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="schedule"
              className="btn-icon"
              color="primary"
              onClick={() => onScheduleClick(row)}
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
              // outline
              size="sm"
              title="accept"
              onClick={() => onAcceptClick(candidaterecommendedjobid)}
              className="btn-icon"
              color="success"
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
              onClick={() => onActionClick("like", candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_liked} alt="list liked"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="warning"
              onClick={() => onActionClick("maybe", candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_maybe} alt="list maybe"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick(candidaterecommendedjobid)}
              className="btn-icon"
              color="danger"
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="schedule"
              className="btn-icon"
              color="primary"
              onClick={() => onScheduleClick(row)}
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
              // outline
              size="sm"
              title="accept"
              onClick={() => onAcceptClick(candidaterecommendedjobid)}
              className="btn-icon"
              color="success"
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick(candidaterecommendedjobid)}
              className="btn-icon"
              color="danger"
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "accepted") {
      return (
        <Row xs={2} sm={2} md={2} lg={2} xl={2} noGutters>
          <Col>
            <Button
              // outline
              size="sm"
              title="reject"
              onClick={() => onRejectClick(candidaterecommendedjobid)}
              className="btn-icon"
              color="danger"
            >
              <img src={customerIcons.list_reject} alt="list reject"></img>
            </Button>
          </Col>
          <Col>
            <Button
              outline
              size="sm"
              title="schedule"
              className="btn-icon"
              color="primary"
              onClick={() => onScheduleClick(row)}
            >
              <BsClock></BsClock>
            </Button>
          </Col>
        </Row>
      );
    } else if (props.type === "rejected") {
      return (
        <Row xs={4} sm={4} md={4} lg={4} xl={4} noGutters>
          <Col>
            <Button
              // outline
              size="sm"
              title="accept"
              onClick={() => onAcceptClick(candidaterecommendedjobid)}
              className="btn-icon"
              color="success"
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="liked"
              className=" btn-icon"
              color="primary"
              onClick={() => onActionClick("like", candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_liked} alt="list liked"></img>
            </Button>
          </Col>
          <Col>
            <Button
              // outline
              size="sm"
              title="maybe"
              className=" btn-icon"
              color="warning"
              onClick={() => onActionClick("maybe", candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_maybe} alt="list maybe"></img>
            </Button>
          </Col>

          <Col>
            <Button
              outline
              size="sm"
              title="schedule"
              className="btn-icon"
              color="primary"
              onClick={() => onScheduleClick(row)}
            >
              <BsClock></BsClock>
            </Button>
          </Col>
        </Row>
      );
    }
  };

  const renderMenu = (candidateid, row) => {
    return (
      <div className="d-block w-100 text-center">
        <UncontrolledButtonDropdown className="menu-ellipses" direction="start">
          <DropdownToggle
            className="btn-icon btn-icon-only btn btn-link"
            color="link"
          >
            <FontAwesomeIcon icon={faEllipsisV} />
          </DropdownToggle>
          <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
            <DropdownItem onClick={() => showJobDetail(row)}>
              <i className="dropdown-icon lnr-layers"></i>
              <span>Job details</span>
            </DropdownItem>
            {row?.scheduledInterviewDtos &&
            row?.scheduledInterviewDtos?.length > 0 &&
            row?.scheduledInterviewDtos[0]?.scheduledate ? (
              <DropdownItem onClick={() => onInterviewDetails(row)}>
                <i className="dropdown-icon lnr-license"> </i>
                <span>Interview details</span>
              </DropdownItem>
            ) : (
              <></>
            )}
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    );
  };

  const columns = memoize((clickHandler) =>
    props.type !== "scheduled"
      ? [
          {
            name: <span className="table-title">Candidate</span>,
            id: "Candidate",
            selector: (row) => (
              <span
                className="table-cell"
                title={row.firstname + " " + row.lastname}
              >
                {row.firstname + " " + row.lastname}
              </span>
            ),
            sortable: true,
            wrap: true,
            width: "15%",
          },
          {
            name: <span className="table-title">Skills</span>,
            selector: (row) => (
              <span className="table-cell" title={returnSkills(row)}>
                {returnSkills(row)?.length > 60
                  ? returnSkills(row).slice(0, 60 - 1) + "…"
                  : returnSkills(row)}
              </span>
            ),
            sortable: true,
            width: "35%",
          },
          {
            name: <span className="table-title">Location</span>,
            selector: (row) => (
              <span
                className="table-cell"
                title={
                  row?.recommendedationCandidateShortList &&
                  row.recommendedationCandidateShortList?.length > 0
                    ? (row?.recommendedationCandidateShortList[0].cityname
                        ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                        : "") +
                      "" +
                      (row.recommendedationCandidateShortList[0].statename
                        ? row.recommendedationCandidateShortList[0].statename
                        : "")
                    : ""
                }
              >
                {row?.recommendedationCandidateShortList &&
                row.recommendedationCandidateShortList?.length > 0
                  ? (row?.recommendedationCandidateShortList[0].cityname
                      ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                      : "") +
                    "" +
                    (row.recommendedationCandidateShortList[0].statename
                      ? row.recommendedationCandidateShortList[0].statename
                      : "")
                  : ""}
              </span>
            ),
            sortable: true,
            width: "15%",
          },

          {
            name: <span className="table-title">Experience</span>,
            selector: (row) => (
              <span
                className="table-cell"
                title={
                  row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"
                }
              >
                <>
                  {row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"}
                </>
              </span>
            ),
            sortable: true,
            width: "15%",
          },

          {
            name: <span className="table-title">Interest</span>,
            cell: (row) => (
              <div className="list-btn-group">
                <ButtonGroup>
                  {renderButtons(row.candidaterecommendedjobid, row)}
                </ButtonGroup>
              </div>
            ),
            ignoreRowClick: true,
            button: true,
            width: "15%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row.candidateid, row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "5%",
          },
        ]
      : [
          {
            name: <span className="table-title">Candidate</span>,
            id: "Candidate",
            selector: (row) => (
              <span
                className="table-cell"
                title={row.firstname + " " + row.lastname}
              >
                {row.firstname + " " + row.lastname}
              </span>
            ),
            sortable: true,
            width: "15%",
          },
          {
            name: <span className="table-title">Skills</span>,
            selector: (row) => (
              <span className="table-cell" title={returnSkills(row)}>
                {returnSkills(row)?.length > 30
                  ? returnSkills(row).slice(0, 30 - 1) + "…"
                  : returnSkills(row)}
              </span>
            ),
            sortable: true,
            width: "21%",
          },
          {
            name: <span className="table-title">Location</span>,
            selector: (row) => (
              <span
                className="table-cell"
                title={
                  row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList?.length > 0
                    ? (row?.recommendedationCandidateShortList[0].cityname
                        ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                        : "") +
                      "" +
                      (row?.recommendedationCandidateShortList[0]?.statename
                        ? row.recommendedationCandidateShortList[0].statename
                        : "")
                    : ""
                }
              >
                {row?.recommendedationCandidateShortList &&
                row.recommendedationCandidateShortList?.length > 0
                  ? (row?.recommendedationCandidateShortList[0].cityname
                      ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                      : "") +
                    "" +
                    (row.recommendedationCandidateShortList[0].statename
                      ? row.recommendedationCandidateShortList[0].statename
                      : "")
                  : ""}
              </span>
            ),
            sortable: true,
            width: "14%",
          },

          {
            name: <span className="table-title">Experience</span>,
            selector: (row) => (
              <span
                className="table-cell"
                title={
                  row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"
                }
              >
                <>
                  {row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"}
                </>
              </span>
            ),
            sortable: true,
            width: "10%",
          },

          {
            name: <span className="table-title">Scheduled</span>,
            sortable: true,
            cell: (row) => (
              <span
                className="table-cell"
                title={
                  row?.scheduledInterviewDtos &&
                  row?.scheduledInterviewDtos?.length > 0
                    ? getTimezoneDateTime(
                        moment(
                          row?.scheduledInterviewDtos[0]?.scheduledate
                        ).format("MM/DD/YYYY") +
                          (row?.scheduledInterviewDtos[0]?.starttime !== null
                            ? " " + row?.scheduledInterviewDtos[0]?.starttime
                            : " 00:00:00")
                      )
                    : ""
                }
              >
                {row?.scheduledInterviewDtos &&
                row?.scheduledInterviewDtos?.length > 0
                  ? getTimezoneDateTime(
                      moment(
                        row?.scheduledInterviewDtos[0]?.scheduledate
                      ).format("MM/DD/YYYY") +
                        (row?.scheduledInterviewDtos[0]?.starttime !== null
                          ? " " + row?.scheduledInterviewDtos[0]?.starttime
                          : " 00:00:00")
                    )
                  : ""}
              </span>
            ),
            width: "17%",
          },
          {
            name: <span className="table-title">Interview Status</span>,
            sortable: true,
            cell: (row) => (
              <span
                className="table-cell"
                title={
                  row?.scheduledInterviewDtos &&
                  row?.scheduledInterviewDtos?.length > 0
                    ? row?.scheduledInterviewDtos[0]?.isactive === true
                      ? row?.scheduledInterviewDtos[0]?.isaccepted === true &&
                        row?.scheduledInterviewDtos[0]?.isrejected === false
                        ? "Accepted"
                        : row?.scheduledInterviewDtos[0]?.isrejected === true
                        ? "Rejected"
                        : "Tentative"
                      : "Cancelled"
                    : ""
                }
              >
                {row?.scheduledInterviewDtos &&
                row?.scheduledInterviewDtos?.length > 0
                  ? row?.scheduledInterviewDtos[0]?.isactive === true
                    ? row?.scheduledInterviewDtos[0]?.isaccepted === true &&
                      row?.scheduledInterviewDtos[0]?.isrejected === false
                      ? "Accepted"
                      : row?.scheduledInterviewDtos[0]?.isrejected === true
                      ? "Rejected"
                      : "Tentative"
                    : "Cancelled"
                  : ""}
              </span>
            ),
            width: "10%",
          },

          {
            name: <span className="table-title">Interest</span>,
            cell: (row) => (
              <div className="list-btn-group">
                {renderButtons(row.candidaterecommendedjobid, row)}
              </div>
            ),
            ignoreRowClick: true,
            button: true,
            width: "8%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row.candidateid, row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "5%",
          },
        ]
  );

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
        columns={columns(handleButtonClick)}
        persistTableHead
        // pagination
        className="cust-list-view"
        responsive
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
            type={selectedIDData.format}
            onClose={() => onCloseIdModal()}
            interviewDetail={selectedIDData}
            postNotesData={(e) => onCloseIdModal(e)}
            postInviteData={(e) => onCloseIdModal(e)}
            cancelScheduleData={(e) => onCloseIdModal(e)}
            editScheduledInterview={(e) => onCloseIdModal(e)}
            postMessageData={(e) => onCloseIdModal(e)}
            acceptInterview={(e) => onCloseIdModal(e)}
            rejectInterview={(e) => onCloseIdModal(e)}
            fromCustList={true}
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
            onOkClickRejSuccess={() => onCloseRejSModal()}
          />
        ) : (
          <></>
        )}
      </>

      <>
        {" "}
        {showSchdIntModal ? (
          <ScheduleInterviewModal
            candidateData={selectedRowData}
            durationOptions={props.durationOptions}
            postData={(e) => {
              getFormData(e);
            }}
            isOpen={showSchdIntModal}
            onClose={() => setShowSchdIntSModal(false)}
          />
        ) : (
          <></>
        )}
      </>

      <>
        {" "}
        {showJDModal ? (
          <CustJobDetailModal
            isOpen={showJDModal}
            data={[selectedRowData]}
            onClose={() => setShowJDModal(false)}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
};
