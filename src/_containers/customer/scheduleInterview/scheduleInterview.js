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
import moment from "moment-timezone";
import { useSelector, useDispatch } from "react-redux";
import {
  customerCandidateListsActions,
  scheduleInterviewActions,
} from "_store";
import { Popup } from "_components/common/Popup";

export function ScheduleInterview() {
  const [showPopup, setShowPopup] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(0);
  const onSelectClick = (evt) => {
    setSelectedJobId(evt.target.value);
    getCandidateList(evt.target.value);
  };
  const dispatch = useDispatch();
  const getCandidateList = async function (jobId) {
    await dispatch(scheduleInterviewActions.getScheduleInterviewThunk(jobId));
  };
  useEffect(() => {
    getUpcomingData({
      pageNo: 1,
      start: moment().format("YYYY-MM-DDTHH:mm:ss"),
      end: moment().add("1", "w").format("YYYY-MM-DDTHH:mm:ss"),
    });
    getCandidateList(selectedJobId);
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(customerCandidateListsActions.getDrpDwnJobLists());
    dispatch(
      scheduleInterviewActions.getUpcomingInterviewListWOPaginationThunk({
        start: moment().format("YYYY-MM-DDTHH:mm:ss"),
        end: moment().add("1", "months").format("YYYY-MM-DDTHH:mm:ss"),
      })
    );
  }, []);

  const getUpcomingData = async function (filterdata) {
    await dispatch(
      scheduleInterviewActions.getUpcomingInterviewListThunk(filterdata)
    );
  };
  const candidateList = useSelector(
    (state) => state.scheduleInterview.scheduleInterview.scheduledInterviewList
  );

  const jobList = useSelector((state) => state.customerCandidateList.jobLists);

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
      let startDate = moment(
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
    console.log(event);
    setPopupData(event.data);
    setOpenModal(true);
    setPopupType(event.format);
  }, []);
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
            </Row>

            {toggleVar === "availabilty" && (
              <Card>
                <CardBody className="scheduled-calender">
                  <Calendar
                    defaultView="week"
                    localizer={localizer}
                    events={upData}
                    startAccessor="start"
                    endAccessor="end"
                    popup
                    onSelectEvent={handleSelectEvent}
                    eventPropGetter={(upData) => {
                      const backgroundColor = upData.color
                        ? upData.color
                        : "blue";
                      const fontSize = "0.8rem";
                      return { style: { backgroundColor, fontSize } };
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
                        ? upcomingInterviews.scheduledInterviewList[0]
                        : selectedJobData[0]
                    }
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
                    <ScheduleInterviewList candidateList={candidateList} />
                  </CardBody>
                </Card>
                {showPopup === true && (
                  <Popup
                    type={"success"}
                    message={"Interview scheduled"}
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
        />
      </Container>
    </>
  );
}
