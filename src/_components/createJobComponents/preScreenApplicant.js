import React, { useState } from "react";
import { Label, Input, FormGroup, Form, Row, Col, Button } from "reactstrap";
export function PreScreenApplicant({ data }) {
  const inputArr = [
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];

  const [customQuestionInput, setCustomQuestionInput] = useState(inputArr);

  const addInput = () => {
    setCustomQuestionInput((s) => {
      return [
        ...s,
        {
          type: "text",
          value: "",
        },
      ];
    });
  };
  const getFormValues = (event) => {
    event.preventDefault();
    console.log(event);
  };

  return (
    <>
      <Form onSubmit={(e) => getFormValues(e)}>
        <Row>
          <Col>
            <FormGroup>
              <Input
                id={"timeAndRange"}
                name={"timeAndRange"}
                type={"checkbox"}
              />{" "}
              {"  "}
              <Label className="fw-semi-bold">
                Please list 2-3 dates and time ranges that you could do an
                interview.
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                id={"commutedToWorkLocation"}
                name={"commutedToWorkLocation"}
                type={"checkbox"}
              />{" "}
              {"  "}
              <Label className="fw-semi-bold">
                Will you be able to reliably commute to work location for this
                job?
              </Label>
            </FormGroup>
            <FormGroup>
              <Input id={"relocate"} name={"relocate"} type={"checkbox"} />{" "}
              {"  "}
              <Label className="fw-semi-bold">
                Will you be able to relocate to be within reasonable commuting
                distance from work location?
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                id={"authorisedToWorkInUS"}
                name={"authorisedToWorkInUS"}
                type={"checkbox"}
              />{" "}
              {"  "}
              <Label className="fw-semi-bold">
                Authorized to work in the United States
              </Label>
            </FormGroup>
            <FormGroup>
              <Input
                id={"preRecordedScreen"}
                name={"preRecordedScreen"}
                type={"checkbox"}
              />{" "}
              {"  "}
              <Label className="fw-semi-bold">
                Request pre-recorded screen
              </Label>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label className="fw-semi-bold">
                How would you like applicants to record their answers?
              </Label>
              <FormGroup>
                <Row>
                  <Col>
                    <Input
                      id={"applicantsRecordAnswer"}
                      name={"applicantsRecordAnswer"}
                      type={"radio"}
                      value={"Audio"}
                    />{" "}
                    {"  "}
                    <Label className="fw-semi-bold">Audio</Label>
                  </Col>
                  <Col>
                    <Input
                      id={"applicantsRecordAnswer"}
                      name={"applicantsRecordAnswer"}
                      type={"radio"}
                      value={"Video"}
                    />{" "}
                    {"  "}
                    <Label className="fw-semi-bold">Video</Label>
                  </Col>
                </Row>
              </FormGroup>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={7}>
            {customQuestionInput.map((item, i) => {
              if (i > 0) {
                return (
                  <FormGroup>
                    <Label className="fw-semi-bold">Custom Question</Label>
                    <Input
                      id={i}
                      name={"custom_question_" + i}
                      type={item.type}
                      maxLength="100"
                    />
                  </FormGroup>
                );
              }
            })}
          </Col>
        </Row>
        {customQuestionInput.length < 4 && (
          <Button color="link" onClick={addInput}>
            + Add another
          </Button>
        )}

        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
      </Form>
      <div></div>
    </>
  );
}
