import React, { useState } from "react";
import { Card, CardBody, CardHeader } from "reactstrap";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import DataTable from "react-data-table-component";
import moment from "moment-timezone";
import "./dashboard.scss";
import { getTimezoneDateTime, getVideoChannelId } from "_helpers/helper";
import videoIcon from "assets/utils/images/camera-video-fill.svg";
import personIcon from "assets/utils/images/person-fill.svg";
import { BsFillTelephoneFill } from "react-icons/bs";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import { USPhoneNumber } from "_helpers/helper";

export function UpcomingInterviewTable({ tableData }) {
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [link, setLink] = useState("");
  const [appShowInterview, setAppShowInterview] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const customStyles = {
    headRow: {
      style: {
        borderTopWidth: "0px",
      },
    },
    headCells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightWidth: "0px",
        },
        color: "#2F479B",
        fontFamily: "Capitana",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": {
          borderRightWidth: "0px",
          cursor: "pointer",
        },
      },
    },
  };
  const columns = (clickHandler) => [
    {
      name: "Candidate",
      selector: (row) => row.candidatename,
      sortable: true,
      width: "170px",
    },
    {
      name: "Job title",
      id: "jobtitle",
      selector: (row) => (row.jobtitle === "" ? "-" : row.jobtitle),
      sortable: true,
      width: "150px",
    },
    {
      name: "Date",
      sortable: true,
      width: "120px",
      selector: (row) =>
        getTimezoneDateTime(
          moment(row.scheduledate).format("YYYY-MM-DD") + "T" + row.starttime,
          "MM/DD/YYYY"
        ),
    },
    {
      name: "Time",
      sortable: true,
      width: "100px",
      selector: (row) =>
        getTimezoneDateTime(
          moment(row.scheduledate).format("YYYY-MM-DD") + "T" + row.starttime,
          "h:mm a"
        ),
    },
    {
      name: "Status",
      selector: (row) => (row.meetingstatus === "" ? "-" : row.meetingstatus),
      sortable: true,
    },
    {
      name: "Mode",
      cell: (row) => (
        <>
          <div className="d-block w-100 ">
            {row.format === "Video" ? (
              <div
                className="ellipse d-flex justify-content-center align-items-center"
                onClick={() => checkInterview("video", row)}
              >
                <img src={videoIcon} alt="interview-icon" />
              </div>
            ) : row.format === "In-person" ? (
              <>
                <div
                  className="ellipse d-flex justify-content-center align-items-center"
                  onClick={() => checkInterview("in-person", row)}
                >
                  <img src={personIcon} alt="interview-icon" />
                </div>
              </>
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
        </>
      ),
      sortable: true,
    },
  ];
  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const checkInterview = function (mode, data) {
    // let startDate = getTimezoneDateTime(
    //   moment(data.scheduledate).format("YYYY-MM-DD") + "T" + data.starttime,
    //   "MM/DD/YYYY HH:mm:ss"
    // );
    // let durationArr =
    //   data?.duration !== undefined ? data?.duration.split(" ") : [];
    // let endDateTime = getTimezoneDateTime(
    //   moment(startDate).add(durationArr[0], "m"),
    //   "MM/DD/YYYY HH:mm:ss"
    // );

    // let endDate = new Date(endDateTime);
    // Create a Date object using the parsed values
    // const targetDate = new Date(startDate);
    let id = getVideoChannelId(
      data?.jobid,
      data?.scheduleinterviewid,
      data?.candidateid
    );
    // if (targetDate === new Date()) {
    //   if (mode === "phone") {
    //     showSweetAlert({
    //       title: `Interview started, please join on phone - ${data.phonenumber}`,
    //       type: "success",
    //     });
    //   } else {
    //     if (data.isappvideocall) {
    //       setLink(id);
    //       setAppShowInterview(true);
    //     } else {
    //       setLink(data.videolink);
    //       setShowInterview(true);
    //     }
    //   }
    // } else if (targetDate > new Date()) {
    //   showSweetAlert({
    //     title: "Interview not started yet!!",
    //     type: "warning",
    //   });
    // } else if (targetDate < new Date()) {
    //   if (endDate < new Date()) {
    //     showSweetAlert({
    //       title: "Interview is completed !!",
    //       type: "error",
    //     });
    //   } else {
    if (mode === "phone") {
      showSweetAlert({
        title: `Please join the interview on phone - ${USPhoneNumber(
          data.phonenumber
        )}`,
        type: "success",
      });
    }
    if (mode === "in-person") {
      showSweetAlert({
        title: `Scheduled at - ${
          data?.interviewaaddress === undefined ||
          data?.interviewaaddress === ""
            ? "No address provided"
            : data?.interviewaaddress
        }`,
        type: "success",
      });
    }
    if (mode === "video") {
      if (data.isappvideocall) {
        setLink(id);
        setAppShowInterview(true);
      } else {
        setLink(data.videolink);
        setShowInterview(true);
      }
    }
    //   }
    // }
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
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
      <Card className="mb-3 chart-fixed-height">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-lg text-capitalize fw-normal">
            <BsFillCalendarWeekFill className="me-1" />
            Upcoming interviews
          </div>
        </CardHeader>
        <CardBody className="pt-0 overflow-auto">
          <DataTable
            columns={columns()}
            data={tableData}
            persistTableHead
            customStyles={customStyles}
            pagination
            className="mt-2"
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15, 20, 25, 50, 100]}
          />
        </CardBody>
      </Card>
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
      <SweetAlert
        title={showAlert.title}
        show={showAlert.show}
        type={showAlert.type}
        onConfirm={() => closeSweetAlert()}
      />
      {showAlert.description}
    </>
  );
}
