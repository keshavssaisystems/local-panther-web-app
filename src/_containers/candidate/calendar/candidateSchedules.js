import React, { useState, useEffect, useCallback } from "react";
import PageTitle from "../../../_components/common/pagetitle";
import calendarLogo from "../../../assets/utils/images/calendar.svg";
import { Row, Col, Card, Container, CardBody } from "reactstrap";
import "../../customer/scheduleInterview/scheduleInterview.scss";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment-timezone";
import { useSelector, useDispatch } from "react-redux";
import { scheduleInterviewActions } from "_store";
import { InterViewDetailModal } from "../../../_components/modal/interviewdetailmodal";
import { getTimezoneDateTime } from "_helpers/helper";
import "./calendar.scss";
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";

export function CandidateSchedules() {
  const dispatch = useDispatch();

  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
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
    // Get the current date
    const currentDate = new Date();

    // Get the first day of the current month
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Get the last day of the current month
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const formattedFirstDay = formatDate(firstDayOfMonth);
    const formattedLastDay = formatDate(lastDayOfMonth);

    getUpcomingData({
      candidateId: userDetails.InternalUserId,
      start: formattedFirstDay,
      end: formattedLastDay,
    });
  }, []);
  const getUpcomingData = async function (filterdata) {
    await dispatch(
      scheduleInterviewActions.getSchedulesByCandidateId(filterdata)
    );
  };

  const candidateSchedules = useSelector(
    (state) => state.scheduleInterview.candidateSchedules.scheduledInterviewList
  );
  const localizer = momentLocalizer(moment);
  let upData = [];
  if (candidateSchedules !== undefined && candidateSchedules.length > 0) {
    candidateSchedules.forEach((upcomingInterview) => {
      let startDate = getTimezoneDateTime(
        moment(upcomingInterview.scheduledate).format("MMM D, YYYY") +
          " " +
          upcomingInterview.starttime,
        "YYYY-MM-DD HH:mm:ss"
      );
      let startTime = getTimezoneDateTime(
        moment(upcomingInterview.scheduledate).format("MMM D, YYYY") +
          " " +
          upcomingInterview.starttime,
        "hh:mm a"
      );
      let durationArr =
        upcomingInterview.duration !== undefined
          ? upcomingInterview.duration.split(" ")
          : [];
      let endDate = getTimezoneDateTime(
        moment(startDate).add(durationArr[0], "m"),
        "YYYY-MM-DD HH:mm:ss"
      );
      let endTime = getTimezoneDateTime(
        moment(startDate).add(durationArr[0], "m"),
        "hh:mm a"
      );
      let interviewData = {
        id: upcomingInterview.scheduleinterviewid,
        data: upcomingInterview,
        format: upcomingInterview.format,
        title: upcomingInterview.jobtitle,
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

  const [view, setView] = useState(Views.MONTH);

  const handleNavigate = function (data) {
    let firstDayOfMonth;

    let lastDayOfMonth;
    let formattedFirstDay;
    let formattedLastDay;

    if (data.start) {
      firstDayOfMonth = new Date(data.start);

      lastDayOfMonth = new Date(data.end);
      formattedFirstDay = formatDate(firstDayOfMonth);
      formattedLastDay = formatDate(lastDayOfMonth);
    } else {
      firstDayOfMonth = new Date(data[0]);

      lastDayOfMonth = new Date(data[data.length - 1]);
      formattedFirstDay = formatDate(firstDayOfMonth);
      formattedLastDay = formatDate(lastDayOfMonth);
    }

    getUpcomingData({
      candidateId: userDetails.InternalUserId,
      start: formattedFirstDay,
      end: formattedLastDay,
    });
  };

  const CustomToolbar = ({ label, onNavigate }) => (
    <div>
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <div>
            <span
              style={{ cursor: "pointer" }}
              className="me-2"
              onClick={() => onNavigate("TODAY")}
            >
              Today
            </span>
            <BsArrowLeft
              style={{ cursor: "pointer" }}
              className="me-2"
              onClick={() => onNavigate("PREV")}
            />
            <BsArrowRight
              style={{ cursor: "pointer" }}
              onClick={() => onNavigate("NEXT")}
            />
          </div>
        </span>

        <span className="rbc-toolbar-label">{label}</span>

        <span className="rbc-btn-group">
          <button onClick={() => [setView(Views.MONTH), onNavigate()]}>
            Month
          </button>
          <button onClick={() => [setView(Views.WEEK), onNavigate()]}>
            Week
          </button>
          <button onClick={() => [setView(Views.DAY), onNavigate()]}>
            Day
          </button>
          <button onClick={() => [setView(Views.AGENDA), onNavigate()]}>
            Agenda
          </button>
        </span>
      </div>
    </div>
  );

  return (
    <>
      <PageTitle heading="Calendar" icon={calendarLogo} />
      <Container fluid className="card-schedule-interview candidate-calendar">
        <Row>
          <Col md="12">
            <Card>
              <CardBody className="scheduled-calender">
                <div className="text-end">
                  <div className="mb-3 me-0 badge badge-color-yellow">P</div> No
                  response
                  <div className="ms-3 mb-3 me-1 badge badge-color-green">
                    P
                  </div>
                  Accepted interview{" "}
                  <div className="ms-3 mb-3 me-0 badge badge-color-red">P</div>{" "}
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
                  views={views}
                  messages={messages}
                  startAccessor="start"
                  endAccessor="end"
                  // popup
                  eventPropGetter={(upData) => {
                    const backgroundColor = upData.color
                      ? upData.color
                      : "blue";
                    const fontSize = "0.8rem";
                    return { style: { backgroundColor, fontSize } };
                  }}
                  onSelectEvent={(evt) => handleSelectEvent(evt)}
                  onRangeChange={handleNavigate}
                  defaultView={Views.MONTH} // Set the default view
                  view={view} // Specify the view
                  onView={setView} // Handle view changes
                  components={{
                    day: {
                      header: () => "",
                    },
                  }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <>
          {openModal ? (
            <>
              <InterViewDetailModal
                data={popupData}
                onClose={() => {
                  onCloseIdModal();
                }}
                isOpen={openModal}
              ></InterViewDetailModal>
            </>
          ) : (
            <></>
          )}
        </>
      </Container>
    </>
  );
}
