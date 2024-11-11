import React from "react";
import { Container, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/utils/images/panther-logo.png";
import plogo from "../../assets/utils/images/panther-logo-2.png";
import "./terms.scss";

export function Support() {
  return (
    <>
      <Container className="my-5">
        <Col className="text-center mb-3">
          <img src={plogo} height="100px" alt="logo" />
        </Col>
        <h2 className="section-title text-center mt-4">
          Get in touch with our Support Team <br />
          <a href="mailto:support@openworx.ai" class="support-link">
            support@openworx.ai
          </a>
        </h2>
        <div className="text-center mt-4">
          Powered by <br />{" "}
          <img src={logo} className="footer-logo ms-1" alt="logo" />
        </div>
      </Container>
    </>
  );
}
