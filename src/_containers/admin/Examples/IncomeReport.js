import moment from "moment";
import React, { Component, Fragment } from "react";
import { Row, Col, CardTitle, Progress, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

import {
  ResponsiveContainer, LineChart, Tooltip, Line, XAxis,
 } from "recharts";

const timeInterval = 10;
const date = new Date().toLocaleDateString('fr-CA');
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-CA')


// queryParams : { 
//   timePeriod = [ 1 week | 1 month | 6 months | 12 months, default : 1 month ],
//   startDate = [ default : today ]
// }

// const data = [
//   { id: 0, label: startDate - (11 * timePeriod), noRecommendedJobs: 4, activeCandidates: 240, recommededJobs: 2400, interviewScheduled: 50 },
//   { id: 1, label: startDate - (10 * timePeriod), noRecommendedJobs: 0, activeCandidates: 139, recommededJobs: 2210, interviewScheduled: 39 },
//   { id: 2, label: startDate - (9 * timePeriod), noRecommendedJobs: 2, activeCandidates: 980, recommededJobs: 2290, interviewScheduled: 77 },
//   { id: 3, label: startDate - (8 * timePeriod), noRecommendedJobs: 2, activeCandidates: 390, recommededJobs: 2000, interviewScheduled: 31 },
//   { id: 4, label: startDate - (7 * timePeriod), noRecommendedJobs: 1, activeCandidates: 480, recommededJobs: 2181, interviewScheduled: 51 },
//   { id: 5, label: startDate - (6 * timePeriod), noRecommendedJobs: 3, activeCandidates: 380, recommededJobs: 2500, interviewScheduled: 60 },
//   { id: 6, label: startDate - (5 * timePeriod), noRecommendedJobs: 0, activeCandidates: 430, recommededJobs: 2100, interviewScheduled: 78 },
//   { id: 7, label: startDate - (4 * timePeriod), noRecommendedJobs: 2, activeCandidates: 680, recommededJobs: 2290, interviewScheduled: 59 },
//   { id: 8, label: startDate - (3 * timePeriod), noRecommendedJobs: 4, activeCandidates: 790, recommededJobs: 2000, interviewScheduled: 71 },
//   { id: 9, label: startDate - (2 * timePeriod), noRecommendedJobs: 2, activeCandidates: 980, recommededJobs: 2181, interviewScheduled: 121 },
//   { id: 10, label: startDate - (1 * timePeriod), noRecommendedJobs: 0, activeCandidates: 800, recommededJobs: 1500, interviewScheduled: 201 },
//   { id: 11, label: startDate - (0 * timePeriod), noRecommendedJobs: 0, activeCandidates: 300, recommededJobs: 2100, interviewScheduled: 82 }
// ];


const data55 = [
  { id: 0, label: "01/01/2024", noRecommendedJobs: 4, activeCandidates: 240, recommededJobs: 2400, interviewScheduled: 50 },
  { id: 1, label: "02/01/2023", noRecommendedJobs: 0, activeCandidates: 139, recommededJobs: 2210, interviewScheduled: 39  },
  { id: 2, label: "03/01/2023", noRecommendedJobs: 2, activeCandidates: 980, recommededJobs: 2290, interviewScheduled: 77 },
  { id: 3, label: "04/01/2023", noRecommendedJobs: 2, activeCandidates: 390, recommededJobs: 2000, interviewScheduled: 31 },
  { id: 4, label: "05/01/2023", noRecommendedJobs: 1, activeCandidates: 480, recommededJobs: 2181, interviewScheduled: 51 },
  { id: 5, label: "06/01/2023", noRecommendedJobs: 3, activeCandidates: 380, recommededJobs: 2500, interviewScheduled: 60 },
  { id: 6, label: "07/01/2023", noRecommendedJobs: 0, activeCandidates: 430, recommededJobs: 2100, interviewScheduled: 78 },
  { id: 7, label: "08/01/2023", noRecommendedJobs: 2, activeCandidates: 680, recommededJobs: 2290, interviewScheduled: 59 },
  { id: 8, label: "09/01/2023", noRecommendedJobs: 4, activeCandidates: 790, recommededJobs: 2000, interviewScheduled: 71 },
  { id: 9, label: "10/01/2023", noRecommendedJobs: 2, activeCandidates: 980, recommededJobs: 2181, interviewScheduled: 121 },
  { id: 10, label: yesterday, noRecommendedJobs: 0, activeCandidates: 800, recommededJobs: 1500, interviewScheduled: 201 },
  { id: 11, label: date, noRecommendedJobs: 0, activeCandidates: 300, recommededJobs: 2100, interviewScheduled: 82 }
];

export default class IncomeReport extends Component {
  render() {
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
              <DropdownItem>
                <i className="dropdown-icon lnr-inbox"> </i>
                <span>a Week</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-file-empty"> </i>
                <span>a Month</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-book"> </i>
                <span>6 Months</span>
              </DropdownItem>
              <DropdownItem>
                <i className="dropdown-icon lnr-book"> </i>
                <span>a Year</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
        <div className="widget-chart-wrapper widget-chart-wrapper-lg opacity-10 m-0">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data55} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
              <XAxis dataKey="label" tick={false} />
              <Tooltip labelFormatter={t => moment(t).format("ddd, DD MMM  YYYY")} />
              <Line type="monotone" dataKey="recommededJobs" stroke="#e83e8c" strokeWidth={3} />
              <Line type="monotone" dataKey="activeCandidates" stroke="#e83e8c" strokeOpacity={0.4} strokeWidth={2}/>
              {/* <Line type="monotone" dataKey="interviewScheduled" stroke="#4BBF73" strokeWidth={3} /> */}
              <Line type="monotone" dataKey="noRecommendedJobs" stroke="#d9534f" strokeOpacity={0.4} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <Row className="mt-3">
          <Col sm="12" md="4">
            <div className="widget-content p-0">
              <div className="widget-content-outer">
                <div className="widget-content-wrapper">
                  <div className="widget-content-left">
                    <div className="widget-numbers text-dark">65%</div>
                  </div>
                </div>
                <div className="widget-progress-wrapper mt-1">
                  <Progress className="progress-bar-xs progress-bar-animated-alt" color="info" value="65"/>
                  <div className="progress-sub-label">
                    <div className="sub-label-left font-size-md">Interviews Accepted</div>
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
                    <div className="widget-numbers text-dark">83%</div>
                  </div>
                </div>
                <div className="widget-progress-wrapper mt-1">
                  <Progress className="progress-bar-xs progress-bar-animated-alt" color="success" value="83" />
                  <div className="progress-sub-label">
                    <div className="sub-label-left font-size-md">New Registrations</div>
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
                    <div className="widget-numbers text-dark">12%</div>
                  </div>
                </div>
                <div className="widget-progress-wrapper mt-1">
                  <Progress className="progress-bar-xs progress-bar-animated-alt" color="warning" value="22"/>
                  <div className="progress-sub-label">
                    <div className="sub-label-left font-size-md">Not Active</div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Fragment>
    );
  }
}
