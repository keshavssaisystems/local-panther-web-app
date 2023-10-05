import React, { Component, Fragment } from "react";
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import avatar1 from "assets/utils/images/avatars/1.jpg";
import avatar2 from "assets/utils/images/avatars/2.jpg";
import avatar3 from "assets/utils/images/avatars/3.jpg";
import avatar4 from "assets/utils/images/avatars/4.jpg";

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
            <div>  
              <Alert className="mbg-3" color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
                <span className="pe-2">
                  <FontAwesomeIcon icon={faQuestionCircle} />
                </span>
                This dashboard is in making. Some features may not work!
              </Alert>
              <Row>
                <Col md="6" lg="3">
                  <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-start">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-chart-flex">
                          <div className="widget-numbers mb-0 w-100">
                            <div className="widget-chart-flex">
                              <div className="fsize-4">
                                5,456
                              </div>
                              <div className="ms-auto">
                                <div className="widget-title ms-auto font-size-lg fw-normal text-muted">
                                  <small className="opacity-5">active</small>
                                  <span className="text-dark ps-2">Clients</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col md="6" lg="3">
                  <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-start">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-chart-flex">
                          <div className="widget-numbers mb-0 w-100">
                            <div className="widget-chart-flex">
                              <div className="fsize-4 ">
                                <small className="opacity-5 text-muted"></small>
                                4,764
                              </div>
                              <div className="ms-auto">
                                <div className="widget-title ms-auto font-size-lg fw-normal text-muted">
                                  <small className="opacity-5">active</small>
                                  <span className="text-dark ps-2">Hiring managers</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col md="6" lg="3">
                  <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-start">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-chart-flex">
                          <div className="widget-numbers mb-0 w-100">
                            <div className="widget-chart-flex">
                              <div className="fsize-4">
                                {/* <span className="text-success pe-2">
                                  <FontAwesomeIcon icon={faAngleDown} />
                                </span> */}
                                1.5M
                              </div>
                              <div className="ms-auto">
                                <div className="widget-title ms-auto font-size-lg fw-normal text-muted">
                                  <small className="opacity-5">active</small>
                                  <span className="text-dark ps-2">Candidates</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col md="6" lg="3">
                  <Card className="card-shadow-primary mb-3 widget-chart widget-chart2 text-start">
                    <div className="widget-chat-wrapper-outer">
                      <div className="widget-chart-content">
                        <div className="widget-chart-flex">
                          <div className="widget-numbers mb-0 w-100">
                            <div className="widget-chart-flex">
                              <div className="fsize-4">
                                31,564
                              </div>
                              <div className="ms-auto">
                                <div className="widget-title ms-auto font-size-lg fw-normal text-muted">
                                  <small className="opacity-5">open</small>
                                  <span className="text-dark ps-2">Jobs</span>
                                </div>
                              </div>
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
            </div>
          </CSSTransition>
        </TransitionGroup>
      </Fragment>
    );
  }
}
