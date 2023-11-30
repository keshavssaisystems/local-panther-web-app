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
  getLocationText,
  calculateEndTime,
  getTimezoneDateTime,
  getVideoChannelId,
} from "_helpers/helper";
import { history } from "_helpers";
import SweetAlert from "react-bootstrap-sweetalert";
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
import { customerCandidateListsActions } from "_store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment-timezone";
import { NavLink } from "react-router-dom";
import { USPhoneNumber } from "_helpers/helper";
import { useNavigate } from "react-router-dom";

export function UpcomingInterviews() {
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  const schedules = useSelector(
    (state) => state.candidateDashboard.dashboardGraphData
  );
  const [showInterviewDetails, setDetails] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [link, setLink] = useState("");
  const loader = useSelector(
    (state) => state.candidateDashboard.schedulesLoader
  );
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  let settings = {
    ...ToastContainer.defaultProps,
    transition: "bounce",
    type: "success",
    disableAutoClose: true,
  };
  const [showInterview, setShowInterview] = useState(false);
  const [appShowInterview, setAppShowInterview] = useState(false);

  const columns = [
    {
      name: "Job title",
      selector: (row) => <span title={row.jobtitle}>{row.jobtitle}</span>,
      sortable: false,
    },
    {
      name: "Job location",
      selector: (row) => (
        <span title={getLocationText(row)}>{getLocationText(row)}</span>
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
      selector: (row) =>
        getTimezoneDateTime(
          moment(row?.scheduledate).format("YYYY-MM-DD") + " " + row?.starttime,
          "MM/DD/YYYY"
        ),
      sortable: false,
    },
    {
      name: "Time",
      selector: (row) => (
        <span title={getStartTime(row)}>{getStartTime(row)}</span>
      ),
      sortable: false,
    },

    {
      name: "Mode",
      cell: (row) => <>{interviewMode(row)}</>,
      sortable: false,
      ignoreRowClick: true,
      button: false,
    },
    {
      name: "Actions",
      cell: (row) => <>{renderMenu(row)}</>,
      sortable: false,
      ignoreRowClick: true,
      button: true,
    },
  ];

  const getStartTime = function (interviewDetail) {
    let startTime = getTimezoneDateTime(
      moment(interviewDetail?.scheduledate).format("MMM D, YYYY") +
        " " +
        interviewDetail?.starttime,
      "hh:mm a"
    );
    let startDate =
      moment(interviewDetail?.scheduledate).format("MMM D, YYYY") +
      " " +
      startTime;
    let durationArr =
      interviewDetail?.duration !== undefined
        ? interviewDetail?.duration.split(" ")
        : [];
    let endTime = getTimezoneDateTime(
      moment(startDate).add(durationArr[0], "m"),
      "hh:mm a"
    );

    return startTime + " to " + endTime;
  };

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

  const onInterviewDetails = async (scheduleInterviewId) => {
    let res = await dispatch(
      customerCandidateListsActions.getScheduleIVList(scheduleInterviewId)
    );
    if (res.payload) {
      if (res?.payload?.data?.scheduledInterviewList.length > 0) {
        setPopupData(res?.payload?.data?.scheduledInterviewList[0]);
        setDetails(true);
      } else {
        showSweetAlert({
          title: "Something went wrong, please try again later",
          type: "error",
        });
      }
    } else {
      //do nothing
    }
  };

  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
  };

  const checkInterview = function (mode, data) {
    let id = getVideoChannelId(
      data?.jobid,
      data?.scheduleinterviewid,
      data?.candidateid
    );
    if (mode === "phone") {
      showSweetAlert({
        title: `Please wait, Interviewer will call you on phone - ${USPhoneNumber(
          data.phonenumber
        )}`,
        type: "success",
      });
    } else if (mode === "Video") {
      if (data.isappvideocall) {
        setLink(id);
        setAppShowInterview(true);
      } else {
        setLink(data.videolink);
        setShowInterview(true);
      }
    } else if (mode === "In-person") {
      showSweetAlert({
        title: `Scheduled at - ${
          data?.interviewaddress === undefined || data?.interviewaddress === ""
            ? "No address provided"
            : data?.interviewaddress
        }`,
        type: "success",
      });
    }
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const interviewMode = (row) => {
    return (
      <div className="d-block w-100 ">
        {row.format === "Video" || row.format === "In-person" ? (
          <div
            className="ellipse d-flex justify-content-center align-items-center"
            onClick={() => checkInterview(row.format, row)}
          >
            <img
              src={row.format === "Video" ? videoIcon : personIcon}
              alt="interview-icon"
            />
          </div>
        ) : (
          <>
            <div className="ellipse d-flex justify-content-center align-items-center">
              <BsFillTelephoneFill
                onClick={() => checkInterview("phone", row)}
                style={{ cursor: "pointer" }}
                className="header-icon icon-gradient bg-amy-crisp"
              />
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
              <span onClick={() => onInterviewDetails(row.scheduleinterviewid)}>
                Interview details
              </span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    );
  };
  const navigate = useNavigate();
  const navigateTo = (link) => {
    navigate(`/video-screen/${link}`);
  };
  const navigateToThirdPartyLink = (link) => {
    window.open(`${link}`, "_blank", "rel=noopener noreferrer");
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
          <div className="d-flex justify-content-center align-items-center loader">
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
      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>

      <div>
        {showInterview && (
          <SweetAlert
            title="Interview started"
            onCancel={() => setShowInterview(false)}
            type="success"
            showConfirm
            onConfirm={(e) => navigateToThirdPartyLink(link)}
            showCancel
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            cancelBtnText="Cancel"
            confirmBtnText="Join interview"
          >
            Click join interview button to proceed with third party link
          </SweetAlert>
        )}
      </div>

      <div>
        {appShowInterview && (
          <SweetAlert
            title="Interview started"
            onCancel={() => setAppShowInterview(false)}
            type="success"
            showConfirm
            onConfirm={(e) => navigateTo(link)}
            showCancel
            confirmBtnBsStyle="success"
            cancelBtnBsStyle="danger"
            cancelBtnText="Cancel"
            confirmBtnText="Join interview"
          >
            Click join interview button to proceed with in app interview
          </SweetAlert>
        )}
      </div>
    </>
  );
}
