import React, { useState, useEffect } from "react";
import memoize from "memoize-one";
import DataTable from "react-data-table-component";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import {
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Button,
  ButtonGroup,
  UncontrolledTooltip,
} from "reactstrap";
import { AcceptModal } from "_components/modal/acceptmodal";
import { ScheduleInterviewModal } from "_components/scheduleInterview/scheduleInterviewModal";
import { InterviewDetailsModal } from "_components/scheduleInterview/interviewDetailsModal";
import { RejectModal } from "_components/modal/rejectmodal";
import { RejectSuccessModal } from "_components/modal/rejectsuccessmodal";
import { BsFillInfoCircleFill, BsFileEarmarkPdf } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { customerCandidateListsActions } from "../../_containers/customer/candidatelists/customercandidatelists.slice";
import customerIcons from "assets/utils/images/customer";
import "./custlistview.scss";
import moment from "moment";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import { getTimezoneDateTime } from "_helpers/helper";
import { UpdateScheduleInterviewModal } from "_components/scheduleInterview/updateScheduleInterviewModal";
import { scheduleInterviewActions } from "_store";
import { CustomerUploadOffer } from "_components/modal/custuploadoffer";
import axios from "axios";

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
  const [showIRSModal, setShowIRSModal] = useState(false);
  const [showUploadOfferModal, setShowUploadOfferModal] = useState(false);

  const dispatch = useDispatch();
  const durationOptions = useSelector(
    (state) => state.scheduleInterview.duration
  );

  useEffect(() => {
    dispatch(scheduleInterviewActions.getDurationThunk());
  }, []);
  const onAcceptClick = async (row) => {
    //Enable upload offer modal from here
    setSelectedRowData(row);
    setShowUploadOfferModal(true);
    // let res = await dispatch(
    //   customerCandidateListsActions.putAcceptedCandidate({
    //     id: candidaterecommendedjobid,
    //   })
    // );

    // if (res.payload.statusCode === 204) {
    //   props.showSweetAlert({
    //     title: "Candidate status updated successfully!!!",
    //     type: "success",
    //   });
    //   props.updateList();
    // } else {
    //   props.showSweetAlert({
    //     title: res.payload.message || res.payload.status,
    //     type: "danger",
    //   });
    // }
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

  const onSubmitRejectModal = async (comment) => {
    let userId = localStorage.getItem("userId");
    let res = await dispatch(
      customerCandidateListsActions.putRejectCandidate({
        id: currCRJId,
        customerrejectedcomment: comment,
        customerrejectedreasonid: 0,
        currentUserId: userId,
      })
    );

    setShowReModal(false);
    if (res.payload.statusCode === 204) {
      props.showSweetAlert({
        title: "Candidate status updated successfully!!!",
        type: "success",
      });
      props.updateList();
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
    if (res.payload?.statusCode === 201) {
      setShowSchdIntSModal(false);
      props.showSweetAlert({
        title: "Interview scheduled successfully!!!",
        type: "success",
      });

      props.updateList();
    } else {
      props.showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
  };

  const renderButtons = (candidaterecommendedjobid, row) => {
    if (props.type === "liked" || props.type === "maybe") {
      return (
        <ButtonGroup>
          {props.type !== "liked" ? (
            <Button
              disabled={props.type === "liked"}
              // outline
              size="sm"
              title="Like"
              className=" btn-icon"
              color="primary"
              onClick={() => onActionClick("like", candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_liked} alt="list liked"></img>
            </Button>
          ) : (
            <></>
          )}
          {props.type !== "maybe" ? (
            <Button
              disabled={props.type === "maybe"}
              // outline
              size="sm"
              title="Maybe"
              className=" btn-icon"
              color="warning"
              onClick={() => onActionClick("maybe", candidaterecommendedjobid)}
            >
              <img src={customerIcons.list_maybe} alt="list maybe"></img>
            </Button>
          ) : (
            <></>
          )}
          <Button
            // outline
            size="sm"
            title="Reject"
            onClick={() => onRejectClick(candidaterecommendedjobid)}
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons.list_reject} alt="list reject"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Schedule"
            className="btn-icon"
            color="alternate"
            onClick={() => onScheduleClick(row)}
          >
            <img src={customerIcons.list_schedule} alt="list maybe"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "applied") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Make offer"
            onClick={() => onAcceptClick(row)}
            className="btn-icon"
            color="success"
          >
            <img src={customerIcons.list_accept} alt="list accept"></img>
          </Button>

          {/* <Button
            // outline
            size="sm"
            title="Like"
            className=" btn-icon"
            color="primary"
            onClick={() => onActionClick("like", candidaterecommendedjobid)}
          >
            <img src={customerIcons.list_liked} alt="list liked"></img>
          </Button> */}
          {/* <Button
            // outline
            size="sm"
            title="maybe"
            className=" btn-icon"
            color="warning"
            onClick={() => onActionClick("maybe", candidaterecommendedjobid)}
          >
            <img src={customerIcons.list_maybe} alt="list maybe"></img>
          </Button> */}
          <Button
            // outline
            size="sm"
            title="Reject candidate"
            onClick={() => onRejectClick(candidaterecommendedjobid)}
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons.list_reject} alt="list reject"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Schedule"
            className="btn-icon"
            color="alternate"
            onClick={() => onScheduleClick(row)}
          >
            <img src={customerIcons.list_schedule} alt="list maybe"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "scheduled") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Make offer"
            onClick={() => onAcceptClick(row)}
            className="btn-icon"
            color="success"
          >
            <img src={customerIcons.list_accept} alt="list accept"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Reject candidate"
            onClick={() => onRejectClick(candidaterecommendedjobid)}
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons.list_reject} alt="list reject"></img>
          </Button>
          {row?.scheduledInterviewDtos?.length > 0 &&
            row?.scheduledInterviewDtos[0]?.isreschedulerequested === true &&
            row?.scheduledInterviewDtos[0]?.interviewstatusid === 0 && (
              <Button
                // outline
                size="sm"
                title="Reschedule Interview"
                onClick={() => onRescheduleInterview(row)}
                className="btn-icon"
                color="alternate"
              >
                <img src={customerIcons.list_schedule} alt="list reject"></img>
              </Button>
            )}
        </ButtonGroup>
      );
    } else if (props.type === "offers") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Reject offer"
            onClick={() => onRejectClick(candidaterecommendedjobid)}
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons.list_reject} alt="list reject"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "accepted") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Reject candidate"
            onClick={() => onRejectClick(candidaterecommendedjobid)}
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons.list_reject} alt="list reject"></img>
          </Button>
          {/* <Button
            // outline
            size="sm"
            title="schedule"
            className="btn-icon"
            color="alternate"
            onClick={() => onScheduleClick(row)}
          >
            <img src={customerIcons.list_schedule} alt="list maybe"></img>
          </Button> */}
        </ButtonGroup>
      );
    } else if (props.type === "rejected") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Make offer"
            onClick={() => onAcceptClick(row)}
            className="btn-icon"
            color="success"
          >
            <img src={customerIcons.list_accept} alt="list accept"></img>
          </Button>

          {/* <Button
            // outline
            size="sm"
            title="liked"
            className=" btn-icon"
            color="primary"
            onClick={() => onActionClick("like", candidaterecommendedjobid)}
          >
            <img src={customerIcons.list_liked} alt="list liked"></img>
          </Button> */}

          {/* <Button
            // outline
            size="sm"
            title="maybe"
            className=" btn-icon"
            color="warning"
            onClick={() => onActionClick("maybe", candidaterecommendedjobid)}
          >
            <img src={customerIcons.list_maybe} alt="list maybe"></img>
          </Button> */}

          <Button
            // outline
            size="sm"
            title="Schedule"
            className="btn-icon"
            color="alternate"
            onClick={() => onScheduleClick(row)}
          >
            <img src={customerIcons.list_schedule} alt="list maybe"></img>
          </Button>
        </ButtonGroup>
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
            row?.scheduledInterviewDtos[0]?.scheduledate &&
            row?.scheduledInterviewDtos[0]?.isactive ? (
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
      ? props.type === "liked" || props.type === "maybe"
        ? [
            {
              name: <span className="table-title">Candidate</span>,
              id: "Candidate",
              cell: (row) => (
                <span title={row.firstname + " " + row.lastname}>
                  {row.firstname + " " + row.lastname}
                </span>
              ),
              selector: (row) => row.firstname + " " + row.lastname,
              sortable: true,
              wrap: true,
              width: "20%",
            },
            {
              name: <span className="table-title">Job title</span>,
              cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
              selector: (row) => row?.jobtitle,
              sortable: true,
              width: "30%",
            },
            {
              name: <span className="table-title">Location</span>,
              cell: (row) => (
                <span
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
              selector: (row) =>
                row?.recommendedationCandidateShortList &&
                row.recommendedationCandidateShortList?.length > 0
                  ? (row?.recommendedationCandidateShortList[0].cityname
                      ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                      : "") +
                    "" +
                    (row.recommendedationCandidateShortList[0].statename
                      ? row.recommendedationCandidateShortList[0].statename
                      : "")
                  : "",
              sortable: true,
              width: "15%",
            },

            {
              name: <span className="table-title">Experience</span>,
              cell: (row) => (
                <span
                  title={
                    row?.recommendedationCandidateShortList &&
                    row?.recommendedationCandidateShortList.length > 0
                      ? row?.recommendedationCandidateShortList[0]?.experience
                      : "-"
                  }
                >
                  {row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"}
                </span>
              ),
              selector: (row) =>
                row?.recommendedationCandidateShortList &&
                row?.recommendedationCandidateShortList.length > 0
                  ? row?.recommendedationCandidateShortList[0]?.experience
                  : "-",
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
        : props.type === "rejected"
        ? [
            {
              name: <span className="table-title">Candidate</span>,
              id: "Candidate",
              cell: (row) => (
                <span title={row.firstname + " " + row.lastname}>
                  {row.firstname + " " + row.lastname}
                </span>
              ),
              selector: (row) => row.firstname + " " + row.lastname,
              sortable: true,
              wrap: true,
              width: "15%",
            },
            {
              name: <span className="table-title">Job title</span>,
              cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
              selector: (row) => row?.jobtitle,
              sortable: true,
              width: "17%",
            },
            {
              name: <span className="table-title">Location</span>,
              cell: (row) => (
                <span
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
              selector: (row) =>
                row?.recommendedationCandidateShortList &&
                row.recommendedationCandidateShortList?.length > 0
                  ? (row?.recommendedationCandidateShortList[0].cityname
                      ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                      : "") +
                    "" +
                    (row.recommendedationCandidateShortList[0].statename
                      ? row.recommendedationCandidateShortList[0].statename
                      : "")
                  : "",
              sortable: true,
              width: "15%",
            },

            {
              name: <span className="table-title">Experience</span>,
              cell: (row) => (
                <span
                  title={
                    row?.recommendedationCandidateShortList &&
                    row?.recommendedationCandidateShortList.length > 0
                      ? row?.recommendedationCandidateShortList[0]?.experience
                      : "-"
                  }
                >
                  {row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"}
                </span>
              ),
              selector: (row) =>
                row?.recommendedationCandidateShortList &&
                row?.recommendedationCandidateShortList.length > 0
                  ? row?.recommendedationCandidateShortList[0]?.experience
                  : "-",
              sortable: true,
              width: "10%",
            },
            {
              name: <span className="table-title">Pre-Screen</span>,
              cell: (row) =>
                row.candidateprescreenstatus === "NA" ? (
                  "-"
                ) : row.candidateprescreenstatus === "Pending" ? (
                  <Button disabled color="link">
                    <u>Pending</u>
                  </Button>
                ) : (
                  <Button
                    onClick={() => props.onPrescreenClick("completed", row)}
                    color="link"
                  >
                    <u>Completed</u>
                  </Button>
                ),
              ignoreRowClick: true,
              button: true,
              width: "10%",
            },
            {
              name: <span className="table-title">Status</span>,
              cell: (row) => (
                <span>
                  {row?.customerrecommendedjobstatusid === 5 &&
                  row?.candidaterecommendedjobstatusid === 6
                    ? "Offer rejected by candidate"
                    : row?.candidaterecommendedjobstatusid === 6 &&
                      row?.customerrecommendedjobstatusid !== 5
                    ? "Rejected by candidate"
                    : row?.customerrecommendedjobstatusid === 6
                    ? "Rejected by customer"
                    : "-"}
                  {row?.candidaterecommendedjobstatusid === 6 ? (
                    <>
                      {" "}
                      <BsFillInfoCircleFill
                        id={"rr_" + row?.jobid + row?.candidateid}
                        color="primary"
                      />
                      <UncontrolledTooltip
                        placement="bottom"
                        target={"rr_" + row?.jobid + row?.candidateid}
                      >
                        {row?.candidaterejectedcomment !== ""
                          ? row?.candidaterejectedcomment
                          : "-"}
                      </UncontrolledTooltip>
                    </>
                  ) : (
                    <></>
                  )}
                  {row?.customerrecommendedjobstatusid === 6 ? (
                    <>
                      {" "}
                      <BsFillInfoCircleFill
                        id={"rr_" + row?.jobid + row?.candidateid}
                        color="primary"
                      ></BsFillInfoCircleFill>
                      <UncontrolledTooltip
                        placement="bottom"
                        target={"rr_" + row?.jobid + row?.candidateid}
                      >
                        {row?.customerrejectedcomment !== ""
                          ? row?.customerrejectedcomment
                          : "-"}
                      </UncontrolledTooltip>
                    </>
                  ) : (
                    <></>
                  )}
                </span>
              ),
              selector: (row) =>
                row?.customerrecommendedjobstatusid === 5 &&
                row?.candidaterecommendedjobstatusid === 6
                  ? "Offer rejected by candidate"
                  : row?.candidaterecommendedjobstatusid === 6 &&
                    row?.customerrecommendedjobstatusid !== 5
                  ? "Rejected by candidate"
                  : row?.customerrecommendedjobstatusid === 6
                  ? "Rejected by customer"
                  : "-",
              ignoreRowClick: true,
              button: true,
              width: "18%",
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
              width: "10%",
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
        : props.type === "offers" || props.type === "accepted"
        ? [
            {
              name: <span className="table-title">Candidate</span>,
              id: "Candidate",
              cell: (row) => (
                <span title={row.firstname + " " + row.lastname}>
                  {row.firstname + " " + row.lastname}
                  {row?.candidateacceptedcomment !== "" &&
                  props.type === "accepted" ? (
                    <>
                      {" "}
                      <BsFillInfoCircleFill
                        id={"ac_" + row?.jobid + row?.candidateid}
                        color="primary"
                      />
                      <UncontrolledTooltip
                        placement="bottom"
                        target={"ac_" + row?.jobid + row?.candidateid}
                      >
                        {row?.candidateacceptedcomment !== ""
                          ? row?.candidateacceptedcomment
                          : "-"}
                      </UncontrolledTooltip>
                    </>
                  ) : (
                    <></>
                  )}
                </span>
              ),
              selector: (row) => row.firstname + " " + row.lastname,
              sortable: true,
              wrap: true,
              width: "15%",
            },
            {
              name: <span className="table-title">Job title</span>,
              cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
              selector: (row) => row?.jobtitle,
              sortable: true,
              width: "25%",
            },
            {
              name: <span className="table-title">Location</span>,
              cell: (row) => (
                <span
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
              selector: (row) =>
                row?.recommendedationCandidateShortList &&
                row.recommendedationCandidateShortList?.length > 0
                  ? (row?.recommendedationCandidateShortList[0].cityname
                      ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                      : "") +
                    "" +
                    (row.recommendedationCandidateShortList[0].statename
                      ? row.recommendedationCandidateShortList[0].statename
                      : "")
                  : "",
              sortable: true,
              width: "12%",
            },

            {
              name: <span className="table-title">Experience</span>,
              cell: (row) => (
                <span
                  title={
                    row?.recommendedationCandidateShortList &&
                    row?.recommendedationCandidateShortList.length > 0
                      ? row?.recommendedationCandidateShortList[0]?.experience
                      : "-"
                  }
                >
                  {row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"}
                </span>
              ),
              selector: (row) =>
                row?.recommendedationCandidateShortList &&
                row?.recommendedationCandidateShortList.length > 0
                  ? row?.recommendedationCandidateShortList[0]?.experience
                  : "-",
              sortable: true,
              width: "12%",
            },
            {
              name: <span className="table-title">Pre-Screen</span>,
              cell: (row) =>
                row.candidateprescreenstatus === "NA" ? (
                  "-"
                ) : row.candidateprescreenstatus === "Pending" ? (
                  <Button disabled color="link">
                    <u>Pending</u>
                  </Button>
                ) : (
                  <Button
                    onClick={() => props.onPrescreenClick("completed", row)}
                    color="link"
                  >
                    <u>Completed</u>
                  </Button>
                ),
              ignoreRowClick: true,
              button: true,
              width: "10%",
            },
            {
              name: <span className="table-title">Offer</span>,
              cell: (row) =>
                row?.jobOfferDtos?.length > 0 ? (
                  <>
                    <BsFileEarmarkPdf
                      className={"icon-pointer"}
                      size={"23px"}
                      title="Click to view offer"
                      onClick={() =>
                        window.open(row?.jobOfferDtos[0]?.offerfilepath)
                      }
                    />
                  </>
                ) : (
                  <> - </>
                ),
              ignoreRowClick: true,
              button: true,
              width: "10%",
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
              width: "11%",
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
              cell: (row) => (
                <span title={row.firstname + " " + row.lastname}>
                  {row.firstname + " " + row.lastname}
                  {row?.candidateacceptedcomment !== "" &&
                  props.type === "accepted" ? (
                    <>
                      {" "}
                      <BsFillInfoCircleFill
                        id={"ac_" + row?.jobid + row?.candidateid}
                        color="primary"
                      />
                      <UncontrolledTooltip
                        placement="bottom"
                        target={"ac_" + row?.jobid + row?.candidateid}
                      >
                        {row?.candidateacceptedcomment !== ""
                          ? row?.candidateacceptedcomment
                          : "-"}
                      </UncontrolledTooltip>
                    </>
                  ) : (
                    <></>
                  )}
                </span>
              ),
              selector: (row) => row.firstname + " " + row.lastname,
              sortable: true,
              wrap: true,
              width: "15%",
            },
            {
              name: <span className="table-title">Job title</span>,
              cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
              selector: (row) => row?.jobtitle,
              sortable: true,
              width: "25%",
            },
            {
              name: <span className="table-title">Location</span>,
              cell: (row) => (
                <span
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
              selector: (row) =>
                row?.recommendedationCandidateShortList &&
                row.recommendedationCandidateShortList?.length > 0
                  ? (row?.recommendedationCandidateShortList[0].cityname
                      ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                      : "") +
                    "" +
                    (row.recommendedationCandidateShortList[0].statename
                      ? row.recommendedationCandidateShortList[0].statename
                      : "")
                  : "",
              sortable: true,
              width: "15%",
            },

            {
              name: <span className="table-title">Experience</span>,
              cell: (row) => (
                <span
                  title={
                    row?.recommendedationCandidateShortList &&
                    row?.recommendedationCandidateShortList.length > 0
                      ? row?.recommendedationCandidateShortList[0]?.experience
                      : "-"
                  }
                >
                  {row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"}
                </span>
              ),
              selector: (row) =>
                row?.recommendedationCandidateShortList &&
                row?.recommendedationCandidateShortList.length > 0
                  ? row?.recommendedationCandidateShortList[0]?.experience
                  : "-",
              sortable: true,
              width: "15%",
            },
            {
              name: <span className="table-title">Pre-Screen</span>,
              cell: (row) =>
                row.candidateprescreenstatus === "NA" ? (
                  "-"
                ) : row.candidateprescreenstatus === "Pending" ? (
                  <Button disabled color="link">
                    <u>Pending</u>
                  </Button>
                ) : (
                  <Button
                    onClick={() => props.onPrescreenClick("completed", row)}
                    color="link"
                  >
                    <u>Completed</u>
                  </Button>
                ),
              ignoreRowClick: true,
              button: true,
              width: "10%",
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
            cell: (row) => (
              <span title={row.firstname + " " + row.lastname}>
                {row.firstname + " " + row.lastname}
              </span>
            ),
            selector: (row) => row.firstname + " " + row.lastname,
            sortable: true,
            width: "16%",
          },
          {
            name: <span className="table-title">Job title</span>,
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row?.jobtitle,
            sortable: true,
            width: "16%",
          },
          {
            name: <span className="table-title">Location</span>,
            cell: (row) => (
              <span
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
            selector: (row) =>
              row?.recommendedationCandidateShortList &&
              row.recommendedationCandidateShortList?.length > 0
                ? (row?.recommendedationCandidateShortList[0].cityname
                    ? `${row?.recommendedationCandidateShortList[0].cityname}, `
                    : "") +
                  "" +
                  (row.recommendedationCandidateShortList[0].statename
                    ? row.recommendedationCandidateShortList[0].statename
                    : "")
                : "",
            sortable: true,
            width: "13%",
          },

          {
            name: <span className="table-title">Experience</span>,
            cell: (row) => (
              <span
                title={
                  row?.recommendedationCandidateShortList &&
                  row?.recommendedationCandidateShortList.length > 0
                    ? row?.recommendedationCandidateShortList[0]?.experience
                    : "-"
                }
              >
                {row?.recommendedationCandidateShortList &&
                row?.recommendedationCandidateShortList.length > 0
                  ? row?.recommendedationCandidateShortList[0]?.experience
                  : "-"}
              </span>
            ),
            selector: (row) =>
              row?.recommendedationCandidateShortList &&
              row?.recommendedationCandidateShortList.length > 0
                ? row?.recommendedationCandidateShortList[0]?.experience
                : "-",
            sortable: true,
            width: "10%",
          },

          {
            name: <span className="table-title">Scheduled</span>,
            sortable: true,
            cell: (row) => (
              <span
                title={
                  row?.scheduledInterviewDtos != null
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
                {row?.scheduledInterviewDtos != null
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
            selector: (row) =>
              row?.scheduledInterviewDtos != null
                ? getTimezoneDateTime(
                    moment(row?.scheduledInterviewDtos[0]?.scheduledate).format(
                      "MM/DD/YYYY"
                    ) +
                      (row?.scheduledInterviewDtos[0]?.starttime !== null
                        ? " " + row?.scheduledInterviewDtos[0]?.starttime
                        : " 00:00:00")
                  )
                : "",

            width: "14%",
          },
          {
            name: <span className="table-title">Interview Status</span>,
            sortable: true,
            cell: (row) => (
              <span
                title={
                  row?.scheduledInterviewDtos &&
                  row?.scheduledInterviewDtos?.length > 0
                    ? row?.scheduledInterviewDtos[0]?.isactive === true
                      ? row?.scheduledInterviewDtos[0]?.interviewstatusid ===
                          0 ||
                        row?.scheduledInterviewDtos[0]?.interviewstatusid ===
                          undefined
                        ? row?.scheduledInterviewDtos[0]
                            ?.isreschedulerequested === true
                          ? "Request for reschedule"
                          : row?.scheduledInterviewDtos[0]?.isaccepted ===
                              true &&
                            row?.scheduledInterviewDtos[0]?.isrejected === false
                          ? "Accepted"
                          : row?.scheduledInterviewDtos[0]?.isrejected === true
                          ? "Rejected"
                          : "No response"
                        : row?.scheduledInterviewDtos[0]?.interviewstatusid ===
                          1
                        ? "Completed"
                        : row?.scheduledInterviewDtos[0]?.interviewstatusid ===
                          2
                        ? "Not joined"
                        : ""
                      : "Cancelled"
                    : ""
                }
              >
                {row?.scheduledInterviewDtos &&
                row?.scheduledInterviewDtos?.length > 0
                  ? row?.scheduledInterviewDtos[0]?.isactive === true
                    ? row?.scheduledInterviewDtos[0]?.interviewstatusid === 0 ||
                      row?.scheduledInterviewDtos[0]?.interviewstatusid ===
                        undefined
                      ? row?.scheduledInterviewDtos[0]
                          ?.isreschedulerequested === true
                        ? "Request for reschedule"
                        : row?.scheduledInterviewDtos[0]?.isaccepted === true &&
                          row?.scheduledInterviewDtos[0]?.isrejected === false
                        ? "Accepted"
                        : row?.scheduledInterviewDtos[0]?.isrejected === true
                        ? "Rejected"
                        : "No response"
                      : row?.scheduledInterviewDtos[0]?.interviewstatusid === 1
                      ? "Completed"
                      : row?.scheduledInterviewDtos[0]?.interviewstatusid === 2
                      ? "Not joined"
                      : ""
                    : "Cancelled"
                  : ""}
                {row?.scheduledInterviewDtos?.length > 0 &&
                row?.scheduledInterviewDtos[0].isreschedulerequested ? (
                  <>
                    {" "}
                    <BsFillInfoCircleFill
                      id={
                        "rsr_" +
                        row?.scheduledInterviewDtos[0].scheduleinterviewid +
                        "" +
                        row?.scheduledInterviewDtos[0].jobid
                      }
                    ></BsFillInfoCircleFill>
                    <UncontrolledTooltip
                      placement="bottom"
                      target={
                        "rsr_" +
                        row?.scheduledInterviewDtos[0].scheduleinterviewid +
                        "" +
                        row?.scheduledInterviewDtos[0].jobid
                      }
                    >
                      {row?.scheduledInterviewDtos[0]
                        .reschedulerequestedreason !== ""
                        ? row?.scheduledInterviewDtos[0]
                            .reschedulerequestedreason
                        : "-"}
                    </UncontrolledTooltip>
                  </>
                ) : (
                  <></>
                )}
                {row?.scheduledInterviewDtos?.length > 0 &&
                row?.scheduledInterviewDtos[0].isrejected &&
                row?.scheduledInterviewDtos[0].interviewstatusid === 0 ? (
                  <>
                    {" "}
                    <BsFillInfoCircleFill
                      id={
                        "rr_" +
                        row?.scheduledInterviewDtos[0].scheduleinterviewid +
                        "" +
                        row?.scheduledInterviewDtos[0].jobid
                      }
                    ></BsFillInfoCircleFill>
                    <UncontrolledTooltip
                      placement="bottom"
                      target={
                        "rr_" +
                        row?.scheduledInterviewDtos[0].scheduleinterviewid +
                        "" +
                        row?.scheduledInterviewDtos[0].jobid
                      }
                    >
                      {row?.scheduledInterviewDtos[0].rejectionreason !== ""
                        ? row?.scheduledInterviewDtos[0].rejectionreason
                        : "-"}
                    </UncontrolledTooltip>
                  </>
                ) : (
                  <></>
                )}
              </span>
            ),
            selector: (row) =>
              row?.scheduledInterviewDtos &&
              row?.scheduledInterviewDtos?.length > 0
                ? row?.scheduledInterviewDtos[0]?.isactive === true
                  ? row?.scheduledInterviewDtos[0]?.interviewstatusid === 0 ||
                    row?.scheduledInterviewDtos[0]?.interviewstatusid ===
                      undefined
                    ? row?.scheduledInterviewDtos[0]?.isreschedulerequested ===
                      true
                      ? "Request for reschedule"
                      : row?.scheduledInterviewDtos[0]?.isaccepted === true &&
                        row?.scheduledInterviewDtos[0]?.isrejected === false
                      ? "Accepted"
                      : row?.scheduledInterviewDtos[0]?.isrejected === true
                      ? "Rejected"
                      : "No response"
                    : row?.scheduledInterviewDtos[0]?.interviewstatusid === 1
                    ? "Completed"
                    : row?.scheduledInterviewDtos[0]?.interviewstatusid === 2
                    ? "Not joined"
                    : ""
                  : "Cancelled"
                : "",
            width: "10%",
          },
          {
            name: <span className="table-title">Pre-Screen</span>,
            cell: (row) =>
              row.candidateprescreenstatus === "NA" ? (
                "-"
              ) : row.candidateprescreenstatus === "Pending" ? (
                <Button disabled color="link">
                  <u>Pending</u>
                </Button>
              ) : (
                <Button
                  onClick={() => props.onPrescreenClick("completed", row)}
                  color="link"
                >
                  <u>Completed</u>
                </Button>
              ),
            ignoreRowClick: true,
            button: true,
            width: "8%",
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

  const onRescheduleInterview = (row) => {
    setSelectedRowData(row);
    setShowIRSModal(true);
  };

  const postUpdateRescheduleInterview = (data) => {
    updateScheduledInterview(data);
  };

  const updateScheduledInterview = async function (formData) {
    let scheduleinterviewid = formData.scheduleinterviewid;
    let res = await dispatch(
      scheduleInterviewActions.updateScheduledInterviewThunk({
        scheduleinterviewid,
        formData,
      })
    );

    if (res.payload?.statusCode === 204) {
      setShowIRSModal(false);
      props.showSweetAlert({
        title: res.payload.message,
        type: "success",
      });

      props.updateList();
    } else {
      props.showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
  };

  const onUploadOfferDoc = (file) => {
    const authData = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${authData}`,
      },
    };

    const form = new FormData();
    form.append(
      "Candidaterecommendedjobid",
      selectedRowData.candidaterecommendedjobid
    );
    form.append("Offerfile", file[0]);
    form.append(
      "CurrentUserId",
      JSON.parse(localStorage.getItem("userDetails")).UserId
    );

    axios
      .post(
        `${process.env.REACT_APP_PANTHER_URL}/api/JobOffer/MakeJobOffer`,
        form,
        config
      )
      .then((result) => {
        if (result.data.statusCode == 200) {
          setShowUploadOfferModal(false);
          props.showSweetAlert({
            title: result.data.message,
            type: "success",
          });
          props.updateList();
        } else {
          props.showSweetAlert({
            title: result.data.message || result.data.status,
            type: "danger",
          });
        }
      })
      .catch((error) => {});
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
      <>
        {showIRSModal ? (
          <UpdateScheduleInterviewModal
            interviewData={selectedRowData}
            durationOptions={durationOptions}
            postData={(e) => {
              postUpdateRescheduleInterview(e);
            }}
            isOpen={showIRSModal}
            onClose={() => setShowIRSModal(false)}
          />
        ) : (
          <></>
        )}
      </>
      <>
        {showUploadOfferModal ? (
          <CustomerUploadOffer
            isOpen={showUploadOfferModal}
            onClose={() => setShowUploadOfferModal(false)}
            uploadOfferDoc={(file) => onUploadOfferDoc(file)}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
};
