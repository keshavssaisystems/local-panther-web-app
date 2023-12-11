import React from "react";
import { Row, Col, Card } from "reactstrap";
import { useSelector } from "react-redux";
import { history } from "_helpers";

export function DashboardCounts() {
  const counts = useSelector(
    (state) => state.candidateDashboard.dashboardCounts
  );
  const navigateToJobsPage = function (e, count, tab) {
    if (count === 0) {
      e.preventDefault();
      return;
    } else {
      history.navigate("/job-list-" + tab);
    }
  };

  return (
    <>
      <Row>
        <Col>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "alternate border-alternate"
            }
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-alternate"} />
                    <i
                      className={"lnr-graduation-hat text-alternate"}
                      style={{ fontSize: "2rem" }}
                    />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">Matched jobs</div>
                    <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                      <div className="widget-chart-flex align-items-center">
                        <div
                          onClick={(e) =>
                            navigateToJobsPage(
                              e,
                              counts.matchedcandidate,
                              "matched"
                            )
                          }
                          style={{
                            cursor:
                              counts.matchedcandidate === 0
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {counts ? counts.matchedcandidate : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "primary border-primary"
            }
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-primary"} />
                    <i className={"lnr-calendar-full text-primary"} />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">
                      Interviews scheduled
                    </div>
                    <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                      <div className="widget-chart-flex align-items-center">
                        <div
                          onClick={(e) =>
                            navigateToJobsPage(
                              e,
                              counts.interveiwSchedule,
                              "interview"
                            )
                          }
                          style={{
                            cursor:
                              counts.interveiwSchedule === 0
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {counts ? counts.interveiwSchedule : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "info border-info"
            }
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="7" lg="4">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-info"} />
                    <i className={"lnr-bullhorn text-info"} />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 "> Offer </div>
                    <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                      <div className="widget-chart-flex align-items-center">
                        <div
                          onClick={(e) =>
                            navigateToJobsPage(
                              e,
                              counts.offersforcandidate,
                              "offers"
                            )
                          }
                          style={{
                            cursor:
                              counts.offersforcandidate === 0
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {counts ? counts.offersforcandidate : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "success border-success"
            }
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-success"} />
                    <i className={"lnr-thumbs-up text-success"} />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">Accepted</div>
                    <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                      <div className="widget-chart-flex align-items-center">
                        <div
                          onClick={(e) =>
                            navigateToJobsPage(
                              e,
                              counts.acceptedbycandidate,
                              "accepted"
                            )
                          }
                          style={{
                            cursor:
                              counts.acceptedbycandidate === 0
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {counts ? counts.acceptedbycandidate : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "danger border-danger"
            }
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-danger"} />
                    <i className={"lnr-user text-danger"} />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">Rejected</div>
                    <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                      <div className="widget-chart-flex align-items-center">
                        <div
                          onClick={(e) =>
                            navigateToJobsPage(
                              e,
                              counts.rejectedbycandidate,
                              "rejected"
                            )
                          }
                          style={{
                            cursor:
                              counts.rejectedbycandidate === 0
                                ? "not-allowed"
                                : "pointer",
                          }}
                        >
                          {counts ? counts.rejectedbycandidate : 0}
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );
}
