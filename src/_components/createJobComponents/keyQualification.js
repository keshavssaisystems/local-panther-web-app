import { SkillsFilter } from "_components/dropdownComponents/SkillsFilter";
import React, { useState } from "react";
import { FormGroup, Form, Row, Col, Button, Label, FormText } from "reactstrap";

export function KeyQualification({ data, postData, prevStep, previousData }) {
  const [successMessage, setSuccessMessage] = useState(false);
  let keyQualificationArr1 = [];
  let keyQualificationArr2 = [];
  if (prevStep === 3 && data.length > 0) {
    data.forEach((element) => {
      if (element.isrequired === true) {
        keyQualificationArr1.push({
          value: element.skillid + ", " + element.skillName,
          label: element.skillName,
        });
      }
      if (element.isrequired === false) {
        keyQualificationArr2.push({
          value: element.skillid + ", " + element.skillName,
          label: element.skillName,
        });
      }
    });
  }
  const [preValue, setPreValue] = useState({
    mustHave:
      data === undefined || data.mustHave === undefined ? "" : data.mustHave,
    niceToHave:
      data === undefined || data.niceToHave === undefined
        ? ""
        : data.niceToHave,
  });
  const [mustHaveValidation, setMustHaveValidation] = useState(false);
  const getStringData = (data, type) => {
    let dataArray = [];
    if (data.length === undefined) {
      let skillArr = data.value.split(", ");
      return [
        {
          jobkeyqualifications: 0,
          jobid: 0,
          skillid: skillArr[0],
          skillname: skillArr[1],
          isrequired: type,
          isactive: true,
        },
      ];
    }
    if (data.length !== undefined) {
      data.forEach((element) => {
        let skillArr = element.value.split(", ");
        let obj = {
          jobkeyqualifications: 0,
          jobid: 0,
          skillid: skillArr[0],
          skillname: skillArr[1],
          isrequired: type,
          isactive: true,
        };
        dataArray.push(obj);
      });
      return dataArray;
    }
  };
  const getFormData = (event) => {
    event.preventDefault();
    let mustHave = getStringData(event.target.elements.mustHave, true);
    let niceToHave = getStringData(event.target.elements.niceToHave, false);
    if (mustHave === "") {
      setMustHaveValidation(true);
    } else {
      setMustHaveValidation(false);
      let data = mustHave.concat(niceToHave);
      postData(data);
      setSuccessMessage(true);
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
                defaultValue={[
                  {
                    value: "2, .NET Development",
                    label: ".NET Development",
                  },
                  {
                    value: "4, .NET Framework 1",
                    label: ".NET Framework 1",
                  },
                ]}
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
                defaultValue={keyQualificationArr2}
              />
            </FormGroup>
          </Col>
        </Row>
        {successMessage === true && (
          <FormText
            color="success"
            className="d-flex align-items-center justify-content-center"
          >
            Key qualification added successfully{" "}
          </FormText>
        )}
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
      </Form>
    </>
  );
}
