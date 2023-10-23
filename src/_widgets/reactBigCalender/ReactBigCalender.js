import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
// import momentTimezone from "moment-timezone";

import {
  Card,
  CardBody,
} from "reactstrap";

export function ReactBigCalender({ toolbar = false, events = [] }) {
  const localizer = momentLocalizer(moment, "Etc/Universal");

  const handleSelectEvent = (event) => {
    console.log('event :>> ', event);
  };
  const handleSelectSlot = (event) => {
    console.log('event :>> ', event);
  };

  return (
    <Card>
      <CardBody className="scheduled-calender">
        <Calendar
          defaultView={Views.MONTH}
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          popup={true}
          formats={{
            dayFormat: "dddd",
          }}
          eventPropGetter={(events) => {
            const backgroundColor = events.color
              ? events.color
              : "blue";
            const fontSize = "0.8rem";
            return { style: { backgroundColor, fontSize } };
          }}
          today={true}
          views={{ month: true }}
          toolbar={toolbar}
          onSelectEvent={handleSelectEvent}
          onShowMore={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
        />
      </CardBody>
    </Card>
  );
}
