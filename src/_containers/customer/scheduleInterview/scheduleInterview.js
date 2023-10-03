import React, { useState, useEffect } from "react";
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
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment-timezone";
import { useSelector, useDispatch } from "react-redux";
import { candidateListsActions, scheduleInterviewActions } from "_store";

export function ScheduleInterview() {
  const [selectedJobId, setSelectedJobId] = useState(5);
  const onSelectClick = (evt) => {
    setSelectedJobId(evt.target.value);
    getCandidateList();
  };
  const dispatch = useDispatch();
  const getCandidateList = async function () {
    await dispatch(
      scheduleInterviewActions.getScheduleInterviewThunk({ selectedJobId })
    );
  };
  useEffect(() => {
    getCandidateList();
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(candidateListsActions.getDrpDwnJobLists());
    dispatch(scheduleInterviewActions.getDurationThunk());
  }, []);
  const candidateList = useSelector(
    (state) => state.scheduleInterview.scheduleInterview.scheduledInterviewList
  );
  const durationOptions = useSelector(
    (state) => state.scheduleInterview.duration
  );
  const jobList = useSelector((state) => state.candidateLists.jobLists);
  const upcomingInterviews = useSelector(
    (state) => state.scheduleInterview.upcomingInterview.scheduledInterviewList
  );
  const localizer = momentLocalizer(moment);
  let upData = [];
  if (upcomingInterviews !== undefined && upcomingInterviews.length > 0) {
    upcomingInterviews.forEach((upcomingInterview) => {
      let startDate = moment(
        moment(upcomingInterview.scheduledate).format("MMM D, YYYY") +
          " " +
          upcomingInterview.starttime
      )
        .tz("America/New_York")
        .format("YYYY-MM-DD HH:mm:ss");
      let startTime = moment(
        moment(upcomingInterview.scheduledate).format("MMM D, YYYY") +
          " " +
          upcomingInterview.starttime
      )
        .tz("America/New_York")
        .format("hh:mm a");
      let durationArr =
        upcomingInterview.duration !== undefined
          ? upcomingInterview.duration.split(" ")
          : [];
      let endDate = moment(startDate)
        .add(durationArr[0], "m")
        .format("YYYY-MM-DD HH:mm:ss");
      let endTime = moment(startDate)
        .add(durationArr[0], "m")
        .format("hh:mm a");
      let interviewData = {
        id: upcomingInterview.scheduleinterviewid,
        title:
          startTime +
          "-" +
          endTime +
          " : " +
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
    postScheduledInterview(formData);
  };
  const postScheduledInterview = async function (formData) {
    await dispatch(
      scheduleInterviewActions.postScheduleInterviewThunk(formData)
    );
  };

  const [toggleVar, setToggleVar] = useState("availabilty");
  const toggle = (tab) => {
    if (toggleVar !== tab) {
      setToggleVar(tab);
    }
  };
  const [selectedClass, setSelectedClass] = useState(
    upcomingInterviews !== undefined && upcomingInterviews.length > 0
      ? upcomingInterviews[0].scheduleinterviewid
      : "2"
  );
  const [selectedJobData, setSelectedJobData] = useState(
    upcomingInterviews !== undefined && upcomingInterviews.length > 0
      ? [upcomingInterviews[0]]
      : []
  );
  let selectedJobDetails =
    upcomingInterviews !== undefined && upcomingInterviews.length > 0
      ? [upcomingInterviews[0]]
      : [];
  const getSelectedInterview = (scheduleinterviewid) => {
    selectedJobDetails = upcomingInterviews.filter((element) => {
      return element.scheduleinterviewid === scheduleinterviewid;
    });
    setSelectedJobData(selectedJobDetails);
    setSelectedClass(scheduleinterviewid);
  };
  return (
    <>
      <PageTitle heading="Interview" icon={titlelogo} />
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
                    upcomingList={upcomingInterviews}
                    selectedInterview={selectedClass}
                    getSelectedInterviewId={(e) => getSelectedInterview(e)}
                  />
                </Col>
                <Col lg="8">
                  <UpcomingDetail interviewDetails={selectedJobData[0]} />
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
                  />
                </CardBody>
              </Card>
            )}
            {toggleVar === "schedule" && (
              <Card>
                <CardBody>
                  <ScheduleInterviewList
                    candidateList={candidateList}
                    durationOptions={durationOptions}
                    postData={(e) => getFormData(e)}
                  />
                </CardBody>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </>
  );
}
