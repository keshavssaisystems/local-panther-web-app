import { SkillsFilter } from "_components/dropdownComponents/SkillsFilter";
import React, { useState } from "react";
import { FormGroup, Form, Row, Col, Button, Label, FormText } from "reactstrap";

export function KeyQualification({ data, postData, prevStep, previousData }) {
  let prevKeyQualificationArr1 = [];
  let prevKeyQualificationArr2 = [];
  if (prevStep === 1 && previousData.length > 0) {
    previousData.forEach((element) => {
      if (element.isrequired === true) {
        prevKeyQualificationArr1.push({
          value: element.skillid + ", " + element.skillname,
          label: element.skillname,
        });
      }
      if (element.isrequired === false) {
        prevKeyQualificationArr2.push({
          value: element.skillid + ", " + element.skillname,
          label: element.skillname,
        });
      }
    });
  }
  const [successMessage, setSuccessMessage] = useState(false);
  let keyQualificationArr1 = [];
  let keyQualificationArr2 = [];
  if (prevStep === 3 && data.length > 0) {
    data.forEach((element) => {
      if (element.isrequired === true) {
        keyQualificationArr1.push({
          value: element.skillid + ", " + element.skillname,
          label: element.skillname,
        });
      }
      if (element.isrequired === false) {
        keyQualificationArr2.push({
          value: element.skillid + ", " + element.skillname,
          label: element.skillname,
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
    let data = null;
    if (
      event.target.elements.mustHave.value !== "" &&
      event.target.elements.niceToHave.value !== ""
    ) {
      data = mustHave.concat(niceToHave);
    }
    if (
      event.target.elements.mustHave.value !== "" &&
      event.target.elements.niceToHave.value === ""
    ) {
      data = mustHave;
    }
    if (
      event.target.elements.mustHave.value === "" &&
      event.target.elements.niceToHave.value !== ""
    ) {
      data = niceToHave;
    }
    console.log(data);
    postData(data);
    setSuccessMessage(true);
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
                defaultValue={
                  prevStep === 3
                    ? keyQualificationArr1
                    : prevKeyQualificationArr1
                }
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
                defaultValue={
                  prevStep === 3
                    ? keyQualificationArr2
                    : prevKeyQualificationArr2
                }
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
