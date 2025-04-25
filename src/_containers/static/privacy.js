import React from "react";
import { Container, Col, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";

import footerImg from "../../assets/utils/images/panther-logo.png";
import "./terms.scss";

export function PrivacyPolicy() {
  return (
    <>
      <Container className="my-5">
        <Col className="text-center mb-3">
          {/* <img src={plogo} height="100px" alt="logo" /> */}
        </Col>
        <h1 className="display-4 text-center">Our Commitment To Privacy</h1>

        <p className="info-text">
          To better protect your privacy, we provide this notice explaining
          OpenWorX’s online information practices and the choices you can make
          about the way your information is collected and used. This notice is
          available on our homepage and wherever personally identifiable
          information may be requested. This notice applies to all information
          collected or submitted on the OpenWorX website.
        </p>

        <h2 className="section-title mt-4">The Information We Collect</h2>
        <p className="info-text">
          When you browse our website, your IP address (the Internet address of
          your computer) is recorded so we may know how you are using our
          website. Your browser may also automatically provide us with
          information regarding your computer and operating system. This
          information is used by OpenWorX to monitor and improve our website and
          is not linked back to you as an individual user.
        </p>

        <p className="info-text">
          On some pages, you can order services, make requests, and register to
          receive materials. The types of personal information collected on
          these pages include name, address, email, phone, fax, and billing
          information. Additionally, to tailor our subsequent communications and
          continuously improve our services, we may ask you to voluntarily
          provide information regarding your personal or professional interests,
          demographics, experience with our services, and contact preferences.
        </p>

        <h2 className="section-title mt-4">The Way We Use Information</h2>
        <p className="info-text">
          OpenWorX uses this information to better understand your needs and
          provide you with improved services. Specifically, we use your
          information to help complete a transaction, communicate with you,
          update you on services and benefits, and personalize our website for
          you.
        </p>

        <p className="info-text">
          From time to time, we may also use your information to contact you for
          market research or to provide information about other OpenWorX
          services that we believe may be of interest to you. We will always
          offer you the opportunity to opt out of receiving such direct
          marketing or market research communications, and you may exercise this
          right at any time. We never use or share personal information you
          provide online in ways unrelated to the ones described above without
          providing an opportunity to opt out or otherwise prohibit such
          unrelated uses.
        </p>

        <h2 className="section-title mt-4">
          How You Can Correct Your Information
        </h2>
        <p className="info-text">
          At any time, you may obtain a summary of your personal information on
          record with OpenWorX. You may also request that we dispose of any or
          all personal information about you, except for information needed to
          complete transactions or to maintain proper records of previous
          transactions. You can help us maintain the accuracy of your
          information by notifying us of any changes to your personal details.
        </p>

        <h2 className="section-title mt-4">How To Contact Us</h2>
        <p className="info-text">
          If you have any questions or concerns about this Privacy Statement or
          how we handle your personal information, please contact us. OpenWorX
          welcomes comments and suggestions concerning this Privacy Statement.
          We are committed to respecting your privacy and protecting your
          personal information.
        </p>

        <h2 className="section-title mt-4">Your Acceptance of These Terms</h2>
        <p className="info-text">
          By using the OpenWorX website, you signify your agreement to this
          Privacy Statement. OpenWorX reserves the right to change this Privacy
          Statement at any time. Any revisions will be posted on this site.
          Please check this page periodically for changes.
        </p>
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
            <a href="/terms" rel="noopener noreferrer" className="footer-link">
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
