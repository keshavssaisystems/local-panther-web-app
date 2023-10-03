import React, { useState } from "react";
import {
  Label,
  Input,
  FormGroup,
  Form,
  Row,
  Col,
  Button,
  FormText,
} from "reactstrap";
export function PreScreenApplicant({
  data,
  postData,
  preScreenQuestionsOption,
  prevStep,
  previousData,
}) {
  const [successMessage, setSuccessMessage] = useState(false);
  const inputArr = [
    {
      type: "text",
      id: 1,
      value: "",
    },
  ];
  let questionArray = [
    {
      jobprescreenapplicationid: 0,
      jobid: 0,
      iscustomquestion: false,
      prescreenquestionid: "6",
      question: "How would you like applicants to record their answers?",
      isactive: true,
    },
  ];
  if (prevStep === 3 && data.length > 0) {
    data.forEach((element) => {
      questionArray.push(element.question);
    });
  }

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
    let questionArr = [];
    if (event.target.elements.question.length > 0) {
      event.target.elements.question.forEach((element) => {
        if (element.checked === true) {
          let questionIdString = element.id.split("_");
          let obj = {
            jobprescreenapplicationid: 0,
            jobid: 0,
            iscustomquestion: false,
            prescreenquestionid: questionIdString[1],
            prescreenquestion: element.value,
            isactive: true,
          };
          questionArr.push(obj);
        }
      });
    }
    if (
      event.target.elements.custom_question !== undefined &&
      event.target.elements.custom_question.length > 0
    ) {
      event.target.elements.custom_question.forEach((element) => {
        let obj = {
          jobprescreenapplicationid: 0,
          jobid: 0,
          iscustomquestion: true,
          prescreenquestionid: 0,
          prescreenquestion: element.value,
          isactive: true,
        };
        questionArr.push(obj);
      });
    }
    if (
      event.target.elements.custom_question !== undefined &&
      event.target.elements.custom_question.length === undefined
    ) {
      let obj = {
        jobprescreenapplicationid: 0,
        jobid: 0,
        iscustomquestion: true,
        prescreenquestionid: 0,
        prescreenquestion: event.target.elements.custom_question.value,
        isactive: true,
      };
      questionArr.push(obj);
    }
    postData(questionArr);
    setSuccessMessage(true);
  };

  return (
    <>
      <Form onSubmit={(e) => getFormValues(e)}>
        <Row>
          <Col>
            {preScreenQuestionsOption.length > 0 &&
              preScreenQuestionsOption.map((options) => (
                <FormGroup>
                  <Input
                    id={
                      options.questiontype + "_" + options.prescreenquestionid
                    }
                    name={"question"}
                    type={"checkbox"}
                    value={options.prescreenquestion}
                    defaultChecked={questionArray.includes(
                      options.prescreenquestion
                    )}
                  />{" "}
                  {"  "}
                  <Label
                    className="fw-semi-bold"
                    for={
                      options.questiontype + "_" + options.prescreenquestionid
                    }
                  >
                    {options.prescreenquestion}
                  </Label>
                </FormGroup>
              ))}
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
                      name={"custom_question"}
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
        {successMessage === true && (
          <FormText
            color="success"
            className="d-flex align-items-center justify-content-center"
          >
            Pre-screen questions added successfully{" "}
          </FormText>
        )}
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
      </Form>
      <div></div>
    </>
  );
}
