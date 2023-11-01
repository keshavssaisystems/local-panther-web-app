import React, { useState } from "react";
import {
  Card,
  CardFooter,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Pagination,
  PaginationItem,
  PaginationLink,
  Row,
  Col,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
  formatDate,
  convertTo12HourFormat,
  getEducText,
  calculateEndTime,
} from "_helpers/helper";
import { history } from "_helpers";
import DataTable from "react-data-table-component";
import scheduleIcon from "../../../assets/utils/images/upcoming-interview.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import videoIcon from "../../../assets/utils/images/camera-video-fill.svg";
import personIcon from "../../../assets/utils/images/person-fill.svg";
import { BsFillTelephoneFill } from "react-icons/bs";
import { InterViewDetailModal } from "../../../_components/modal/interviewdetailmodal";
import { NoDataFound } from "_components/common/nodatafound";
import Loader from "react-loaders";

export function UpcomingInterviews() {
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const schedules = useSelector(
    (state) => state.candidateDashboard.dashboardGraphData
  );
  const [showInterviewDetails, setDetails] = useState(false);
  const [popupData, setPopupData] = useState({});
  const loader = useSelector(
    (state) => state.candidateDashboard.schedulesLoader
  );

  const columns = [
    {
      name: "Job title",
      selector: (row) => <span title={row.jobtitle}>{row.jobtitle}</span>,
      sortable: false,
    },
    {
      name: "Job location",
      selector: (row) => (
        <span title={getEducText(row)}>{getEducText(row)}</span>
      ),
      sortable: false,
    },
    {
      name: "Company",
      selector: (row) => <span title={row.companyname}>{row.companyname}</span>,
      sortable: false,
    },
    {
      name: "Scheduled date",
      selector: (row) => (
        <span title={formatDate(row.scheduledate)}>
          {formatDate(row.scheduledate)}
        </span>
      ),
      sortable: false,
    },
    {
      name: "Time",
      selector: (row) => (
        <span title={convertTo12HourFormat(row.starttime)}>
          {convertTo12HourFormat(row.starttime)}
        </span>
      ),
      sortable: false,
    },

    {
      name: "Mode",
      cell: (row) => <>{interviewMode("Video")}</>,
      sortable: false,
      ignoreRowClick: true,
      button: false,
    },
    {
      name: "Actions",
      cell: (row) => <>{renderMenu(row.jobid)}</>,
      sortable: false,
      ignoreRowClick: true,
      button: true,
    },
  ];

  const totalRecords = useSelector(
    (state) => state.candidateDashboard?.dashboardGraphData?.length
  );

  const handlePageChange = (page) => {
    setPageNo(page);
  };

  const renderPaginationItems = () => {
    const items = [];

    for (let page = 1; page <= Math.round(totalRecords / 5); page++) {
      if (page <= 3 || page > Math.round(totalRecords / 5) - 3) {
        items.push(
          <PaginationItem
            className="middle-page"
            key={page}
            active={pageNo === page}
          >
            <PaginationLink onClick={() => handlePageChange(page)}>
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }
    return items;
  };

  const interviewMode = (interviewmode) => {
    return (
      <div className="d-block w-100 ">
        {interviewmode === "Video" || interviewmode === "In-person" ? (
          <div className="ellipse d-flex justify-content-center align-items-center">
            <img
              src={interviewmode === "Video" ? videoIcon : personIcon}
              alt="interview-icon"
            />
          </div>
        ) : (
          <>
            <div className="ellipse d-flex justify-content-center align-items-center">
              <BsFillTelephoneFill className="header-icon icon-gradient bg-amy-crisp" />
            </div>
          </>
        )}
      </div>
    );
  };

  const renderMenu = (row) => {
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
            <DropdownItem>
              <i className="dropdown-icon lnr-license"> </i>
              <span onClick={() => navigateToInterviews(row)}>
                Interview details
              </span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    );
  };

  const navigateToInterviews = function (data) {
    setPopupData(data);
    setDetails(true);
  };

  return (
    <>
      <Card className="card-hover-shadow-2x mb-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-md text-capitalize fw-bold">
            <img src={scheduleIcon} alt="schedule-img" className="me-2" />
            Upcoming Interviews
          </div>
        </CardHeader>

        {!loader ? (
          <div>
            {schedules?.length > 0 ? (
              <DataTable
                data={schedules ? schedules : []}
                columns={columns}
                fixedHeader
                fixedHeaderScrollHeight="390px"
              />
            ) : (
              <Row style={{ textAlign: "center" }}>
                <Col>
                  {" "}
                  <NoDataFound imageSize={"25px"} />
                </Col>
              </Row>
            )}
          </div>
        ) : (
          <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
            <Loader active={loader} type="line-scale-pulse-out-rapid" />
          </div>
        )}
        <CardFooter>
          {totalRecords > 0 ? (
            <div className="mt-2">
              {totalRecords > 5 ? (
                <Pagination className="float-end pagination-cont me-2">
                  <PaginationItem disabled={pageNo === 1}>
                    <PaginationLink
                      previous
                      onClick={() => handlePageChange(pageNo + 1)}
                    />
                  </PaginationItem>
                  {renderPaginationItems()}
                  <PaginationItem disabled={pageNo === totalRecords / 5}>
                    <PaginationLink
                      next
                      onClick={() => handlePageChange(pageNo + 1)}
                    />
                  </PaginationItem>
                </Pagination>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <></>
          )}
        </CardFooter>
      </Card>
      <>
        {showInterviewDetails ? (
          <>
            <InterViewDetailModal
              data={popupData}
              onClose={() => {
                setDetails(false);
              }}
              isOpen={showInterviewDetails}
            ></InterViewDetailModal>
          </>
        ) : (
          <></>
        )}
      </>
    </>
  );
}
