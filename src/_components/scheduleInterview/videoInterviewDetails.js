import React from "react";
import {
  CardHeader,
  Col,
  CardFooter,
  Button,
  ButtonGroup,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  UncontrolledButtonDropdown,
  Card,
  CardBody,
} from "reactstrap";
import "./scheduledInterview.scss";
import { FaEllipsisV } from "react-icons/fa";
import { BsCheckLg } from "react-icons/bs";

export function VideoInterviewDetails() {
  return (
    <>
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
              <ButtonGroup size={"sm"}>
                <Button
                  name="format"
                  color={"primary"}
                  size={"sm"}
                  className="mb-2 btn-transition"
                  outline
                >
                  <BsCheckLg />
                </Button>
                <Button
                  name="format"
                  color={"primary"}
                  size={"sm"}
                  className="mb-2 btn-transition"
                  outline
                >
                  ?
                </Button>
                <Button
                  name="format"
                  color={"primary"}
                  size={"sm"}
                  className="mb-2 btn-transition"
                  outline
                >
                  X
                </Button>
              </ButtonGroup>

              <UncontrolledButtonDropdown>
                <DropdownToggle className="btn-icon btn-icon-only" color="link">
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
      <div className="p-custom">
        <p className="mb-0">ajaysingh@gmail.com</p>
      </div>
      <div className="p-custom">
        <p className="mb-0">Applied to Java Developer, Shelton, CT, 06611</p>
      </div>
      <Card className="mt-3">
        <CardHeader className="card-header-tab">
          <div className="card-header-title font-size-lg text-capitalize fw-normal">
            <i className="header-icon lnr-lighter icon-gradient bg-amy-crisp">
              {" "}
            </i>
            Interviews
          </div>
          <div className="btn-actions-pane-right text-capitalize actions-icon-btn">
            <UncontrolledButtonDropdown>
              <DropdownToggle className="btn-icon btn-icon-only" color="link">
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
          <Button
            outline
            className="mb-2 mr-2 btn-transition btn btn-outline-primary"
            color="primary"
            size={"sm"}
          >
            {" "}
            Take notes{" "}
          </Button>
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
          understanding of core design patterns B: Hands on experience in Java 8
          and above versions is MUST
        </p>
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Application questions</h6>
        <p className="mb-0">
          A: 3 years Java server-side development experience with excellent
          understanding of core design patterns B: Hands on experience in Java 8
          and above versions is MUST
        </p>
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Phase pre-screen</h6>
        <p className="mb-0">
          A: 3 years Java server-side development experience with excellent
          understanding of core design patterns B: Hands on experience in Java 8
          and above versions is MUST
        </p>
      </div>
      <div className="p-3">
        <h6 className="fw-bold">Skills test</h6>
        <p className="mb-0">
          A: 3 years Java server-side development experience with excellent
          understanding of core design patterns B: Hands on experience in Java 8
          and above versions is MUST
        </p>
      </div>
      <div className="divider" />
      <div className="d-block text-center mb-1">
        <h6 className="fw-bold">Request sent on Sept 17, 2023</h6>
      </div>
    </>
  );
}
