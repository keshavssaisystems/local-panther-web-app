import moment from "moment";
import React, { Component, Fragment } from "react";
import { Row, Col, CardTitle, Progress } from "reactstrap";

import {
  ResponsiveContainer, LineChart, Tooltip, Line, XAxis,
 } from "recharts";

const timeInterval = 10;
const date = new Date().toLocaleDateString('fr-CA');
const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-CA')


const data55 = [
  { label: "01/01/2024", name: "Page A", uv: 4000, activecandidates: 2400, amt: 2400 },
  { label: "02/01/2023", name: "Page B", uv: 3000, activecandidates: 1398, amt: 2210 },
  { label: "03/01/2023", name: "Page C", uv: 2000, activecandidates: 9800, amt: 2290 },
  { label: "04/01/2023", name: "Page D", uv: 2780, activecandidates: 3908, amt: 2000 },
  { label: "05/01/2023", name: "Page E", uv: 1890, activecandidates: 4800, amt: 2181 },
  { label: "06/01/2023", name: "Page F", uv: 2390, activecandidates: 3800, amt: 2500 },
  { label: "07/01/2023", name: "Page G", uv: 3490, activecandidates: 4300, amt: 2100 },
  { label: "08/01/2023", name: "Page C", uv: 2000, activecandidates: 6800, amt: 2290 },
  { label: "09/01/2023", name: "Page D", uv: 4780, activecandidates: 7908, amt: 2000 },
  { label: "10/01/2023", name: "Page E", uv: 2890, activecandidates: 9800, amt: 2181 },
  { label: yesterday, name: "Page F", uv: 1390, activecandidates: 3800, amt: 1500 },
  { label: date, name: "Page G", uv: 3490, activecandidates: 4300, amt: 2100 }
];

export default class IncomeReport extends Component {
  render() {
    return (
      <Fragment>
        <div className="widget-chart-wrapper widget-chart-wrapper-lg opacity-10 m-0">
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data55} margin={{ top: 0, right: 5, left: 5, bottom: 0 }}>
              <XAxis dataKey="label" tick={false} />
              <Tooltip labelFormatter={t => moment(t).format("ddd, DD MMM  YYYY")} />
              <Line type="monotone" dataKey="activecandidates" stroke="#e83e8c" strokeOpacity={0.4} strokeWidth={2}/>
              <Line type="monotone" dataKey="uv" stroke="#e83e8c" strokeWidth={3}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <CardTitle>Candidates Stats</CardTitle>
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
                    <div className="sub-label-left font-size-md">Recommended Jobs</div>
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
          <Col sm="12" md="4">
            <div className="widget-content p-0">
              <div className="widget-content-outer">
                <div className="widget-content-wrapper">
                  <div className="widget-content-left">
                    <div className="widget-numbers text-dark">83%</div>
                  </div>
                </div>
                <div className="widget-progress-wrapper mt-1">
                  <Progress className="progress-bar-xs progress-bar-animated-alt" color="success" value="83"/>
                  <div className="progress-sub-label">
                    <div className="sub-label-left font-size-md">New Registrations</div>
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
