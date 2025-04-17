import React, { useState } from "react";
import {
  CardHeader,
  Card,
  CardBody,
  ButtonGroup,
  Button,
  Row,
  Col,
} from "reactstrap";
import "../../customer/scheduleInterview/scheduleInterview.scss";
import moment from "moment-timezone";
import { BsFillTelephoneFill } from "react-icons/bs";
import { getTimezoneDateTime } from "_helpers/helper";
import { NavLink } from "react-router-dom";
import { getVideoChannelId } from "_helpers/helper";
import { BsPersonVideo2, BsPerson } from "react-icons/bs";
import { USPhoneNumber } from "_helpers/helper";
import { useSelector, useDispatch } from "react-redux";
import customerIcons from "assets/utils/images/customer";
import { DeactivateReasonModal } from "_components/modal/deactivateReason";
import { scheduleInterviewActions, candidateListActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";

export function ScheduleDetails({
  interviewDetail,
  onClose,
  closeModaBox,
  isAdmin = false,
}) {
  const dispatch = useDispatch();
  const interviewGuideLink = useSelector(
    (state) => state.scheduleInterview?.interviewGuideList
  );
  let scheduled = getTimezoneDateTime(
    moment(
      interviewDetail?.scheduledate.slice(0, 11) + interviewDetail.starttime
    ).format("YYYY-MM-DD HH:mm:ss"),

    "MM/DD/YYYY"
  );

  let id = getVideoChannelId(
    interviewDetail?.jobid,
    interviewDetail?.scheduleinterviewid,
    interviewDetail?.candidateid
  );
  let currentDay = getTimezoneDateTime(moment());
  let yesterdayDate = getTimezoneDateTime(
    moment().subtract(1, "days"),
    "YYYY-MM-DD"
  );
  let tomorrowDate = getTimezoneDateTime(moment().add(1, "days"), "YYYY-MM-DD");
  let scheduledDate = getTimezoneDateTime(
    moment(
      interviewDetail?.scheduledate.slice(0, 11) + interviewDetail?.starttime
    ).format("YYYY-MM-DD HH:mm:ss"),
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
    moment(
      interviewDetail?.scheduledate.slice(0, 11) + interviewDetail?.starttime
    ).format("YYYY-MM-DD HH:mm:ss"),

    "hh:mm A"
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
    "hh:mm A"
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
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const [candidaterecommendedjobid, setRecommendedJobId] = useState(0);
  const [rejectType, setRejectType] = useState("");
  const [title, setTitle] = useState("");
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const rejectReason = (rejectTitle, type, candidaterecommendedjobid) => {
    setTitle(rejectTitle);
    setRejectType(type);
    setRecommendedJobId(candidaterecommendedjobid);
    setRejectReasonModal(true);
  };
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleId, setRescheduleId] = useState("");
  const submitReject = async (comment) => {
    setRejectReasonModal(false);
    onBtnClick(rejectType, candidaterecommendedjobid, comment);
  };
  const onBtnClick = async (type, candidaterecommendedjobid, reason) => {
    if (type === "acceptInterview") {
      let res = await dispatch(
        scheduleInterviewActions.acceptInterviewThunk({
          scheduleinterviewid: candidaterecommendedjobid,
        })
      );
      if (res.payload.statusCode === 204) {
        showSweetAlert({ title: res.payload.message, type: "success" });
      } else {
        showSweetAlert({
          title: res.payload.message || res.payload.status,
          type: "danger",
        });
      }
      closeModal();
    }
    if (type === "rejectInterview") {
      let payload = {
        rejectionreason: reason,
      };
      let res = await dispatch(
        scheduleInterviewActions.rejectInterviewThunk({
          scheduleinterviewid: candidaterecommendedjobid,
          payload: payload,
        })
      );
      if (res.payload.statusCode === 204) {
        showSweetAlert({ title: res.payload.message, type: "success" });
      } else {
        showSweetAlert({
          title: res.payload.message || res.payload.status,
          type: "danger",
        });
      }
      closeModal();
    }
    if (type === "rescheduleInterview") {
      setShowRescheduleModal(true);
      setRescheduleId(candidaterecommendedjobid);
    }
  };
  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
  };
  const closeModal = function () {
    setRejectReasonModal(false);
  };
  const onSendRescheduleData = async (data) => {
    let res = await dispatch(
      candidateListActions.updateRescheduleReason({
        scheduleinterviewid: rescheduleId,
        reschedulerequestedreason: data,
      })
    );
    if (res?.payload?.statusCode === 204) {
      setShowRescheduleModal(false);
      showSweetAlert({ title: res.payload.message, type: "success" });
    } else {
      showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
    closeModal();
  };
  return (
    <>
      <Card className="scheduled-interview">
        <CardBody>
          <div className="m-1 p-1 candidate-schedule">
            <Row>
              <Col md={8} lg={8}>
                {" "}
                <div>
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
              </Col>
              <Col md={4} lg={4}>
                <div className="align-right float-end">
                  <ButtonGroup size="sm">
                    {interviewDetail !== undefined &&
                    interviewDetail?.isactive === true ? (
                      <>
                        {interviewDetail?.isreschedulerequested === false && (
                          <>
                            {interviewDetail?.isrejected === false &&
                              interviewDetail?.interviewstatusid === 0 && (
                                <>
                                  <Button
                                    // outline
                                    size="sm"
                                    title="Reject interview"
                                    onClick={() =>
                                      rejectReason(
                                        "interview reject",
                                        "rejectInterview",
                                        interviewDetail?.scheduleinterviewid
                                      )
                                    }
                                    className="btn-icon"
                                    color="danger"
                                  >
                                    <img
                                      src={customerIcons?.list_reject}
                                      alt="list reject"
                                    ></img>
                                  </Button>
                                  <Button
                                    // outline
                                    size="sm"
                                    title="Reschedule interview"
                                    onClick={() =>
                                      onBtnClick(
                                        "rescheduleInterview",
                                        interviewDetail?.scheduleinterviewid
                                      )
                                    }
                                    className="btn-icon"
                                    color="alternate"
                                  >
                                    <img
                                      src={customerIcons?.list_schedule}
                                      alt="list reschedule"
                                    ></img>
                                  </Button>
                                </>
                              )}
                            {interviewDetail?.isaccepted === false &&
                              interviewDetail?.isrejected === false &&
                              interviewDetail?.interviewstatusid === 0 && (
                                <Button
                                  size="sm"
                                  title="Accept interview"
                                  className="btn-icon"
                                  color="success"
                                  onClick={() =>
                                    onBtnClick(
                                      "acceptInterview",
                                      interviewDetail?.scheduleinterviewid
                                    )
                                  }
                                >
                                  <img
                                    src={customerIcons?.list_accept}
                                    alt="list accept"
                                  ></img>
                                </Button>
                              )}
                          </>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                  </ButtonGroup>
                </div>
              </Col>
            </Row>

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
                        : "You have not responded"}
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

                      {getTimezoneDateTime(
                        moment(
                          interviewDetail?.scheduledate.slice(0, 11) +
                            interviewDetail?.starttime
                        ).format("YYYY-MM-DD HH:mm:ss"),
                        "YYYY-MM-DD"
                      ) >=
                      getTimezoneDateTime(
                        moment().format("YYYY-MM-DD"),
                        "YYYY-MM-DD"
                      ) ? (
                        <>
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
                                        <NavLink
                                          to={`/video-screen/${id}`}
                                          target="_blank"
                                          exact
                                        >
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
      {rejectReasonModal && (
        <DeactivateReasonModal
          isRMOpen={rejectReasonModal}
          callBack={(e) => submitReject(e)}
          callBackError={() => closeModal()}
          title={title}
        ></DeactivateReasonModal>
      )}
      {showRescheduleModal ? (
        <DeactivateReasonModal
          isRMOpen={showRescheduleModal}
          callBack={(data) => onSendRescheduleData(data)}
          callBackError={() => setShowRescheduleModal()}
          title={"rescheduling"}
        ></DeactivateReasonModal>
      ) : (
        <></>
      )}
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
    </>
  );
}
