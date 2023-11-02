import React, { useState } from "react";
import { CardHeader, Card, CardFooter, Row, Col } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import alertsIcon from "../../../assets/utils/images/alert-reminder.svg";
import { useSelector } from "react-redux";
import { NoDataFound } from "_components/common/nodatafound";
import Loader from "react-loaders";

export function Alerts() {
  const totalRecords = useSelector(
    (state) => state.candidateListReducer.totalRecords
  );

  const alerts = useSelector((state) => state.candidateDashboard.alertsList);
  const loader = useSelector((state) => state.candidateDashboard.alertsLoader);

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
          {!loader ? (
            <PerfectScrollbar>
              <div className="p-2">
                {alerts?.length > 0 ? (
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
                          {item.notificationmessage}
                        </p>
                      </VerticalTimelineElement>
                    ))}
                  </VerticalTimeline>
                ) : (
                  <Row style={{ textAlign: "center" }}>
                    <Col>
                      {" "}
                      <NoDataFound imageSize={"25px"} />
                    </Col>
                  </Row>
                )}
              </div>
            </PerfectScrollbar>
          ) : (
            <div className="d-flex justify-content-center align-items-center loader">
              <Loader active={loader} type="line-scale-pulse-out-rapid" />
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
