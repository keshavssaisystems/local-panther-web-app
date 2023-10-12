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
import "./scheduleInterview.scss";
import { ScheduleInterviewList } from "_components/scheduleInterview/scheduleInterviewList";
import { UpcomingCard } from "_components/scheduleInterview/upcomingCard";
import { UpcomingDetail } from "_components/scheduleInterview/upcomingDetail";
import { InterviewDetailsModal } from "_components/scheduleInterview/interviewDetailsModal";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import momentTimezone from "moment-timezone";
import { useSelector, useDispatch } from "react-redux";
import {
  customerCandidateListsActions,
  scheduleInterviewActions,
} from "_store";
import { Popup } from "_components/common/Popup";
import { UpdateScheduleInterviewModal } from "_components/scheduleInterview/updateScheduleInterviewModal";
import { msdummy } from "./msdummy";
// import { Providers } from "@microsoft/mgt-element";
// import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
// import { Login } from "@microsoft/mgt-react";

export function ScheduleInterview() {
  // Providers.globalProvider = new Msal2Provider({
  //   clientId: "48db530e-6da5-470b-8437-0f5c4f4919b2",
  //   scopes: ["Calendars.Read"],
  // });
  const [showPopup, setShowPopup] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(0);
  const onSelectClick = (evt) => {
    setSelectedJobId(evt.target.value);
    getCandidateList(
      evt.target.value,
      moment().format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("1", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
  };
  const dispatch = useDispatch();
  const getCandidateList = async function (selectedJobId, startdate, enddate) {
    await dispatch(
      scheduleInterviewActions.getScheduleInterviewThunk({
        selectedJobId,
        startdate,
        enddate,
      })
    );
  };
  useEffect(() => {
    getUpdatedScheduleList();
    dispatch(customerCandidateListsActions.getDrpDwnJobLists());
  }, []);
  const getUpdatedScheduleList = () => {
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
    dispatch(scheduleInterviewActions.getDurationThunk());
    dispatch(
      scheduleInterviewActions.getUpcomingInterviewListWOPaginationThunk({
        start: moment().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
        end: moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss"),
      })
    );
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
  const upcomingInterviewsWOPagination = useSelector(
    (state) =>
      state.scheduleInterview.upcomingInterviewWOPagination
        .scheduledInterviewList
  );
  const localizer = momentLocalizer(moment);
  let upData = [];
  if (
    upcomingInterviewsWOPagination !== undefined &&
    upcomingInterviewsWOPagination.length > 0
  ) {
    upcomingInterviewsWOPagination.forEach((upcomingInterview) => {
      let startDate = momentTimezone(
        moment(upcomingInterview.scheduledate).format("MMM D, YYYY") +
          " " +
          upcomingInterview.starttime
      )
        .tz("America/New_York")
        .format("YYYY-MM-DD HH:mm:ss");
      let durationArr =
        upcomingInterview.duration !== undefined
          ? upcomingInterview.duration.split(" ")
          : [];
      let endDate = moment(startDate)
        .add(durationArr[0], "m")
        .format("YYYY-MM-DD HH:mm:ss");
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
          upcomingInterview.isaccepted === true &&
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
    console.log(formData);
    updateScheduledInterview(formData);
  };
  const updateScheduledInterview = async function (formData) {
    let scheduleinterviewid = formData.scheduleinterviewid;
    setShowPopup(true);
    await dispatch(
      scheduleInterviewActions.updateScheduledInterviewThunk({
        scheduleinterviewid,
        formData,
      })
    );
    getCandidateList(
      selectedJobId,
      moment().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
      moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss")
    );
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
    });
    dispatch(
      scheduleInterviewActions.getUpcomingInterviewListWOPaginationThunk({
        start: moment().startOf("month").format("YYYY-MM-DDTHH:mm:ss"),
        end: moment().add("3", "months").format("YYYY-MM-DDTHH:mm:ss"),
      })
    );
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
      ? [upcomingInterviews.scheduledInterviewList[0]]
      : []
  );
  let selectedJobDetails =
    upcomingInterviews.scheduledInterviewList !== undefined &&
    upcomingInterviews.scheduledInterviewList.length > 0
      ? [upcomingInterviews.scheduledInterviewList[0]]
      : [];
  const getSelectedInterview = (scheduleinterviewid) => {
    selectedJobDetails = upcomingInterviews.scheduledInterviewList.filter(
      (element) => {
        return element.scheduleinterviewid === scheduleinterviewid;
      }
    );
    setSelectedJobData(selectedJobDetails);
    setSelectedClass(scheduleinterviewid);
  };

  const onPageChange = (page) => {
    let filterOnPageChange = {
      pageNo: page,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
    };
    getUpcomingData(filterOnPageChange);
  };
  const [openModal, setOpenModal] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [popupType, setPopupType] = useState("Video");
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
  };

  const cancelScheduleData = (cancelData) => {
    console.log(cancelData);
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
  };
  const [showEditScheduleModal, setShowEditScheduleModal] = useState(false);
  const editScheduledInterview = (editStatus) => {
    console.log(editStatus);
    setShowEditScheduleModal(editStatus);
  };

  const allInterview = useSelector(
    (state) => state.scheduleInterview.allInterview.scheduledInterviewList
  );
  let syncData = msdummy.value;
  let overallData = [];
  let availData = [];
  let msBlockData = [];
  if (syncData?.length > 0) {
    syncData.forEach((syncDataElement) => {
      let dynamicStartDate = moment().weekday(Number(0)).format("YYYY-MM-DD");
      let dynamicEndDate = moment().weekday(Number(6)).format("YYYY-MM-DD");
      if (
        dynamicStartDate <
          moment(syncDataElement.start.dateTime).format("YYYY-MM-DD") &&
        dynamicEndDate >
          moment(syncDataElement.start.dateTime).format("YYYY-MM-DD")
      ) {
        let startDate = momentTimezone(syncDataElement.start.dateTime)
          .tz("Etc/UTC")
          .format("YYYY-MM-DD HH:mm:ss");
        let endDate = momentTimezone(syncDataElement.end.dateTime)
          .tz("Etc/UTC")
          .format("YYYY-MM-DD HH:mm:ss");
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
  if (allInterview?.length > 0) {
    allInterview.forEach((blockedData) => {
      let dynamicStartDate = moment().weekday(Number(0)).format("YYYY-MM-DD");
      let dynamicEndDate = moment().weekday(Number(6)).format("YYYY-MM-DD");
      if (
        dynamicStartDate <
          moment(blockedData.scheduledate).format("YYYY-MM-DD") &&
        dynamicEndDate > moment(blockedData.scheduledate).format("YYYY-MM-DD")
      ) {
        let startDate = momentTimezone(
          moment(blockedData.scheduledate).format("MMM D, YYYY") +
            " " +
            blockedData.starttime
        )
          .tz("America/New_York")
          .format("YYYY-MM-DD HH:mm:ss");
        let durationArr =
          blockedData.duration !== undefined
            ? blockedData.duration.split(" ")
            : [];
        let endDate = moment(startDate)
          .add(durationArr[0], "m")
          .format("YYYY-MM-DD HH:mm:ss");
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
  console.log(overallData);

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
                      setShowPopup(false);
                    }}
                  >
                    Availabilty
                  </Button>
                  <Button
                    color={toggleVar === "upcoming" ? "success" : "primary"}
                    className={"btn-shadow"}
                    onClick={() => {
                      toggle("upcoming");
                      setShowPopup(false);
                    }}
                  >
                    Upcoming
                  </Button>
                  <Button
                    color={toggleVar === "calendar" ? "success" : "primary"}
                    className={"btn-shadow "}
                    onClick={() => {
                      toggle("calendar");
                      setShowPopup(false);
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
                        Select a job
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
              {/* {toggleVar === "availabilty" && (
                <Col
                  xs={12}
                  sm={12}
                  md={4}
                  lg={4}
                  xl={4}
                  className="mb-3 right-align"
                >
                  <Login>Sync with Microsoft</Login>
                </Col>
              )} */}
            </Row>

            {toggleVar === "availabilty" && (
              <Card>
                <CardBody className="scheduled-calender">
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
                <Col lg="4">
                  <UpcomingCard
                    upcomingList={upcomingInterviews.scheduledInterviewList}
                    selectedInterview={selectedClass}
                    getSelectedInterviewId={(e) => getSelectedInterview(e)}
                    totalRows={upcomingInterviews.totalRows}
                    pageSize={5}
                    page={page}
                    setPage={setPage}
                    onPageChange={onPageChange}
                  />
                </Col>
                <Col lg="8">
                  <UpcomingDetail
                    interviewDetails={
                      selectedJobData[0] === undefined
                        ? upcomingInterviews?.scheduledInterviewList[0]
                        : selectedJobData[0]
                    }
                    cancelScheduleData={(e) => cancelScheduleData(e)}
                    postNotesData={(e) => postNotesData(e)}
                    postInviteData={(e) => postInviteData(e)}
                  />
                </Col>
              </Row>
            )}
            {toggleVar === "calendar" && (
              <Card>
                <CardBody className="scheduled-calender">
                  <Calendar
                    localizer={localizer}
                    events={upData}
                    startAccessor="start"
                    endAccessor="end"
                    popup
                    eventPropGetter={(upData) => {
                      const backgroundColor = upData.color
                        ? upData.color
                        : "blue";
                      const fontSize = "0.8rem";
                      return { style: { backgroundColor, fontSize } };
                    }}
                    onSelectEvent={handleSelectEvent}
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
                    />
                  </CardBody>
                </Card>
                {showPopup === true && (
                  <Popup
                    type={"success"}
                    message={"Interview schedule updated"}
                    action={true}
                  />
                )}
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
    </>
  );
}
