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
import SweetAlert from "react-bootstrap-sweetalert";

import { RejectReasonModal } from "_components/modal/rejectReasonPopup";
import moment from "moment";
import customerIcons from "assets/utils/images/customer";
import { getTimezoneDateTime } from "_helpers/helper";
import finalOffer from "assets/utils/images/job-detail-icons/finaloffer.svg";
import currentOffer from "assets/utils/images/job-detail-icons/currentoffer.svg";
import previousOffer from "assets/utils/images/job-detail-icons/previousoffer.svg";
import newOffer from "assets/utils/images/job-detail-icons/newoffer.svg";
import { DeactivateReasonModal } from "_components/modal/deactivateReason";
import { getAcceptedListUniqueData } from "_helpers/helper";
import { useSelector } from "react-redux";

export const CandListView = (props) => {
  const onBtnClick = (type, candidaterecommendedjobid, reason) => {
    props.onCandidateActions(type, candidaterecommendedjobid, reason);
  };
  const acceptedList = useSelector(
    (state) => state.candidateListReducer.acceptedJobList?.data
  );
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [candidaterecommendedjobid, setRecommendedJobId] = useState(0);
  const [rejectType, setRejectType] = useState("");
  const [title, setTitle] = useState("");
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const acceptedListData = getAcceptedListUniqueData(acceptedList);
  const rejectReason = (rejectTitle, type, candidaterecommendedjobid) => {
    setTitle(rejectTitle);
    setRejectType(type);
    setRecommendedJobId(candidaterecommendedjobid);
    setRejectReasonModal(true);
  };

  const submitReject = async (comment) => {
    setRejectReasonModal(false);
    onBtnClick(rejectType, candidaterecommendedjobid, comment);
  };

  const onShowModal = (row, type) => {
    props.showModal(row, type);
  };

  const onShowOHModal = (row) => {
    props.onShowOHModal(row);
  };
  const renderButtons = (row) => {
    if (props.type === "liked") {
      return (
        <ButtonGroup>
          <Button
            disabled={props.type === "maybe"}
            // outline
            size="sm"
            title="Maybe"
            className=" btn-icon"
            color="warning"
            onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_maybe} alt="list maybe"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Reject"
            className="btn-icon"
            color="danger"
            // onClick={() =>
            //   onBtnClick("rejected", row.candidaterecommendedjobid)
            // }
            onClick={() =>
              rejectReason("reject", "rejected", row.candidaterecommendedjobid)
            }
          >
            <img src={customerIcons?.list_reject} alt="list reject"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Apply"
            className="btn-icon"
            color="success"
            onClick={() => onBtnClick("applied", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_accept} alt="list apply"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "maybe") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Reject"
            // onClick={() =>
            //   onBtnClick("rejected", row.candidaterecommendedjobid)
            // }

            onClick={() =>
              rejectReason("reject", "rejected", row.candidaterecommendedjobid)
            }
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons?.list_reject} alt="list reject"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Apply"
            className="btn-icon"
            color="info"
            onClick={() => onBtnClick("applied", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_accept} alt="list apply"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "applied") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Reject"
            // onClick={() =>
            //   onBtnClick("rejected", row.candidaterecommendedjobid)
            // }

            onClick={() =>
              rejectReason("reject", "rejected", row.candidaterecommendedjobid)
            }
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons?.list_reject} alt="list reject"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "interview") {
      return (
        <ButtonGroup>
          {row?.scheduledInterviewDtos !== undefined &&
          row?.scheduledInterviewDtos?.length > 0 &&
          row?.scheduledInterviewDtos[0]?.isactive === true ? (
            <>
              {row?.scheduledInterviewDtos[0]?.isreschedulerequested ===
                false && (
                <>
                  {row?.scheduledInterviewDtos[0]?.isrejected === false &&
                    row?.scheduledInterviewDtos[0]?.interviewstatusid === 0 && (
                      <>
                        <Button
                          // outline
                          size="sm"
                          title="Reject interview"
                          onClick={() =>
                            rejectReason(
                              "interview reject",
                              "rejectInterview",
                              row?.scheduledInterviewDtos[0]
                                ?.scheduleinterviewid
                            )
                          }
                          className="btn-icon"
                          color="danger"
                        >
                          <img
                            src={customerIcons?.list_reject}
                            alt="list reject"
                          ></img>
                        </Button>
                        <Button
                          // outline
                          size="sm"
                          title="Reschedule interview"
                          onClick={() =>
                            onBtnClick(
                              "rescheduleInterview",
                              row?.scheduledInterviewDtos[0]
                                ?.scheduleinterviewid
                            )
                          }
                          className="btn-icon"
                          color="alternate"
                        >
                          <img
                            src={customerIcons?.list_schedule}
                            alt="list reschedule"
                          ></img>
                        </Button>
                      </>
                    )}
                  {row?.scheduledInterviewDtos[0]?.isaccepted === false &&
                    row?.scheduledInterviewDtos[0]?.interviewstatusid === 0 && (
                      <Button
                        size="sm"
                        title="Accept interview"
                        className="btn-icon"
                        color="success"
                        onClick={() =>
                          onBtnClick(
                            "acceptInterview",
                            row?.scheduledInterviewDtos[0]?.scheduleinterviewid
                          )
                        }
                      >
                        <img
                          src={customerIcons?.list_accept}
                          alt="list accept"
                        ></img>
                      </Button>
                    )}
                </>
              )}
            </>
          ) : (
            <></>
          )}
        </ButtonGroup>
      );
    } else if (props.type === "accepted") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Reject offer"
            onClick={() =>
              rejectReason(
                "rejection",
                "rejected",
                row.candidaterecommendedjobid
              )
            }
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons?.list_reject} alt="list reject"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "rejected") {
      return (
        <ButtonGroup>
          {row?.customerrecommendedjobstatusid !== 5 &&
            row?.customerrecommendedjobstatusid !== 6 && (
              <>
                <Button
                  size="sm"
                  title="Apply"
                  className="btn-icon"
                  color="info"
                  onClick={() =>
                    onBtnClick("applied", row.candidaterecommendedjobid)
                  }
                >
                  <img src={customerIcons?.list_accept} alt="list apply"></img>
                </Button>
              </>
            )}
        </ButtonGroup>
      );
    } else if (props.type === "offers") {
      return (
        <ButtonGroup>
          {acceptedListData.companyIds.includes(row?.companyid) && (
            <>
              <Button
                size="sm"
                className="btn-icon btn-mute"
                color="success"
                id="offerDisable"
              >
                <img src={customerIcons?.list_accept} alt="list apply"></img>
              </Button>
              <UncontrolledTooltip placement="bottom" target={"offerDisable"}>
                You have already accepted a job from this employer; you cannot
                accept the job!
              </UncontrolledTooltip>
            </>
          )}
          {!acceptedListData.companyIds.includes(row?.companyid) &&
            acceptedListData.jobAcceptPermission === false && (
              <>
                <Button
                  size="sm"
                  className="btn-icon btn-mute"
                  color="success"
                  id="offerAcceptButton"
                >
                  <img src={customerIcons?.list_accept} alt="list apply"></img>
                </Button>
                <UncontrolledTooltip
                  placement="bottom"
                  target={"offerAcceptButton"}
                >
                  You have already accepted a full time or direct hiring job.
                  You cannot accept the job!
                </UncontrolledTooltip>
              </>
            )}
          {!acceptedListData.companyIds.includes(row?.companyid) &&
            acceptedListData.jobAcceptPermission === true && (
              <>
                <Button
                  // outline
                  size="sm"
                  title="Accept offer"
                  className="btn-icon"
                  color="success"
                  onClick={() =>
                    onBtnClick("accepted", row.candidaterecommendedjobid)
                  }
                >
                  <img src={customerIcons?.list_accept} alt="list apply"></img>
                </Button>
              </>
            )}
          <Button
            // outline
            size="sm"
            title="Reject offer"
            onClick={() =>
              rejectReason(
                "rejection",
                "rejected",
                row.candidaterecommendedjobid
              )
            }
            className="btn-icon"
            color="danger"
          >
            <img src={customerIcons?.list_reject} alt="list reject"></img>
          </Button>
        </ButtonGroup>
      );
    }
  };
  const renderMenu = (row) => {
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
            <DropdownItem onClick={() => onShowModal(row, "jd")}>
              <i className="dropdown-icon lnr-layers"></i>
              <span>Job details</span>
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

            {props.type === "interview" &&
            row?.scheduledInterviewDtos &&
            row?.scheduledInterviewDtos.length > 0 &&
            row?.scheduledInterviewDtos[0]?.isactive ? (
              <DropdownItem onClick={() => onShowModal(row, "id")}>
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
    props.type === "interview"
      ? [
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "20%",
          },

          {
            name: <span className="table-title">Employer</span>,
            cell: (row) => (
              <span title={row.companyname}>{row.companyname}</span>
            ),
            selector: (row) => row.companyname,
            sortable: true,
            width: "14%",
          },
          {
            name: <span className="table-title">Location</span>,
            cell: (row) => (
              <span
                title={
                  row.cityname && row.statename
                    ? row.cityname + ", " + row.statename
                    : ""
                }
              >
                {row.cityname && row.statename
                  ? row.cityname + ", " + row.statename
                  : ""}
              </span>
            ),
            selector: (row) =>
              row.cityname && row.statename
                ? row.cityname + ", " + row.statename
                : "",
            sortable: true,
            width: "13%",
          },
          {
            name: <span className="table-title">Scheduled</span>,
            cell: (row) => (
              <span
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
            selector: (row) =>
              row?.scheduledInterviewDtos &&
              row?.scheduledInterviewDtos?.length > 0
                ? getTimezoneDateTime(
                    moment(row?.scheduledInterviewDtos[0]?.scheduledate).format(
                      "MM/DD/YYYY"
                    ) +
                      (row?.scheduledInterviewDtos[0]?.starttime !== null
                        ? " " + row?.scheduledInterviewDtos[0]?.starttime
                        : " 00:00:00")
                  )
                : "",
            sortable: true,
            width: "17%",
          },
          {
            name: <span className="table-title">Interview Status</span>,
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
                          ? "Requested for reschedule"
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
                        ? "Requested for reschedule"
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
                      ? "Requested for reschedule"
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
            sortable: true,
            width: "11%",
          },
          {
            name: <span className="table-title">Pre-screen</span>,
            cell: (row) =>
              row.candidateprescreenstatus === "NA" ? (
                "-"
              ) : row.candidateprescreenstatus === "Pending" ? (
                <Button
                  onClick={() => onPrescreenClick("pending", row)}
                  color="link"
                >
                  <u>Pending</u>
                </Button>
              ) : (
                <Button
                  onClick={() => onPrescreenClick("completed", row)}
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
              <div className="list-btn-group">{renderButtons(row)}</div>
            ),
            ignoreRowClick: true,
            button: true,
            width: "11%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "6%",
          },
        ]
      : props.type === "rejected"
      ? [
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "20%",
          },
          {
            name: <span className="table-title">Employer</span>,
            cell: (row) => (
              <span title={row.companyname}>{row.companyname}</span>
            ),
            selector: (row) => row.companyname,
            sortable: true,
            width: "10%",
          },

          {
            name: <span className="table-title">Location</span>,
            cell: (row) => (
              <span
                title={
                  row.cityname && row.statename
                    ? row.cityname + ", " + row.statename
                    : ""
                }
              >
                {row.cityname && row.statename
                  ? row.cityname + ", " + row.statename
                  : ""}
              </span>
            ),
            selector: (row) =>
              row.cityname && row.statename
                ? row.cityname + ", " + row.statename
                : "",
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Offered salary</span>,
            id: "pay",
            cell: (row) => (
              <span
                title={
                  row?.jobOfferDtos === null
                    ? "-"
                    : row?.jobOfferDtos[0]?.salary === 0
                    ? "-"
                    : "$ " +
                      new Intl.NumberFormat("en-US").format(
                        row?.jobOfferDtos[0]?.salary
                      )
                }
              >
                {row?.jobOfferDtos === null
                  ? "-"
                  : row?.jobOfferDtos[0]?.salary === 0
                  ? "-"
                  : "$ " +
                    new Intl.NumberFormat("en-US").format(
                      row?.jobOfferDtos[0]?.salary
                    )}
              </span>
            ),
            selector: (row) =>
              row?.jobOfferDtos === null
                ? "-"
                : row?.jobOfferDtos[0]?.salary === 0
                ? "-"
                : "$ " +
                  new Intl.NumberFormat("en-US").format(
                    row?.jobOfferDtos[0]?.salary
                  ),
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Start date</span>,
            cell: (row) => (
              <span
                title={
                  row?.jobOfferDtos === null
                    ? "-"
                    : row?.jobOfferDtos[0]?.startdate === null
                    ? "-"
                    : getTimezoneDateTime(
                        row?.jobOfferDtos[0]?.startdate,
                        "MM/DD/YYYY"
                      )
                }
              >
                {row?.jobOfferDtos === null
                  ? "-"
                  : row?.jobOfferDtos[0]?.startdate === null
                  ? "-"
                  : getTimezoneDateTime(
                      row?.jobOfferDtos[0]?.startdate,
                      "MM/DD/YYYY"
                    )}
              </span>
            ),
            selector: (row) =>
              row?.jobOfferDtos === null
                ? "-"
                : row?.jobOfferDtos[0]?.startdate === null
                ? "-"
                : getTimezoneDateTime(
                    row?.jobOfferDtos[0]?.startdate,
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
                        title="Final Offer - Click to view offer"
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
                          src={currentOffer}
                          alt="list maybe"
                          className={"icon-pointer"}
                          width={"20px"}
                          title="New Offer - Click to view offer"
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
                          src={newOffer}
                          alt="list maybe"
                          className={"icon-pointer"}
                          width={"20px"}
                          title="New Offer - Click to view offer"
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
            width: "8%",
          },
          {
            name: <span className="table-title">Status</span>,
            cell: (row) => (
              <span
                title={
                  row?.customerrecommendedjobstatusid === 5 &&
                  row?.candidaterecommendedjobstatusid === 6
                    ? "Offer rejected"
                    : row?.candidaterecommendedjobstatusid === 6 &&
                      row?.customerrecommendedjobstatusid !== 5
                    ? "Rejected by candidate"
                    : row?.customerrecommendedjobstatusid === 6
                    ? "Rejected by customer"
                    : "-"
                }
              >
                {row?.customerrecommendedjobstatusid === 5 &&
                row?.candidaterecommendedjobstatusid === 6
                  ? "Offer rejected"
                  : row?.candidaterecommendedjobstatusid === 6 &&
                    row?.customerrecommendedjobstatusid !== 5
                  ? "Rejected by candidate"
                  : row?.customerrecommendedjobstatusid === 6
                  ? "Rejected by customer"
                  : "-"}
              </span>
            ),
            selector: (row) =>
              row?.customerrecommendedjobstatusid === 5 &&
              row?.candidaterecommendedjobstatusid === 6
                ? "Offer rejected"
                : row?.candidaterecommendedjobstatusid === 6 &&
                  row?.customerrecommendedjobstatusid !== 5
                ? "Rejected by candidate"
                : row?.customerrecommendedjobstatusid === 6
                ? "Rejected by customer"
                : "-",
            sortable: true,
            width: "14%",
          },
          {
            name: <span className="table-title">Interest</span>,
            cell: (row) => (
              <div className="list-btn-group">{renderButtons(row)}</div>
            ),
            ignoreRowClick: true,
            button: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "8%",
          },
        ]
      : props.type === "offers"
      ? [
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "28%",
          },
          {
            name: <span className="table-title">Employer</span>,
            cell: (row) => (
              <span title={row.companyname}>{row.companyname}</span>
            ),
            selector: (row) => row.companyname,
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Location</span>,
            selector: (row) =>
              row.cityname && row.statename
                ? row.cityname + ", " + row.statename
                : "",
            sortable: true,
            width: "17%",
          },
          {
            name: <span className="table-title">Offered salary</span>,
            id: "pay",
            cell: (row) => (
              <span
                title={
                  row?.jobOfferDtos === null
                    ? "-"
                    : row?.jobOfferDtos[0]?.salary === 0
                    ? "-"
                    : "$ " +
                      new Intl.NumberFormat("en-US").format(
                        row?.jobOfferDtos[0]?.salary
                      )
                }
              >
                {row?.jobOfferDtos === null
                  ? "-"
                  : row?.jobOfferDtos[0]?.salary === 0
                  ? "-"
                  : "$ " +
                    new Intl.NumberFormat("en-US").format(
                      row?.jobOfferDtos[0]?.salary
                    )}
              </span>
            ),
            selector: (row) =>
              row?.jobOfferDtos === null
                ? "-"
                : row?.jobOfferDtos[0]?.salary === 0
                ? "-"
                : "$ " +
                  new Intl.NumberFormat("en-US").format(
                    row?.jobOfferDtos[0]?.salary
                  ),
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Start date</span>,
            cell: (row) => (
              <span
                title={
                  row?.jobOfferDtos === null
                    ? "-"
                    : row?.jobOfferDtos[0]?.startdate === null
                    ? "-"
                    : getTimezoneDateTime(
                        row?.jobOfferDtos[0]?.startdate,
                        "MM/DD/YYYY"
                      )
                }
              >
                {row?.jobOfferDtos === null
                  ? "-"
                  : row?.jobOfferDtos[0]?.startdate === null
                  ? "-"
                  : getTimezoneDateTime(
                      row?.jobOfferDtos[0]?.startdate,
                      "MM/DD/YYYY"
                    )}
              </span>
            ),
            selector: (row) =>
              row?.jobOfferDtos === null
                ? "-"
                : row?.jobOfferDtos[0]?.startdate === null
                ? "-"
                : getTimezoneDateTime(
                    row?.jobOfferDtos[0]?.startdate,
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
                        title="Final Offer - Click to view offer"
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
                          src={currentOffer}
                          alt="list maybe"
                          className={"icon-pointer"}
                          width={"20px"}
                          title="New Offer - Click to view offer"
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
                          src={newOffer}
                          alt="list maybe"
                          className={"icon-pointer"}
                          width={"20px"}
                          title="New Offer - Click to view offer"
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
            width: "7%",
          },
          {
            name: <span className="table-title">Interest</span>,
            cell: (row) => (
              <div className="list-btn-group">{renderButtons(row)}</div>
            ),
            ignoreRowClick: true,
            button: true,
            width: "13%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "5%",
          },
        ]
      : props.type === "accepted"
      ? [
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "23%",
          },
          {
            name: <span className="table-title">Employer</span>,
            cell: (row) => (
              <span title={row.companyname}>{row.companyname}</span>
            ),
            selector: (row) => row.companyname,
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Location</span>,
            cell: (row) => (
              <span
                title={
                  row.cityname && row.statename
                    ? row.cityname + ", " + row.statename
                    : ""
                }
              >
                {row.cityname && row.statename
                  ? row.cityname + ", " + row.statename
                  : ""}
              </span>
            ),
            selector: (row) =>
              row.cityname && row.statename
                ? row.cityname + ", " + row.statename
                : "",
            sortable: true,
            width: "17%",
          },
          {
            name: <span className="table-title">Offered salary</span>,
            id: "pay",
            cell: (row) => (
              <span
                title={
                  row?.jobOfferDtos === null
                    ? "-"
                    : row?.jobOfferDtos[0]?.salary === 0
                    ? "-"
                    : "$ " +
                      new Intl.NumberFormat("en-US").format(
                        row?.jobOfferDtos[0]?.salary
                      )
                }
              >
                {row?.jobOfferDtos === null
                  ? "-"
                  : row?.jobOfferDtos[0]?.salary === 0
                  ? "-"
                  : "$ " +
                    new Intl.NumberFormat("en-US").format(
                      row?.jobOfferDtos[0]?.salary
                    )}
              </span>
            ),
            selector: (row) =>
              row?.jobOfferDtos === null
                ? "-"
                : row?.jobOfferDtos[0]?.salary === 0
                ? "-"
                : "$ " +
                  new Intl.NumberFormat("en-US").format(
                    row?.jobOfferDtos[0]?.salary
                  ),
            sortable: true,
            width: "8%",
          },
          {
            name: <span className="table-title">Start date</span>,
            cell: (row) => (
              <span
                title={
                  row?.jobOfferDtos === null
                    ? "-"
                    : row?.jobOfferDtos[0]?.startdate === null
                    ? "-"
                    : getTimezoneDateTime(
                        row?.jobOfferDtos[0]?.startdate,
                        "MM/DD/YYYY"
                      )
                }
              >
                {row?.jobOfferDtos === null
                  ? "-"
                  : row?.jobOfferDtos[0]?.startdate === null
                  ? "-"
                  : getTimezoneDateTime(
                      row?.jobOfferDtos[0]?.startdate,
                      "MM/DD/YYYY"
                    )}
              </span>
            ),
            selector: (row) =>
              row?.jobOfferDtos === null
                ? "-"
                : row?.jobOfferDtos[0]?.startdate === null
                ? "-"
                : getTimezoneDateTime(
                    row?.jobOfferDtos[0]?.startdate,
                    "MM/DD/YYYY"
                  ),
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Accepted date</span>,
            cell: (row) => (
              <span
                title={
                  row?.candidateaccepteddatetime === null
                    ? "-"
                    : getTimezoneDateTime(
                        row?.candidateaccepteddatetime,
                        "MM/DD/YYYY"
                      )
                }
              >
                {row?.candidateaccepteddatetime === null
                  ? "-"
                  : getTimezoneDateTime(
                      row?.candidateaccepteddatetime,
                      "MM/DD/YYYY"
                    )}
              </span>
            ),
            selector: (row) =>
              row?.candidateaccepteddatetime === null
                ? "-"
                : getTimezoneDateTime(
                    row?.candidateaccepteddatetime,
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
                        title="Click to view accepted offer"
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
                          src={finalOffer}
                          alt="list maybe"
                          className={"icon-pointer"}
                          width={"20px"}
                          title="Click to view accepted offer"
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
                          src={finalOffer}
                          alt="list maybe"
                          className={"icon-pointer"}
                          width={"20px"}
                          title="Click to view accepted offer"
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
            width: "8%",
          },
          {
            name: <span className="table-title">Interest</span>,
            cell: (row) => (
              <div className="list-btn-group">{renderButtons(row)}</div>
            ),
            ignoreRowClick: true,
            button: true,
            width: "8%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "6%",
          },
        ]
      : [
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "25%",
          },
          {
            name: <span className="table-title">Employer</span>,
            cell: (row) => (
              <span title={row.companyname}>{row.companyname}</span>
            ),
            selector: (row) => row.companyname,
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Location</span>,
            cell: (row) => (
              <span
                title={
                  row.cityname && row.statename
                    ? row.cityname + ", " + row.statename
                    : ""
                }
              >
                {row.cityname && row.statename
                  ? row.cityname + ", " + row.statename
                  : ""}
              </span>
            ),
            selector: (row) =>
              row.cityname && row.statename
                ? row.cityname + ", " + row.statename
                : "",
            sortable: true,
            width: "15%",
          },

          {
            name: <span className="table-title">Experience</span>,
            cell: (row) => (
              <span
                title={
                  row?.jobExperienceScheduleDtos &&
                  row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    : "-"
                }
              >
                {row?.jobExperienceScheduleDtos &&
                row?.jobExperienceScheduleDtos[0]?.experiencelevel
                  ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                  : "-"}
              </span>
            ),
            selector: (row) =>
              row?.jobExperienceScheduleDtos &&
              row?.jobExperienceScheduleDtos[0]?.experiencelevel
                ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                : "-",
            sortable: true,
            width: "8%",
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
            width: "10%",
          },

          {
            name: <span className="table-title">Pre-screen</span>,
            cell: (row) =>
              row.candidateprescreenstatus === "NA" ? (
                "-"
              ) : row.candidateprescreenstatus === "Pending" ? (
                <Button
                  onClick={() => onPrescreenClick("pending", row)}
                  color="link"
                >
                  <u>Pending</u>
                </Button>
              ) : (
                <Button
                  onClick={() => onPrescreenClick("completed", row)}
                  color="link"
                >
                  <u>Completed</u>
                </Button>
              ),
            ignoreRowClick: true,
            button: true,
            width: "9%",
          },

          {
            name: <span className="table-title">Interest</span>,
            cell: (row) => (
              <div className="list-btn-group">{renderButtons(row)}</div>
            ),
            ignoreRowClick: true,
            button: true,
            width: "15%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "8%",
          },
        ]
  );

  const handleButtonClick = () => {
    console.log("clicked");
  };

  const handleRowClick = (data) => {
    console.log(data);
  };

  const onPrescreenClick = (type, row) => {
    props.onPrescreenClick(type, row);
  };

  const closeModal = function () {
    setRejectReasonModal(false);
  };
  return (
    <>
      <DataTable
        onRowClicked={handleRowClick}
        data={props.data}
        columns={columns(handleButtonClick)}
        // selectableRows
        persistTableHead
        // pagination
        className="cust-list-view"
      />
      {rejectReasonModal && (
        // <RejectReasonModal
        //   isRMOpen={rejectReasonModal}
        //   callBack={(e) => submitReject(e)}
        //   callBackError={() => closeModal()}
        //   title={title}
        // />

        <DeactivateReasonModal
          isRMOpen={rejectReasonModal}
          callBack={(e) => submitReject(e)}
          callBackError={() => closeModal()}
          title={title}
        ></DeactivateReasonModal>
      )}
      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeModal()}
        />
        {showAlert.description}
      </>
    </>
  );
};
