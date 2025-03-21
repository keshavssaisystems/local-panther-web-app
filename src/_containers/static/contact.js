import React from "react";
import { Container, Col, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/utils/images/panther-logo.png";
import plogo from "../../assets/utils/images/panther-logo-2.png";
import footerImg from "../../assets/utils/images/panther-logo.png";
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
            <span className="mt-2">Powered by</span>
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
            <a
              href="/terms"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Terms & Conditions
            </a>
            <span className="mx-2">|</span>
            <a
              href="/support"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Support
            </a>
            <span className="mx-2">|</span>
            <a
              href="/"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Home
            </a>
          </Col>
        </Row>
      </footer>
    </>
  );
}
