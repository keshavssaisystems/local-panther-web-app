import React from "react";
import { Row, Col, Card } from "reactstrap";
import { useSelector } from "react-redux";
import { history } from "_helpers";
import custDashIcons from "assets/utils/images/customer/dashboard";
export function DashboardCounts() {
  const counts = useSelector(
    (state) => state.candidateDashboard.dashboardCounts
  );
  const navigateToJobsPage = function (e, count, tab) {
    history.navigate("/job-list-" + tab);
  };

  return (
    <>
      <Row>
        <Col xxl={2} xl={2} lg={4} md={4} sm={12}>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "alternate border-alternate"
            }
            onClick={(e) =>
              navigateToJobsPage(e, counts.matchedcandidate, "matched")
            }
            style={{
              cursor: "pointer",
              height: "68%",
            }}
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4" sm="4" className="me-2 mt-1">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-primary"} />
                    <img
                      className="d-flex justify-content-center"
                      src={custDashIcons.candMatched}
                      alt="matched-icon"
                    />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">Matched jobs</div>
                    <div className="widget-numbers mt-2 fsize-4 mb-2 w-100">
                      <div className="widget-chart-flex align-items-center ">
                        <div>{counts ? counts.matchedcandidate : 0}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xxl={2} xl={2} lg={4} md={4} sm={12}>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "warning border-warning"
            }
            onClick={(e) =>
              navigateToJobsPage(e, counts.appliedcount, "applied")
            }
            style={{
              cursor: "pointer",
              height: "68%",
            }}
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4" sm="4" className="me-2  mt-1">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-warning"} />

                    <img
                      className="d-flex justify-content-center"
                      src={custDashIcons.candApplied}
                      alt="applied-icon"
                    />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">Applied</div>
                    <div className="widget-numbers mt-2 fsize-4 mb-2 w-100">
                      <div className="widget-chart-flex ">
                        <div>{counts ? counts.appliedcount : 0}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xxl={2} xl={2} lg={4} md={4} sm={12}>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "primary border-primary"
            }
            onClick={(e) =>
              navigateToJobsPage(e, counts.interveiwSchedule, "interview")
            }
            style={{
              cursor: "pointer",
              height: "68%",
            }}
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4" sm="4" className="me-2  mt-1">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-primary"} />
                    <img
                      className="d-flex justify-content-center"
                      src={custDashIcons.candInterview}
                      alt="interview-icon"
                    />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">Interviews</div>
                    <div className="widget-numbers mt-2 fsize-4 mb-2 w-100">
                      <div className="widget-chart-flex align-items-center ">
                        <div>{counts ? counts.interveiwSchedule : 0}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xxl={2} xl={2} lg={4} md={4} sm={12}>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "info border-info"
            }
            onClick={(e) =>
              navigateToJobsPage(e, counts.offersforcandidate, "offers")
            }
            style={{
              cursor: "pointer",
              height: "68%",
            }}
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4" sm="4" className="me-2  mt-1">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-info"} />
                    <img
                      className="d-flex justify-content-center"
                      src={custDashIcons.candOffer}
                      alt="offer-icon"
                    />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">
                      Offer
                      {/* <span style={{ visibility: "hidden" }}>12345</span> */}
                    </div>
                    <div className="widget-numbers mt-2 fsize-4 mb-2 w-100">
                      <div className="widget-chart-flex align-items-center ">
                        <div>{counts ? counts.offersforcandidate : 0}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>

        <Col xxl={2} xl={2} lg={4} md={4} sm={12}>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "success border-success"
            }
            onClick={(e) =>
              navigateToJobsPage(e, counts.acceptedbycandidate, "accepted")
            }
            style={{
              cursor: "pointer",
              height: "68%",
            }}
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4" sm="4" className="me-2 mt-1">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-success"} />
                    <img
                      className="d-flex justify-content-center"
                      src={custDashIcons.candAccepted}
                      alt="accepted-icon"
                    />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">Accepted</div>
                    <div className="widget-numbers mt-2 fsize-4 mb-2 w-100">
                      <div className="widget-chart-flex align-items-center ">
                        <div>{counts ? counts.acceptedbycandidate : 0}</div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>
        </Col>
        <Col xxl={2} xl={2} lg={4} md={4} sm={12}>
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
              "danger border-danger"
            }
            onClick={(e) =>
              navigateToJobsPage(e, counts.rejectedbycandidate, "rejected")
            }
            style={{
              cursor: "pointer",
              height: "68%",
            }}
          >
            <div className="widget-chat-wrapper-outer">
              <Row>
                <Col md="4" sm="4" className="me-2  mt-1">
                  <div className="icon-wrapper rounded-circle mt-1">
                    <div className={"icon-wrapper-bg bg-danger"} />
                    <img
                      className="d-flex justify-content-center"
                      src={custDashIcons.candRejected}
                      alt="rejected-icon"
                    />
                  </div>
                </Col>
                <Col>
                  <div className="widget-chart-content">
                    <div className="widget-title opacity-5 ">Rejected</div>
                    <div className="widget-numbers mt-2 fsize-4 mb-2 w-100">
                      <div className="widget-chart-flex ">
                        <div>{counts ? counts.rejectedbycandidate : 0}</div>
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
