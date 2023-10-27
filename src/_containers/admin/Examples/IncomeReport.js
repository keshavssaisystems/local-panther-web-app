import moment from "moment";
import React, { Fragment, useEffect, useState } from "react";
import { Row, Col, Progress, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCandidates } from '_containers/admin/_redux/adminDashboard.slice';

import {
  ResponsiveContainer, LineChart, Tooltip, Line, XAxis,
} from "recharts";

const today = new Date().toLocaleDateString('fr-CA');

const IncomeReport = () => {
  const dispatch = useDispatch();
  const {
    candidatesData,
    loading = false } = useSelector((state) => state?.adminDashboard ?? {});
  const { cardStats, 
    totalInterviewScheduled,
    dashboardCountDetails } = useSelector((state) => state?.adminDashboard ?? {});

  const selectTimeInterval = (timeInterval) => {
    // dispatch(showScores(timeInterval))
  }

  useEffect(() => {
    dispatch(getCandidates({ startDate: today, chartFor: 'Candidate', groupBy: 'week' }))
  }, [])


  return (
    <Fragment>
      <div className="btn-actions-pane-right text-capitalize  actions-icon-btn right-align">
        <UncontrolledButtonDropdown>
          <DropdownToggle className="btn-icon btn-icon-only" color="link">
            <i className="lnr-calendar-full btn-icon-wrapper" />
          </DropdownToggle>
          <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
            <DropdownItem header>Select Range</DropdownItem>
            <DropdownItem divider />
            <DropdownItem onClick={() => { selectTimeInterval('week') }}>
              <i className="dropdown-icon lnr-inbox"> </i>
              <span>one Week</span>
            </DropdownItem>
            <DropdownItem onClick={() => { selectTimeInterval('month') }}>
              <i className="dropdown-icon lnr-file-empty"> </i>
              <span>one Month</span>
            </DropdownItem>
            <DropdownItem onClick={() => { selectTimeInterval('6-months') }}>
              <i className="dropdown-icon lnr-book"> </i>
              <span>six Months</span>
            </DropdownItem>
            <DropdownItem onClick={() => { selectTimeInterval('year') }}>
              <i className="dropdown-icon lnr-book"> </i>
              <span>a Year</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
      <div className="widget-chart-wrapper widget-chart-wrapper-lg opacity-10 m-0">
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={candidatesData} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
            <XAxis dataKey="label" tick={false} />
            <Tooltip labelFormatter={t => moment(t).format("ddd, DD MMM  YYYY")} />
            <Line type="monotone" dataKey="recommededJobs" stroke="#e83e8c" strokeWidth={3} />
            <Line type="monotone" dataKey="activeCandidates" stroke="#4BBF73" strokeWidth={2} />
            <Line type="monotone" dataKey="noRecommendedJobs" stroke="#e83e8c" strokeOpacity={0.7} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <Row className="mt-3">
        <Col sm="12" md="4">
          <div className="widget-content p-0">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  {/* <div className="widget-numbers text-dark">{cardStats.todaysinterviewscheduledcount}</div> */}
                  <div className="widget-numbers text-dark">{dashboardCountDetails?.todaysinterviewscheduledcount || 0}</div>
                </div>
              </div>
              <div className="widget-progress-wrapper mt-1">
                <Progress className="progress-bar-xs progress-bar-animated-alt" color="info" value={dashboardCountDetails?.todaysinterviewscheduledcount || 0} />
                <div className="progress-sub-label">
                  <div className="sub-label-left font-size-md">Interviews Scheduled</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col sm="12" md="4">
          <div className="widget-content p-0">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-numbers text-dark">3%</div>
                </div>
              </div>
              <div className="widget-progress-wrapper mt-1">
                <Progress className="progress-bar-xs progress-bar-animated-alt" color="success" value="3" />
                <div className="progress-sub-label">
                  <div className="sub-label-left font-size-md">some Candidate Status</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
        <Col sm="12" md="4">
          <div className="widget-content p-0">
            <div className="widget-content-outer">
              <div className="widget-content-wrapper">
                <div className="widget-content-left">
                  <div className="widget-numbers text-dark">0%</div>
                </div>
              </div>
              <div className="widget-progress-wrapper mt-1">
                <Progress className="progress-bar-xs progress-bar-animated-alt" color="warning" value="0" />
                <div className="progress-sub-label">
                  <div className="sub-label-left font-size-md">some Candidate Stats. eg Not Active</div>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Fragment>
  );
}

export default IncomeReport;