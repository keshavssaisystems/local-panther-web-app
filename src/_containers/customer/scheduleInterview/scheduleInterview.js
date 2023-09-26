import React, { useState } from "react";
import Tabs from "react-responsive-tabs";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { Row, Col, Card, Container } from "reactstrap";
import "./scheduleInterview.scss";
import { ScheduleInterviewList } from "_components/scheduleInterview/scheduleInterviewList";
import { UpcomingCard } from "_components/scheduleInterview/upcomingCard";
import { UpcomingDetail } from "_components/scheduleInterview/upcomingDetail";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

export function ScheduleInterview() {
  const localizer = momentLocalizer(moment);
  const events = [
    // {
    //   id: 0,
    //   title: "All Day Event very long title",
    //   allDay: true,
    //   start: new Date(2023, 9, 0),
    //   end: new Date(2023, 9, 1),
    // },
    {
      id: 1,
      title: "Long Event",
      start: new Date(2023, 9, 7),
      end: new Date(2023, 9, 10),
    },
    {
      id: 2,
      title: "DTS STARTS",
      start: new Date(2016, 2, 13, 0, 0, 0),
      end: new Date(2016, 2, 20, 0, 0, 0),
    },
    {
      id: 9,
      title: "DTS ENDS",
      start: new Date(2016, 10, 6, 0, 0, 0),
      end: new Date(2016, 10, 13, 0, 0, 0),
    },
    {
      id: 4,
      title: "Some Event",
      start: new Date(2023, 9, 9, 0, 0, 0),
      end: new Date(2023, 9, 10, 0, 0, 0),
    },
    {
      id: 5,
      title: "Conference",
      start: new Date(2023, 9, 11),
      end: new Date(2023, 9, 13),
      desc: "Big conference for important people",
    },
    {
      id: 6,
      title: "Meeting",
      start: new Date(2023, 9, 12, 10, 30, 0, 0),
      end: new Date(2023, 9, 12, 12, 30, 0, 0),
      desc: "Pre-meeting meeting, to prepare for the meeting",
    },
    {
      id: 7,
      title: "Lunch",
      start: new Date(2023, 9, 12, 12, 0, 0, 0),
      end: new Date(2023, 9, 12, 13, 0, 0, 0),
      desc: "Power lunch",
    },
    {
      id: 8,
      title: "Meeting",
      start: new Date(2023, 9, 12, 14, 0, 0, 0),
      end: new Date(2023, 9, 12, 15, 0, 0, 0),
    },
    {
      id: 9,
      title: "Happy Hour",
      start: new Date(2023, 9, 12, 17, 0, 0, 0),
      end: new Date(2023, 9, 12, 17, 90, 0, 0),
      desc: "Most important meal of the day",
    },
    {
      id: 10,
      title: "Dinner",
      start: new Date(2023, 9, 12, 20, 0, 0, 0),
      end: new Date(2023, 9, 12, 21, 0, 0, 0),
    },
    {
      id: 11,
      title: "Birthday Party",
      start: new Date(2023, 9, 13, 7, 0, 0),
      end: new Date(2023, 9, 13, 10, 90, 0),
    },
    {
      id: 12,
      title: "Late Night Event",
      start: new Date(2023, 9, 17, 19, 90, 0),
      end: new Date(2023, 9, 18, 2, 0, 0),
    },
    {
      id: 12.5,
      title: "Late Same Night Event",
      start: new Date(2023, 9, 17, 19, 90, 0),
      end: new Date(2023, 9, 17, 23, 90, 0),
    },
    {
      id: 13,
      title: "Multi-day Event",
      start: new Date(2023, 9, 20, 19, 90, 0),
      end: new Date(2023, 9, 22, 2, 0, 0),
    },
    {
      id: 14,
      title: "Meeting",
      start: new Date(new Date().setHours(new Date().getHours() - 2)),
      end: new Date(new Date().setHours(new Date().getHours() + 2)),
    },
  ];
  const getSimpleTabs = () =>
    [
      {
        name: "Availablility",
        content: (
          <Calendar
            defaultView="week"
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            popup
          />
        ),
      },
      {
        name: "Upcoming",
        content: (
          <>
            <Row>
              <Col lg="4">
                <UpcomingCard />
              </Col>
              <Col lg="8">
                <UpcomingDetail />
              </Col>
            </Row>
          </>
        ),
      },
      {
        name: "Calendar",
        content: (
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            popup
          />
        ),
      },
      {
        name: "Schedule",
        content: (
          <>
            <ScheduleInterviewList />
          </>
        ),
      },
    ].map(({ name, content }, index) => ({
      key: index,
      title: name,
      getContent: () => content,
    }));

  const [toggleVar, setToggleVar] = useState(1);
  const toggle = (tab) => {
    if (toggleVar !== tab) {
      setToggleVar(tab);
    }
  };

  return (
    <>
      <PageTitle heading="Interview" icon={titlelogo} />
      <Container fluid className="card-schedule-interview">
        <Row>
          <Col md="12">
            <Card className="mb-3 card-tabs card-tabs-animated ">
              <Tabs
                tabsWrapperClass="card-header"
                activeTab={toggleVar}
                showMore
                transform={false}
                showInkBar
                items={getSimpleTabs()}
                selectedTabKey={0}
                transformWidth={400}
                toggle={toggle(toggleVar)}
              />
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
