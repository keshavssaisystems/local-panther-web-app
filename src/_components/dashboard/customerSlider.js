import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardBody, Row, Col } from "reactstrap";
import Slider from "react-slick";
import "./dashboard.scss";
import videoIcon from "assets/utils/images/interview-icons/video-join-icon.svg";
import personIcon from "assets/utils/images/interview-icons/person-join-icon.svg";
import telephoneIcon from "assets/utils/images/interview-icons/telephone-join-icon.svg";
import {
  getTimezoneDateTime,
  getVideoChannelId,
  USPhoneNumber,
} from "_helpers/helper";
import moment from "moment-timezone";
import { BsCalendar2WeekFill, BsClockFill } from "react-icons/bs";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";
import { NoDataFound } from "_components/common/nodatafound";
import custDashIcons from "assets/utils/images/customer/dashboard";

import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
export function CustomerSlider({ data }) {
  const dispatch = useDispatch();
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [link, setLink] = useState("");
  const [appShowInterview, setAppShowInterview] = useState(false);
  const [showInterview, setShowInterview] = useState(false);
  const settings = {
    className: "center",
    centerMode: false,
    infinite: true,
    centerPadding: "20px",
    slidesToShow: data?.length > 4 ? 4 : data?.length,
    speed: 500,
    dots: false,
  };
  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
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
        title: `Please join the interview on phone - ${USPhoneNumber(
          data.phonenumber
        )}`,
        type: "success",
      });
    }
    if (mode === "in-person") {
      showSweetAlert({
        title: `Scheduled at - ${data?.interviewaddress === undefined || data?.interviewaddress === ""
          ? "No address provided"
          : data?.interviewaddress
          }`,
        type: "success",
      });
    }
    if (mode === "video") {
      if (isBefore(data)) {
        dispatch(showSnackbar({
          message: "You can join the interview before 15 minutes of the scheduled time.",
          type: SNACKBAR_TYPES.WARNING,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 2000,
          maxWidth: 500,
        }));
        return;
      }

      if (isAfter(data)) {
        dispatch(showSnackbar({
          message: "You can not join the interview after the scheduled time.",
          type: SNACKBAR_TYPES.WARNING,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 2000,
          maxWidth: 500,
        }));
        return;
      }

      if (data.isappvideocall) {


        navigateTo(id);
        // setLink(id);
        // setAppShowInterview(true);
      } else {
        setLink(data.videolink);
        setShowInterview(true);
      }
    }
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
    window.open(`/video-screen/${link}`, "_blank");
    // navigate(`/video-screen/${link}`);
  };
  const navigateToThirdPartyLink = (link) => {
    window.open(`${link}`, "_blank", "rel=noopener noreferrer");
  };



  const isBefore = (options) => {
    let scheduledTime = getTimezoneDateTime(moment(options?.scheduledate.slice(0, 11) + options?.starttime).format("YYYY-MM-DD HH:mm:ss"), "MM/DD/YYYY HH:mm:ss");

    let startTime = getTimezoneDateTime(moment(options?.scheduledate).format("MMM D, YYYY") + " " + options?.starttime, "hh:mm A");
    let startDate = moment(options?.scheduledate).format("MMM D, YYYY") + " " + startTime; let durationArr = options?.duration !== undefined ? options?.duration.split(" ") : [];

    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let minutes = moment(scheduledTime).diff(now, "minutes");

    return (!(minutes <= 15));
  };

  const isAfter = (options) => {

    let durationArr = options?.duration !== undefined ? options?.duration.split(" ") : [];
    let endTime = getTimezoneDateTime(moment(options?.scheduledate.slice(0, 11) + options?.starttime).add(durationArr[0], "m").format("YYYY-MM-DD HH:mm:ss"), "MM/DD/YYYY HH:mm:ss");

    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");

    let revminutes = moment(now).diff(endTime, "minutes");

    return (!(revminutes <= 0));
  };




  const isPast = (options) => {
    let scheduledTime = getTimezoneDateTime(
      moment(
        options?.scheduledate.slice(0, 11) + options?.starttime
      ).format("YYYY-MM-DD HH:mm:ss"),

      "MM/DD/YYYY HH:mm:ss"
    );

    let startTime = getTimezoneDateTime(
      moment(options?.scheduledate).format("MMM D, YYYY") +
      " " +
      options?.starttime,
      "hh:mm A"
    );
    let startDate =
      moment(options?.scheduledate).format("MMM D, YYYY") +
      " " +
      startTime;
    let durationArr =
      options?.duration !== undefined
        ? options?.duration.split(" ")
        : [];
    let endTime = getTimezoneDateTime(
      moment(
        options?.scheduledate.slice(0, 11) + options?.starttime
      ).add(durationArr[0], "m").format("YYYY-MM-DD HH:mm:ss"),
      "MM/DD/YYYY HH:mm:ss"
    );


    console.log("scheduledTime", endTime);
    let now = moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
    let minutes = moment(scheduledTime).diff(now, "minutes");
    let revminutes = moment(now).diff(endTime, "minutes");

    return (!(revminutes < 0 && minutes < 15));
  };

  return (
    <>
      <div className="customer-slider">
        <div className=" mb-2 main-title">
          <img
            src={custDashIcons.upcomint}
            width={16}
            height={16}
            alt="stat icon"
          />{" "}
          {"  "}Upcoming Interviews
        </div>
      </div>
      <Card className="mb-3 customer-slider">
        <CardBody>
          {data?.length > 0 && (
            <Slider {...settings}>
              {data?.map((options) => (
                <div>
                  <div className="card ms-2 me-2 widget-content bg-upcoming">
                    <div className="widget-content-wrapper text-white">
                      <div className="widget-content-left">
                        <div
                          className="widget-heading"
                          title={options.jobtitle}
                        >
                          {options?.jobtitle.length > 25
                            ? options?.jobtitle.slice(0, 25) + "..."
                            : options?.jobtitle}
                        </div>
                        <div className="widget-name">
                          {options?.candidatename} ({options?.meetingstatus})
                        </div>
                        <div className="widget-date">
                          <BsCalendar2WeekFill className="mb-1" /> {"  "}
                          {getTimezoneDateTime(
                            moment(
                              options.scheduledate.slice(0, 11) +
                              options.starttime
                            ).format("YYYY-MM-DD HH:mm:ss"),
                            "MM/DD/YYYY"
                          )}
                        </div>
                      </div>
                      <div className="widget-content-right">
                        <div>
                          {options?.format === "Video" ? (
                            <img
                              src={videoIcon}
                              alt="interview-icon"
                              onClick={() => checkInterview("video", options)}
                              className="float-end join-icon"
                            />
                          ) : options?.format === "In-person" ? (
                            <>
                              <img
                                src={personIcon}
                                alt="interview-icon"
                                onClick={() =>
                                  checkInterview("in-person", options)
                                }
                                className="float-end join-icon"
                              />
                            </>
                          ) : (
                            <>
                              <img
                                src={telephoneIcon}
                                alt="interview-icon"
                                onClick={() => checkInterview("phone", options)}
                                className="float-end join-icon"
                              />
                            </>
                          )}
                        </div>
                        <div className="widget-time float-end">
                          <BsClockFill className="mb-1" /> {"  "}
                          {getTimezoneDateTime(
                            moment(
                              options.scheduledate.slice(0, 11) +
                              options.starttime
                            ).format("YYYY-MM-DD HH:mm:ss"),
                            "h:mm A"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          )}
          {data?.length === 0 && (
            <>
              <Row
                style={{ textAlign: "center" }}
                className="center-middle-align"
              >
                <Col>
                  <NoDataFound></NoDataFound>
                </Col>
              </Row>
            </>
          )}
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
