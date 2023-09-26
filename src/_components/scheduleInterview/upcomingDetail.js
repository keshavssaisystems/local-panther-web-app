import React from "react";
import {
  CardHeader,
  Col,
  CardFooter,
  Button,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
  Card,
  CardBody,
} from "reactstrap";
import "./scheduledInterview.scss";
import { FaEllipsisV } from "react-icons/fa";
import { BsCheckLg, BsCameraVideo } from "react-icons/bs";
import { TakeNotesModal } from "./takeNotesModal";

export function UpcomingDetail() {
  return (
    <>
      <Card className="upcoming-interview">
        <CardBody>
          <div className="dropdown-menu-header">
            <div className="dropdown-menu-header-inner">
              <div className="menu-header-content btn-pane-right">
                <Col lg="4">
                  <h6 className="job-main-heading mb-0">Ajay Singh</h6>
                </Col>
                <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    outline
                    size="sm"
                    className="mb-2 mr-2 btn-transition btn btn-outline-primary"
                    color="primary"
                  >
                    {" "}
                    Invite to interview{" "}
                  </Button>
                  <Button
                    outline
                    size="sm"
                    className="mb-2 mr-2 btn-transition"
                    color="primary"
                  >
                    {" "}
                    Message{" "}
                  </Button>
                  <Button
                    outline
                    size="sm"
                    className="mb-2 mr-2 btn-transition"
                    color="primary"
                  >
                    {" "}
                    Call{" "}
                  </Button>

                  <UncontrolledButtonDropdown>
                    <DropdownToggle
                      className="btn-icon btn-icon-only"
                      color="link"
                    >
                      <FaEllipsisV />
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
          <div className="divider" />
          <div className="p-custom">
            <h6 className="fw-bold mb-0 job-heading">Email</h6>
            <p className="mb-0">ajaysingh@gmail.com</p>
          </div>
          <div className="p-custom">
            <p className="mb-0">
              <h6 className="fw-bold mb-0 job-heading">Mobile</h6>
              (987)-654-3210
            </p>
          </div>
          <div className="p-custom">
            <p className="mb-0">
              <h6 className="fw-bold mb-0 job-heading">Skills</h6>
              Java, Spring Boot, React JS, SQL Server ...
            </p>
          </div>
          <div className="p-custom">
            <p className="mb-0">
              <h6 className="fw-bold mb-0 job-heading">Status</h6>
              Scheduled
            </p>
          </div>
          <Card className="mt-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                <BsCameraVideo className="header-icon icon-gradient bg-amy-crisp" />
                Interview
              </div>
              <div className="btn-actions-pane-right text-capitalize actions-icon-btn">
                <UncontrolledButtonDropdown>
                  <DropdownToggle
                    className="btn-icon btn-icon-only"
                    color="link"
                  >
                    <FaEllipsisV />
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
            <CardBody>
              <div className="p-custom">
                <p className="mb-0">Today : 3:00 PM to 4:00 PM</p>
              </div>
              <div className="p-custom">
                <p className="mb-0">Mode : Video</p>
              </div>
              <div className="p-custom">
                <p className="mb-0">
                  Interview link :{" "}
                  <a
                    href="https://meet.google.com/daj-jvga-hkc"
                    onClick={(e) => e.preventDefault()}
                  >
                    Click here to join
                  </a>
                </p>
              </div>
              <div className="p-custom">
                <p className="mb-0">Interviewer : iswatirupatirao@gmail.com</p>
              </div>
            </CardBody>
            <CardFooter className="d-block text-left">
              <TakeNotesModal />
              <Button
                outline
                className="mb-2 mr-2 btn-transition"
                color="primary"
                size={"sm"}
              >
                {" "}
                Add interview guide{" "}
              </Button>
            </CardFooter>
          </Card>

          <div className="p-3">
            <h6 className="fw-bold">Summary</h6>
            <p className="mb-0">
              A: 3 years Java server-side development experience with excellent
              understanding of core design patterns B: Hands on experience in
              Java 8 and above versions is MUST
            </p>
          </div>
          <div className="p-3">
            <h6 className="fw-bold">Application questions</h6>
            <p className="mb-0">
              A: 3 years Java server-side development experience with excellent
              understanding of core design patterns B: Hands on experience in
              Java 8 and above versions is MUST
            </p>
          </div>
          <div className="p-3">
            <h6 className="fw-bold">Phase pre-screen</h6>
            <p className="mb-0">
              A: 3 years Java server-side development experience with excellent
              understanding of core design patterns B: Hands on experience in
              Java 8 and above versions is MUST
            </p>
          </div>
          <div className="p-3">
            <h6 className="fw-bold">Skills test</h6>
            <p className="mb-0">
              A: 3 years Java server-side development experience with excellent
              understanding of core design patterns B: Hands on experience in
              Java 8 and above versions is MUST
            </p>
          </div>
          <div className="divider" />
          <div className="d-block text-center mb-1">
            <h6 className="fw-bold">Request sent on Sept 17, 2023</h6>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
