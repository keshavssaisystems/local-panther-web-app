import React, { useState } from "react";
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
        title: `Scheduled at - ${
          data?.interviewaddress === undefined || data?.interviewaddress === ""
            ? "No address provided"
            : data?.interviewaddress
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
                            moment(options?.scheduledate).format("YYYY-MM-DD") +
                              "T" +
                              options?.starttime,
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
                            moment(options?.scheduledate).format("YYYY-MM-DD") +
                              "T" +
                              options?.starttime,
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
