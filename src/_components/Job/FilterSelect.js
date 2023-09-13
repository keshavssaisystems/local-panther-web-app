import React from "react";
import { Label, Input, Row, Col } from "reactstrap";

export function FilterSelect({ name, optionData, id, label }) {
  return (
    <>
      <Label for={id} className="fw-semi-bold">
        {" "}
        {label}{" "}
      </Label>
      <Input id={id} name={name} type="select">
        {optionData.map((options, index) => (
          <option key={index} value={index}>
            {" "}
            {options}{" "}
          </option>
        ))}
      </Input>
    </>
  );
}

export function FilterMultipleSelect({ name1, optionData, id, label, name2 }) {
  return (
    <>
      <Label for={id} className="fw-semi-bold">
        {" "}
        {label}{" "}
      </Label>
      <Row className="mb-2">
        <Col>
          <Input id={id} name={name1} type="select">
            {optionData.map((options, index) => (
              <option key={index} value={index}>
                {" "}
                {options}{" "}
              </option>
            ))}
          </Input>
        </Col>
        <Col>
          <Input id={id} name={name2} type="select">
            {optionData.map((options, index) => (
              <option key={index} value={index}>
                {" "}
                {options}{" "}
              </option>
            ))}
          </Input>
        </Col>
      </Row>
    </>
  );
}
