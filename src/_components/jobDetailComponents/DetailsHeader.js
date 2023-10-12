import React from "react";
import "./jobDetails.scss";
import { FiMapPin } from "react-icons/fi";
import { Col, Row, Button } from "reactstrap";

export function DetailsHeader({
  heading,
  subHeading,
  location,
  // ApplyButton,
  // jobId,
  // department,
  showApplyBtn,
  applyBtnState,
  onClickApply,
}) {
  return (
    <>
      <div className="dropdown-menu-header">
        <div className="dropdown-menu-header-inner heading-background">
          <Row>
            <Col md={9} lg={9}>
              <div className="menu-header-content btn-pane-right text-start">
                <div>
                  <h5 className="menu-header-title job-title-details">
                    {heading}
                  </h5>
                  <p className="mb-0 mt-0">{subHeading}</p>
                  <p className="mb-0 mt-0">
                    <FiMapPin className="muted-icon" /> {location}
                  </p>
                </div>
              </div>
            </Col>
            {showApplyBtn ? (
              <Col md={3} lg={3} className="right-align">
                <Button onClick={() => onClickApply()} color="primary">
                  Apply Now
                </Button>
              </Col>
            ) : (
              <></>
            )}
          </Row>
        </div>
      </div>
    </>
  );
}
