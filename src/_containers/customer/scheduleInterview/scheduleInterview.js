import React, { useState, useEffect, useCallback } from "react";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import {
  Row,
  Col,
  Card,
  Container,
  ButtonGroup,
  Button,
  CardBody,
  Input,
} from "reactstrap";
import { NoDataFound } from "_components/common/nodatafound";
import "./scheduleInterview.scss";
import { ScheduleInterviewList } from "_components/scheduleInterview/scheduleInterviewList";
import { UpcomingCard } from "_components/scheduleInterview/upcomingCard";
import { UpcomingDetail } from "_components/scheduleInterview/upcomingDetail";
import { InterviewDetailsModal } from "_components/scheduleInterview/interviewDetailsModal";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import Loader from "react-loaders";
import {
  customerCandidateListsActions,
  scheduleInterviewActions,
  graphActions,
} from "_store";
import { UpdateScheduleInterviewModal } from "_components/scheduleInterview/updateScheduleInterviewModal";
import { getTimezoneDateTime } from "_helpers/helper";
import SweetAlert from "react-bootstrap-sweetalert";
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import { Login } from "@microsoft/mgt-react";

Providers.globalProvider = new Msal2Provider({
  clientId: process.env.REACT_APP_API_KEY,
  scopes: ["Calendars.Read"],
});

export function ScheduleInterview() {
  const dispatch = useDispatch();
  const localizer = momentLocalizer(moment);
  const [msLogin, setMsLogin] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(0);
  const [updateSuccessPopup, setUpdateSuccess] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [popupType, setPopupType] = useState("Video");
  const views = {
    month: true,
    week: true,
    day: true,
    agenda: true, // Add or modify views as needed
  };
  const messages = {
    agenda: "Schedule", // Change the label for Agenda to Schedule
  };
  useEffect(() => {
    getGraphData();
  }, [msLogin]);
  useEffect(() => {
    if (msLogin === true) {
      getGraphData();
    }
    getUpdatedScheduleList();
    dispatch(scheduleInterviewActions.getInterviewGuideListThunk());
    dispatch(customerCandidateListsActions.getDrpDwnJobLists());
  }, []);
  const onSelectClick = (evt) => {
    setSelectedJobId(evt.target.value);
    getCandidateList(
      evt.target.value,
      moment().format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("1", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };
  const getCandidateList = async function (selectedJobId, startdate, enddate) {
    await dispatch(
      scheduleInterviewActions.getScheduleInterviewThunk({
        selectedJobId,
        startdate,
        enddate,
      })
    );
  };

  const getGraphData = async function () {
    let startDate =
      moment().weekday(Number(0)).format("YYYY-MM-DD") + "T00:00:00Z";
    let endDate =
      moment().weekday(Number(6)).format("YYYY-MM-DD") + "T00:00:00Z";
    await dispatch(graphActions.getgraphThunk({ startDate, endDate }));
  };
  const microsoftCalenderData = useSelector((state) => state.graph.graph.value);

  const getUpdatedScheduleList = () => {
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
    dispatch(scheduleInterviewActions.getDurationThunk());
    dispatch(scheduleInterviewActions.getInterviewStatusDropDownThunk());
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
    });
    getCandidateList(
      selectedJobId,
      moment().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };
  const getUpcomingData = async function (filterdata) {
    await dispatch(
      scheduleInterviewActions.getUpcomingInterviewListThunk(filterdata)
    );
  };
  const candidateList = useSelector(
    (state) => state.scheduleInterview.scheduleInterview.scheduledInterviewList
  );

  const jobList = useSelector((state) => state.customerCandidateList.jobLists);
  const durationOptions = useSelector(
    (state) => state.scheduleInterview.duration
  );
  const upcomingInterviews = useSelector(
    (state) => state.scheduleInterview.upcomingInterview
  );
  const upcomingInterviewLoading = useSelector(
    (state) => state.scheduleInterview.upcomingInterviewLoading
  );
  const allInterviews = useSelector(
    (state) => state.scheduleInterview.allInterview.scheduledInterviewList
  );

  let upData = [];
  if (allInterviews !== undefined && allInterviews.length > 0) {
    allInterviews.forEach((upcomingInterview) => {
      let startDate = getTimezoneDateTime(
        moment(upcomingInterview.scheduledate).format("MMM D, YYYY") +
          " " +
          upcomingInterview.starttime,
        "YYYY-MM-DD HH:mm:ss"
      );
      let durationArr =
        upcomingInterview.duration !== undefined
          ? upcomingInterview.duration.split(" ")
          : [];
      let endDate = getTimezoneDateTime(
        moment(startDate).add(durationArr[0], "m"),
        "YYYY-MM-DD HH:mm:ss"
      );
      let interviewData = {
        id: upcomingInterview.scheduleinterviewid,
        data: upcomingInterview,
        format: upcomingInterview.format,
        title:
          upcomingInterview.candidatename +
          " (" +
          upcomingInterview.jobtitle +
          ")",
        start: new Date(startDate),
        end: new Date(endDate),
        color:
          upcomingInterview?.isreschedulerequested === true
            ? "#2f479b"
            : upcomingInterview?.interviewstatusid !== 0
            ? upcomingInterview?.interviewstatusid === 1
              ? "#30b1ff"
              : "#6c757d"
            : upcomingInterview.isaccepted === true &&
              upcomingInterview.isrejected === false
            ? "green"
            : upcomingInterview.isrejected === true
            ? "red"
            : "#f7b924",
      };
      upData.push(interviewData);
    });
  }
  const getFormData = (formData) => {
    updateScheduledInterview(formData);
  };
  const updateScheduledInterview = async function (formData) {
    let scheduleinterviewid = formData.scheduleinterviewid;
    await dispatch(
      scheduleInterviewActions.updateScheduledInterviewThunk({
        scheduleinterviewid,
        formData,
      })
    );
    setUpdateSuccess(true);
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
  };
  const [toggleVar, setToggleVar] = useState("availabilty");
  const toggle = (tab) => {
    if (toggleVar !== tab) {
      setToggleVar(tab);
    }
  };
  const [selectedClass, setSelectedClass] = useState(
    upcomingInterviews.scheduledInterviewList !== undefined &&
      upcomingInterviews.scheduledInterviewList.length > 0
      ? upcomingInterviews.scheduledInterviewList[0].scheduleinterviewid
      : null
  );
  const [selectedJobData, setSelectedJobData] = useState(
    upcomingInterviews.scheduledInterviewList !== undefined &&
      upcomingInterviews.scheduledInterviewList.length > 0
      ? upcomingInterviews.scheduledInterviewList[0]
      : []
  );
  let selectedJobDetails =
    upcomingInterviews.scheduledInterviewList !== undefined &&
    upcomingInterviews.scheduledInterviewList.length > 0
      ? upcomingInterviews.scheduledInterviewList[0]
      : [];
  const getSelectedInterview = (scheduleinterviewid) => {
    selectedJobDetails = upcomingInterviews.scheduledInterviewList.filter(
      (element) => {
        return element.scheduleinterviewid === scheduleinterviewid;
      }
    );
    setSelectedJobData(selectedJobDetails[0]);
    setSelectedClass(scheduleinterviewid);
  };

  const onPageChange = (page) => {
    let filterOnPageChange = {
      pageNo: page,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
    };
    getUpcomingData(filterOnPageChange);
    setSelectedJobData({});
  };

  const onCloseIdModal = () => {
    setOpenModal(false);
  };
  const handleSelectEvent = useCallback((event) => {
    setPopupData(event.data);
    setOpenModal(true);
    setPopupType(event.format);
  }, []);

  const postNotesData = (notesData) => {
    updateNotesData(notesData);
    getUpdatedScheduleList();
  };
  const updateNotesData = async function (notesdata) {
    let scheduleinterviewid = notesdata.scheduleinterviewid;
    await dispatch(
      scheduleInterviewActions.updateInterviewNotesThunk({
        scheduleinterviewid,
        notesdata,
      })
    );
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
    });
    getCandidateList(
      selectedJobId,
      moment().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };

  const postInviteData = (inviteData) => {
    updateInterviewerData(inviteData);
    getUpdatedScheduleList();
  };

  const updateInterviewerData = async function (invitedata) {
    let scheduleinterviewid = invitedata.scheduleinterviewid;
    await dispatch(
      scheduleInterviewActions.updateInterviewerListThunk({
        scheduleinterviewid,
        invitedata,
      })
    );
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
    });
    getCandidateList(
      selectedJobId,
      moment().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };

  const cancelScheduleData = (cancelData) => {
    cancelInterview(cancelData);
    getUpdatedScheduleList();
  };

  const cancelInterview = async function (cancelData) {
    let scheduleinterviewid = cancelData.scheduledInterviewId;
    let payload = {
      currentUserId: cancelData.currentUserId,
    };
    await dispatch(
      scheduleInterviewActions.cancelInterviewThunk({
        scheduleinterviewid,
        payload,
      })
    );
    onCloseIdModal();
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
    });
    getCandidateList(
      selectedJobId,
      moment().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const editScheduledInterview = (editStatus) => {
    setOpenModal(false);
    setShowEditScheduleModal(editStatus);
  };

  let weekfirstday = getTimezoneDateTime(
    moment().weekday(Number(0)).format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  let weeklastday = getTimezoneDateTime(
    moment().weekday(Number(6)).format("YYYY-MM-DD"),
    "YYYY-MM-DD"
  );
  const availableInterview = allInterviews?.filter(
    (value) =>
      value.scheduledate >= weekfirstday && value.scheduledate <= weeklastday
  );
  let syncData = microsoftCalenderData;
  let overallData = [];
  let availData = [];
  let msBlockData = [];
  if (syncData?.length > 0) {
    syncData.forEach((syncDataElement) => {
      if (
        weekfirstday <
          getTimezoneDateTime(
            moment(syncDataElement.start.dateTime).format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          ) &&
        weeklastday >
          getTimezoneDateTime(
            moment(syncDataElement.start.dateTime).format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          )
      ) {
        let startDate = getTimezoneDateTime(
          syncDataElement.start.dateTime,
          "YYYY-MM-DD HH:mm:ss"
        );
        let endDate = getTimezoneDateTime(
          syncDataElement.end.dateTime,
          "YYYY-MM-DD HH:mm:ss"
        );
        let interviewData = {
          id: syncDataElement.id,
          data: syncDataElement.location,
          format: "Video",
          title: "",
          start: new Date(startDate),
          end: new Date(endDate),
          color: "#2F479B",
        };
        msBlockData.push(interviewData);
      }
    });
  }
  if (availableInterview?.length > 0) {
    availableInterview.forEach((blockedData) => {
      if (
        weekfirstday <
          getTimezoneDateTime(
            moment(blockedData.scheduledate).format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          ) &&
        weeklastday >
          getTimezoneDateTime(
            moment(blockedData.scheduledate).format("YYYY-MM-DD"),
            "YYYY-MM-DD"
          )
      ) {
        let startDate = getTimezoneDateTime(
          moment(blockedData.scheduledate).format("MMM D, YYYY") +
            " " +
            blockedData.starttime,
          "YYYY-MM-DD HH:mm:ss"
        );
        let durationArr =
          blockedData.duration !== undefined
            ? blockedData.duration.split(" ")
            : [];
        let endDate = getTimezoneDateTime(
          moment(startDate).add(durationArr[0], "m"),
          "YYYY-MM-DD HH:mm:ss"
        );
        let interviewData = {
          id: blockedData.scheduleinterviewid,
          data: blockedData,
          format: blockedData.format,
          title: "",
          start: new Date(startDate),
          end: new Date(endDate),
          color: "#2F479B",
        };
        availData.push(interviewData);
      }
    });
  }
  overallData = availData.concat(msBlockData);

  const postMessageData = (formData) => {};
  const rejectScheduleData = (scheduledInterviewId) => {
    rejectInterview(scheduledInterviewId);
    getUpdatedScheduleList();
  };

  const rejectInterview = async function (scheduledInterviewId) {
    let scheduleinterviewid = scheduledInterviewId;
    let payload = {
      rejectionreason: "",
    };
    await dispatch(
      scheduleInterviewActions.rejectInterviewThunk({
        scheduleinterviewid,
        payload,
      })
    );
    onCloseIdModal();
  };
  const acceptScheduleData = (scheduledInterviewId) => {
    acceptInterview(scheduledInterviewId);
    getUpdatedScheduleList();
  };

  const acceptInterview = async function (scheduledInterviewId) {
    let scheduleinterviewid = scheduledInterviewId;
    await dispatch(
      scheduleInterviewActions.acceptInterviewThunk({
        scheduleinterviewid,
      })
    );
    onCloseIdModal();
  };
  const postFeedbackData = async (event) => {
    let scheduleinterviewid = event.scheduleinterviewid;
    let payload = event;
    await dispatch(
      scheduleInterviewActions.interviewFeedbackThunk({
        scheduleinterviewid,
        payload,
      })
    );
    await dispatch(
      scheduleInterviewActions.feedback({
        scheduleInterviewList: candidateList,
        upcomingInterviewList: upcomingInterviews?.scheduledInterviewList,
        allInterviewList: allInterviews,
        scheduleinterviewid: scheduleinterviewid,
        interviewstatusid: event.interviewstatusid,
        interviewfeedback: event.interviewfeedback,
      })
    );
  };
  return (
    <>
      <PageTitle heading="Interviews" icon={titlelogo} />
      <Container fluid className="card-schedule-interview">
        <Row>
          <Col md="12">
            <Row>
              <Col
                xs={12}
                sm={12}
                md={8}
                lg={8}
                xl={8}
                className="mb-3 tab-selection-text"
              >
                <ButtonGroup size="lg">
                  <Button
                    color={toggleVar === "availabilty" ? "success" : "primary"}
                    className={"btn-shadow "}
                    onClick={() => {
                      toggle("availabilty");
                    }}
                  >
                    Availabilty
                  </Button>
                  <Button
                    color={toggleVar === "upcoming" ? "success" : "primary"}
                    className={"btn-shadow"}
                    onClick={() => {
                      toggle("upcoming");
                    }}
                  >
                    Upcoming
                  </Button>
                  <Button
                    color={toggleVar === "calendar" ? "success" : "primary"}
                    className={"btn-shadow "}
                    onClick={() => {
                      toggle("calendar");
                    }}
                  >
                    Calendar
                  </Button>
                  <Button
                    color={toggleVar === "schedule" ? "success" : "primary"}
                    className={"btn-shadow "}
                    onClick={() => {
                      toggle("schedule");
                    }}
                  >
                    Schedule
                  </Button>
                </ButtonGroup>
              </Col>
              {toggleVar === "schedule" && (
                <Col
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  className="mb-3 right-align"
                >
                  {jobList !== undefined && jobList?.length > 0 ? (
                    <Input
                      value={selectedJobId}
                      onChange={(evt) => onSelectClick(evt)}
                      type="select"
                      id="customerJobList"
                      name="customerJobList"
                    >
                      <option key={0} value={0}>
                        All jobs
                      </option>
                      {jobList.map((data) => {
                        return (
                          <option value={data.jobid} key={data.jobid}>
                            {data.jobtitle +
                              ", " +
                              data?.cityname +
                              ", " +
                              data?.statename}
                          </option>
                        );
                      })}
                    </Input>
                  ) : (
                    <></>
                  )}
                </Col>
              )}
              {toggleVar === "availabilty" && (
                <Col
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  className="mb-3 right-align"
                >
                  <div>
                    <Row>
                      <Col md={7} className="mt-1 right-align">
                        <span className="right-align">
                          Connect microsoft calendar using
                        </span>
                      </Col>
                      <Col md={5}>
                        <div className="text-start">
                          <Login
                            loginCompleted={(e) => setMsLogin(true)}
                          ></Login>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              )}
            </Row>

            {toggleVar === "availabilty" && (
              <Card>
                <CardBody className="scheduled-calender">
                  <div className="text-end">
                    <div className="mb-3 me-1 badge badge-color-white">P</div>
                    Available{" "}
                    <div className="ms-3 mb-3 me-0 badge badge-color-blue">
                      P
                    </div>{" "}
                    Not available
                  </div>
                  <Calendar
                    defaultView="week"
                    localizer={localizer}
                    events={overallData}
                    startAccessor="start"
                    endAccessor="end"
                    popup
                    formats={{
                      dayFormat: "dddd",
                    }}
                    toolbar={false}
                    today={false}
                    views={{ week: true }}
                    // onSelectEvent={handleSelectEvent}
                    eventPropGetter={(overallData) => {
                      const backgroundColor = overallData.color
                        ? overallData.color
                        : "blue";
                      const borderColor = overallData.color
                        ? overallData.color
                        : "blue";
                      const fontSize = "0.8rem";
                      return {
                        style: { backgroundColor, fontSize, borderColor },
                      };
                    }}
                  />
                </CardBody>
              </Card>
            )}
            {toggleVar === "upcoming" && (
              <Row>
                {upcomingInterviewLoading === false ? (
                  <>
                    {upcomingInterviews.scheduledInterviewList.length > 0 ? (
                      <>
                        <Col md={4} lg="4">
                          <UpcomingCard
                            upcomingList={
                              upcomingInterviews.scheduledInterviewList
                            }
                            selectedInterview={selectedClass}
                            getSelectedInterviewId={(e) =>
                              getSelectedInterview(e)
                            }
                            totalRows={upcomingInterviews.totalRows}
                            pageSize={5}
                            page={page}
                            setPage={setPage}
                            onPageChange={onPageChange}
                          />
                        </Col>
                        <Col md={8} lg="8">
                          <UpcomingDetail
                            interviewDetails={
                              selectedJobData.scheduleinterviewid === undefined
                                ? upcomingInterviews?.scheduledInterviewList
                                    ?.length > 0
                                  ? upcomingInterviews
                                      ?.scheduledInterviewList[0]
                                  : []
                                : selectedJobData
                            }
                            cancelScheduleData={(e) => cancelScheduleData(e)}
                            postNotesData={(e) => postNotesData(e)}
                            postInviteData={(e) => postInviteData(e)}
                            acceptInterview={(e) => acceptScheduleData(e)}
                            rejectInterview={(e) => rejectScheduleData(e)}
                            getUpdatedFormData={(e) => getFormData(e)}
                            postFeedbackData={(e) => postFeedbackData(e)}
                          />
                        </Col>
                      </>
                    ) : (
                      <>
                        <Row
                          style={{ textAlign: "center", minHeight: "40vh" }}
                          className="center-middle-align"
                        >
                          <Col>
                            {" "}
                            <NoDataFound></NoDataFound>
                          </Col>
                        </Row>
                      </>
                    )}
                  </>
                ) : (
                  <Loader
                    type="line-scale-pulse-out-rapid"
                    className="d-flex justify-content-center"
                  />
                )}
              </Row>
            )}
            {toggleVar === "calendar" && (
              <Card>
                <CardBody className="scheduled-calender">
                  <div className="text-end">
                    <div className="mb-3 me-0 badge badge-color-yellow">P</div>{" "}
                    No response
                    <div className="ms-3 mb-3 me-1 badge badge-color-green">
                      P
                    </div>
                    Accepted interview{" "}
                    <div className="ms-3 mb-3 me-0 badge badge-color-red">
                      P
                    </div>{" "}
                    Rejected interview
                    <div className="ms-3 mb-3 me-0 badge badge-color-skyblue">
                      P
                    </div>{" "}
                    Interview completed
                    <div className="ms-3 mb-3 me-0 badge badge-color-grey">
                      P
                    </div>{" "}
                    Not joined
                    <div className="ms-3 mb-3 me-0 badge badge-color-darkblue">
                      P
                    </div>{" "}
                    Requested for reschedule
                  </div>
                  <Calendar
                    localizer={localizer}
                    events={upData}
                    startAccessor="start"
                    endAccessor="end"
                    eventPropGetter={(upData) => {
                      const backgroundColor = upData.color
                        ? upData.color
                        : "blue";
                      const fontSize = "0.8rem";
                      return { style: { backgroundColor, fontSize } };
                    }}
                    onSelectEvent={handleSelectEvent}
                    views={views}
                    messages={messages}
                  />
                </CardBody>
              </Card>
            )}
            {toggleVar === "schedule" && (
              <>
                <Card>
                  <CardBody>
                    <ScheduleInterviewList
                      candidateList={candidateList}
                      postNotesData={(e) => postNotesData(e)}
                      postInviteData={(e) => postInviteData(e)}
                      cancelScheduleData={(e) => cancelScheduleData(e)}
                      postMessageData={(e) => postMessageData(e)}
                      acceptInterview={(e) => acceptScheduleData(e)}
                      rejectInterview={(e) => rejectScheduleData(e)}
                      getUpdatedFormData={(e) => getFormData(e)}
                      postFeedbackData={(e) => postFeedbackData(e)}
                    />
                  </CardBody>
                </Card>
              </>
            )}
          </Col>
        </Row>
        <InterviewDetailsModal
          isOpen={openModal}
          type={popupType}
          onClose={() => onCloseIdModal()}
          interviewDetail={popupData}
          postNotesData={(e) => postNotesData(e)}
          postInviteData={(e) => postInviteData(e)}
          cancelScheduleData={(e) => cancelScheduleData(e)}
          editScheduledInterview={(e) => editScheduledInterview(e)}
          postMessageData={(e) => postMessageData(e)}
          acceptInterview={(e) => acceptScheduleData(e)}
          rejectInterview={(e) => rejectScheduleData(e)}
          postFeedbackData={(e) => postFeedbackData(e)}
        />
        <UpdateScheduleInterviewModal
          interviewData={popupData}
          durationOptions={durationOptions}
          postData={(e) => {
            getFormData(e);
          }}
          isOpen={showEditScheduleModal}
          onClose={() => setShowEditScheduleModal(false)}
        />
      </Container>
      {updateSuccessPopup === true && (
        <SweetAlert
          success
          title="Interview updated successfully!!!"
          onConfirm={(e) => setUpdateSuccess(false)}
        ></SweetAlert>
      )}
    </>
  );
}
