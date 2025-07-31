import React from "react";
import { Container, Col, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import "./terms.scss";
import footerImg from "../../assets/utils/images/panther-logo.png";

export default function Support() {
  return (
    <>
      <Container className="my-5">
        <Col className="text-center mb-3">
          {/* <img src={plogo} height="100px" alt="logo" /> */}
        </Col>
        <h2 className="section-title text-center mt-4">
          Get in touch with our Support Team <br />
          <a href="mailto:support@openworx.ai" class="support-link">
            support@openworx.ai
          </a>
        </h2>
      </Container>
      <footer className="footer--pin">
        <Row>
          <Col lg="2" md="2" sm="12"></Col>
          <Col
            xxl={{ order: 1, size: 3 }}
            xl={{ order: 1, size: 3 }}
            lg={{ order: 1, size: 3 }}
            md={{ order: 1, size: 3 }}
            sm={{ order: 1, size: 12 }}
            xs={{ order: 1, size: 12 }}
            className="text-start mt-1"
          >
            <span className="mt-2 pb-text">Powered by</span>
            <img
              src={footerImg}
              className="logo ms-1"
              width="135px"
              alt="logo"
            />
          </Col>
          <Col
            xxl={{ order: 2, size: 5 }}
            xl={{ order: 2, size: 5 }}
            lg={{ order: 2, size: 5 }}
            md={{ order: 1, size: 5 }}
            sm={{ order: 1, size: 12 }}
            xs={{ order: 1, size: 12 }}
            className="text-end mt-1"
          >
            <a
              href="/privacy"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Privacy Policy
            </a>
            <span className="mx-2">|</span>
            <a href="/terms" rel="noopener noreferrer" className="footer-link">
              Terms & Conditions
            </a>
            <span className="mx-2">|</span>
            <a
              href="/contact"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Contact Us
            </a>
            <span className="mx-2">|</span>
            <a href="/" rel="noopener noreferrer" className="footer-link">
              Home
            </a>
          </Col>
        </Row>
      </footer>
    </>
  );
}
