import React, { useEffect, useState, Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { getDashboardCountThunk, getMissedInterviewThunk, getScores } from '_containers/admin/_redux/adminDashboard.slice'
import { getInterviewStatusThunk } from "_containers/admin/_redux/adminDashboard.slice";
import { Table as DataTable } from "_widgets";
import Loader from "react-loaders";

import { useDispatch, useSelector } from "react-redux";
import { makeData } from "_containers/admin/Examples/utils.js";
import Chart from "react-apexcharts";
import './adminDashboardDetails.scss'
import IncomeReport from "_containers/admin/Examples/IncomeReport";

// import avatar1 from "assets/utils/images/avatars/1.jpg";
// import avatar2 from "assets/utils/images/avatars/2.jpg";
// import avatar3 from "assets/utils/images/avatars/3.jpg";
// import avatar4 from "assets/utils/images/avatars/4.jpg";

import {
  Row,
  Col,
  Alert,
  Button,
  CardHeader,
  // Table,
  // ButtonGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Progress,
  Card,
  CardBody,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
} from "reactstrap";

import {
  faAngleUp,
  faAngleDown,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classnames from "classnames";
import CountUp from "react-countup";
import moment from "moment";
import { TabbedContent } from "./Examples/Tabbed";

const AdminDashboardDetails = () => {
  const dispatch = useDispatch()
  const {
    loading = false,
    cardStats,
    scheduledInterviewLoading = false,
    scheduledInterviewList,
    missedInterviewList,
    dashboardCountDetails
  } = useSelector((state) => state?.adminDashboard ?? {});

  const [visible, setVisible] = useState(true)
  const [activeTab, setActiveTab] = useState("1")
  const [data, setData] = useState(makeData)
  
  const today = new Date().toLocaleDateString('fr-CA');
  const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString('fr-CA')

  const jobsData = [
    { id: 0, label: "01/01/2023", closedJobs: 144, openJobs: 240, closureTime: 30 },
    { id: 1, label: "02/01/2023", closedJobs: 55, openJobs: 139, closureTime: 25 },
    { id: 2, label: "03/01/2023", closedJobs: 141, openJobs: 980, closureTime: 36 },
    { id: 3, label: "04/01/2023", closedJobs: 167, openJobs: 390, closureTime: 30 },
    { id: 4, label: "05/01/2023", closedJobs: 122, openJobs: 480, closureTime: 45 },
    { id: 5, label: "06/01/2023", closedJobs: 122, openJobs: 380, closureTime: 35 },
    { id: 6, label: "07/01/2023", closedJobs: 143, openJobs: 430, closureTime: 64 },
    { id: 7, label: "08/01/2023", closedJobs: 121, openJobs: 680, closureTime: 52 },
    { id: 8, label: "09/01/2023", closedJobs: 141, openJobs: 790, closureTime: 59 },
    { id: 9, label: "10/01/2023", closedJobs: 256, openJobs: 980, closureTime: 36 },
    { id: 10, label: yesterday, closedJobs: 127, openJobs: 800, closureTime: 39 },
    { id: 11, label: today, closedJobs: 243, openJobs: 300, closureTime: 12 }
  ];

  const initial = {
    timeIntervalDefault: 'week',
    timeInterval: 'month',
    optionsJobsChart: {
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
        "11/01/2022",
        "12/01/2022",
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
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          seriesName: 'Open Jobs',
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
          },
          title: {
            text: "# of Jobs"
          },
          min: 0,
        },
        {
          seriesName: 'Closed Jobs',
          show: false
        }, {
          opposite: true,
          seriesName: 'Closing Time',
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
          },
          title: {
            text: "# of Days"
          },
          min: 1,
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {

          formatter: function (value, { seriesIndex, series }) {
            console.log("NG seriesName", series)
            if (seriesIndex === 2) {

              return value.toFixed(0) + " Days";

            } else {

              return value.toFixed(0) + " Jobs";

            }

          },

        },
      },
    },
    seriesJobsChart: [
      {
        name: "Open Jobs",
        type: "column",
        data: [240, 139, 980, 390, 480, 380, 430, 680, 790, 980, 800, 300],
      },
      {
        name: "Closed Jobs",
        type: "column",
        data: [144, 55, 141, 167, 122, 122, 143, 121, 141, 256, 127, 243],
      },
      {
        name: "Closing Time",
        type: "line",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39,12],
      },
    ],
    optionsInterviewChart: {
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
        "11/01/2022",
        "12/01/2022",
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
      ],
      markers: {
        size: 0,
      },
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          seriesName: 'Scheduled Interviews',
          axisTicks: {
            show: true
          },
          axisBorder: {
            show: true,
          },
          title: {
            text: "# of Interviews"
          },
          min: 0,
        },
        {
          seriesName: 'Closed Interviews',
          show: false
        }, {
          seriesName: 'Accepted Interviews',
          show: false
        }
      ],
      tooltip: {
        shared: true,
        intersect: false,
        y: {

          formatter: function (value, { seriesIndex, series }) {
              return value.toFixed(0) + " Interviews";
          },

        },
      },
    },
    seriesInterviewChart: [
      {
        name: "Accepted Interviews",
        type: "column",
        data: [240, 139, 180, 390, 480, 380, 430, 680, 790, 580, 800, 300],
      },
      {
        name: "Closed Interviews",
        type: "column",
        data: [144, 55, 141, 167, 122, 122, 143, 121, 141, 256, 127, 243],
      },
      {
        name: "Scheduled Interviews",
        type: "line",
        data: [330, 225, 236, 430, 545, 435, 564, 752, 859, 636, 939, 412],
      },
    ],

  };
  const [initialState, setInitialState] = useState(initial)

  const columns = [
    {
      name: "Candidate",
      selector: row => row.candidatename,
      sortable: true,
      wrap: true,
      width: '120px'
    },
    {
      name: "Job Title",
      selector: row => row.jobtitle,
      sortable: true,
      wrap: true,
      width: '120px'
    },
    {
      name: "Skills",
      selector: row => row.candidateskills,
      sortable: true,
      wrap: true,
      width: '300px'
    },
    {
      name: "Scheduled Date",
      selector: row => moment(row.scheduledate).format('MM-DD-YYYY'),
      sortable: true,
      wrap: true,
    },
    {
      name: "Status",
      selector: row => !row.isaccepted && !row.isrejected ? 'Not responded' : row.isrejected ? 'Rejected' : 'Accepted',
      sortable: true,
      wrap: true,
    },
  ];

  useEffect(()=>{
    dispatch(getDashboardCountThunk())
    dispatch(getScores(today))
    dispatch(getInterviewStatusThunk({ startDate: today, endDate: today }));    
    dispatch(getMissedInterviewThunk({ startDate: today, endDate: today }));    
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <CSSTransition component="div" classNames="admin-dashboard-details TabsAnimation " appear={true}
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
                        <CountUp start={0} end={dashboardCountDetails?.activecandidatecount || 0} separator="," decimals={0}
                          decimal="" delay={2} prefix="" duration="10" />
                      </div>
                      <div className="tab-subheading fsize-1 fw-normal">
                        <i className="header-icon lnr-users me-3 text-muted opacity-6"> {" "} </i>
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
                      <div className="widget-number ">
                        <span className="pe-2 text-success">
                          <FontAwesomeIcon icon={faAngleUp} />
                        </span>
                        <CountUp start={0} end={dashboardCountDetails?.openjobcount || 0} separator="" decimals={0} decimal=""
                          delay={2} prefix="" duration="10" />
                      </div>
                      <div className="tab-subheading fsize-1 fw-normal">
                        <i className="header-icon lnr-graduation-hat me-3 text-muted opacity-6"> {" "} </i>
                        Jobs
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
                        <CountUp start={0} end={dashboardCountDetails?.todaysinterviewscheduledcount || 0} separator=","
                          decimals={0} decimal="" delay={2} prefix="" duration="10" />
                      </div>
                      <div className="tab-subheading fsize-1 fw-normal">
                        <i className="header-icon lnr-calendar-full me-3 text-muted opacity-6"> {" "} </i>
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
                  <CardHeader className="rm-border">
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
                  </CardHeader>
                  <CardBody>
                    <Chart options={initialState.optionsJobsChart} series={initialState.seriesJobsChart}
                          type="line" width="100%" height="330px" />
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
                            <Progress className="progress-bar-xs progress-bar-animated-alt" color="info" value="65" />
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
                              <div className="widget-numbers text-dark">83%</div>
                            </div>
                          </div>
                          <div className="widget-progress-wrapper mt-1">
                            <Progress className="progress-bar-xs progress-bar-animated-alt" color="success" value="83" />
                            <div className="progress-sub-label">
                              <div className="sub-label-left font-size-md">Closed Jobs</div>
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
                              <div className="widget-numbers text-dark">70%</div>
                            </div>
                          </div>
                          <div className="widget-progress-wrapper mt-1">
                            <Progress className="progress-bar-xs progress-bar-animated-alt" color="warning" value="70" />
                            <div className="progress-sub-label">
                              <div className="sub-label-left font-size-md">Avg. Time for Closure</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  </CardBody>
                </TabPane>
                <TabPane tabId="3">
                  <CardHeader className="rm-border">
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
                  </CardHeader>
                  <CardBody>
                    <Chart options={initialState.optionsInterviewChart} series={initialState.seriesInterviewChart}
                      type="line" width="100%" height="330px" />
                    <Row className="mt-3">
                      <Col sm="12" md="4">
                        <div className="widget-content p-0">
                          <div className="widget-content-outer">
                            <div className="widget-content-wrapper">
                              <div className="widget-content-left">
                                <div className="widget-numbers text-dark">15%</div>
                              </div>
                            </div>
                            <div className="widget-progress-wrapper mt-1">
                              <Progress className="progress-bar-xs progress-bar-animated-alt" color="info" value="15" />
                              <div className="progress-sub-label">
                                <div className="sub-label-left font-size-md">Interviews Missed</div>
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
                                <div className="sub-label-left font-size-md">Acceptance Rate</div>
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
                                <div className="widget-numbers text-dark">90%</div>
                              </div>
                            </div>
                            <div className="widget-progress-wrapper mt-1">
                              <Progress className="progress-bar-xs progress-bar-animated-alt" color="warning" value="90" />
                              <div className="progress-sub-label">
                                <div className="sub-label-left font-size-md">Avg. Time to Converge</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </TabPane>
              </TabContent>
            </Card>
            <CardHeader className="mbg-3 h-auto ps-0 pe-0 bg-transparent no-border">
              <div className="card-header-title fsize-2 text-capitalize fw-normal">
                Interview Status
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
                    {/* <div className="btn-actions-pane-right actions-icon-btn">
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
                    </div> */}
                  </CardHeader>
                  <CardBody>
                    <DataTable 
                      progressPending={scheduledInterviewLoading}
                      progressComponent={<Loader type="line-scale-pulse-out-rapid" className="d-flex justify-content-center" />}
                      columns={columns}
                      data={scheduledInterviewList}
                      // onRowClicked={handleRowClicked}
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
                    <TabbedContent data={missedInterviewList} />
                  </CardBody>
                </Card>
              </Col>
            </Row>
            {/* <Card className="main-card mb-3">
              <CardHeader>
                <div className="card-header-title font-size-lg text-capitalize fw-normal">
                  Customer
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
            </Card> */}
          </div>
        </CSSTransition>
      </TransitionGroup>
    </Fragment>
  );
}

export default AdminDashboardDetails;
