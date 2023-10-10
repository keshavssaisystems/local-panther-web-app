import React, { useState, useEffect, useCallback } from "react";
import PageTitle from "../../_components/common/pagetitle";
import titlelogo from "../../assets/utils/images/candidate.svg";
import {
  Row,
  Col,
  Card,
  Container,
  ButtonGroup,
  ModalHeader,
  CardBody,
  Input,
  Modal,
} from "reactstrap";
import "../customer/scheduleInterview/scheduleInterview.scss";
import { BsArrowRight, BsArrowLeft } from "react-icons/bs";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment-timezone";
import { useSelector, useDispatch } from "react-redux";
import {
  customerCandidateListsActions,
  scheduleInterviewActions,
} from "_store";
import { ScheduleDetails } from "./scheduleDetails";
import { OverlayTrigger, Popover } from "react-bootstrap";

export function CandidateSchedules() {
  const [showPopup, setShowPopup] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedJobId, setSelectedJobId] = useState(27);
  const onSelectClick = (evt) => {
    setSelectedJobId(evt.target.value);
    getCandidateList(evt.target.value);
  };
  const dispatch = useDispatch();
  const getCandidateList = async function (jobId) {
    await dispatch(scheduleInterviewActions.getScheduleInterviewThunk(jobId));
  };
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

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
    getCandidateList(selectedJobId);
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(customerCandidateListsActions.getDrpDwnJobLists());
    dispatch(scheduleInterviewActions.getDurationThunk());
    dispatch(
      scheduleInterviewActions.getUpcomingInterviewListWOPaginationThunk({
        start: moment().format("YYYY-MM-DDTHH:mm:ss"),
        end: moment().add("1", "months").format("YYYY-MM-DDTHH:mm:ss"),
      })
    );
  }, []);
  const getUpcomingData = async function (filterdata) {
    debugger;
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
        data: upcomingInterview,
        format: upcomingInterview.format,
        title: upcomingInterview.jobtitle,
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

  const [openModal, setOpenModal] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [popupType, setPopupType] = useState("Video");
  const onCloseIdModal = () => {
    setOpenModal(false);
  };
  const handleSelectEvent = useCallback((event) => {
    debugger;
    console.log(event);
    setPopupData(event.data);
    setOpenModal(true);
    setPopupType(event.format);
  }, []);

  const [view, setView] = useState(Views.MONTH);

  const handleNavigate = function (data) {
    debugger;
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
            <span className="me-2" onClick={() => onNavigate("TODAY")}>
              Today
            </span>
            <BsArrowLeft className="me-2" onClick={() => onNavigate("PREV")} />
            <BsArrowRight onClick={() => onNavigate("NEXT")} />
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
      <PageTitle heading="Calendar" icon={titlelogo} />
      <Container fluid className="card-schedule-interview">
        <Row>
          <Col md="12">
            <Card>
              <CardBody className="scheduled-calender">
                <Calendar
                  localizer={localizer}
                  events={upData}
                  startAccessor="start"
                  endAccessor="end"
                  views={["month", "week", "day", "agenda"]}
                  popup
                  eventPropGetter={(upData) => {
                    const backgroundColor = upData.color
                      ? upData.color
                      : "blue";
                    const fontSize = "0.8rem";
                    return { style: { backgroundColor, fontSize } };
                  }}
                  onSelectEvent={(evt) => handleSelectEvent(evt)}
                  onRangeChange={handleNavigate}
                  components={{
                    toolbar: CustomToolbar, // Use the custom toolbar component
                  }}
                  defaultView={Views.MONTH} // Set the default view
                  view={view} // Specify the view
                  onView={setView} // Handle view changes
                />
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal className="modal-reject-align profile-view" isOpen={openModal}>
          <ModalHeader toggle={() => onCloseIdModal()} charCode="Y">
            <strong className="card-title-text">Interview Details</strong>
          </ModalHeader>
          <ScheduleDetails
            type={popupType}
            onClose={() => onCloseIdModal()}
            interviewDetail={popupData}
          />
        </Modal>
      </Container>
    </>
  );
}
