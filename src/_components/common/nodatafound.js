import React from "react";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { Row, Col } from "reactstrap";
export const NoDataFound = (props) => {
  debugger;
  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={12} lg={12} className="mt-5 mb-3">
          <BsFillExclamationTriangleFill
            size={props && props.imageSize ? props.imageSize : "100px"}
          ></BsFillExclamationTriangleFill>
        </Col>
        <Col sm={12} md={12} xl={12} lg={12} className="mb-3">
          {props && props.imageSize ? (
            <h6 style={{ fontWeight: "revert" }}>NO DATA FOUND</h6>
          ) : (
            <h1 style={{ fontWeight: "revert" }}>NO DATA FOUND</h1>
          )}
        </Col>
      </Row>
    </div>
  );
};
