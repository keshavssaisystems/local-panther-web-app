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
  onHandleNavigate,
}) {
  const [view, setView] = useState(Views.MONTH);
  const localizer = momentLocalizer(moment, "Etc/Universal");
  const views = {
    month: true,
    week: true,
    day: true,
    agenda: true, // Add or modify views as needed
  };
  const messages = {
    agenda: "Schedule", // Change the label for Agenda to Schedule
  };
  const handleSelectEvent = (event) => {
    onHandleSelectEvent(event);
  };
  const handleSelectSlot = (event) => {
    console.log("event :>> ", event);
  };

  const handleNavigate = (evt) => {
    onHandleNavigate(evt);
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
          // popup
          formats={{
            dayFormat: "dddd",
          }}
          eventPropGetter={(events) => {
            const backgroundColor = events.color ? events.color : "blue";
            const fontSize = "0.8rem";
            return { style: { backgroundColor, fontSize } };
          }}
          today={false}
          views={views}
          messages={messages}
          toolbar={toolbar}
          onRangeChange={handleNavigate}
          view={view} // Specify the view
          onView={setView} // Handle view changes
          onSelectEvent={handleSelectEvent}
          components={{
            day: {
              header: () => "",
            },
          }}
          // onShowMore={handleSelectEvent}
        />
      </CardBody>
    </Card>
  );
}
