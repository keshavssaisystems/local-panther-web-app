import React from "react";
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

import { BsCheckCircle } from "react-icons/bs";
import moment from "moment";
import customerIcons from "assets/utils/images/customer";
import { getTimezoneDateTime } from "_helpers/helper";

export const CandListView = (props) => {
  const onBtnClick = (type, candidaterecommendedjobid) => {
    props.onCandidateActions(type, candidaterecommendedjobid);
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
            title="maybe"
            className=" btn-icon"
            color="warning"
            onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_maybe} alt="list maybe"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Not Interested"
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
            title="apply"
            className="btn-icon"
            color="success"
            onClick={() => onBtnClick("applied", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_schedule} alt="list apply"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "maybe") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="liked"
            className=" btn-icon"
            color="primary"
            onClick={() => onBtnClick("liked", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_liked} alt="list like"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Not Interested"
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
            title="apply"
            className="btn-icon"
            color="success"
            onClick={() => onBtnClick("applied", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_schedule} alt="list apply"></img>
          </Button>
        </ButtonGroup>
      );
    } else if (props.type === "applied") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="liked"
            className=" btn-icon"
            color="primary"
            onClick={() => onBtnClick("liked", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_liked} alt="list like"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="maybe"
            className=" btn-icon"
            color="warning"
            onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_maybe} alt="list maybe"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="Not Interested"
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
          <Button
            // outline
            size="sm"
            title="liked"
            className=" btn-icon"
            color="primary"
            onClick={() => onBtnClick("liked", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_liked} alt="list like"></img>
          </Button>

          <Button
            // outline
            size="sm"
            title="maybe"
            className=" btn-icon"
            color="warning"
            onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_maybe} alt="list maybe"></img>
          </Button>
          {row?.scheduledInterviewDtos[0]?.isrejected === false &&
            row?.scheduledInterviewDtos[0]?.isactive === true && (
              <Button
                // outline
                size="sm"
                title="Reject interview"
                onClick={() =>
                  onBtnClick(
                    "rejectInterview",
                    row?.scheduledInterviewDtos[0]?.scheduleinterviewid
                  )
                }
                className="btn-icon"
                color="danger"
              >
                <img src={customerIcons?.list_reject} alt="list reject"></img>
              </Button>
            )}
          {row?.scheduledInterviewDtos[0]?.isaccepted === false &&
            row?.scheduledInterviewDtos[0]?.isactive === true && (
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
                <img src={customerIcons?.list_accept} alt="list accept"></img>
              </Button>
            )}
        </ButtonGroup>
      );
    } else if (props.type === "accepted") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="Not Interested"
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
    } else if (props.type === "notIntrested") {
      return (
        <ButtonGroup>
          <Button
            // outline
            size="sm"
            title="liked"
            className=" btn-icon"
            color="primary"
            onClick={() => onBtnClick("liked", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_liked} alt="list like"></img>
          </Button>
          <Button
            // outline
            size="sm"
            title="maybe"
            className=" btn-icon"
            color="warning"
            onClick={() => onBtnClick("maybe", row.candidaterecommendedjobid)}
          >
            <img src={customerIcons?.list_maybe} alt="list maybe"></img>
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

            {props.type === "interview" ? (
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
            selector: (row) => (
              <span className="table-cell" title={row.jobid}>
                {row.jobid}
              </span>
            ),
            sortable: true,
            width: "8%",
          },
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            selector: (row) => (
              <span className="table-cell" title={row.jobtitle}>
                {row.jobtitle}
              </span>
            ),
            sortable: true,
            width: "18%",
          },

          {
            name: <span className="table-title">Location</span>,
            selector: (row) => (
              <span
                className="table-cell"
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
            sortable: true,
            width: "15%",
          },

          {
            name: <span className="table-title">Experience</span>,
            selector: (row) => (
              <span
                className="table-cell"
                title={
                  row?.jobExperienceScheduleDtos &&
                  row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    : "-"
                }
              >
                <>
                  {row?.jobExperienceScheduleDtos &&
                  row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    : "-"}
                </>
              </span>
            ),
            sortable: true,
            width: "10%",
          },
          {
            name: <span className="table-title">Scheduled</span>,
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
            sortable: true,
            width: "17%",
          },
          {
            name: <span className="table-title">Interview Status</span>,
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
            selector: (row) => (
              <span className="table-cell" title={row.jobid}>
                {row.jobid}
              </span>
            ),
            sortable: true,
            width: "12%",
          },
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            selector: (row) => (
              <span className="table-cell" title={row.jobtitle}>
                {row.jobtitle}
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
            sortable: true,
            width: "15%",
          },

          {
            name: <span className="table-title">Experience</span>,
            selector: (row) => (
              <span
                className="table-cell"
                title={
                  row?.jobExperienceScheduleDtos &&
                  row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    : "-"
                }
              >
                <>
                  {row?.jobExperienceScheduleDtos &&
                  row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    : "-"}
                </>
              </span>
            ),
            sortable: true,
            width: "15%",
          },
          {
            name: <span className="table-title">Pre-screen</span>,
            cell: (row) =>
              row.candidateprescreenstatus === "Pending" ? (
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
            width: "13%",
          },
          {
            name: <span className="table-title">Action</span>,
            cell: (row) => <>{renderMenu(row)}</>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            width: "10%",
          },
        ]
      : [
          {
            name: <span className="table-title">Job Id</span>,
            id: "Job Id",
            selector: (row) => (
              <span className="table-cell" title={row.jobid}>
                {row.jobid}
              </span>
            ),
            sortable: true,
            width: "12%",
          },
          {
            name: <span className="table-title">Title</span>,
            id: "Title",
            selector: (row) => (
              <span className="table-cell" title={row.jobtitle}>
                {row.jobtitle}
              </span>
            ),
            sortable: true,
            width: "25%",
          },

          {
            name: <span className="table-title">Location</span>,
            selector: (row) => (
              <span
                className="table-cell"
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
            sortable: true,
            width: "15%",
          },

          {
            name: <span className="table-title">Experience</span>,
            selector: (row) => (
              <span
                className="table-cell"
                title={
                  row?.jobExperienceScheduleDtos &&
                  row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    : "-"
                }
              >
                <>
                  {row?.jobExperienceScheduleDtos &&
                  row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    ? row?.jobExperienceScheduleDtos[0]?.experiencelevel
                    : "-"}
                </>
              </span>
            ),
            sortable: true,
            width: "15%",
          },
          {
            name: <span className="table-title">Pre-screen</span>,
            cell: (row) =>
              row.candidateprescreenstatus === "Pending" ? (
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
    </>
  );
};
