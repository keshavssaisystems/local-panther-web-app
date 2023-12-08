import React, { useState, useEffect } from "react";
import { FormGroup, Form, Row, Col, Button, Label, FormText } from "reactstrap";

import AsyncSelect from "react-select/async";
import { getSkillsFilter } from "_store";
import AsyncCreatableSelect from "react-select/async-creatable";

export function KeyQualification({ data, postData, prevStep, previousData }) {
  const [prevKeyQualificationArr1, setPrevKey] = useState([]);
  const [prevKeyQualificationArr2, setPrevKey2] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [skillExist, setSkillExist] = useState(false);
  const [searchOptionalText, setSearchOptionalText] = useState("");
  const [optionalskillExist, setOptionalSkillExist] = useState(false);
  const [isLabelVisible, setLabelVisibility] = useState(true);

  const [successMessage, setSuccessMessage] = useState(false);
  // let keyQualificationArr1 = [];
  // let keyQualificationArr2 = [];

  const [keyQualificationArr1, setKeyQual1] = useState([]);
  const [keyQualificationArr2, setKeyQual2] = useState([]);

  useEffect(() => {
    if (prevStep === 3 && data.length > 0) {
      let new_array1 = [];
      let new_array2 = [];
      data.forEach((element) => {
        if (element.isrequired === true) {
          new_array1.push({
            value: element.skillid + ", " + element.skillname,
            label: element.skillname,
          });
        }
        if (element.isrequired === false) {
          new_array2.push({
            value: element.skillid + ", " + element.skillname,
            label: element.skillname,
          });
        }
      });
      setKeyQual1(new_array1);
      setKeyQual2(new_array2);
    }

    let new_arr3 = [];
    let new_arr4 = [];
    if (prevStep === 1 && previousData.length > 0) {
      previousData.forEach((element) => {
        if (element.isrequired === true) {
          new_arr3.push({
            value: element.skillid + ", " + element.skillname,
            label: element.skillname,
          });
        }
        if (element.isrequired === false) {
          new_arr4.push({
            value: element.skillid + ", " + element.skillname,
            label: element.skillname,
          });
        }
      });
      setPrevKey(new_arr3);
      setPrevKey2(new_arr4);
    }
  }, []);

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
    let mustHaveHasData = false;
    let niceToHaveHasData = false;
    let mustHave = getStringData(event.target.elements.mustHave, true);
    let niceToHave = getStringData(event.target.elements.niceToHave, false);
    if (
      event.target.elements.mustHave.value !== "" ||
      event.target.elements.mustHave.length > 0
    ) {
      mustHaveHasData = true;
    }
    if (
      event.target.elements.niceToHave.value !== "" ||
      event.target.elements.niceToHave.length > 0
    ) {
      niceToHaveHasData = true;
    }
    let data = null;
    if (mustHaveHasData === true && niceToHaveHasData === true) {
      data = mustHave.concat(niceToHave);
    }
    if (mustHaveHasData === true && niceToHaveHasData === false) {
      data = mustHave;
    }
    if (mustHaveHasData === false && niceToHaveHasData === true) {
      data = niceToHave;
    }
    postData(data);
    setSuccessMessage(true);
  };

  const addNewSkill = () => {
    if (searchText === "") {
      return;
    }
    let prevKey = [...prevKeyQualificationArr1];

    let obj = {
      value: 0 + ", " + searchText,
      label: searchText,
    };

    prevKey.push(obj);
    setPrevKey(prevKey);
    setSearchText("");

    let keyQualification1 = [...keyQualificationArr1];
    keyQualification1.push(obj);
    setKeyQual1(keyQualification1);
  };

  const addNewSkillOptional = () => {
    if (searchOptionalText === "") {
      return;
    }
    let prevKey2 = [...prevKeyQualificationArr2];

    let obj = {
      value: 0 + ", " + searchOptionalText,
      label: searchOptionalText,
    };

    prevKey2.push(obj);
    setPrevKey2(prevKey2);
    setSearchOptionalText("");

    let keyQualification2 = [...keyQualificationArr2];
    keyQualification2.push(obj);
    setKeyQual2(keyQualification2);
  };
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      setLabelVisibility(true);
      setSearchText(inputValue);
      const { data = [] } = await getSkillsFilter(inputValue);

      const isKeyTrueForAll = data.some(
        (item) => item["skillname"].toLowerCase() === inputValue.toLowerCase()
      );
      console.log(isKeyTrueForAll);
      if (isKeyTrueForAll) {
        setSkillExist(false);
      } else {
        setSkillExist(true);
      }
      return data.map(({ skillid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.skillname}`,
          label: `${rest.skillname}`,
        };
      });
    }
  };

  const loadOptionsoptional = async (inputValue) => {
    if (inputValue.length > 2) {
      setLabelVisibility(true);
      setSearchOptionalText(inputValue);
      const { data = [] } = await getSkillsFilter(inputValue);

      const isKeyTrueForAll = data.some(
        (item) => item["skillname"].toLowerCase() === inputValue.toLowerCase()
      );
      console.log(isKeyTrueForAll);
      if (isKeyTrueForAll) {
        setOptionalSkillExist(false);
      } else {
        setOptionalSkillExist(true);
      }
      return data.map(({ skillid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.skillname}`,
          label: `${rest.skillname}`,
        };
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Backspace") {
      setSearchText("");
      setSkillExist(false);
    }
  };

  const handleKeyDownOptional = (event) => {
    if (event.key === "Backspace") {
      setSearchOptionalText("");
      setOptionalSkillExist(false);
    }
  };
  const customStyles = {
    valueContainer: (provided, state) => ({
      ...provided,
      minHeight: "30px",
      padding: "0 6px",
    }),
    input: (provided, state) => ({
      ...provided,
      margin: "0px",
    }),
  };
  const onSelectSkillsDropdown = function (data) {
    setSearchText("");
    if (data.length === 0) {
      setPrevKey([]);
      setKeyQual1([]);
    } else {
      setPrevKey(data);
    }
  };
  const selectOptionalSkills = function (data) {
    setSearchOptionalText("");
    if (data.length === 0) {
      setPrevKey2([]);
      setKeyQual2([]);
    } else {
      setPrevKey2(data);
    }
  };
  const formatCreateLabel = (inputValue) => {
    if (skillExist && inputValue !== "" && inputValue.length > 2) {
      return (
        <span style={{ cursor: "pointer" }}>
          Add new skill - <span style={{ color: "#545cd8" }}>{inputValue}</span>
        </span>
      );
    } else {
      return "";
    }
  };

  return (
    <>
      <Form onSubmit={(e) => getFormData(e)}>
        <Row>
          <Label className="fw-semi-bold">
            Additional qualification for the role
          </Label>
          <Col md={6} lg={4}>
            <FormGroup>
              <Label for={"mustHave"} className="fw-semi-bold">
                Must have
              </Label>

              <AsyncCreatableSelect
                name="mustHave"
                placeholder="Search to select"
                loadOptions={loadOptions}
                isMulti={true}
                styles={customStyles}
                value={
                  prevStep === 3
                    ? keyQualificationArr1
                    : prevKeyQualificationArr1
                }
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(evt) => onSelectSkillsDropdown(evt)}
                formatCreateLabel={formatCreateLabel}
                onCreateOption={addNewSkill}
              />
              {mustHaveValidation === true && (
                <FormText color="danger">
                  Please select must have skiils for better recommendations
                </FormText>
              )}
            </FormGroup>
          </Col>
          <Col md={6} lg={4}>
            <FormGroup>
              <Label for={"niceToHave"} className="fw-semi-bold">
                Nice to have
              </Label>

              <AsyncCreatableSelect
                name="niceToHave"
                id="niceToHave"
                placeholder="Search to select"
                loadOptions={loadOptionsoptional}
                isMulti={true}
                styles={customStyles}
                value={
                  prevStep === 3
                    ? keyQualificationArr2
                    : prevKeyQualificationArr2
                }
                onKeyDown={(e) => handleKeyDownOptional(e)}
                onChange={(evt) => selectOptionalSkills(evt)}
                formatCreateLabel={formatCreateLabel}
                onCreateOption={addNewSkillOptional}
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
