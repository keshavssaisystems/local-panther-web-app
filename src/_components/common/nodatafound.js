import React from "react";
import NoDataImg from "../../assets/utils/images/NoData.svg";
import { Row, Col } from "reactstrap";
export const NoDataFound = (props) => {
  return (
    <div>
      <Row>
        <Col sm={12} md={12} xl={12} lg={12} className="mt-5 mb-3">
          <img src={NoDataImg} alt="No data" className="no-data-image" />
        </Col>
        <Col sm={12} md={12} xl={12} lg={12} className="mb-3">
          <h6 style={{ fontWeight: "revert" }}>
            {props?.text ? props?.text : "No Data Available"}
          </h6>
          <p style={{ fontSize: "0.85rem", color: "#6c757d", marginTop: "4px" }}>
            There is currently no data to display.
            <br />
            Data will appear here once it becomes available.
          </p>
        </Col>
      </Row>
    </div>
  );
};
