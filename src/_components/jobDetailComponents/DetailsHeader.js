import React from "react";
import "./jobDetails.scss";
import { FiMapPin } from "react-icons/fi";
import { Col, Row } from "reactstrap";
import { ApplyJobModal } from "../../_containers/candidate/ApplyJobModal";

export function DetailsHeader({ heading, subHeading, location, ApplyButton }) {
  return (
    <>
      <div className="dropdown-menu-header">
        <div className="dropdown-menu-header-inner heading-background">
          <Row>
            <Col>
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
            {ApplyButton === true && (
              <Col>
                <ApplyJobModal
                  jobId={221}
                  heading={heading}
                  subHeading={subHeading}
                  location={location}
                />
              </Col>
            )}
          </Row>
        </div>
      </div>
    </>
  );
}
