import React from "react";
import { Container, Col } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/utils/images/panther-logo.png";
import plogo from "../../assets/utils/images/panther-logo-2.png";
import "./terms.scss";

export function Contact() {
  return (
    <>
      <Container className="my-5">
        <Col className="text-center mb-3">
          <img src={plogo} height="100px" alt="logo" />
        </Col>
        <h2 className="section-title text-center mt-4">
          For more information, please contact us at <br />
          <a href="mailto:info@openworx.ai" class="support-link">
            info@openworx.ai
          </a>
          <br />
          We're here to help with any inquiries!
        </h2>
        <div className="text-center mt-4">
          Powered by <br />{" "}
          <img src={logo} className="footer-logo ms-1" alt="logo" />
        </div>
      </Container>
    </>
  );
}
