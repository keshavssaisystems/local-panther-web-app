import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { useSelector } from "react-redux";
import { history } from "_helpers";

export function DashboardCounts() {
  const counts = useSelector(
    (state) => state.candidateDashboard.dashboardCounts
  );
  const navigateToJobsPage = function (e, count, tab) {
    if (count == 0) {
      e.preventDefault();
      return;
    } else {
      history.navigate("/job-list-" + tab);
    }
  };
  return (
    <>
      <Row>
        <Col md="6" xl="3">
          <div className="card mb-3 widget-content bg-night-fade">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Matched jobs</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span
                    onClick={(e) =>
                      navigateToJobsPage(e, counts.matchedcandidate, "matched")
                    }
                    style={{
                      cursor:
                        counts.matchedcandidate == 0 ? "block" : "pointer",
                    }}
                  >
                    {counts ? counts.matchedcandidate : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md="6" xl="3">
          <div className="card mb-3 widget-content bg-arielle-smile">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Interviews scheduled</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span
                    onClick={(e) =>
                      navigateToJobsPage(
                        e,
                        counts.interveiwSchedule,
                        "interview"
                      )
                    }
                    style={{
                      cursor:
                        counts.interveiwSchedule == 0 ? "block" : "pointer",
                    }}
                  >
                    {counts ? counts.interveiwSchedule : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md="6" xl="3">
          <div className="card mb-3 widget-content bg-happy-green">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Accepted</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span
                    onClick={(e) =>
                      navigateToJobsPage(
                        e,
                        counts.acceptedbycandidate,
                        "accepted"
                      )
                    }
                    style={{
                      cursor:
                        counts.acceptedbycandidate == 0 ? "block" : "pointer",
                    }}
                  >
                    {counts ? counts.acceptedbycandidate : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md="6" xl="3">
          <div className="card mb-3 widget-content bg-strong-bliss">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Rejected</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  <span
                    onClick={(e) =>
                      navigateToJobsPage(
                        e,
                        counts.acceptedbycandidate,
                        "rejected"
                      )
                    }
                    style={{
                      cursor:
                        counts.acceptedbycandidate == 0 ? "block" : "pointer",
                    }}
                  >
                    {counts ? counts.acceptedbycandidate : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
