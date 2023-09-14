import React from "react";
import { Label, Input, FormGroup, Row, Col } from "reactstrap";

export function RadioButtonFormGroup({ name, id, label }) {
  return (
    <>
      <FormGroup>
        <Label check className="fw-semi-bold">
          {"  "}
          {"   " + label}
        </Label>
        <Row className="mt-2">
          <Col md={3}>
            <Input name={name} type="radio" id={id + "_yes"} value={"yes"} />{" "}
            <Label check for={id + "_yes"}>
              Yes
            </Label>
          </Col>
          <Col md={3}>
            <Input name={name} type="radio" id={id + "_no"} value={"no"} />{" "}
            <Label check for={id + "_no"}>
              No
            </Label>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
}
