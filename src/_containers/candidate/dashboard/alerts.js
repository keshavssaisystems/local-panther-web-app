import React, { useState } from "react";
import { CardHeader, Card, CardFooter } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import alertsIcon from "../../../assets/utils/images/alert-reminder.svg";
import { useSelector } from "react-redux";

export function Alerts() {
  const alerts = [
    {
      id: 1,
      alert: "All Hands Meeting",
    },
    {
      id: 2,
      alert: "Scheduled interview for UI developer",
    },
    {
      id: 3,
      alert: "Build the production release",
    },

    {
      id: 4,
      alert: "All Hands Meeting",
    },
  ];
  const totalRecords = useSelector(
    (state) => state.candidateListReducer.totalRecords
  );

  const colors = ["dot-danger", "dot-success", "dot-primary"];
  return (
    <>
      <Card className="card-hover-shadow-2x mb-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-md text-capitalize fw-bold">
            <img src={alertsIcon} alt="alerts-img" className="me-2" />
            Alerts & Notifications
          </div>
        </CardHeader>
        <div className="scroll-area-md">
          <PerfectScrollbar>
            <div className="p-2">
              <VerticalTimeline
                layout="1-column"
                className="vertical-time-simple vertical-without-time"
              >
                {alerts?.map((item) => (
                  <VerticalTimelineElement
                    className={
                      colors[Math.floor(Math.random() * colors.length)] +
                      " vertical-timeline-item"
                    }
                  >
                    <p
                      className="timeline-title fw-solid"
                      style={{ fontSize: "12px" }}
                    >
                      {item.alert}
                    </p>
                  </VerticalTimelineElement>
                ))}
              </VerticalTimeline>
            </div>
          </PerfectScrollbar>
        </div>
        {/* {totalRecords > 0 ? (
          <CardFooter className="mb-3 mt-1" style={{ border: "none" }}>
            &nbsp;
          </CardFooter>
        ) : (
          <></>
        )} */}
      </Card>
    </>
  );
}
