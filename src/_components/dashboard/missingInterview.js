import React from "react";
import { Card, CardBody, Col, Row } from "reactstrap";
import "./dashboard.scss";
import { getTimezoneDateTime } from "_helpers/helper";
import moment from "moment-timezone";
import { BsCalendar2WeekFill, BsClockFill } from "react-icons/bs";
import { NoDataFound } from "_components/common/nodatafound";

export function MissingInterview({ cardOptions }) {
  return (
    <>
      <Col>
        <Card className="missed-interview">
          <div className="ms-3 mt-3 missed-interview-title">
            Missed interviews
          </div>
          {cardOptions?.length > 0 && (
            <CardBody className="overflow-auto">
              {cardOptions?.map((options, index) => (
                <div className="mi-main-card" key={index}>
                  <div className="widget-chart-content">
                    <div className="widget-content-left fsize-1">
                      <div className="widget-main-title ms-2 mt-2">
                        {options.jobtitle}
                      </div>
                    </div>
                    <div className="widget-content-left fsize-1">
                      <Row>
                        <Col>
                          {" "}
                          <div className="widget-main-subtitle ms-2">
                            Candidate
                          </div>
                          <div className="widget-main-subtitle-name ms-2">
                            {options.candidatename}
                          </div>
                        </Col>
                        <Col className="right-align me-2">
                          <div className="widget-main-subtitle ms-2">
                            Interviewer
                          </div>
                          <div className="widget-main-subtitle-name ms-2">
                            {options.customername}
                          </div>
                        </Col>
                      </Row>
                    </div>
                    {/* <div className="divider" /> */}
                    <div className="mt-2 mi-footer">
                      <Row className="mt-2 mb-2">
                        <Col className="left-align">
                          {" "}
                          <div className="widget-main-subtitle-name ms-2">
                            <BsCalendar2WeekFill className="mb-1" /> {"  "}
                            {getTimezoneDateTime(
                              moment(options?.scheduledate).format(
                                "YYYY-MM-DD"
                              ) +
                                " " +
                                options?.starttime,
                              "MM/DD/YYYY"
                            )}
                          </div>
                        </Col>
                        <Col className="right-align me-2">
                          <div className="widget-main-subtitle-name ms-2">
                            <BsClockFill className="mb-1" /> {"  "}
                            {getTimezoneDateTime(
                              moment(options?.scheduledate).format(
                                "YYYY-MM-DD"
                              ) +
                                " " +
                                options?.starttime,
                              "hh:mm A"
                            )}
                          </div>
                        </Col>
                        {/* <Col className="right-align me-2">
                      <div className="widget-main-subtitle-name ms-2">
                        Reschedule
                      </div>
                    </Col> */}
                      </Row>
                    </div>
                  </div>
                </div>
              ))}
            </CardBody>
          )}

          {cardOptions?.length === 0 && (
            <>
              <CardBody>
                <Row
                  style={{ textAlign: "center" }}
                  className="center-middle-align"
                >
                  <Col>
                    <NoDataFound></NoDataFound>
                  </Col>
                </Row>
              </CardBody>
            </>
          )}
        </Card>
      </Col>
    </>
  );
}
