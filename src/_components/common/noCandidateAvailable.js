import React from "react";
import NoDataImg from "../../assets/utils/images/NoData.svg";
import { Row, Col } from "reactstrap";
export const NoCandidateAvailable = ({ message }) => {
  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={12} lg={12} className="mt-5 mb-3">
          <img src={NoDataImg} alt="No data" className="no-data-image" />
        </Col>
        <Col sm={12} md={12} xl={12} lg={12} className="mb-3">
          <h6 style={{ fontWeight: "revert" }}>{message}</h6>
        </Col>
      </Row>
    </div>
  );
};
