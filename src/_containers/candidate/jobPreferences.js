import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
} from "reactstrap";
import { candidateActions } from "_store";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Collapse,
  CardHeader,
  Button,
  FormGroup,
  InputGroup,
  Form,
} from "reactstrap";

import editIcon from "../../assets/utils/images/pencil.svg";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { BsPencil } from "react-icons/bs";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import {
  shiftsOption,
  workScheduleOptions,
  jobTypeOption,
  experienceLevelOption,
  hiringTimelineOption,
  jobLocationOptions,
  payPeriodTypeOption,
} from "../../_containers/customer/createJob/dummyData";

export function JobPreferences(props) {
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};

  const [preferenceDetails, setDetails] = useState({
    desiredJobTitle: "flexible",
    specificJobTitle: "Java Developer,UI Developer",
    desiredJobTypes: "Full-time,Part-time,Contract,Temporary,Internship",
    workSchedules: "Weekends Only, Weekdays Only, Weekends as needed",
    shifts: "Days,Night,Evening,Regular 8 hour shift",
    pay: "$45 per hour",
    relocate: "New York",
    workType: "Remote,Hybrid,In-person",
  });

  const [countryList, setCountryList] = useState([]);

  // form validation rules
  const validationSchema = Yup.object().shape({
    summary: Yup.string().max(50),
    language: Yup.string().max(50),
    proficiency: Yup.string().max(50),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  function onSubmit(payload) {}

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Card>
          <div className="mt-3" style={{ marginLeft: "10px" }}>
            <strong className="card-title-text">Job Preferences</strong>
            <BsPencil
              className="icons float-end me-3"
              onClick={() => setPersonalModal(true)}
            />
          </div>
          <CardBody>
            <Row>
              <Col>
                <Row>
                  <strong>Desired job titles</strong>
                  <div>{preferenceDetails.desiredJobTitle}</div>
                </Row>
                <hr />
                <Row>
                  <strong>Specific job title</strong>
                  <div>{preferenceDetails.specificJobTitle}</div>
                </Row>
                <hr />
                <Row>
                  <strong>Desired job types</strong>
                  <div>{preferenceDetails.desiredJobTypes}</div>
                </Row>
                <hr />
                <Row>
                  <strong>Work schedules</strong>
                  <div>{preferenceDetails.workSchedules}</div>
                </Row>
                <hr />
                <Row>
                  <strong>Shifts</strong>
                  <div>{preferenceDetails.shifts}</div>
                </Row>
                <hr />
              </Col>

              <Col>
                <Row>
                  <strong>Desired minimum pay</strong>

                  <div>{preferenceDetails.pay}</div>
                </Row>
                <hr />
                <Row>
                  <strong>Willing to relocate</strong>
                  <div>{preferenceDetails.relocate}</div>
                </Row>
                <hr />
                <Row>
                  <strong>Desired work type</strong>
                  <div>{preferenceDetails.workType}</div>
                </Row>
                <hr />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </div>

      {isPersonalModal ? (
        <div>
          <Modal
            className="personal-information"
            size="lg"
            isOpen={isPersonalModal}
          >
            <ModalHeader toggle={isPersonalModal} charCode="Y">
              <strong className="card-title-text">
                Add/Edit Job Preferences
              </strong>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="zipCode" className="input-label">
                        Job Title
                      </Label>
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        placeholder="Enter Job Title"
                        {...register("jobTitle")}
                        className="field-input placeholder-text form-control input-text"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup check>
                      <Input name="authorization" type="radio" />{" "}
                      <Label check className="input-label">
                        Flexible
                      </Label>
                    </FormGroup>
                  </Col>

                  <Col md={4}>
                    <FormGroup check>
                      <Input name="sponserdCheck" type="radio" />{" "}
                      <Label check className="input-label">
                        Specific Job Title
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>

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
                            />{" "}
                            {"  "}
                            <Label check for={"jobType_" + options.id}>
                              {options.jobType}
                            </Label>
                          </div>
                        ))}
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

                <div className="float-end">
                  <Button className="me-2 save-btn" type="submit">
                    Save
                  </Button>
                  <Button
                    type="button"
                    className="close-btn"
                    onClick={() => setPersonalModal(false)}
                  >
                    Close
                  </Button>
                </div>
              </Form>
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
