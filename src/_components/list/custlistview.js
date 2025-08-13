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
  Button,
  ButtonGroup,
  UncontrolledTooltip,
} from "reactstrap";
import { AcceptModal } from "_components/modal/acceptmodal";
import { ScheduleInterviewModal } from "_components/scheduleInterview/scheduleInterviewModal";
import { InterviewDetailsModal } from "_components/scheduleInterview/interviewDetailsModal";
import { RejectModal } from "_components/modal/rejectmodal";
import { RejectSuccessModal } from "_components/modal/rejectsuccessmodal";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { customerCandidateListsActions } from "../../_containers/customer/candidatelists/customercandidatelists.slice";
import customerIcons from "assets/utils/images/customer";
import finalOffer from "assets/utils/images/job-detail-icons/finaloffer.svg";
import currentOffer from "assets/utils/images/job-detail-icons/currentoffer.svg";
import previousOffer from "assets/utils/images/job-detail-icons/previousoffer.svg";
import newoffer from "assets/utils/images/job-detail-icons/newoffer.svg";
import "./custlistview.scss";
import moment from "moment";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import { getTimezoneDateTime } from "_helpers/helper";
import { UpdateScheduleInterviewModal } from "_components/scheduleInterview/updateScheduleInterviewModal";
import { scheduleInterviewActions } from "_store";
import { CustomerUploadOffer } from "_components/modal/custuploadoffer";
import axios from "axios";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, CANDIDATE_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

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
  const [offerUploadLoading, setOfferUploadLoading] = useState(false);

  // Use Redux dispatch for snackbar
  const dispatch = useDispatch();
  const durationOptions = useSelector(
    (state) => state.scheduleInterview.duration
  );
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
      // props.showSweetAlert({
      //   title: "Candidate status updated successfully!!!2",
      //   type: "success",
      // });      

      props.updateList();

      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.CANDIDATE_STATUS_UPDATED_SUCCESS,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    } else {
      // props.showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });

      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

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
      // props.showSweetAlert({
      //   title: "Interview scheduled successfully!",
      //   type: "success",
      // });            

      props.updateList();

      debugger;
      dispatch(showSnackbar({
        message: CANDIDATE_MESSAGES.INTERVIEW_SCHEDULED_SUCCESSFULLY,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    } else {
      // props.showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });

      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  };

  const renderButtons = (candidaterecommendedjobid, row) => {
    if (props.type === "liked" || props.type === "maybe") {
      return (
        <ButtonGroup>
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
          <Button
            // outline
            size="sm"
            title="Decline"
            onClick={() => onRejectClick(candidaterecommendedjobid)}
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons.list_reject} alt="list reject"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "applied") {
      return (
        <ButtonGroup>
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
            title="Decline candidate"
            onClick={() => onRejectClick(candidaterecommendedjobid)}
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons.list_reject} alt="list reject"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "scheduled") {
      return (
        <ButtonGroup>
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
            title="Decline candidate"
            onClick={() => onRejectClick(candidaterecommendedjobid)}
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons.list_reject} alt="list reject"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "offers") {
      return (
        <ButtonGroup>
          {row.jobOfferDtos &&
            row.jobOfferDtos.length > 0 &&
            !row.jobOfferDtos[0].isfinaloffer ? (
            <Button
              // outline
              size="sm"
              title="Re-extend offer"
              onClick={() => onAcceptClick(row)}
              className="btn-icon"
              color="success"
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          ) : (
            <></>
          )}
          <Button
            // outline
            size="sm"
            title="Decline offer"
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
            title="Decline candidate"
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
            title="Schedule"
            className="btn-icon"
            color="alternate"
            onClick={() => onScheduleClick(row)}
          >
            <img src={customerIcons.list_schedule} alt="list maybe"></img>
          </Button>
          {row.jobOfferDtos &&
            row.jobOfferDtos.length > 0 &&
            !row.jobOfferDtos[0].isfinaloffer ? (
            <Button
              // outline
              size="sm"
              title="Re-extend offer"
              onClick={() => onAcceptClick(row)}
              className="btn-icon"
              color="success"
            >
              <img src={customerIcons.list_accept} alt="list accept"></img>
            </Button>
          ) : (
            <></>
          )}
          {/* <Button
            // outline
            size="sm"
            title="Make offer"
            onClick={() => onAcceptClick(row)}
            className="btn-icon"
            color="success"
          >
            <img src={customerIcons.list_accept} alt="list accept"></img>
          </Button> */}

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
        </ButtonGroup>
      );
    }
  };

  const onShowOHModal = (row) => {
    props.onShowOHModal(row);
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
            <DropdownItem onClick={() => props.onBuildResume(candidateid)}>
              <i className="dropdown-icon lnr-layers"></i>
              <span>Candidate details</span>
            </DropdownItem>
            {props.type === "offers" ||
              props.type === "accepted" ||
              props.type === "rejected" ? (
              <DropdownItem onClick={() => onShowOHModal(row)}>
                <i className="dropdown-icon lnr-layers"></i>
                <span>Offer history</span>
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
            width: "40%",
          },
          {
            name: <span className="table-title">{props.type === "liked" ? "Liked by" : "Maybe by"}</span>,
            cell: (row) => <span title={props.type === "liked" ? row.customerlikebyname : row.customermaybebyname}>{props.type === "liked" ? row.customerlikebyname : row.customermaybebyname}</span>,
            selector: (row) => props.type === "liked" ? row.customerlikebyname : row.customermaybebyname,
            sortable: true,
            //width: "20%",
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
            width: "17%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row.candidateid, row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "8%",
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
              width: "14%",
            },
            {
              name: <span className="table-title">Job title</span>,
              cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
              selector: (row) => row?.jobtitle,
              sortable: true,
              width: "18%",
            },
            {
              name: <span className="table-title">Offered salary</span>,
              cell: (row) => (
                <span
                  title={
                    row?.jobOfferDtos[0] === undefined
                      ? "-"
                      : row?.jobOfferDtos[0]?.salary === 0
                        ? "-"
                        : "$ " +
                        new Intl.NumberFormat("en-US").format(
                          row?.jobOfferDtos[0]?.salary
                        )
                  }
                >
                  {row?.jobOfferDtos[0] === undefined
                    ? "-"
                    : row?.jobOfferDtos[0]?.salary === 0
                      ? "-"
                      : "$ " +
                      new Intl.NumberFormat("en-US").format(
                        row?.jobOfferDtos[0]?.salary
                      ) +
                      (row?.jobOfferDtos?.length > 0 &&
                        row?.jobOfferDtos[0].payperiodtype !== null
                        ? " - " + row?.jobOfferDtos[0].payperiodtype
                        : "")}
                </span>
              ),
              selector: (row) =>
                row?.jobOfferDtos[0] === undefined
                  ? "-"
                  : row?.jobOfferDtos[0]?.salary === 0
                    ? "-"
                    : "$ " +
                    new Intl.NumberFormat("en-US").format(
                      row?.jobOfferDtos[0]?.salary
                    ),
              sortable: true,
              width: "12%",
            },
            {
              name: <span className="table-title">Start date</span>,
              cell: (row) => (
                <span
                  title={
                    row?.jobOfferDtos[0] === undefined
                      ? "-"
                      : row?.jobOfferDtos[0]?.startdate === null
                        ? "-"
                        : moment(row?.jobOfferDtos[0]?.startdate).format(
                          "MM/DD/YYYY"
                        )
                  }
                >
                  {row?.jobOfferDtos[0] === undefined
                    ? "-"
                    : row?.jobOfferDtos[0]?.startdate === null
                      ? "-"
                      : moment(row?.jobOfferDtos[0]?.startdate).format(
                        "MM/DD/YYYY"
                      )}
                </span>
              ),
              selector: (row) =>
                row?.jobOfferDtos[0] === undefined
                  ? "-"
                  : row?.jobOfferDtos[0]?.startdate === null
                    ? "-"
                    : moment(row?.jobOfferDtos[0]?.startdate).format(
                      "MM/DD/YYYY"
                    ),
              sortable: true,
              width: "10%",
            },
            {
              name: <span className="table-title">Offer</span>,
              cell: (row) =>
                row?.jobOfferDtos?.length > 0 ? (
                  <>
                    {row?.jobOfferDtos?.length === 2 && (
                      <>
                        <img
                          src={previousOffer}
                          alt="list maybe"
                          className={"icon-pointer me-2"}
                          width={"20px"}
                          title="Previous Offer - Click to view offer"
                          onClick={() =>
                            window.open(row?.jobOfferDtos[1]?.offerfilepath)
                          }
                        ></img>
                      </>
                    )}
                    {row?.isfinaloffer === true && (
                      <>
                        <img
                          src={finalOffer}
                          alt="list maybe"
                          className={"icon-pointer me-2"}
                          width={"20px"}
                          title={
                            props.type === "accepted"
                              ? "Click to view offer"
                              : "Final Offer - Click to view offer"
                          }
                          onClick={() =>
                            window.open(row?.jobOfferDtos[0]?.offerfilepath)
                          }
                        ></img>
                      </>
                    )}
                    {row?.jobOfferDtos?.length === 1 &&
                      row?.isfinaloffer === false && (
                        <>
                          <img
                            src={
                              props.type === "accepted"
                                ? finalOffer
                                : currentOffer
                            }
                            alt="list maybe"
                            className={"icon-pointer"}
                            width={"20px"}
                            title={
                              props.type === "accepted"
                                ? "Click to view accepted offer"
                                : "New Offer - Click to view offer"
                            }
                            onClick={() =>
                              window.open(row?.jobOfferDtos[0]?.offerfilepath)
                            }
                          ></img>
                        </>
                      )}
                    {row?.jobOfferDtos?.length === 2 &&
                      row?.isfinaloffer === false && (
                        <>
                          <img
                            src={
                              props.type === "accepted" ? finalOffer : newoffer
                            }
                            alt="list maybe"
                            className={"icon-pointer"}
                            width={"20px"}
                            title={
                              props.type === "accepted"
                                ? "Click to view accepted offer"
                                : "New Offer - Click to view offer"
                            }
                            onClick={() =>
                              window.open(row?.jobOfferDtos[0]?.offerfilepath)
                            }
                          ></img>
                        </>
                      )}
                  </>
                ) : (
                  <> - </>
                ),
              ignoreRowClick: true,
              button: true,
              width: "6%",
            },
            {
              name: <span className="table-title">Status</span>,
              cell: (row) => (
                <span>
                  {row?.customerrecommendedjobstatusid === 5 &&
                    row?.candidaterecommendedjobstatusid === 6
                    ? "Offer declined by candidate"
                    : row?.candidaterecommendedjobstatusid === 6 &&
                      row?.customerrecommendedjobstatusid !== 5
                      ? "Declined by candidate"
                      : row?.customerrecommendedjobstatusid === 6
                        ? "Declined by customer"
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
                  ? "Offer declined by candidate"
                  : row?.candidaterecommendedjobstatusid === 6 &&
                    row?.customerrecommendedjobstatusid !== 5
                    ? "Declined by candidate"
                    : row?.customerrecommendedjobstatusid === 6
                      ? "Declined by customer"
                      : "-",
              ignoreRowClick: true,
              button: true,
              width: "15%",
            },
            {
              name: <span className="table-title">Rejected by</span>,
              cell: (row) => <span title={row.customerrejectedbyname}>{row.customerrejectedbyname}</span>,
              selector: (row) => row?.customerrejectedbyname,
              sortable: true,
              width: "12%",
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
                width: "22%",
              },
              {
                name: <span className="table-title">Offered salary</span>,
                cell: (row) => (
                  <span
                    title={
                      row?.jobOfferDtos[0] === undefined
                        ? "-"
                        : row?.jobOfferDtos[0]?.salary === 0
                          ? "-"
                          : "$ " +
                          new Intl.NumberFormat("en-US").format(
                            row?.jobOfferDtos[0]?.salary
                          )
                    }
                  >
                    {row?.jobOfferDtos[0] === undefined
                      ? "-"
                      : row?.jobOfferDtos[0]?.salary === 0
                        ? "-"
                        : "$ " +
                        new Intl.NumberFormat("en-US").format(
                          row?.jobOfferDtos[0]?.salary
                        ) +
                        (row?.jobOfferDtos?.length > 0 &&
                          row?.jobOfferDtos[0].payperiodtype !== null
                          ? " - " + row?.jobOfferDtos[0].payperiodtype
                          : "")}
                  </span>
                ),
                selector: (row) =>
                  row?.jobOfferDtos[0] === undefined
                    ? "-"
                    : row?.jobOfferDtos[0]?.salary === 0
                      ? "-"
                      : "$ " +
                      new Intl.NumberFormat("en-US").format(
                        row?.jobOfferDtos[0]?.salary
                      ),
                sortable: true,
                width: "12%",
              },
              {
                name: <span className="table-title">Start date</span>,
                cell: (row) => (
                  <span
                    title={
                      row?.jobOfferDtos[0] === undefined
                        ? "-"
                        : row?.jobOfferDtos[0]?.startdate === null
                          ? "-"
                          : moment(row?.jobOfferDtos[0]?.startdate).format(
                            "MM/DD/YYYY"
                          )
                    }
                  >
                    {row?.jobOfferDtos[0] === undefined
                      ? "-"
                      : row?.jobOfferDtos[0]?.startdate === null
                        ? "-"
                        : moment(row?.jobOfferDtos[0]?.startdate).format(
                          "MM/DD/YYYY"
                        )}
                  </span>
                ),
                selector: (row) =>
                  row?.jobOfferDtos[0] === undefined
                    ? "-"
                    : row?.jobOfferDtos[0]?.startdate === null
                      ? "-"
                      : moment(row?.jobOfferDtos[0]?.startdate).format(
                        "MM/DD/YYYY"
                      ),
                sortable: true,
                width: "10%",
              },
              {
                name: <span className="table-title">Offer</span>,
                cell: (row) =>
                  row?.jobOfferDtos?.length > 0 ? (
                    <>
                      {row?.jobOfferDtos?.length === 2 && (
                        <>
                          <img
                            src={previousOffer}
                            alt="list maybe"
                            className={"icon-pointer me-2"}
                            width={"20px"}
                            title="Previous Offer - Click to view offer"
                            onClick={() =>
                              window.open(row?.jobOfferDtos[1]?.offerfilepath)
                            }
                          ></img>
                        </>
                      )}
                      {row?.isfinaloffer === true && (
                        <>
                          <img
                            src={finalOffer}
                            alt="list maybe"
                            className={"icon-pointer me-2"}
                            width={"20px"}
                            title={
                              props.type === "accepted"
                                ? "Click to view accepted offer"
                                : "Final Offer - Click to view offer"
                            }
                            onClick={() =>
                              window.open(row?.jobOfferDtos[0]?.offerfilepath)
                            }
                          ></img>
                        </>
                      )}
                      {row?.jobOfferDtos?.length === 1 &&
                        row?.isfinaloffer === false && (
                          <>
                            <img
                              src={
                                props.type === "accepted"
                                  ? finalOffer
                                  : currentOffer
                              }
                              alt="list maybe"
                              className={"icon-pointer"}
                              width={"20px"}
                              title={
                                props.type === "accepted"
                                  ? "Click to view accepted offer"
                                  : "New Offer - Click to view offer"
                              }
                              onClick={() =>
                                window.open(row?.jobOfferDtos[0]?.offerfilepath)
                              }
                            ></img>
                          </>
                        )}
                      {row?.jobOfferDtos?.length === 2 &&
                        row?.isfinaloffer === false && (
                          <>
                            <img
                              src={
                                props.type === "accepted" ? finalOffer : newoffer
                              }
                              alt="list maybe"
                              className={"icon-pointer"}
                              width={"20px"}
                              title={
                                props.type === "accepted"
                                  ? "Click to view accepted offer"
                                  : "New Offer - Click to view offer"
                              }
                              onClick={() =>
                                window.open(row?.jobOfferDtos[0]?.offerfilepath)
                              }
                            ></img>
                          </>
                        )}
                    </>
                  ) : (
                    <> - </>
                  ),
                ignoreRowClick: true,
                button: true,
                width: "10%",
              },
              {
                name: <span className="table-title">{props?.type === "offers" ? "Offered by" : "Job posted by"}</span>,
                cell: (row) => <span title={props?.type === "offers" ? row.customerofferedbyname : row.jobpostedbyname}>{props?.type === "offers" ? row.customerofferedbyname : row.jobpostedbyname}</span>,
                selector: (row) => props?.type === "offers" ? row.customerofferedbyname : row.jobpostedbyname,
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
                width: "20%",
              },
              {
                name: <span className="table-title">Applied date</span>,
                selector: (row) =>
                  getTimezoneDateTime(
                    moment(row?.candidateapplydatetime).format(
                      "YYYY-MM-DD HH:MM:SS"
                    ),
                    "MM/DD/YYYY"
                  ),

                ignoreRowClick: true,
                button: true,
                width: "15%",
              },
              // {
              //   name: <span className="table-title">Location</span>,
              //   cell: (row) => (
              //     <span
              //       title={
              //         row?.recommendedationCandidateShortList &&
              //         row.recommendedationCandidateShortList?.length > 0
              //           ? (row?.recommendedationCandidateShortList[0].cityname
              //               ? `${row?.recommendedationCandidateShortList[0].cityname}, `
              //               : "") +
              //             "" +
              //             (row.recommendedationCandidateShortList[0].statename
              //               ? row.recommendedationCandidateShortList[0].statename
              //               : "")
              //           : ""
              //       }
              //     >
              //       {row?.recommendedationCandidateShortList &&
              //       row.recommendedationCandidateShortList?.length > 0
              //         ? (row?.recommendedationCandidateShortList[0].cityname
              //             ? `${row?.recommendedationCandidateShortList[0].cityname}, `
              //             : "") +
              //           "" +
              //           (row.recommendedationCandidateShortList[0].statename
              //             ? row.recommendedationCandidateShortList[0].statename
              //             : "")
              //         : ""}
              //     </span>
              //   ),
              //   selector: (row) =>
              //     row?.recommendedationCandidateShortList &&
              //     row.recommendedationCandidateShortList?.length > 0
              //       ? (row?.recommendedationCandidateShortList[0].cityname
              //           ? `${row?.recommendedationCandidateShortList[0].cityname}, `
              //           : "") +
              //         "" +
              //         (row.recommendedationCandidateShortList[0].statename
              //           ? row.recommendedationCandidateShortList[0].statename
              //           : "")
              //       : "",
              //   sortable: true,
              //   width: "15%",
              // },

              // {
              //   name: <span className="table-title">Experience</span>,
              //   cell: (row) => (
              //     <span
              //       title={
              //         row?.recommendedationCandidateShortList &&
              //         row?.recommendedationCandidateShortList.length > 0
              //           ? row?.recommendedationCandidateShortList[0]?.experience
              //           : "-"
              //       }
              //     >
              //       {row?.recommendedationCandidateShortList &&
              //       row?.recommendedationCandidateShortList.length > 0
              //         ? row?.recommendedationCandidateShortList[0]?.experience
              //         : "-"}
              //     </span>
              //   ),
              //   selector: (row) =>
              //     row?.recommendedationCandidateShortList &&
              //     row?.recommendedationCandidateShortList.length > 0
              //       ? row?.recommendedationCandidateShortList[0]?.experience
              //       : "-",
              //   sortable: true,
              //   width: "15%",
              // },
              {
                name: <span className="table-title">Pre-screen</span>,
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
                width: "15%",
              },
              {
                name: <span className="table-title">Job posted by</span>,
                cell: (row) => <span title={row.jobpostedbyname}>{row.jobpostedbyname}</span>,
                selector: (row) => row?.jobpostedbyname,
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
          cell: (row) => (
            <span title={row.firstname + " " + row.lastname}>
              {row.firstname + " " + row.lastname}
            </span>
          ),
          selector: (row) => row.firstname + " " + row.lastname,
          sortable: true,
          //width: "15%",
        },
        {
          name: <span className="table-title">Job title</span>,
          cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
          selector: (row) => row?.jobtitle,
          sortable: true,
          //width: "20%",
        },
        {
          name: <span className="table-title">Proposed interview</span>,
          sortable: true,
          cell: (row) => (
            <span
              title={
                row?.scheduledInterviewDtos != null
                  ? getTimezoneDateTime(
                    moment(
                      row?.scheduledInterviewDtos[0]?.scheduledate?.slice(
                        0,
                        11
                      ) +
                      (row?.scheduledInterviewDtos[0]?.starttime !== null
                        ? " " + row?.scheduledInterviewDtos[0]?.starttime
                        : " 00:00:00")
                    ).format("YYYY-MM-DD HH:mm:ss")
                  )
                  : ""
              }
            >
              {row?.scheduledInterviewDtos != null
                ? getTimezoneDateTime(
                  moment(
                    row?.scheduledInterviewDtos[0]?.scheduledate?.slice(
                      0,
                      11
                    ) +
                    (row?.scheduledInterviewDtos[0]?.starttime !== null
                      ? row?.scheduledInterviewDtos[0]?.starttime
                      : "00:00:00")
                  ).format("YYYY-MM-DD HH:mm:ss")
                )
                : ""}
            </span>
          ),
          selector: (row) =>
            row?.scheduledInterviewDtos != null
              ? getTimezoneDateTime(
                moment(
                  row?.scheduledInterviewDtos[0]?.scheduledate?.slice(
                    0,
                    11
                  ) +
                  (row?.scheduledInterviewDtos[0]?.starttime !== null
                    ? row?.scheduledInterviewDtos[0]?.starttime
                    : "00:00:00")
                ).format("YYYY-MM-DD HH:mm:ss")
              )
              : "",

          //width: "16%",
        },
        {
          name: <span className="table-title">Pre-screen</span>,
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
          //width: "10%",
        },
        {
          name: <span className="table-title">Interview status</span>,
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
                            ? "Declined"
                            : "No response by candidate"
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
                          ? "Declined"
                          : "No response by candidate"
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
                        ? "Declined"
                        : "No response"
                  : row?.scheduledInterviewDtos[0]?.interviewstatusid === 1
                    ? "Completed"
                    : row?.scheduledInterviewDtos[0]?.interviewstatusid === 2
                      ? "Not joined"
                      : ""
                : "Cancelled"
              : "",
          //width: "12%",
        },
        {
          name: <span className="table-title">Interview feedback status</span>,
          sortable: true,
          cell: (row) => (
            <span
              title={
                row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
                  ? row?.scheduledInterviewDtos[0]?.interviewstatus ===
                    '' ||
                    row?.scheduledInterviewDtos[0]?.interviewstatus ===
                    undefined
                    ? row?.scheduledInterviewDtos[0]?.interviewstatus : ""
                  : ""
              }
            >
              {row?.scheduledInterviewDtos && row?.scheduledInterviewDtos?.length > 0
                ? row?.scheduledInterviewDtos[0]?.interviewstatus ===
                  '' ||
                  row?.scheduledInterviewDtos[0]?.interviewstatus ===
                  undefined
                  ? "" : row?.scheduledInterviewDtos[0]?.interviewstatus
                : ""}
            </span >
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
                        ? "Declined"
                        : "No response"
                  : row?.scheduledInterviewDtos[0]?.interviewstatusid === 1
                    ? "Completed"
                    : row?.scheduledInterviewDtos[0]?.interviewstatusid === 2
                      ? "Not joined"
                      : ""
                : "Cancelled"
              : "",
          //width: "12%",
        },
        {
          name: <span className="table-title">Scheduled by</span>,
          cell: (row) => <span title={row.customerscheduledbyname}>{row.customerscheduledbyname}</span>,
          selector: (row) => row?.customerscheduledbyname,
          sortable: true,
          //width: "20%",
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
          //width: "10%",
        },
        {
          name: <span className="table-title">Action</span>,
          cell: (row) => <>{renderMenu(row.candidateid, row)}</>,
          ignoreRowClick: true,
          allowOverflow: true,
          button: true,
          //width: "5%",
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
      // props.showSweetAlert({
      //   title: res.payload.message,
      //   type: "success",
      // });

      props.updateList();

      dispatch(showSnackbar({
        message: res.payload.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

      
    } else {
      // props.showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });
      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  };

  const onUploadOfferDoc = (
    file,
    startdate,
    pay,
    finaloffer,
    payType,
    selectedTemplate,
    generatedHtml
  ) => {
    setOfferUploadLoading(true);
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
    form.append("Isfinaloffer", finaloffer);
    form.append("Salary", pay);
    form.append("Payperiodtype", payType);
    form.append(
      "Startdate",
      moment(startdate).tz("Etc/UTC").format("YYYY-MM-DD")
    );
    if (selectedTemplate && generatedHtml) {
      form.append("Offerlettertemplateid", selectedTemplate);
      form.append("Offerlettertemplatefinaltext", generatedHtml);
    }
    axios
      .post(
        `${process.env.REACT_APP_PANTHER_URL}/api/JobOffer/MakeJobOffer`,
        form,
        config
      )
      .then((result) => {
        setOfferUploadLoading(false);
        if (result.data.statusCode === 200) {
          setShowUploadOfferModal(false);
          // props.showSweetAlert({
          //   title: result.data.message,
          //   type: "success",
          // });
          dispatch(showSnackbar({
            message: result.data.message,
            type: SNACKBAR_TYPES.SUCCESS,
            position: SNACKBAR_POSITION.TOP_CENTER,
            autoClose: true,
            autoCloseDelay: 3000,
            maxWidth: 500,
          }));
          props.updateList();
        } else {
          // props.showSweetAlert({
          //   title: result.data.message || result.data.status,
          //   type: "danger",
          // });
          dispatch(showSnackbar({
            message: result.data.message || result.data.status,
            type: SNACKBAR_TYPES.ERROR,
            position: SNACKBAR_POSITION.TOP_CENTER,
            autoClose: true,
            autoCloseDelay: 3000,
            maxWidth: 500,
          }));
        }
      })
      .catch((error) => {
        setOfferUploadLoading(false);
      });
  };

  const onOfferUploading = (data) => {
    setOfferUploadLoading(data);
  };

  return (
    <>
      <DataTable
        onRowClicked={handleRowClick}
        data={props.data}
        columns={columns(handleButtonClick)}
        persistTableHead
        // pagination
        className="cust-list-view popover-height"
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
            type={selectedIDData?.format}
            onClose={() => onCloseIdModal()}
            interviewDetail={selectedIDData}
            postNotesData={() => onCloseIdModal()}
            postInviteData={() => onCloseIdModal()}
            cancelScheduleData={() => onCloseIdModal()}
            editScheduledInterview={() => onCloseIdModal()}
            postMessageData={() => onCloseIdModal()}
            acceptInterview={() => onCloseIdModal()}
            rejectInterview={() => onCloseIdModal()}
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
            uploadOfferDoc={(
              file,
              startdate,
              pay,
              finaloffer,
              payType,
              selectedTemplate,
              generatedHtml
            ) =>
              onUploadOfferDoc(
                file,
                startdate,
                pay,
                finaloffer,
                payType,
                selectedTemplate,
                generatedHtml
              )
            }
            loading={offerUploadLoading}
            updateLoading={(data) => onOfferUploading(data)}
            data={selectedRowData}
          />
        ) : (
          <></>
        )}
      </>

    </>
  );
};
