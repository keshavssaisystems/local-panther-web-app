import React, { useState } from "react";
import { Card, CardBody } from "reactstrap";
import Slider from "react-slick";
import "./dashboard.scss";
import videoIcon from "assets/utils/images/camera-video-fill.svg";
import personIcon from "assets/utils/images/person-fill.svg";
import {
  getTimezoneDateTime,
  getVideoChannelId,
  USPhoneNumber,
} from "_helpers/helper";
import moment from "moment-timezone";
import {
  BsFillTelephoneFill,
  BsCalendar2WeekFill,
  BsClockFill,
} from "react-icons/bs";
import SweetAlert from "react-bootstrap-sweetalert";
import { useNavigate } from "react-router-dom";

export function CustomerSlider({ data }) {
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
      data?.jobtitle,
      data?.jobid,
      data?.scheduleinterviewid
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
      <div className="customer-slider">
        <div className=" mb-2 main-title">
          <i className="lnr-calendar-full"></i> {"  "}Upcoming interviews
        </div>
      </div>
      <Card className="mb-3 customer-slider">
        <CardBody>
          <Slider {...settings}>
            {data?.map((options) => (
              <div>
                <div className="card ms-2 me-2 widget-content bg-upcoming">
                  <div className="widget-content-wrapper text-white">
                    <div className="widget-content-left">
                      <div className="widget-heading">{options.jobtitle}</div>
                      <div className="widget-name">
                        {options.candidatename} ({options.meetingstatus})
                      </div>
                      <div className="widget-date">
                        <BsCalendar2WeekFill className="mb-1" /> {"  "}
                        {getTimezoneDateTime(
                          moment(options.scheduledate).format("YYYY-MM-DD") +
                            "T" +
                            options.starttime,
                          "MM/DD/YYYY"
                        )}
                      </div>
                    </div>
                    <div className="widget-content-right">
                      <div>
                        {options.format === "Video" ? (
                          <div
                            className="ellipse d-flex justify-content-center align-items-center float-end mb-2"
                            onClick={() => checkInterview("video", options)}
                          >
                            <img src={videoIcon} alt="interview-icon" />
                          </div>
                        ) : options.format === "In-person" ? (
                          <>
                            <div
                              className="ellipse d-flex justify-content-center align-items-center float-end mb-2"
                              onClick={() =>
                                checkInterview("in-person", options)
                              }
                            >
                              <img src={personIcon} alt="interview-icon" />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="ellipse d-flex justify-content-center align-items-center float-end mb-2">
                              <BsFillTelephoneFill
                                onClick={() => checkInterview("phone", options)}
                                style={{ cursor: "pointer", color: "#000000" }}
                                className="header-icon icon-gradient bg-amy-crisp"
                              />
                            </div>
                          </>
                        )}
                      </div>
                      <div className="widget-time float-end">
                        <BsClockFill className="mb-1" /> {"  "}
                        {getTimezoneDateTime(
                          moment(options.scheduledate).format("YYYY-MM-DD") +
                            "T" +
                            options.starttime,
                          "h:mm A"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
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
