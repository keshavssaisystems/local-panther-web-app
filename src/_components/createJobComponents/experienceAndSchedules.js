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
  postData,
  prevStep,
  previousData,
  esFormSubmitted,
}) {
  const [successMessage, setSuccessMessage] = useState(false);
  const [preValue, setPreValue] = useState({
    jobType:
      data === undefined || data.jobType === undefined
        ? ""
        : data.jobType.slice(","),
    workSchedule:
      data === undefined || data.workSchedule === undefined
        ? ""
        : data.workSchedule.slice(","),
    shift:
      data === undefined || data.shift === undefined
        ? ""
        : data.shift.slice(","),
    experienceLevel:
      data === undefined || data.experienceLevel === undefined
        ? ""
        : data.experienceLevel,
    hiringTimeline:
      data === undefined || data.hiringTimeline === undefined
        ? ""
        : data.hiringTimeline,
  });
  const [previousValue, setPreviousValue] = useState({
    jobType:
      previousData[0] === undefined || previousData[0].jobtypes === undefined
        ? ""
        : previousData[0].jobtypes.slice(","),
    workSchedule:
      previousData[0] === undefined ||
      previousData[0].workschedules === undefined
        ? ""
        : previousData[0].workschedules.slice(","),
    shift:
      previousData[0] === undefined || previousData[0].shifts === undefined
        ? ""
        : previousData[0].shifts.slice(","),
    experienceLevel:
      previousData[0] === undefined ||
      previousData[0].experiencelevelid === undefined
        ? ""
        : previousData[0].experiencelevelid,
    hiringTimeline:
      previousData[0] === undefined ||
      previousData[0].hiringtimelineid === undefined
        ? ""
        : previousData[0].hiringtimelineid,
  });
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
    let data = {
      jobType: jobType,
      workSchedule: workSchedule,
      shift: shift,
      experienceLevel: event.target.elements.experienceLevel.value,
      hiringTimeline: event.target.elements.hiringTimeline.value,
      shiftsOption: shiftsOption,
      workScheduleOptions: workScheduleOptions,
      jobTypeOption: jobTypeOption,
      experienceLevelOption: experienceLevelOption,
      hiringTimelineOption: hiringTimelineOption,
    };
    postData(data);
    setPreValue(data);
    setSuccessMessage(true);
    esFormSubmitted(true);
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
  let expLevelSelected =
    prevStep === 3
      ? Number(preValue.experienceLevel)
      : previousValue.experienceLevel;
  let hiringSelected =
    prevStep === 3
      ? Number(preValue.hiringTimeline)
      : previousValue.hiringTimeline;
  return (
    <>
      <Form onSubmit={(e) => getFormValidation(e)}>
        <Row>
          <Col md={6} lg={3}>
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
                      defaultChecked={
                        prevStep === 3
                          ? preValue.jobType.includes(options.id)
                          : previousValue.jobType.includes(options.id)
                      }
                      value={options.id}
                      invalid={jobTypeValidation === true ? true : false}
                    />{" "}
                    {"  "}
                    <Label check for={"jobType_" + options.id}>
                      {options.name}
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
          <Col md={6} lg={3}>
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
                      defaultChecked={
                        prevStep === 3
                          ? preValue.workSchedule.includes(options.id)
                          : previousValue.workSchedule.includes(options.id)
                      }
                      value={options.id}
                    />{" "}
                    {"  "}
                    <Label check for={"workSchedule_" + options.id}>
                      {options.name}
                    </Label>
                  </div>
                ))}
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
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
                      defaultChecked={
                        prevStep === 3
                          ? preValue.shift.includes(options.id)
                          : previousValue.shift.includes(options.id)
                      }
                      value={options.id}
                    />{" "}
                    {"  "}
                    <Label check for={"shifts_" + options.id}>
                      {options.name}
                    </Label>
                  </div>
                ))}
            </FormGroup>
          </Col>
          <Col md={6} lg={3}></Col>
        </Row>
        <Row>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for={"experienceLevel"} className="fw-semi-bold">
                Experience level
              </Label>
              <Input
                id={"experienceLevel"}
                name={"experienceLevel"}
                type={"select"}
              >
                <option key={0} value={""}>
                  Select experience level
                </option>
                {experienceLevelOption.length > 0 &&
                  experienceLevelOption.map((options) => (
                    <option
                      key={options.id}
                      value={options.id}
                      selected={expLevelSelected === options.id}
                    >
                      {options.name}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for={"hiringTimeline"} className="fw-semi-bold">
                Hiring timeline
              </Label>
              <Input
                id={"hiringTimeline"}
                name={"hiringTimeline"}
                type={"select"}
              >
                <option key={0} value={""}>
                  Select hiring timeline
                </option>
                {hiringTimelineOption.length > 0 &&
                  hiringTimelineOption.map((options) => (
                    <option
                      key={options.id}
                      value={options.id}
                      selected={hiringSelected === options.id}
                    >
                      {options.name}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={6} lg={3}></Col>
          <Col md={6} lg={3}></Col>
        </Row>
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
        {successMessage === true && (
          <FormText
            color="success"
            className="d-flex align-items-center justify-content-center"
          >
            Experience & schedules added successfully{" "}
          </FormText>
        )}
      </Form>
    </>
  );
}
