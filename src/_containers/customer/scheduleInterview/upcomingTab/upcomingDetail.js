import React from "react";
import {
  Row,
  Col,
  Button,
  CardHeader,
  CardFooter,
  Card,
  CardBody,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
} from "reactstrap";

import {
  BsPersonVcard,
  BsMailbox,
  BsPhoneFill,
  BsPlaystation,
  BsListStars
} from "react-icons/bs";

import PerfectScrollbar from "react-perfect-scrollbar";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";

export function UpcomingDetail() {
  return (
    <>

      <Card>
        <CardBody>
          <div className="dropdown-menu-header">
            <div className="dropdown-menu-header-inner heading-background">
              <div className="menu-header-content btn-pane-right text-start">
                <Col lg="6">
                  <h5 className="menu-header-title job-title-details">
                    Fullstack developer
                  </h5>
                  <p className="mb-0 mt-0">
                    Graysville, Connecticut, USA
                  </p>
                </Col>
                <Col style={{'display': 'flex', "justify-content": "flex-end"}}>
                  <Button outline className="mb-2 mr-2 btn-transition btn btn-outline-primary" color="primary"> Invite to interview </Button>
                  <Button outline className="mb-2 mr-2 btn-transition" color="primary"> Message </Button>
                  <Button outline className="mb-2 mr-2 btn-transition" color="primary"> Call </Button>
                  
                  
                  <UncontrolledButtonDropdown>
                    <DropdownToggle className="btn-icon btn-icon-only" color="link">
                      <i className="pe-7s-menu btn-icon-wrapper" />
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                      <DropdownItem>
                        <i className="dropdown-icon lnr-inbox"> </i>
                        <span>Reject</span>
                      </DropdownItem>
                      <DropdownItem>
                        <i className="dropdown-icon lnr-file-empty"> </i>
                        <span>Delete</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledButtonDropdown>
                </Col>
              </div>
            </div>
          </div>
          <div className="heading-title">
            <h6 className="job-main-heading mb-0">Details</h6>
          </div>

          <div>
            <Row>
              <Col md="1" className="padding-demo-1">
                <div className="detail-padding-icon">
                  {<BsPersonVcard />}
                </div>
              </Col>
              <Col className="padding-demo-2">
                <div className="detail-padding">
                  <h6 className="fw-bold mb-0 job-heading">Name</h6>
                  <p className="mb-0 mt-1">Ajay Singh</p>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col md="1" className="padding-demo-1">
                <div className="detail-padding-icon">
                  {<BsMailbox />}
                </div>
              </Col>
              <Col className="padding-demo-2">
                <div className="detail-padding">
                  <h6 className="fw-bold mb-0 job-heading">Email</h6>
                  <p className="mb-0 mt-1">ajay@SaiSystems.com</p>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col md="1" className="padding-demo-1">
                <div className="detail-padding-icon">
                  {<BsPhoneFill />}
                </div>
              </Col>
              <Col className="padding-demo-2">
                <div className="detail-padding">
                  <h6 className="fw-bold mb-0 job-heading">Mobile: </h6>
                  <p className="mb-0 mt-1">80850-34214</p>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col md="1" className="padding-demo-1">
                <div className="detail-padding-icon">
                  {<BsListStars />}
                </div>
              </Col>
              <Col className="padding-demo-2">
                <div className="detail-padding">
                  <h6 className="fw-bold mb-0 job-heading">Skills: </h6>
                  <p className="mb-0 mt-1">.NET Assemblies,.NET Development,.…</p>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Row>
              <Col md="1" className="padding-demo-1">
                <div className="detail-padding-icon">
                  {<BsPlaystation />}
                </div>
              </Col>
              <Col className="padding-demo-2">
                <div className="detail-padding">
                  <h6 className="fw-bold mb-0 job-heading">Status: </h6>
                  <p className="mb-0 mt-1">Confirmed</p>
                </div>
              </Col>
            </Row>
          </div>
          <Card>
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                <i className="header-icon lnr-lighter icon-gradient bg-amy-crisp"> {" "} </i>
                Interviews
              </div>
              <div className="btn-actions-pane-right text-capitalize actions-icon-btn">
                <UncontrolledButtonDropdown>
                  <DropdownToggle className="btn-icon btn-icon-only" color="link">
                    <i className="pe-7s-menu btn-icon-wrapper" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                    <DropdownItem>
                      <i className="dropdown-icon lnr-inbox"> </i>
                      <span>Edit</span>
                    </DropdownItem>
                    <DropdownItem>
                      <i className="dropdown-icon lnr-file-empty"> </i>
                      <span>Cancel</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardHeader>
            <div>
              <PerfectScrollbar>
                <div className="p-4">
                  <VerticalTimeline layout="1-column">
                    <VerticalTimelineElement className="vertical-timeline-item"
                      icon={
                        <i className="badge badge-dot badge-dot-xl bg-success"> {" "} </i>
                      }
                      date="Today">
                      <h4 className="timeline-title">Interview, at <b className="text-danger">3:00 PM</b></h4>
                      <p>
                          03:00 PM 
                            To
                          04:00 PM
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement className="vertical-timeline-item"
                      icon={
                        <i className="badge badge-dot badge-dot-xl bg-warning"> {" "} </i>
                      }
                      date="Mode">
                      <h4  className="timeline-title">
                        VIDEO {" "}
                      </h4>
                      <p>
                        Interview Link {" "}
                        
                        <a href="https://meet.google.com/daj-jvga-hkc" onClick={(e) => e.preventDefault()}>
                          Click here to join
                        </a>
                        {" "}
                        or join by https://meet.google.com/daj-jvga-hkc
                      </p>
                    </VerticalTimelineElement>
                    <VerticalTimelineElement className="vertical-timeline-item"
                      icon={
                        <i className="badge badge-dot badge-dot-xl bg-danger"> {" "} </i>
                      }>
                      <h4 className="timeline-title">
                        Interviewer
                      </h4>
                      <p>
                        Vinit Pal
                      </p>
                    </VerticalTimelineElement>
                  </VerticalTimeline>
                </div>
              </PerfectScrollbar>
            </div>
            <CardFooter className="d-block text-left">
              <Button outline className="mb-2 mr-2 btn-transition btn btn-outline-primary" color="primary"> Take Notes </Button>
              <Button outline className="mb-2 mr-2 btn-transition" color="secondary"> Cancel </Button>
            </CardFooter>
          </Card>

          <div className="p-3">
            <h6 className="fw-bold">Summary</h6>
            <p className="mb-0">A: 3 years Java server-side development experience with excellent understanding of core design patterns B: Hands on experience in Java 8 and above versions is MUST C: Hands on experience in spring Boot and Microservices for more than 2 years is required D: Hands on experience in spring Boot and Microservices of consuming and providing REST APIs E: Excellent knowledge of J2EE architecture/design patterns, Object Oriented Design methodologies, SOA, data modelling techniques and SOAPtesting, CI / CD</p>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
