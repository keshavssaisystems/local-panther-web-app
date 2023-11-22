import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
// import momentTimezone from "moment-timezone";

import { Card, CardBody } from "reactstrap";
import "./reactbigcalendar.scss";

export function ReactBigCalender({
  toolbar = false,
  events = [],
  onHandleSelectEvent,
}) {
  const [view, setView] = useState(Views.MONTH);
  const localizer = momentLocalizer(moment, "Etc/Universal");

  const handleSelectEvent = (event) => {
    onHandleSelectEvent(event);
  };
  const handleSelectSlot = (event) => {
    console.log("event :>> ", event);
  };

  return (
    <Card className="admin-calendar-cont">
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
            const backgroundColor = events.color ? events.color : "blue";
            const fontSize = "0.8rem";
            return { style: { backgroundColor, fontSize } };
          }}
          today={true}
          views={["month", "week", "day", "agenda"]}
          toolbar={toolbar}
          // view={view} // Specify the view
          // onView={setView} // Handle view changes
          onSelectEvent={handleSelectEvent}
          onShowMore={handleSelectEvent}
        />
      </CardBody>
    </Card>
  );
}
