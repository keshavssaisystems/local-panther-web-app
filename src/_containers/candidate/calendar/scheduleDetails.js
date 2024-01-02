import React from "react";
import { CardHeader, Card, CardBody } from "reactstrap";
import "../../customer/scheduleInterview/scheduleInterview.scss";
import moment from "moment-timezone";
import { BsFillTelephoneFill } from "react-icons/bs";
import { getTimezoneDateTime } from "_helpers/helper";
import { NavLink } from "react-router-dom";
import { getVideoChannelId } from "_helpers/helper";
import { BsPersonVideo2, BsPerson } from "react-icons/bs";
import { USPhoneNumber } from "_helpers/helper";
import { useSelector } from "react-redux";

export function ScheduleDetails({ interviewDetail, onClose, isAdmin = false }) {
  const interviewGuideLink = useSelector(
    (state) => state.scheduleInterview?.interviewGuideList
  );
  let scheduled = getTimezoneDateTime(
    moment(interviewDetail?.scheduledate).format("YYYY-MM-DD") +
      " " +
      interviewDetail?.starttime,
    "MM/DD/YYYY"
  );

  let id = getVideoChannelId(
    interviewDetail?.jobid,
    interviewDetail?.scheduleinterviewid,
    interviewDetail?.candidateid
  );
  let currentDay = getTimezoneDateTime(moment(), "YYYY-MM-DD");
  let yesterdayDate = getTimezoneDateTime(
    moment().subtract(1, "days").format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  let tomorrowDate = getTimezoneDateTime(
    moment().add(1, "days").format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  let scheduledDate = getTimezoneDateTime(
    moment(interviewDetail?.scheduledate).format("YYYY-MM-DD") +
      " " +
      interviewDetail?.starttime,
    "YYYY-MM-DD"
  );
  if (scheduledDate === currentDay) {
    scheduled = "Today";
  }
  if (scheduledDate === yesterdayDate) {
    scheduled = "Yesterday";
  }
  if (scheduledDate === tomorrowDate) {
    scheduled = "Tommorow";
  }
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
  const getText = function (data) {
    let text = "";
    if (data.companyname !== "") {
      text = data.companyname;
      if (data.cityname !== "") {
        text += ", " + data.cityname;
      }
      if (data.statename !== "") {
        text += ", " + data.statename;
      }
      if (data.countryname !== "") {
        text += ", " + data.countryname;
      }
    } else if (data.cityname !== "") {
      text = data.cityname;
      if (data.statename !== "") {
        text += ", " + data.statename;
      }
      if (data.countryname !== "") {
        text += ", " + data.countryname;
      }
    } else if (data.statename !== "") {
      text = data.statename;
      if (data.countryname !== "") {
        text += ", " + data.countryname;
      }
    } else if (data.countryname !== "") {
      text = data.countryname;
    }
    return text;
  };

  return (
    <>
      <Card className="scheduled-interview">
        <CardBody>
          <div className="m-1 p-1 candidate-schedule">
            <div className="mb-3 ">
              <span className="interview-details-title">
                {interviewDetail.jobtitle}
              </span>

              <span className="interview-details-label">
                {interviewDetail.companyname !== "" ||
                interviewDetail.cityname !== "" ||
                interviewDetail.statename !== "" ||
                interviewDetail.countryname !== "" ? (
                  <div className="mt-1" style={{ fontSize: "12px" }}>
                    <i className="pe-7s-map-marker location-icon"> </i>
                    <span className="location-text">
                      {getText(interviewDetail)}
                    </span>
                  </div>
                ) : (
                  ""
                )}
              </span>
            </div>
            <Card className="mt-3">
              <CardHeader className="card-header-tab">
                <div className="card-header-title font-size-lg text-capitalize fw-normal">
                  {interviewDetail?.format === "Video" && (
                    <BsPersonVideo2 className="header-icon icon-gradient bg-amy-crisp" />
                  )}
                  {interviewDetail?.format === "Phone" && (
                    <BsFillTelephoneFill className="header-icon icon-gradient bg-amy-crisp" />
                  )}
                  {interviewDetail?.format === "In-person" && (
                    <BsPerson className="header-icon icon-gradient bg-amy-crisp" />
                  )}
                  {interviewDetail?.format} Interview
                </div>
              </CardHeader>
              <CardBody>
                <div>
                  <div className="btn-actions-pane-right text-capitalize actions-icon-btn float-end"></div>
                  <div className="p-custom">
                    <p className="mb-0">
                      <b>Interview status -</b>{" "}
                      {interviewDetail?.isreschedulerequested === true
                        ? "Requested for reschedule"
                        : interviewDetail?.interviewstatusid !== 0
                        ? interviewDetail?.interviewstatusid === 2
                          ? "Completed but candidate not joined"
                          : "Completed"
                        : interviewDetail?.isaccepted === true &&
                          interviewDetail?.isrejected === false
                        ? "Accepted"
                        : interviewDetail?.isrejected === true
                        ? "Rejected"
                        : "No response from candidate"}
                    </p>
                  </div>
                  {interviewDetail?.isreschedulerequested === false && (
                    <>
                      <div className="p-custom">
                        <p className="mb-0">
                          {scheduled} at {startTime} to {endTime} ({" "}
                          {interviewDetail.duration} )
                        </p>
                      </div>
                      {interviewDetail?.format === "Phone" && (
                        <div className="p-custom">
                          <p className="mb-0">
                            Phone no -{" "}
                            {interviewDetail.candidatephonenumber === undefined
                              ? ""
                              : USPhoneNumber(
                                  interviewDetail.candidatephonenumber
                                )}
                          </p>
                        </div>
                      )}
                      {interviewDetail?.format === "In-person" && (
                        <div className="p-custom">
                          <p className="mb-0">
                            Scheduled at {interviewDetail.interviewaddress}
                          </p>
                        </div>
                      )}
                      {!isAdmin ? (
                        <>
                          {" "}
                          {interviewDetail?.isappvideocall === false &&
                            interviewDetail?.format === "Video" &&
                            interviewDetail?.isactive === true &&
                            interviewDetail?.isrejected === false && (
                              <div className="p-custom">
                                <p className="mb-0">
                                  <a
                                    href={interviewDetail.videolink}
                                    target={"_blank"}
                                    rel="noreferrer"
                                  >
                                    Click here to join
                                  </a>{" "}
                                  the interview
                                </p>
                              </div>
                            )}
                          {interviewDetail.isappvideocall === true &&
                            interviewDetail?.format === "Video" &&
                            interviewDetail?.isactive === true &&
                            interviewDetail?.isrejected === false && (
                              <div className="p-custom">
                                <p className="mb-0">
                                  <a href="/">
                                    <NavLink to={`/video-screen/${id}`} exact>
                                      Click here to join
                                    </NavLink>
                                  </a>{" "}
                                  the in-app interview
                                </p>
                              </div>
                            )}
                        </>
                      ) : (
                        <></>
                      )}

                      {interviewDetail.messagetocandidate !== "" && (
                        <div className="p-custom">
                          <p className="mb-0">
                            <b>Note -</b>{" "}
                            {interviewDetail.messagetocandidate === ""
                              ? "-"
                              : interviewDetail.messagetocandidate}
                          </p>
                        </div>
                      )}
                    </>
                  )}

                  {!isAdmin ? (
                    <>
                      <div className="p-custom">
                        <p className="mb-0">
                          <b>Scheduled by -</b>{" "}
                          {interviewDetail.interviewername === ""
                            ? "No interviewer added"
                            : interviewDetail.interviewername}
                        </p>
                      </div>
                      <div className="p-custom">
                        <p className="mb-0">
                          <a
                            href={interviewGuideLink[0]?.name}
                            target={"_blank"}
                            rel="noreferrer"
                          >
                            Click here
                          </a>{" "}
                          to downlaod the interview guide.
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-custom">
                        <p className="mb-0">
                          <b>Interviewer -</b>{" "}
                          {interviewDetail.interviewername === ""
                            ? "No interviewer added"
                            : interviewDetail.interviewername}
                        </p>
                      </div>
                      <div className="p-custom">
                        <p className="mb-0">
                          <b>Candidate -</b>
                          {" " + interviewDetail?.candidatename}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
