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
} from "reactstrap";
import SweetAlert from "react-bootstrap-sweetalert";

import { RejectReasonModal } from "_components/modal/rejectReasonPopup";
import moment from "moment";
import customerIcons from "assets/utils/images/customer";
import { getTimezoneDateTime } from "_helpers/helper";
import { BsFileEarmarkPdf } from "react-icons/bs";

export const CandListView = (props) => {
  const onBtnClick = (type, candidaterecommendedjobid, reason) => {
    props.onCandidateActions(type, candidaterecommendedjobid, reason);
  };
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
            onClick={() =>
              onBtnClick("rejected", row.candidaterecommendedjobid)
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
            onClick={() =>
              onBtnClick("rejected", row.candidaterecommendedjobid)
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
            onClick={() =>
              onBtnClick("rejected", row.candidaterecommendedjobid)
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
          {row?.customerrecommendedjobstatusid === 5 && (
            <Button
              size="sm"
              title="Accept offer"
              className="btn-icon"
              color="success"
              onClick={
                () =>
                  rejectReason(
                    "reaccepting",
                    "reaccepted",
                    row.candidaterecommendedjobid
                  )
                // onBtnClick("accepted", row.candidaterecommendedjobid)
              }
            >
              <img src={customerIcons?.list_accept} alt="list apply"></img>
            </Button>
          )}
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
  const getPay = (data) => {
    let maxAmount = new Intl.NumberFormat("en-US").format(
      data.jobPaymentBenefitDtos[0]?.maximumamount
    );
    let minAmount = new Intl.NumberFormat("en-US").format(
      data.jobPaymentBenefitDtos[0]?.minimumamount
    );
    if (minAmount !== "" && maxAmount !== "") {
      return (
        "$" +
        minAmount +
        " - $" +
        maxAmount +
        " ( " +
        data.jobPaymentBenefitDtos[0]?.payperiodtype +
        " ) "
      );
    }
    if (minAmount !== "" && maxAmount === "") {
      return (
        "$" +
        minAmount +
        " (" +
        data.jobPaymentBenefitDtos[0]?.payperiodtype +
        ") "
      );
    }
    if (minAmount === "" && maxAmount !== "") {
      return (
        "$" +
        data.jobPaymentBenefitDtos[0]?.maximumamount +
        " (" +
        data.jobPaymentBenefitDtos[0]?.payperiodtype +
        ") "
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
            name: <span className="table-title">Job Id</span>,
            id: "Job Id",
            cell: (row) => <span title={row.jobid}>{row.jobid}</span>,
            selector: (row) => row.jobid,
            sortable: true,
            width: "8%",
          },
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "18%",
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
            width: "10%",
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
            width: "6%",
          },
        ]
      : props.type === "rejected"
      ? [
          {
            name: <span className="table-title">Job Id</span>,
            id: "Job Id",
            cell: (row) => <span title={row.jobid}>{row.jobid}</span>,
            selector: (row) => row.jobid,
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "25%",
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
            name: <span className="table-title">Job Id</span>,
            id: "Job Id",
            cell: (row) => <span title={row.jobid}>{row.jobid}</span>,
            selector: (row) => row.jobid,
            sortable: true,
            width: "8%",
          },
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "22%",
          },
          {
            name: <span className="table-title">Location</span>,
            selector: (row) =>
              row.cityname && row.statename
                ? row.cityname + ", " + row.statename
                : "",
            sortable: true,
            width: "13%",
          },
          {
            name: <span className="table-title">Pay</span>,
            id: "pay",
            selector: (row) => getPay(row),

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
            width: "10%",
          },
          {
            name: <span className="table-title">Offer</span>,
            cell: (row) =>
              row?.jobOfferDtos?.length > 0 ? (
                <>
                  <BsFileEarmarkPdf
                    className="icon-pointer"
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
            width: "7%",
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
            width: "5%",
          },
        ]
      : props.type === "accepted"
      ? [
          {
            name: <span className="table-title">Job Id</span>,
            id: "Job Id",
            cell: (row) => <span title={row.jobid}>{row.jobid}</span>,
            selector: (row) => row.jobid,
            sortable: true,
            width: "8%",
          },
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "34%",
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
            width: "10%",
          },
          {
            name: <span className="table-title">Offer</span>,
            cell: (row) =>
              row?.jobOfferDtos?.length > 0 ? (
                <>
                  <BsFileEarmarkPdf
                    className="icon-pointer"
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
            width: "7%",
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
            width: "6%",
          },
        ]
      : [
          {
            name: <span className="table-title">Job Id</span>,
            id: "Job Id",
            cell: (row) => <span title={row.jobid}>{row.jobid}</span>,
            selector: (row) => row.jobid,
            sortable: true,
            width: "8%",
          },
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            cell: (row) => <span title={row.jobtitle}>{row?.jobtitle}</span>,
            selector: (row) => row.jobtitle,
            sortable: true,
            width: "34%",
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
            width: "10%",
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
        <RejectReasonModal
          isRMOpen={rejectReasonModal}
          callBack={(e) => submitReject(e)}
          callBackError={() => closeModal()}
          title={title}
        />
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
