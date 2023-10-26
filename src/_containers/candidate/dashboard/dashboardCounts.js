import React, { useState } from "react";
import { Row, Col } from "reactstrap";
import { useSelector } from "react-redux";

export function DashboardCounts() {
  const counts = useSelector(
    (state) => state.candidateDashboard.dashboardCounts
  );

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
                  {counts ? counts.matchedcandidate : 0}
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col md="6" xl="3">
          <div className="card mb-3 widget-content bg-arielle-smile">
            <div className="widget-content-wrapper text-white">
              <div className="widget-content-left">
                <div className="widget-heading">Interview schedules</div>
              </div>
              <div className="widget-content-right">
                <div className="widget-numbers text-white">
                  {counts ? counts.interveiwSchedule : 0}
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
                  {counts ? counts.acceptedbycandidate : 0}
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
                  {counts ? counts.acceptedbycandidate : 0}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
