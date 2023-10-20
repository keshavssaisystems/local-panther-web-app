import React from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { Row, Col } from "reactstrap";
export const NoDataFound = () => {
  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={12} lg={12} className="mt-5 mb-5">
          <BsFillExclamationTriangleFill
            size={"100px"}
          ></BsFillExclamationTriangleFill>
        </Col>
        <Col sm={12} md={12} xl={12} lg={12} className="mb-5">
          <h1 style={{ fontWeight: "revert" }}>NO DATA FOUND</h1>
        </Col>
      </Row>
    </div>
  );
};
