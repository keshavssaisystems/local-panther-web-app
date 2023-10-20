import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import momentTimezone from "moment-timezone";
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

const events = [
  {
    start: moment().toDate(),
    end: moment()
      .add(1, "days")
      .toDate(),
    title: "Some title"
  }
];

export function ReactBigCalender({ toolbar = false }) {
  const localizer = momentLocalizer(moment, "Etc/Universal");

  const handleSelectEvent = (event) => {
    console.log('event :>> ', event);
  };

  return (
    <Card>
      <CardBody className="scheduled-calender">
        <Calendar
          defaultView="month"
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          popup
          formats={{
            dayFormat: "dddd",
          }}
          today={true}
          views={{ month: true }}
          toolbar={toolbar}
          onSelectEvent={handleSelectEvent}
        />
      </CardBody>
    </Card>
  );
}
