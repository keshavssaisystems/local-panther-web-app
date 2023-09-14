import React from "react";
import { Label, Input, FormGroup, Row, Col } from "reactstrap";

export function CheckboxFormGroup({ name, id, label }) {
  return (
    <>
      <FormGroup>
        <Label check for={id} className="fw-semi-bold">
          {label}
        </Label>
        <Row className="mt-2">
          <Col md={3}>
            <Input type="checkbox" name={name} id={id} />
            {"  "}
            <Label check for={id}>
              Yes
            </Label>
          </Col>
          <Col md={3}>
            <Input type="checkbox" name={name} id={id} />
            {"  "}
            <Label check for={id}>
              No
            </Label>
          </Col>
        </Row>
      </FormGroup>
    </>
  );
}
