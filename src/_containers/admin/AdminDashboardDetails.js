import React, { useEffect, useState, Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import DataTable from 'react-data-table-component';
import { makeData } from "_containers/admin/Examples/utils.js";
import Chart from "react-apexcharts";

import IncomeReport from "_containers/admin/Examples/IncomeReport";
import IncomeReport2 from "_containers/admin/Examples/IncomeReport2";

import avatar1 from "assets/utils/images/avatars/1.jpg";
import avatar2 from "assets/utils/images/avatars/2.jpg";
import avatar3 from "assets/utils/images/avatars/3.jpg";
import avatar4 from "assets/utils/images/avatars/4.jpg";
import sideBarIcons from 'assets/utils/sidebarimages'

import {
  Row,
  Col,
  Alert,
  Button,
  CardHeader,
  Table,
  ButtonGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Popover,
  PopoverBody,
  Progress,
  Card,
  CardBody,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
  CardFooter,
} from "reactstrap";

import {
  faAngleUp,
  faAngleDown,
  faQuestionCircle,
  faBusinessTime,
  faCog,
  faEllipsisV
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TabbedContent from "./Examples/Tabbed";
import classnames from "classnames";
import CountUp from "react-countup";


const AdminDashboardDetails = () => {
  const [visible, setVisible] = useState(true)
  const [activeTab, setActiveTab] = useState("1")
  const [data, setData] = useState(makeData)
  
  const dashboardCards = {activecompanycount:0, activecustomercount:0, activecandidatecount:0, newcandidateregistrationcount:0}
  const [cardStats, setCardStats] = useState({ ...dashboardCards })

  const date = new Date().toLocaleDateString('fr-CA');
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-CA')
  const [todaysDate, setTodaysDate] = useState(date)

  const initial = {
    popoverOpen1: false,

    optionsMixedChart: {
      chart: {
        height: 350,
        type: "line",
        stacked: false,
      },
      stroke: {
        width: [0, 2, 5],
        curve: "smooth",
      },
      plotOptions: {
        bar: {
          columnWidth: "50%",
        },
      },
      fill: {
        opacity: [0.85, 0.25, 1],
        gradient: {
          inverseColors: false,
          shade: "light",
          type: "vertical",
          opacityFrom: 0.85,
          opacityTo: 0.55,
          stops: [0, 100, 100, 100],
        },
      },
      labels: [
        "01/01/2023",
        "02/01/2023",
        "03/01/2023",
        "04/01/2023",
        "05/01/2023",
        "06/01/2023",
        "07/01/2023",
        "08/01/2023",
        "09/01/2023",
        "10/01/2023",
        "11/01/2023",
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: {
        title: {
          text: "Points",
        },
        min: 0,
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (y) {
            if (typeof y !== "undefined") {
              console.log("NG check y",y)
              return y.toFixed(0) + " points";
            }
            return y;
          },
        },
      },
    },
    seriesMixedChart: [
      {
        name: "TEAM A",
        type: "column",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
      },
      {
        name: "TEAM B",
        type: "bar",
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
      },
      {
        name: "TEAM C",
        type: "line",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
      },
    ],
  };
  const [initialState, setInitialState] = useState(initial)

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
      selector: row => row.visits,
      sortable: true,
    },

    {
      name: "Action",
      selector: row => row.status,
      sortable: true,
    },
  ];

  useEffect(()=>{
    fetch(`https://panther-api-dev.azurewebsites.net/api/AdminDashboard/DasboardCount?date=${todaysDate}`)
    .then(data => data.json())
    .then(result => {
      setCardStats({ ...result.data })
    }
      )
  }, [])

  const onDismiss = () => {
    setVisible(value => !value);
  }

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }


  const dashCardUI = [
    {
        id : 0,
        cardFor: 'client',
        color: 'border-primary',
        count: 0,
        arrowDirection: 'faAngleUp',
        arrowColor: 'text-success',
        title: 'active Clients',
        apiVariable: 'activecompanycount'
    },
    {
        id: 1,
        cardFor: 'hiringManager',
        color: 'border-danger',
        count: 0,
        arrowDirection: 'faAngleUp',
        arrowColor: 'text-success',
        title: 'active Hirers',
        apiVariable: 'activecustomercount'
    },
    {
        id: 2,
        cardFor: 'candidate',
        color: 'border-warning',
        count: 0,
        arrowDirection: 'faAngleDown',
        arrowColor: 'text-danger',
        title: 'active Candidates',
        apiVariable: 'activecandidatecount'
    },
    {
      id: 3,
      cardFor: 'registration',
        color: 'border-success',
        count: 0,
        arrowDirection: 'faAngleUp',
        arrowColor: 'text-success',
        title: 'new Registrations',
        apiVariable: 'newcandidateregistrationcount'
    }
  ]

  const cardsMapping = dashCardUI.map(ele => {
    const borderColor = "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary " + ele.color
    const arrowDirection = ele.arrowDirection === 'faAngleUp' ? 1 : 0
    const arrowColor = "opacity-10 pe-2 " + ele.arrowColor

   return (
      <Col key={ele} xs="12" sm="9" md="6" lg="3">
       <Card className={borderColor}>
          <div className="widget-chat-wrapper-outer">
            <div className="widget-chart-content">
              <div className="widget-content-left fsize-1">
                <div className="text-muted opacity-6">
                  {ele.title}
                </div>
              </div>
              <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                <div className="widget-chart-flex align-items-center">
                  <div>
                   <span className={arrowColor}>
                     { arrowDirection ?
                     <FontAwesomeIcon icon={faAngleUp} />
                     : <FontAwesomeIcon icon={faAngleDown} /> }
                    </span>
                    {cardStats[`${ele.apiVariable}`]}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Col>
    )
  })


  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" classNames="TabsAnimation" appear={true}
          timeout={1500} enter={false} exit={false}>
          <div>
            {/* <Alert className="mbg-3" color="info" isOpen={visible} toggle={onDismiss}>
              <span className="pe-2">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </span>
              This dashboard is in making. Some features may not work!
            </Alert> */}
            <Row>
              {cardsMapping}
            </Row>
            <Alert className="mbg-3" color="info" isOpen={visible} toggle={onDismiss}>
              <span className="pe-2">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </span>
              The below section of dashboard is in making. Data is from JSON !
            </Alert>

            <Card className="mb-3">
              <CardHeader className="tabs-lg-alternate">
                <Nav justified>
                  <NavItem>
                    <NavLink href="#"
                      className={classnames({
                        active: activeTab === "1",
                      })}
                      onClick={() => {
                        toggle("1");
                      }}>
                      <div className="widget-number">
                        <CountUp start={0} end={15065} separator="," decimals={0}
                          decimal="" delay={2} prefix="" duration="10" />
                      </div>
                      <div className="tab-subheading">
                        <span className="pe-2 opacity-6 ">
                          <img src={sideBarIcons.candidates} alt="candidatesIcon" />
                        </span>
                        Candidates
                      </div>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#"
                      className={classnames({
                        active: activeTab === "2",
                      })}
                      onClick={() => {
                        toggle("2");
                      }}>
                      <div className="widget-number align-items-center">
                        <span className="pe-2 text-success">
                          <FontAwesomeIcon icon={faAngleUp} />
                        </span>
                        <CountUp start={0} end={4531} separator="" decimals={0} decimal=""
                          delay={2} prefix="" duration="10" />
                      </div>
                      <div className="tab-subheading align-items-center">
                        <span className="pe-2 opacity-6 ">
                          <img src={sideBarIcons.jobs} alt="jobsIcon" />
                        </span>
                        <span className="pe-2 ">
                          Jobs
                        </span>
                      </div>
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href="#"
                      className={classnames({
                        active: activeTab === "3",
                      })}
                      onClick={() => {
                        toggle("3");
                      }}>
                      <div className="widget-number text-danger">
                        <CountUp start={0} end={67} separator=","
                          decimals={1} decimal="" delay={2} prefix="" duration="10" />
                      </div>
                      <div className="tab-subheading">
                        <span className="pe-2 opacity-6">
                          <img src={sideBarIcons.interviews} alt="interviewsIcon" />
                        </span>
                        Interviews
                      </div>
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardHeader>
              <TabContent activeTab={activeTab}>
                <TabPane tabId="1">
                  <CardBody>
                    <IncomeReport />
                  </CardBody>
                </TabPane>
                <TabPane tabId="2">
                  <Chart options={initialState.optionsMixedChart} series={initialState.seriesMixedChart}
                    type="line" width="100%" height="330px" />
                </TabPane>
                <TabPane tabId="3">
                  <IncomeReport2 />
                </TabPane>
              </TabContent>
            </Card>

            <CardHeader className="mbg-3 h-auto ps-0 pe-0 bg-transparent no-border">
              <div className="card-header-title fsize-2 text-capitalize fw-normal">
                Interview Stats
              </div>
              <div className="btn-actions-pane-right text-capitalize actions-icon-btn">
                <Button size="sm" color="link">
                  Download
                </Button>
              </div>
            </CardHeader>
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
              <Col md="12" lg="5" xl="4">
                <Card className="mb-3">
                  <CardHeader className="card-header-tab">
                    <div className="card-header-title font-size-lg text-capitalize fw-normal">
                      <i className="header-icon lnr-cloud-download icon-gradient bg-happy-itmeo"> {" "} </i>
                      Alerts
                    </div>
                  </CardHeader>
                  <CardBody className="p-0">
                    <TabbedContent />
                  </CardBody>
                </Card>
              </Col>
            </Row>

            {/* <Row>
              <Col sm="12" lg="4">
                <Card className="mb-3">
                  <CardHeader className="card-header-tab">
                    <div className="card-header-title font-size-lg text-capitalize fw-normal">
                      Total Sales
                    </div>
                    <div className="btn-actions-pane-right text-capitalize actions-icon-btn">
                      <UncontrolledButtonDropdown>
                        <DropdownToggle className="btn-icon btn-icon-only" color="link">
                          <i className="lnr-cog btn-icon-wrapper" />
                        </DropdownToggle>
                        <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                          <DropdownItem header>Header</DropdownItem>
                          <DropdownItem>
                            <i className="dropdown-icon lnr-inbox"> </i>
                            <span>Menus</span>
                          </DropdownItem>
                          <DropdownItem>
                            <i className="dropdown-icon lnr-file-empty"> </i>
                            <span>Settings</span>
                          </DropdownItem>
                          <DropdownItem>
                            <i className="dropdown-icon lnr-book"> </i>
                            <span>Actions</span>
                          </DropdownItem>
                          <DropdownItem divider />
                          <div className="p-1 text-end">
                            <Button className="me-2 btn-shadow btn-sm" color="link">
                              View Details
                            </Button>
                            <Button className="me-2 btn-shadow btn-sm" color="primary">
                              Action
                            </Button>
                          </div>
                        </DropdownMenu>
                      </UncontrolledButtonDropdown>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Bar2 />
                  </CardBody>
                  <CardFooter className="p-0 d-block">
                    <div className="grid-menu grid-menu-2col">
                      <Row className="g-0">
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="dark">
                            <i className="lnr-car text-primary opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Admin
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="dark">
                            <i className="lnr-bullhorn text-danger opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Blog
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="dark">
                            <i className="lnr-bug text-success opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Register
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="dark">
                            <i className="lnr-heart text-warning opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Directory
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col sm="12" lg="4">
                <Card className="mb-3">
                  <CardHeader className="card-header-tab">
                    <div className="card-header-title font-size-lg text-capitalize fw-normal">
                      Daily Sales
                    </div>
                    <div className="btn-actions-pane-right text-capitalize">
                      <Button size="sm" outline className="btn-wide btn-outline-2x" color="focus">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Column />
                  </CardBody>
                  <CardFooter className="p-0 d-block">
                    <div className="grid-menu grid-menu-2col">
                      <Row className="g-0">
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="dark">
                            <i className="lnr-apartment text-dark opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Overview
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="dark">
                            <i className="lnr-database text-dark opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Support
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="dark">
                            <i className="lnr-printer text-dark opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Activities
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="dark">
                            <i className="lnr-store text-dark opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Marketing
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </CardFooter>
                </Card>
              </Col>
              <Col sm="12" lg="4">
                <Card className="mb-3">
                  <CardHeader className="card-header-tab">
                    <div className="card-header-title font-size-lg text-capitalize fw-normal">
                      Total Expenses
                    </div>
                    <div className="btn-actions-pane-right text-capitalize">
                      <Button size="sm" outline className="btn-wide btn-outline-2x" color="primary">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Area />
                  </CardBody>
                  <CardFooter className="p-0 d-block">
                    <div className="grid-menu grid-menu-2col">
                      <Row className="g-0">
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="success">
                            <i className="lnr-lighter text-success opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Accounts
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="warning">
                            <i className="lnr-construction text-warning opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Contacts
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="info">
                            <i className="lnr-bus text-info opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Products
                          </Button>
                        </Col>
                        <Col sm="6" className="p-2">
                          <Button className="btn-icon-vertical btn-transition-text btn-transition btn-transition-alt pt-2 pb-2"
                            outline color="alternate">
                            <i className="lnr-gift text-alternate opacity-7 btn-icon-wrapper mb-2"> {" "} </i>
                            Services
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </CardFooter>
                </Card>
              </Col>
            </Row> */}
            <Card className="main-card mb-3">
              <CardHeader>
                <div className="card-header-title font-size-lg text-capitalize fw-normal">
                  Hiring Managers
                </div>
                <div className="btn-actions-pane-right">
                </div>
              </CardHeader>
              <Table responsive borderless hover className="align-middle text-truncate mb-0">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Avatar</th>
                    <th className="text-center">Hirer</th>
                    <th className="text-center">Company</th>
                    <th className="text-center">Recent Hire Status</th>
                    <th className="text-center">Last Hire</th>
                    <th className="text-center">Target Achievement</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center text-muted" style={{ width: "80px" }}>
                      #54
                    </td>
                    <td className="text-center" style={{ width: "80px" }}>
                      <img width={40} className="rounded-circle" src={avatar1} alt="" />
                    </td>
                    <td className="text-center">
                      <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                        Juan C. Cargill
                      </a>
                    </td>
                    <td className="text-center">
                      <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                        Micro Electronics
                      </a>
                    </td>
                    <td className="text-center">
                      <div className="badge rounded-pill bg-danger">
                        Canceled
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="pe-2 opacity-6">
                        <FontAwesomeIcon icon={faBusinessTime} />
                      </span>
                      12 Dec
                    </td>
                    <td className="text-center" style={{ width: "200px" }}>
                      <div className="widget-content p-0">
                        <div className="widget-content-outer">
                          <div className="widget-content-wrapper">
                            <div className="widget-content-left pe-2">
                              <div className="widget-numbers fsize-1 text-danger">
                                71%
                              </div>
                            </div>
                            <div className="widget-content-right w-100">
                              <Progress className="progress-bar-xs" color="danger" value="71" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <ButtonGroup size="sm">
                        <div className="d-block w-100 text-center">
                          <UncontrolledButtonDropdown direction="start">
                            <DropdownToggle
                              className="btn-icon btn-icon-only btn btn-link"
                              color="link"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </DropdownToggle>
                            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
                              <DropdownItem>
                                <i className="dropdown-icon lnr-layers"></i>
                                <span>View activities</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </ButtonGroup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center text-muted" style={{ width: "80px" }}>
                      #55
                    </td>
                    <td className="text-center" style={{ width: "80px" }}>
                      <img width={40} className="rounded-circle" src={avatar2} alt="" />
                    </td>
                    <td className="text-center">
                      <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                        Johnathan Phelan
                      </a>
                    </td>
                    <td className="text-center">
                      <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                        Hatchworks
                      </a>
                    </td>
                    <td className="text-center">
                      <div className="badge rounded-pill bg-info">On Hold</div>
                    </td>
                    <td className="text-center">
                      <span className="pe-2 opacity-6">
                        <FontAwesomeIcon icon={faBusinessTime} />
                      </span>
                      15 Dec
                    </td>
                    <td className="text-center" style={{ width: "200px" }}>
                      <div className="widget-content p-0">
                        <div className="widget-content-outer">
                          <div className="widget-content-wrapper">
                            <div className="widget-content-left pe-2">
                              <div className="widget-numbers fsize-1 text-warning">
                                54%
                              </div>
                            </div>
                            <div className="widget-content-right w-100">
                              <Progress className="progress-bar-xs" color="warning" value="54" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <ButtonGroup size="sm">
                        <div className="d-block w-100 text-center">
                          <UncontrolledButtonDropdown direction="start">
                            <DropdownToggle
                              className="btn-icon btn-icon-only btn btn-link"
                              color="link"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </DropdownToggle>
                            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
                              <DropdownItem>
                                <i className="dropdown-icon lnr-layers"></i>
                                <span>View activities</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </ButtonGroup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center text-muted" style={{ width: "80px" }}>
                      #56
                    </td>
                    <td className="text-center" style={{ width: "80px" }}>
                      <img width={40} className="rounded-circle" src={avatar3} alt="" />
                    </td>
                    <td className="text-center">
                      <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                        Darrell Lowe
                      </a>
                    </td>
                    <td className="text-center">
                      <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                        Riddle Electronics
                      </a>
                    </td>
                    <td className="text-center">
                      <div className="badge rounded-pill bg-warning">
                        In Progress
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="pe-2 opacity-6">
                        <FontAwesomeIcon icon={faBusinessTime} />
                      </span>
                      6 Dec
                    </td>
                    <td className="text-center" style={{ width: "200px" }}>
                      <div className="widget-content p-0">
                        <div className="widget-content-outer">
                          <div className="widget-content-wrapper">
                            <div className="widget-content-left pe-2">
                              <div className="widget-numbers fsize-1 text-success">
                                97%
                              </div>
                            </div>
                            <div className="widget-content-right w-100">
                              <Progress className="progress-bar-xs" color="success" value="97" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <ButtonGroup size="sm">
                        <div className="d-block w-100 text-center">
                          <UncontrolledButtonDropdown direction="start">
                            <DropdownToggle
                              className="btn-icon btn-icon-only btn btn-link"
                              color="link"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </DropdownToggle>
                            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
                              <DropdownItem>
                                <i className="dropdown-icon lnr-layers"></i>
                                <span>View activities</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </ButtonGroup>
                    </td>
                  </tr>
                  <tr>
                    <td className="text-center text-muted" style={{ width: "80px" }}>
                      #56
                    </td>
                    <td className="text-center" style={{ width: "80px" }}>
                      <img width={40} className="rounded-circle" src={avatar4} alt="" />
                    </td>
                    <td className="text-center">
                      <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                        George T. Cottrell
                      </a>
                    </td>
                    <td className="text-center">
                      <a href="https://colorlib.com/" onClick={(e) => e.preventDefault()}>
                        Pixelcloud
                      </a>
                    </td>
                    <td className="text-center">
                      <div className="badge rounded-pill bg-success">
                        Completed
                      </div>
                    </td>
                    <td className="text-center">
                      <span className="pe-2 opacity-6">
                        <FontAwesomeIcon icon={faBusinessTime} />
                      </span>
                      19 Dec
                    </td>
                    <td className="text-center" style={{ width: "200px" }}>
                      <div className="widget-content p-0">
                        <div className="widget-content-outer">
                          <div className="widget-content-wrapper">
                            <div className="widget-content-left pe-2">
                              <div className="widget-numbers fsize-1 text-info">
                                88%
                              </div>
                            </div>
                            <div className="widget-content-right w-100">
                              <Progress className="progress-bar-xs" color="info" value="88" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="text-center">
                      <ButtonGroup size="sm">
                        <div className="d-block w-100 text-center">
                          <UncontrolledButtonDropdown direction="start">
                            <DropdownToggle
                              className="btn-icon btn-icon-only btn btn-link"
                              color="link"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </DropdownToggle>
                            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
                              <DropdownItem>
                                <i className="dropdown-icon lnr-layers"></i>
                                <span>View activities</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </ButtonGroup>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <CardFooter className="d-block p-4 text-center">
                <Button color="dark" className="btn-pill btn-shadow btn-wide fsize-1" size="lg">
                  <span className="me-2 opacity-7">
                    <FontAwesomeIcon spin fixedWidth={false} icon={faCog} />
                  </span>
                  <span className="me-1">View Complete Report</span>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Fragment>
  );
}

export default AdminDashboardDetails;
