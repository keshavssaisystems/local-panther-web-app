import React, { Component, Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Progress } from "react-sweet-progress";
import classnames from "classnames";
import { IoIosAnalytics } from "react-icons/io";
import DataTable from 'react-data-table-component';

import {
  Row,
  Col,
  Button,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  CardHeader,
  CardFooter,
  ListGroup,
  ListGroupItem,
  Card,
  CardBody,
  DropdownItem,
  ButtonGroup,
  TabContent,
  TabPane,
} from "reactstrap";

import TabbedContent from "./Tabbed";

import {
  XAxis,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";

import PerfectScrollbar from "react-perfect-scrollbar";

import {
  faAngleUp,
  faArrowRight,
  faAngleDown,
  faDotCircle,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CountUp from "react-countup";

import avatar1 from "assets/utils/images/avatars/1.jpg";
import avatar8 from "assets/utils/images/avatars/2.jpg";
import avatar3 from "assets/utils/images/avatars/3.jpg";
import avatar4 from "assets/utils/images/avatars/4.jpg";
import avatar5 from "assets/utils/images/avatars/5.jpg";
import avatar6 from "assets/utils/images/avatars/8.jpg";
import avatar7 from "assets/utils/images/avatars/9.jpg";

import { makeData } from "_containers/admin/Examples/utils.js";

const data55 = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Page C", uv: 2000, pv: 6800, amt: 2290 },
  { name: "Page D", uv: 4780, pv: 7908, amt: 2000 },
  { name: "Page E", uv: 2890, pv: 9800, amt: 2181 },
  { name: "Page F", uv: 1390, pv: 3800, amt: 1500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
];

const data2 = [
  { name: "Jan", Sales: 4000, Downloads: 2400, amt: 2400 },
  { name: "Feb", Sales: 3000, Downloads: 1398, amt: 2210 },
  { name: "Mar", Sales: 2000, Downloads: 5800, amt: 2290 },
  { name: "Apr", Sales: 2780, Downloads: 3908, amt: 2000 },
  { name: "Jun", Sales: 1890, Downloads: 4800, amt: 2181 },
  { name: "Jul", Sales: 2390, Downloads: 3800, amt: 2500 },
  { name: "Aug", Sales: 3490, Downloads: 4543, amt: 1233 },
  { name: "Sep", Sales: 1256, Downloads: 1398, amt: 1234 },
  { name: "Oct", Sales: 2345, Downloads: 4300, amt: 5432 },
  { name: "Nov", Sales: 1258, Downloads: 3908, amt: 2345 },
  { name: "Dec", Sales: 3267, Downloads: 2400, amt: 5431 },
];

const data552 = [
  { name: "Page A", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Page F", uv: 1390, pv: 3800, amt: 1500 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Page E", uv: 2890, pv: 9800, amt: 2181 },
  { name: "Page D", uv: 2780, pv: 3908, amt: 2000 },
  { name: "Page E", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Page F", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Page C", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Page B", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Page G", uv: 3490, pv: 4300, amt: 2100 },
  { name: "Page C", uv: 2000, pv: 6800, amt: 2290 },
  { name: "Page D", uv: 4780, pv: 7908, amt: 2000 },
];

export default class SalesDashboard1 extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);

    this.state = {
      activeTab: "1",
      data: makeData(),
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  render() {
    const { data } = this.state;

    const columns = [
      {
        name: "Candidate",
        selector: row => row.firstName,
        sortable: true,
      },
      {
        name: "Job",
        id: "lastName",
        selector: row => row.lastName,
        sortable: true,
      },
    
      {
        name: "Time",
        selector: row => row.age,
        sortable: true,
      },
      {
        name: "Status",
        selector: row => row.status,
        sortable: true,
      },
    
      {
        name: "Action",
        selector: row => row.visits,
        sortable: true,
        },
    ];

    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition component="div" classNames="TabsAnimation" appear={true}
            timeout={1500} enter={false} exit={false}>
            <div>
              <Row>
                <Col md="12" lg="6" xl="8">
                  <Card className="mb-3">
                    <CardHeader className="card-header-tab">
                      <div className="card-header-title font-size-lg text-capitalize fw-normal">
                        <i className="header-icon lnr-dice me-3 text-muted opacity-6"> {" "} </i>
                        Today's Interviews
                      </div>
                      <div className="btn-actions-pane-right actions-icon-btn">
                        <UncontrolledButtonDropdown>
                          <DropdownToggle className="btn-icon btn-icon-only" color="link">
                            <i className="pe-7s-menu btn-icon-wrapper" />
                          </DropdownToggle>
                          <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
                            <DropdownItem header>Change Range</DropdownItem>
                            <DropdownItem>
                              <i className="dropdown-icon lnr-inbox"> </i>
                              <span>Week</span>
                            </DropdownItem>
                            <DropdownItem>
                              <i className="dropdown-icon lnr-file-empty"> </i>
                              <span>Month</span>
                            </DropdownItem>
                            <DropdownItem>
                              <i className="dropdown-icon lnr-book"> </i>
                              <span>Download report</span>
                            </DropdownItem>
                            <DropdownItem divider />
                            <div className="p-3 text-end">
                              <Button className="me-2 btn-shadow btn-sm" color="link">
                                View Details
                              </Button>
                              <Button className="me-2 btn-shadow btn-sm" color="primary">
                                Close
                              </Button>
                            </div>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </div>
                    </CardHeader>
                    <CardBody>
                    <DataTable data={data}
                          columns={columns}
                          pagination
                          fixedHeader
                          fixedHeaderScrollHeight="370px"
                        />
                    </CardBody>
                  </Card>
                </Col>
                <Col md="12" lg="6" xl="4">
                  <Card className="mb-3">
                    <CardHeader className="card-header-tab">
                      <div className="card-header-title font-size-lg text-capitalize fw-normal">
                        <i className="header-icon lnr-cloud-download icon-gradient bg-happy-itmeo"> {" "} </i>
                        Technical Support
                      </div>
                    </CardHeader>
                    <CardBody className="p-0">
                      <TabbedContent />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}
