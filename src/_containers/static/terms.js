import React from "react";
import { Container, Col, Row } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../../assets/utils/images/panther-logo.png";
import plogo from "../../assets/utils/images/panther-logo-2.png";
import footerImg from "../../assets/utils/images/panther-logo.png";
import "./terms.scss";

export function TermsAndConditions() {
  return (
    <>
      <Container className="my-5">
        <Col className="text-center mb-3">
          {/* <img src={plogo} height="100px" alt="logo" /> */}
        </Col>
        <h1 className="display-4 text-center">Important Information</h1>

        <p className="info-text">
          OpenWorX (“OpenWorX”) maintains this site (the “Site”) for your
          personal entertainment, information, education, and communication. You
          may browse the Site and download material displayed on it for
          non-commercial, personal use only, provided you retain all copyright
          and other proprietary notices on the materials. However, you may not
          distribute, modify, transmit, reuse, report, or use the contents of
          the Site for public or commercial purposes, including text, images,
          audio, and video, without OpenWorX’s written permission.
        </p>

        <p className="info-text">
          Your access and use of the Site are also subject to the following
          terms and conditions (“Terms and Conditions”) and all applicable laws.
          By accessing and browsing the Site, you accept, without limitation or
          qualification, these Terms and Conditions.
        </p>

        <h2 className="section-title mt-4">Terms and Conditions</h2>
        <p className="info-text">
          Assume that everything you see or read on the Site is copyrighted
          unless otherwise noted and may not be used except as provided in these
          Terms and Conditions or as specified on the Site without written
          permission from OpenWorX. OpenWorX neither warrants nor represents
          that your use of materials displayed on the Site will not infringe on
          the rights of third parties not affiliated with OpenWorX.
        </p>

        <p className="info-text">
          While OpenWorX makes reasonable efforts to include accurate and
          up-to-date information on the Site, it makes no warranties or
          representations regarding its accuracy. OpenWorX assumes no liability
          for any errors or omissions in the content on the Site.
        </p>

        <h2 className="section-title mt-4">Communications</h2>
        <p className="info-text">
          Any communication or material you transmit to the Site by electronic
          mail or otherwise, including any data, questions, comments,
          suggestions, or the like, is and will be treated as non-confidential
          and non-proprietary. Anything you transmit or post may be used by
          OpenWorX or its affiliates for any purpose, including reproduction,
          disclosure, transmission, publication, broadcast, and posting.
        </p>

        <h2 className="section-title mt-4">Use of Images</h2>
        <p className="info-text">
          Images on the Site are either owned by or used with permission by
          OpenWorX. Unauthorized use of these images is prohibited unless
          specifically permitted by these Terms and Conditions. Unauthorized use
          may violate copyright laws, trademark laws, privacy and publicity
          laws, and communications regulations.
        </p>

        <h2 className="section-title mt-4">Links to Other Sites</h2>
        <p className="info-text">
          OpenWorX has not reviewed all sites linked to the Site and is not
          responsible for their content. Linking to any other off-site pages or
          sites is at your own risk.
        </p>

        <h2 className="section-title mt-4">User-Generated Content</h2>
        <p className="info-text">
          Although OpenWorX may monitor discussions, chats, postings,
          transmissions, and bulletin boards on the Site, it is under no
          obligation to do so. OpenWorX assumes no responsibility for any error,
          defamation, libel, slander, omission, falsehood, obscenity,
          pornography, profanity, danger, or inaccuracy in any information on
          the Site.
        </p>

        <p className="info-text">
          You are prohibited from posting unlawful, threatening, libelous,
          defamatory, obscene, scandalous, inflammatory, pornographic, or
          profane materials, or any material that could constitute or encourage
          criminal conduct. OpenWorX will fully cooperate with law enforcement
          authorities or court orders requesting OpenWorX to disclose the
          identity of anyone posting such information.
        </p>

        <h2 className="section-title mt-4">
          Revisions to Terms and Conditions
        </h2>
        <p className="info-text">
          OpenWorX may revise these Terms and Conditions at any time by updating
          this posting. You are bound by any revisions and should visit this
          page periodically to review the current Terms and Conditions.
        </p>

        <h2 className="section-title mt-4">Linking and Logo Information</h2>
        <p className="info-text">
          OpenWorX encourages links to our pages. However, please notify our
          webmaster when you link to our pages to keep you informed of changes.
          All graphics and content on the OpenWorX site are Copyright ©, 2022
          OpenWorX. All rights reserved.
        </p>

        <h2 className="section-title mt-4">The Information We Collect</h2>
        <p className="info-text">
          This website uses cookies to record user-specific information about
          pages accessed or actions taken during your visit. These cookies do
          not store or collect any personally identifiable data.
        </p>

        <h2 className="section-title mt-4">How We Use Information</h2>
        <p className="info-text">
          Through cookies on this site, we create remarketing lists that
          identify and serve users with specific interests in our company,
          products, or services. Third-party vendors, including Google and
          Facebook, use cookies to display relevant ads based on past visits to
          the OpenWorX website.
        </p>

        <h2 className="section-title mt-4">
          Access or Correct Your Information
        </h2>
        <p className="info-text">
          You can opt-out of Google’s cookie use by visiting{" "}
          <a
            href="https://adssettings.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google’s Ads Settings
          </a>
          . Alternatively, you may opt out of a third-party vendor’s use of
          cookies by visiting the{" "}
          <a
            href="https://optout.networkadvertising.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Network Advertising Initiative opt-out page
          </a>
          .
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
