import React, { Component, Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import avatar1 from "assets/utils/images/avatars/1.jpg";
import avatar2 from "assets/utils/images/avatars/2.jpg";
import avatar3 from "assets/utils/images/avatars/3.jpg";
import avatar4 from "assets/utils/images/avatars/4.jpg";
import "./adminDashboardDetails.scss";

import {
  Row,
  Col,
  Alert,
  CardHeader,
  Table,
  Progress,
  Card,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
  CardFooter,
} from "reactstrap";

import {
  faQuestionCircle,
  faBusinessTime,
  faEllipsisV,
  faAngleUp,
  faAngleDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default class AdminDashboardDetails extends Component {
  constructor(props) {
    super(props);

    this.togglePop1 = this.togglePop1.bind(this);

    this.state = {
      visible: true,
      popoverOpen1: false,

      optionsRadial: {
        chart: {
          height: 350,
          type: "radialBar",
          toolbar: {
            show: true,
          },
        },
        plotOptions: {
          radialBar: {
            startAngle: -135,
            endAngle: 225,
            hollow: {
              margin: 0,
              size: "70%",
              background: "#fff",
              image: undefined,
              imageOffsetX: 0,
              imageOffsetY: 0,
              position: "front",
              dropShadow: {
                enabled: true,
                top: 3,
                left: 0,
                blur: 4,
                opacity: 0.24,
              },
            },
            track: {
              background: "#fff",
              strokeWidth: "67%",
              margin: 0, // margin is in pixels
              dropShadow: {
                enabled: true,
                top: -3,
                left: 0,
                blur: 4,
                opacity: 0.35,
              },
            },

            dataLabels: {
              showOn: "always",
              name: {
                offsetY: -10,
                show: true,
                color: "#888",
                fontSize: "17px",
              },
              value: {
                formatter: function (val) {
                  return parseInt(val);
                },
                color: "#111",
                fontSize: "36px",
                show: true,
              },
            },
          },
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "horizontal",
            shadeIntensity: 0.5,
            gradientToColors: ["#ABE5A1"],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
          },
        },
        stroke: {
          lineCap: "round",
        },
        labels: ["Percent"],
      },
      seriesRadial: [76],
    };
    this.onDismiss = this.onDismiss.bind(this);
  }

  togglePop1() {
    this.setState({
      popoverOpen1: !this.state.popoverOpen1,
    });
  }

  onDismiss() {
    this.setState({ visible: false });
  }

  render() {
    return (
      <Fragment>
        <TransitionGroup>
          <CSSTransition component="div" classNames="TabsAnimation" appear={true}
            timeout={1500} enter={false} exit={false}>
            <div className="adminDashboardDetails"> 
              <Alert className="mbg-3" color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
                <span className="pe-2">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
                This dashboard is in making. Some features may not work!
              </Alert>

              <Row >
                <Col xs="9" sm="9" md="9" lg="9" xl="9" >
              <Row>
                <Col xs="1" sm="1" md="3" lg="3">
                  <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-primary">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-title opacity-5">
                          active Clients
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
                <Col xs="1" sm="2" md="3" lg="3">
                  <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-danger border-danger">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-title opacity-5">
                          active Hiring managers
                        </div>
                        <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                          <div className="widget-chart-flex align-items-center">
                            <div>
                              <span className="opacity-10 text-danger pe-2">
                                <FontAwesomeIcon icon={faAngleDown} />
                              </span>
                              71
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs="1" sm="2" md="3" lg="3">
                  <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-warning border-warning">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-title opacity-5">
                          active Candidates
                        </div>
                        <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                          <div className="widget-chart-flex align-items-center">
                            <div>
                              <span className="opacity-10 text-danger pe-2">
                                <FontAwesomeIcon icon={faAngleDown} />
                              </span>
                              1,45M
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col xs="1" sm="2" md="3" lg="3">
                  <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-success border-success">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-title opacity-5">
                          open Jobs
                        </div>
                        <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                          <div className="widget-chart-flex align-items-center">
                            <div>
                              <span className="opacity-10 text-success pe-2">
                                <FontAwesomeIcon icon={faAngleUp} />
                              </span>
                              34
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
                  Interview stats
                </div>
              </CardHeader>
              <Card className="main-card mb-3">
                <CardHeader>
                  <div className="card-header-title font-size-lg text-capitalize fw-normal">
                    Today's interviews
                  </div>
                  <div className="btn-actions-pane-right">
                  </div>
                </CardHeader>
                <Table responsive borderless hover className="align-middle text-truncate mb-0">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Avatar</th>
                      <th className="text-center">Candidates</th>
                      <th className="text-center">Jobs</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Last active</th>
                      <th className="text-center">Recruitment Chances</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="text-center text-muted" style={{ width: "80px" }}>
                        #54
                      </td>
                      <td className="text-center" style={{ width: "80px" }}>
                        <img width={40} className="rounded-circle" src={avatar1} alt=""/>
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
                        12 Sept, 2023
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
                                <Progress className="progress-bar-xs" color="danger" value="71"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-block w-100 text-center">
                          <UncontrolledButtonDropdown direction="start">
                            <DropdownToggle
                              className="btn-icon btn-icon-only btn btn-link"
                              color="link"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </DropdownToggle>
                            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
                                <DropdownItem >
                                <i className="dropdown-icon lnr-user"> </i>
                                  <span >Profile</span>
                                </DropdownItem>
                              <DropdownItem>
                                <i className="dropdown-icon lnr-layers"> </i>
                                <span>Follow up</span>
                              </DropdownItem>
                              <DropdownItem>
                                <i className="dropdown-icon lnr-trash"> </i>
                                <span>Drop</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center text-muted" style={{ width: "80px" }}>
                        #55
                      </td>
                      <td className="text-center" style={{ width: "80px" }}>
                        <img width={40} className="rounded-circle" src={avatar2} alt=""/>
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
                        15 Dec, 2023
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
                                <Progress className="progress-bar-xs" color="warning" value="54"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-block w-100 text-center">
                          <UncontrolledButtonDropdown direction="start">
                            <DropdownToggle
                              className="btn-icon btn-icon-only btn btn-link"
                              color="link"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </DropdownToggle>
                            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
                              <DropdownItem >
                                <i className="dropdown-icon lnr-user"> </i>
                                <span >Profile</span>
                              </DropdownItem>
                              <DropdownItem>
                                <i className="dropdown-icon lnr-layers"> </i>
                                <span>Follow up</span>
                              </DropdownItem>
                              <DropdownItem>
                                <i className="dropdown-icon lnr-trash"> </i>
                                <span>Drop</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center text-muted" style={{ width: "80px" }}>
                        #56
                      </td>
                      <td className="text-center" style={{ width: "80px" }}>
                        <img width={40} className="rounded-circle" src={avatar3} alt=""/>
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
                        6 Dec, 2023
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
                                <Progress className="progress-bar-xs" color="success" value="97"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-block w-100 text-center">
                          <UncontrolledButtonDropdown direction="start">
                            <DropdownToggle
                              className="btn-icon btn-icon-only btn btn-link"
                              color="link"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </DropdownToggle>
                            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
                              <DropdownItem >
                                <i className="dropdown-icon lnr-user"> </i>
                                <span >Profile</span>
                              </DropdownItem>
                              <DropdownItem>
                                <i className="dropdown-icon lnr-layers"> </i>
                                <span>Follow up</span>
                              </DropdownItem>
                              <DropdownItem>
                                <i className="dropdown-icon lnr-trash"> </i>
                                <span>Drop</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td className="text-center text-muted" style={{ width: "80px" }}>
                        #56
                      </td>
                      <td className="text-center" style={{ width: "80px" }}>
                        <img width={40} className="rounded-circle" src={avatar4} alt=""/>
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
                        19 Dec, 2023
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
                                <Progress className="progress-bar-xs" color="info" value="88"/>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="d-block w-100 text-center">
                          <UncontrolledButtonDropdown direction="start">
                            <DropdownToggle
                              className="btn-icon btn-icon-only btn btn-link"
                              color="link"
                            >
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </DropdownToggle>
                            <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
                              <DropdownItem >
                                <i className="dropdown-icon lnr-user"> </i>
                                <span >Profile</span>
                              </DropdownItem>
                              <DropdownItem>
                                <i className="dropdown-icon lnr-layers"> </i>
                                <span>Follow up</span>
                              </DropdownItem>
                              <DropdownItem>
                                <i className="dropdown-icon lnr-trash"> </i>
                                <span>Drop</span>
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledButtonDropdown>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                <CardFooter className="d-block p-4 text-center">
                </CardFooter>
              </Card>
              </Col>
              <Col xs="3" sm="3" md="3" lg="3">
                  <Row >
                  <Col xs="1" sm="1" md="1" lg="1">
                    <div className="dividerheight vr"></div>
                  </Col>
                  <Col xs="10" sm="10" md="10" lg="10">
                      <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-primary">
                        <div className="widget-chat-wrapper-outer">
                          <div className="widget-chart-content">
                            <div className="widget-title opacity-5">
                              Today's interview
                            </div>
                            <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                              <div className="widget-chart-flex align-items-center">
                                <div>
                                  <span className="opacity-10 text-success pe-2">
                                    <FontAwesomeIcon icon={faAngleUp} />
                                  </span>
                                  14
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                      <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-primary">
                        <div className="widget-chat-wrapper-outer">
                          <div className="widget-chart-content">
                            <div className="widget-title opacity-5">
                              Upcoming interview
                            </div>
                            <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                              <div className="widget-chart-flex align-items-center">
                                <div>
                                  <span className="opacity-10 text-success pe-2">
                                    <FontAwesomeIcon icon={faAngleUp} />
                                  </span>
                                  54
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                      <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-primary">
                        <div className="widget-chat-wrapper-outer">
                          <div className="widget-chart-content">
                            <div className="widget-title opacity-5">
                              Interview history
                            </div>
                            <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                              <div className="widget-chart-flex align-items-center">
                                <div>
                                  ...
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                      <Card className="widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary border-primary">
                        <div className="widget-chat-wrapper-outer">
                          <div className="widget-chart-content">
                            <div className="widget-title opacity-5">
                              New candidate registrations
                            </div>
                            <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                              <div className="widget-chart-flex align-items-center">
                                <div>
                                  <span className="opacity-10 text-danger pe-2">
                                    <FontAwesomeIcon icon={faAngleDown} />
                                  </span>
                                  54
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}
