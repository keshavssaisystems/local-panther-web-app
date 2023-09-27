import { SkillsFilter } from "_components/dropdownComponents/SkillsFilter";
import React, { useState } from "react";
import { FormGroup, Form, Row, Col, Button, Label, FormText } from "reactstrap";

export function KeyQualification({ data }) {
  const [mustHaveValidation, setMustHaveValidation] = useState(false);
  const getStringData = (data) => {
    let dataArray = [];
    if (data.length === undefined) {
      return data.value;
    }
    if (data.length !== undefined) {
      data.forEach((element) => {
        dataArray.push(element.value);
      });
      return dataArray.toString();
    }
  };
  const getFormData = (event) => {
    event.preventDefault();
    let mustHave = getStringData(event.target.elements.mustHave);
    let niceToHave = getStringData(event.target.elements.niceToHave);
    if (mustHave === "") {
      setMustHaveValidation(true);
    } else {
      setMustHaveValidation(false);
      let data = {
        mustHave: mustHave,
        niceToHave: niceToHave,
      };
      console.log(data);
    }
  };
  return (
    <>
      <Form onSubmit={(e) => getFormData(e)}>
        <Row>
          <Label className="fw-semi-bold">
            Additional qualification for the role
          </Label>
          <Col md={4}>
            <FormGroup>
              <SkillsFilter
                id={"mustHave"}
                name={"mustHave"}
                label={"Must have"}
              />
              {mustHaveValidation === true && (
                <FormText color="danger">
                  Please select must have skiils for better recommendations
                </FormText>
              )}
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <SkillsFilter
                id={"niceToHave"}
                name={"niceToHave"}
                label={"Nice to have"}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
      </Form>
    </>
  );
}
