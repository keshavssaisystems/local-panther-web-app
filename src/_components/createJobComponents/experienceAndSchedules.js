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

export function ExperienceAndSchedules({
  data,
  shiftsOption,
  workScheduleOptions,
  jobTypeOption,
  experienceLevelOption,
  hiringTimelineOption,
}) {
  const [jobTypeValidation, setJobTypeValidation] = useState(false);
  const getFormValidation = (event) => {
    event.preventDefault();
    let jobType = getJobType(event.target.elements.jobType);
    jobType === "" ? setJobTypeValidation(true) : setJobTypeValidation(false);
    if (jobType !== "") {
      saveData(jobType, event);
    }
  };
  const saveData = (jobType, event) => {
    let workSchedule = getWorkSchedule(event.target.elements.workSchedule);
    let shift = getShifts(event.target.elements.shifts);
    let demo = {
      jobType: jobType,
      workSchedule: workSchedule,
      shift: shift,
      experienceLevel: event.target.elements.experienceLevel.value,
      hiringTimeline: event.target.elements.hiringTimeline.value,
    };
    console.log(demo);
  };
  const getJobType = (jobTypeArray) => {
    let jobTypeArr = [];
    jobTypeArray.forEach((element) => {
      if (element.checked === true) {
        jobTypeArr.push(element.value);
      }
    });
    return jobTypeArr.toString();
  };
  const getWorkSchedule = (workScheduleArray) => {
    let workScheduleArr = [];
    workScheduleArray.forEach((element) => {
      if (element.checked === true) {
        workScheduleArr.push(element.value);
      }
    });
    return workScheduleArr.toString();
  };
  const getShifts = (shiftArray) => {
    let shiftArr = [];
    shiftArray.forEach((element) => {
      if (element.checked === true) {
        shiftArr.push(element.value);
      }
    });
    return shiftArr.toString();
  };
  return (
    <>
      <Form onSubmit={(e) => getFormValidation(e)}>
        <Row>
          <Col>
            <FormGroup>
              <Label className="fw-semi-bold">
                Job Type<span style={{ color: "red" }}>* </span>
              </Label>
              {jobTypeOption.length > 0 &&
                jobTypeOption.map((options) => (
                  <div className="form-group-custom">
                    <Input
                      key={options.id}
                      type="checkbox"
                      name={"jobType"}
                      id={"jobType_" + options.id}
                      value={options.id}
                      invalid={jobTypeValidation === true ? true : false}
                    />{" "}
                    {"  "}
                    <Label check for={"jobType_" + options.id}>
                      {options.jobType}
                    </Label>
                  </div>
                ))}
              {jobTypeValidation === true && (
                <FormText color="danger">
                  Please select any one job type
                </FormText>
              )}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="workSchedule" className="fw-semi-bold">
                Work schedules
              </Label>
              {workScheduleOptions.length > 0 &&
                workScheduleOptions.map((options) => (
                  <div className="form-group-custom">
                    <Input
                      key={options.id}
                      type="checkbox"
                      name={"workSchedule"}
                      id={"workSchedule_" + options.id}
                      value={options.id}
                    />{" "}
                    {"  "}
                    <Label check for={"workSchedule_" + options.id}>
                      {options.workSchedule}
                    </Label>
                  </div>
                ))}
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="shifts" className="fw-semi-bold">
                Shifts
              </Label>
              {shiftsOption.length > 0 &&
                shiftsOption.map((options) => (
                  <div className="form-group-custom">
                    <Input
                      key={options.id}
                      type="checkbox"
                      name={"shifts"}
                      id={"shifts_" + options.id}
                      value={options.id}
                    />{" "}
                    {"  "}
                    <Label check for={"shifts_" + options.id}>
                      {options.shifts}
                    </Label>
                  </div>
                ))}
            </FormGroup>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for={"experienceLevel"} className="fw-semi-bold">
                Experience level
              </Label>
              <Input
                id={"experienceLevel"}
                name={"experienceLevel"}
                type={"select"}
              >
                <option key={0}>Select experience level</option>
                {experienceLevelOption.length > 0 &&
                  experienceLevelOption.map((options) => (
                    <option key={options.id} value={options.label}>
                      {options.label}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for={"hiringTimeline"} className="fw-semi-bold">
                Hiring timeline
              </Label>
              <Input
                id={"hiringTimeline"}
                name={"hiringTimeline"}
                type={"select"}
              >
                <option key={0}>Select hiring timeline</option>
                {hiringTimelineOption.length > 0 &&
                  hiringTimelineOption.map((options) => (
                    <option key={options.id} value={options.label}>
                      {options.label}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col></Col>
          <Col></Col>
        </Row>
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
      </Form>
    </>
  );
}
