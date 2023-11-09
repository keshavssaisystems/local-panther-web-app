import React, { useState } from "react";
import { Card, CardBody, CardHeader, NavLink } from "reactstrap";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import DataTable from "react-data-table-component";
import moment from "moment-timezone";
import "./dashboard.scss";
import {
  getTimezoneDateTime,
  calculateEndTime,
  getVideoChannelId,
} from "_helpers/helper";
import videoIcon from "assets/utils/images/camera-video-fill.svg";
import personIcon from "assets/utils/images/person-fill.svg";
import { BsFillTelephoneFill } from "react-icons/bs";
import SweetAlert from "react-bootstrap-sweetalert";

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
      name: "mode",
      cell: (row) => (
        <>
          <div className="d-block w-100 ">
            {row.format === "Video" || row.format === "In-person" ? (
              <div
                className="ellipse d-flex justify-content-center align-items-center"
                onClick={() => checkInterview("video", row)}
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
    const [year, month, day] = data.scheduledate.split("-").map(Number);
    const [hours, minutes, seconds] = data.starttime.split(":").map(Number);

    let endTime = calculateEndTime(data.starttime, data.duration);
    let end_date = year + "-" + (month - 1) + "-" + day + " " + endTime;

    let endDate = new Date(end_date);

    // Create a Date object using the parsed values
    const targetDate = new Date(year, month - 1, day, hours, minutes, seconds); // Note: Months are 0-based (0 = January, 1 = February, etc.)
    let id = getVideoChannelId(
      data?.jobtitle,
      data?.jobid,
      data?.scheduleinterviewid
    );

    if (targetDate === new Date()) {
      if (mode === "phone") {
        showSweetAlert({
          title: `Interview started, please join on phone - ${data.phonenumber}`,
          type: "success",
        });
      } else {
        if (data.isappvideocall) {
          setLink(id);
          setAppShowInterview(true);
        } else {
          setLink(data.videolink);
          setShowInterview(true);
        }
      }
    } else if (targetDate > new Date()) {
      showSweetAlert({
        title: "Interview not started yet!!",
        type: "warning",
      });
    } else if (targetDate < new Date()) {
      if (endDate < new Date()) {
        showSweetAlert({
          title: "Interview is completed !!",
          type: "error",
        });
      } else {
        if (mode === "phone") {
          showSweetAlert({
            title: `Interview started, please join on phone - ${data.phonenumber}`,
            type: "success",
          });
        } else {
          if (data.isappvideocall) {
            setLink(id);
            setAppShowInterview(true);
          } else {
            setLink(data.videolink);
            setShowInterview(true);
          }
        }
      }
    }
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
            showCancel
            showConfirm={false}
            showClose
          >
            <NavLink to={`/video-screen/${link}`} exact>
              Click here to join
            </NavLink>
          </SweetAlert>
        )}
      </div>
      <div>
        {showInterview && (
          <SweetAlert
            title="Interview started"
            onCancel={() => setShowInterview(false)}
            type="success"
            showCancel
            showConfirm={false}
            showClose
          >
            <a href={link} target="_blank">
              click to join{" "}
            </a>
          </SweetAlert>
        )}
      </div>
    </>
  );
}
