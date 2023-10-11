import React, { useState } from "react";
import { Card, CardBody } from "reactstrap";
import "../../customer/scheduleInterview/scheduleInterview.scss";
import moment from "moment-timezone";
import videoIcon from "../../../assets/utils/images/camera-video-fill.svg";
import personIcon from "../../../assets/utils/images/person-fill.svg";
import linkIcon from "../../../assets/utils/images/link.png";
import copyLinkIcon from "../../../assets/utils/images/copy-link.png";
import { BsPersonVideo2, BsFillTelephoneFill, BsPinMap } from "react-icons/bs";

export function ScheduleDetails({ interviewDetail }) {
  const [isCopied, setIsCopied] = useState(false);
  let scheduled = moment(interviewDetail.scheduledate).format("MMM D, YYYY");
  let currentDay = moment().format("YYYY-MM-DD");
  let yesterdayDate = moment().subtract(1, "days").format("YYYY-MM-DD");
  let tomorrowDate = moment().add(1, "days").format("YYYY-MM-DD");
  let scheduledDate = moment(interviewDetail.scheduledate).format("YYYY-MM-DD");
  if (scheduledDate === currentDay) {
    scheduled = "Today";
  }
  if (scheduledDate === yesterdayDate) {
    scheduled = "Yesterday";
  }
  if (scheduledDate === tomorrowDate) {
    scheduled = "Tommorow";
  }

  let startTime = moment(
    moment(interviewDetail.scheduledate).format("MMM D, YYYY") +
      " " +
      interviewDetail.starttime
  )
    .tz("America/New_York")
    .format("hh:mm a");
  let startDate =
    moment(interviewDetail.scheduledate).format("MMM D, YYYY") +
    " " +
    startTime;
  let durationArr =
    interviewDetail.duration !== undefined
      ? interviewDetail.duration.split(" ")
      : [];
  let endTime = moment(startDate).add(durationArr[0], "m").format("hh:mm a");
  const handleCopyClick = async (data) => {
    try {
      await navigator.clipboard.writeText(data);
      setIsCopied(true);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  function addEllipsisAfter20Chars(inputString) {
    if (inputString.length <= 15) {
      return inputString; // Return the string as-is if it's 20 characters or shorter
    } else {
      // Use the slice method to extract the first 20 characters and add "..."
      return inputString.slice(0, 15) + "...";
    }
  }
  const getText = function (data) {
    let text = "";
    if (data.companyname != "") {
      text = data.companyname;
      if (data.cityname != "") {
        text += ", " + data.cityname;
      }
      if (data.statename != "") {
        text += ", " + data.statename;
      }
      if (data.countryname != "") {
        text += ", " + data.countryname;
      }
    } else if (data.cityname != "") {
      text = data.cityname;
      if (data.statename != "") {
        text += ", " + data.statename;
      }
      if (data.countryname != "") {
        text += ", " + data.countryname;
      }
    } else if (data.statename != "") {
      text = data.statename;
      if (data.countryname != "") {
        text += ", " + data.countryname;
      }
    } else if (data.countryname != "") {
      text = data.countryname;
    }
    return text;
  };

  return (
    <>
      <Card>
        <CardBody>
          <div className="m-1 p-1 candidate-schedule">
            <div className="mb-3">
              <span className="interview-details-title">
                {interviewDetail.jobtitle}
              </span>

              <span className="interview-details-label">
                {interviewDetail.companyname != "" ||
                interviewDetail.cityname != "" ||
                interviewDetail.statename != "" ||
                interviewDetail.countryname != "" ? (
                  <div className="mt-1" style={{ fontSize: "12px" }}>
                    {/* <BsPinMap className="personal-sec-icon me-2" /> */}
                    <i className="pe-7s-map-marker location-icon"> </i>
                    <span style={{ verticalAlign: "text-top" }}>
                      {getText(interviewDetail)}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </span>

              <div className="">
                <p className="mb-0 mt-2">
                  {startDate} to {endTime}
                </p>
              </div>
            </div>

            <div className="p-custom mb-3">
              <p className="mb-0 interview-details-label">Mode </p>
              <div>
                {interviewDetail?.format === "Video" && (
                  // <BsPersonVideo2 className="header-icon icon-gradient bg-amy-crisp" />
                  <img className="me-2" src={videoIcon} alt="video" />
                )}
                {interviewDetail?.format === "Phone" && (
                  <BsFillTelephoneFill className="header-icon icon-gradient bg-amy-crisp me-2" />
                )}
                {interviewDetail?.format === "In-person" && (
                  <img className="me-2" src={personIcon} alt="video" />
                )}
                <span style={{ verticalAlign: "middle" }}>
                  {interviewDetail?.format} Interview
                </span>
              </div>
            </div>
            <div className="p-custom mb-3">
              <p className="mb-0 interview-details-label">Interviewer </p>
              <div>
                <img className="me-2" src={personIcon} alt="personIcon" />
                <span style={{ verticalAlign: "middle" }}>
                  {interviewDetail.interviewername == ""
                    ? "No interviewer added"
                    : interviewDetail.interviewername}
                </span>
              </div>
            </div>
            {interviewDetail?.format === "Phone" && (
              <div className="p-custom">
                <p className="mb-0 interview-details-label">Phone no </p>
                <span>{interviewDetail.textremaindernumbers}</span>
              </div>
            )}
            {interviewDetail?.format === "In-person" && (
              <div className="p-custom">
                <p className="mb-0 interview-details-label">
                  Mode Scheduled at
                </p>
                <span>{interviewDetail.interviewaddress}</span>
              </div>
            )}

            {interviewDetail.isappvideocall === true &&
              interviewDetail?.format === "Video" && (
                <div className="p-custom">
                  <p className="mb-0">
                    <a href="/" onClick={(e) => e.preventDefault()}>
                      Click here to join
                    </a>{" "}
                    the in-app interview
                  </p>
                </div>
              )}

            {interviewDetail?.isappvideocall === false &&
              interviewDetail?.format === "Video" && (
                <div>
                  {interviewDetail.videolink ? (
                    <div className="p-custom">
                      <p className="mb-0 interview-details-label">Link : </p>
                      <div>
                        <img
                          className="me-3 link-icon"
                          src={linkIcon}
                          alt="link-icon"
                        />
                        <a
                          className="me-2"
                          href={interviewDetail.videolink}
                          onClick={(e) => e.preventDefault()}
                        >
                          {addEllipsisAfter20Chars(interviewDetail.videolink)}
                        </a>
                        <span>
                          <img
                            onClick={() =>
                              handleCopyClick(interviewDetail.videolink)
                            }
                            src={copyLinkIcon}
                            className="copy-link-icon me-2"
                            alt="copy-link"
                          />
                          {isCopied && (
                            <span className="success-message">
                              Link copied!
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              )}
          </div>
        </CardBody>
      </Card>
    </>
  );
}
