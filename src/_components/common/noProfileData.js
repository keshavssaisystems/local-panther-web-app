import React from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { Row, Col } from "reactstrap";
export const NoProfileData = (props) => {
  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={12} lg={12} className="mt-5 mb-3">
          <BsFillExclamationTriangleFill
            size={"25px"}
          ></BsFillExclamationTriangleFill>
        </Col>
        <Col sm={12} md={12} xl={12} lg={12} className="mb-3">
          <h6 style={{ fontWeight: "revert" }}>NOT ENTERED</h6>
        </Col>
      </Row>
    </div>
  );
};
