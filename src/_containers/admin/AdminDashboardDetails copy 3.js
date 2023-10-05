import React, { useState, Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import DataTable from 'react-data-table-component';
import { makeData } from "_containers/admin/Examples/utils.js";

import avatar1 from "assets/utils/images/avatars/1.jpg";
import avatar2 from "assets/utils/images/avatars/2.jpg";
import avatar3 from "assets/utils/images/avatars/3.jpg";
import avatar4 from "assets/utils/images/avatars/4.jpg";

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

import Column from "./Examples/Column";
import Bar2 from "./Examples/Bar";
import Area from "./Examples/Area";
import Mixed from "./Examples/Mixed";

import {
  faAngleUp,
  faAngleDown,
  faQuestionCircle,
  faBusinessTime,
  faCog,
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const AdminDashboardDetails = () => {
  const [visible, setVisible] = useState(true)
  const [activeTab, setActiveTab] = useState("1")
  const [data, setData] = useState(makeData)

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

  const onDismiss = () => {
    setVisible(value => !value);
  }

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }


  return (
    <Fragment>
      <TransitionGroup>
        <CSSTransition component="div" classNames="TabsAnimation" appear={true}
          timeout={1500} enter={false} exit={false}>
          <div>
            <Alert className="mbg-3" color="info" isOpen={visible} toggle={onDismiss}>
              <span className="pe-2">
                <FontAwesomeIcon icon={faQuestionCircle} />
              </span>
              This dashboard is in making. Some features may not work!
            </Alert>
            <Row>
              <Col xs="12" sm="9" md="6" lg="3">
                <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-primary">
                  <div className="widget-chat-wrapper-outer">
                    <div className="widget-chart-content">
                      <div className="widget-content-left fsize-1">
                        <div className="text-muted opacity-6">
                          active Clients
                        </div>
                      </div>
                      <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                        <div className="widget-chart-flex align-items-center">
                          <div>
                            <span className="opacity-10 text-success pe-2">
                              <FontAwesomeIcon icon={faAngleUp} />
                            </span>
                            234
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs="12" sm="9" md="6" lg="3">
                <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-danger">
                  <div className="widget-chat-wrapper-outer">
                    <div className="widget-chart-content">
                      <div className="widget-content-left fsize-1">
                        <div className="text-muted opacity-6">
                          hiring Managers
                        </div>
                      </div>
                      <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                        <div className="widget-chart-flex align-items-center">
                          <div>
                            <span className="opacity-10 text-danger pe-2">
                              <FontAwesomeIcon icon={faAngleDown} />
                            </span>
                            221
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs="12" sm="9" md="6" lg="3">
                <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-warning">
                  <div className="widget-chat-wrapper-outer">
                    <div className="widget-chart-content">
                      <div className="widget-content-left fsize-1">
                        <div className="text-muted opacity-6">
                          active Candidates
                        </div>
                      </div>
                      <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                        <div className="widget-chart-flex align-items-center">
                          <div>
                            <span className="opacity-10 text-success pe-2">
                              <FontAwesomeIcon icon={faAngleUp} />
                            </span>
                            1234
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
              <Col xs="12" sm="9" md="6" lg="3">
                <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-success">
                  <div className="widget-chat-wrapper-outer">
                    <div className="widget-chart-content">
                      <div className="widget-content-left fsize-1">
                        <div className="text-muted opacity-6">
                          open Jobs
                        </div>
                      </div>
                      <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                        <div className="widget-chart-flex align-items-center">
                          <div>
                            <span className="opacity-10 text-success pe-2">
                              <FontAwesomeIcon icon={faAngleUp} />
                            </span>
                            885
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <CardHeader className="mbg-3 h-auto ps-0 pe-0 bg-transparent no-border">
              <div className="card-header-title fsize-2 text-capitalize fw-normal">
                Stats Section
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

            <Row>
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
            </Row>
            <Card className="main-card mb-3">
              <CardHeader>
                <div className="card-header-title font-size-lg text-capitalize fw-normal">
                  Company Agents Status
                </div>
                <div className="btn-actions-pane-right">
                </div>
              </CardHeader>
              <Table responsive borderless hover className="align-middle text-truncate mb-0">
                <thead>
                  <tr>
                    <th className="text-center">#</th>
                    <th className="text-center">Avatar</th>
                    <th className="text-center">Name</th>
                    <th className="text-center">Company</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Due Date</th>
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
                        <Button className="btn-shadow" color="primary">
                          Hire
                        </Button>
                        <Button className="btn-shadow" color="primary">
                          Fire
                        </Button>
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
                        <Button className="btn-shadow" color="primary">
                          Hire
                        </Button>
                        <Button className="btn-shadow" color="primary">
                          Fire
                        </Button>
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
                        <Button className="btn-shadow" color="primary">
                          Hire
                        </Button>
                        <Button className="btn-shadow" color="primary">
                          Fire
                        </Button>
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
                        <Button className="btn-shadow" color="primary">
                          Hire
                        </Button>
                        <Button className="btn-shadow" color="primary">
                          Fire
                        </Button>
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
