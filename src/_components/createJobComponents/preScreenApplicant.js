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
import { findRestrictedWords } from "_helpers/helper";
import { BsPlusSquare } from "react-icons/bs";
import { useSelector } from "react-redux";
export function PreScreenApplicant({
  data,
  postData,
  preScreenQuestionsOption,
  prevStep,
  previousData,
}) {
  const flaggedWordList = useSelector(
    (state) => state.dropdown.flaggedWordsList
  );
  let wordArray = [];
  if (flaggedWordList?.length > 0) {
    flaggedWordList.forEach((element) => {
      wordArray.push(element.name);
    });
  }
  let prevDataArr = [];
  if (prevStep === 1 && previousData.length > 0) {
    previousData.forEach((element) => {
      prevDataArr.push(element.prescreenquestion);
    });
  }
  const [successMessage, setSuccessMessage] = useState(false);
  const [checkRestrictionValidation, setCheckRestrictionValidation] =
    useState(false);
  const [restrictionValidation1, setRestrictionValidation1] = useState(false);
  const [restrictionValidation2, setRestrictionValidation2] = useState(false);
  const [restrictionValidation3, setRestrictionValidation3] = useState(false);
  const [restrictionWord1, setRestrictionWord1] = useState([]);
  const [restrictionWord2, setRestrictionWord2] = useState([]);
  const [restrictionWord3, setRestrictionWord3] = useState([]);
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
      questionArray.push(element.prescreenquestion);
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
  const getFormValidation = (event) => {
    event.preventDefault();
    if (
      restrictionValidation1 === false &&
      restrictionValidation2 === false &&
      restrictionValidation3 === false
    ) {
      getFormValues(event);
      setCheckRestrictionValidation(false);
    } else {
      setCheckRestrictionValidation(true);
      setSuccessMessage(false);
    }
  };
  const getFormValues = (event) => {
    event.preventDefault();
    let questionArr = [];
    let customAnswer =
      event?.target?.elements?.applicantsRecordAnswer?.value === undefined
        ? ""
        : event.target.elements.applicantsRecordAnswer.value;
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
      event.target.elements.custom_question.length === undefined &&
      event.target.elements.custom_question.value !== ""
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
    postData({
      questionArr: questionArr,
      customAnserType: customAnswer === "" ? "Audio" : customAnswer,
    });
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
    }, 2000);
  };

  const checkRestrictedWord = (fieldName, string) => {
    if (wordArray.length > 0) {
      if (fieldName === "custom_question_1") {
        let restrictedWords = findRestrictedWords(wordArray, string);
        restrictedWords.wordsCount > 0
          ? setRestrictionValidation1(true)
          : setRestrictionValidation1(false);
        restrictedWords.wordsCount > 0
          ? setRestrictionWord1(restrictedWords.wordsArray)
          : setRestrictionWord1([]);
      }
      if (fieldName === "custom_question_2") {
        let restrictedWords = findRestrictedWords(wordArray, string);
        restrictedWords.wordsCount > 0
          ? setRestrictionValidation2(true)
          : setRestrictionValidation2(false);
        restrictedWords.wordsCount > 0
          ? setRestrictionWord2(restrictedWords.wordsArray)
          : setRestrictionWord2([]);
      }
      if (fieldName === "custom_question_3") {
        let restrictedWords = findRestrictedWords(wordArray, string);
        restrictedWords.wordsCount > 0
          ? setRestrictionValidation3(true)
          : setRestrictionValidation3(false);
        restrictedWords.wordsCount > 0
          ? setRestrictionWord3(restrictedWords.wordsArray)
          : setRestrictionWord3([]);
      }
    }
  };

  return (
    <>
      <Form onSubmit={(e) => getFormValidation(e)}>
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
                    defaultChecked={
                      prevStep === 3
                        ? questionArray.includes(options.prescreenquestion)
                        : prevDataArr.includes(options.prescreenquestion)
                    }
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
            {customQuestionInput?.map((item, i) => {
              if (i > 0) {
                return (
                  <FormGroup>
                    <Label className="fw-semi-bold">Custom Question {i}</Label>
                    <Input
                      id={i}
                      name={"custom_question"}
                      type={item.type}
                      maxLength="100"
                      onChange={(e) =>
                        checkRestrictedWord(
                          "custom_question_" + i,
                          e.target.value
                        )
                      }
                    />
                    {i === 1 && restrictionValidation1 === true && (
                      <FormText
                        color="danger"
                        className="custom-question-validation"
                      >
                        Your input contains the flagged word '{" "}
                        <b>{restrictionWord1.toString()}</b> '.
                      </FormText>
                    )}
                    {i === 2 && restrictionValidation2 === true && (
                      <FormText
                        color="danger"
                        className="custom-question-validation"
                      >
                        Your input contains the flagged word '{" "}
                        <b>{restrictionWord2.toString()}</b> '.
                      </FormText>
                    )}
                    {i === 3 && restrictionValidation3 === true && (
                      <FormText
                        color="danger"
                        className="custom-question-validation"
                      >
                        Your input contains the flagged word '{" "}
                        <b>{restrictionWord3.toString()}</b> '.
                      </FormText>
                    )}
                  </FormGroup>
                );
              }
            })}
          </Col>
        </Row>
        {customQuestionInput.length < 4 && (
          <Col md={5}>
            <Button
              color="link"
              onClick={addInput}
              className="custom-add-button"
            >
              <BsPlusSquare className="mb-1" /> Add{"  "}
              {customQuestionInput.length > 1 ? "another" : ""} custom question
            </Button>
          </Col>
        )}

        {customQuestionInput.length > 1 && (
          <Row>
            <Col md={5}>
              <FormGroup>
                <Label className="fw-semi-bold">
                  How would you like applicants to record their answers?
                </Label>
                <FormGroup>
                  <Row>
                    <Col md={3}>
                      <Input
                        id={"applicantsRecordAnswer"}
                        name={"applicantsRecordAnswer"}
                        type={"radio"}
                        value={"Audio"}
                      />{" "}
                      {"  "}
                      <Label className="fw-semi-bold">Audio</Label>
                    </Col>
                    <Col md={3}>
                      <Input
                        id={"applicantsRecordAnswer"}
                        name={"applicantsRecordAnswer"}
                        type={"radio"}
                        value={"Video"}
                      />{" "}
                      {"  "}
                      <Label className="fw-semi-bold">Video</Label>
                    </Col>
                    <Col md={3}>
                      <Input
                        id={"applicantsRecordAnswer"}
                        name={"applicantsRecordAnswer"}
                        type={"radio"}
                        value={"Text"}
                      />{" "}
                      {"  "}
                      <Label className="fw-semi-bold">Text</Label>
                    </Col>
                  </Row>
                </FormGroup>
              </FormGroup>
            </Col>
          </Row>
        )}

        {successMessage === true && (
          <FormText
            color="success"
            className="d-flex align-items-center justify-content-center"
          >
            Pre-screen questions added successfully{" "}
          </FormText>
        )}
        {checkRestrictionValidation === true && (
          <FormText
            color="danger"
            className="d-flex align-items-center justify-content-center"
          >
            Please remove flagged words from custom questions
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
