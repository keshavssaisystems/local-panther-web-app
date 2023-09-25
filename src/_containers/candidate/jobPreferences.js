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

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import candidatelogo from "../../assets/utils/images/candidate.svg";

export function JobPreferences(props) {
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};

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
        <Card className="mb-3 profile-view">
          <Row className="g-0 mt-3">
            <Row>
              <strong>Job Preferences</strong>
            </Row>
            <Col sm="12" md="6" xl="6" className="ml-border">
              <Row>
                <Col>
                  <strong>Desired Job Titles</strong>
                  <br />
                  <Label>Flexible</Label>
                </Col>
                <hr />
                <Col className="col-1"></Col>
                <hr />
                <Col>
                  <strong>Desired minimum pay</strong>
                  <Label>$45 per hour</Label>
                </Col>
                <hr />
              </Row>
            </Col>
          </Row>
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
                <Row className="mb-2">
                  <Row>
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
                </Row>

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
                </Row>

                <Row className="mb-2">
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        FullTime
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        PartTime
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Contract
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Temporary
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Internship
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Weekdays only
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Weekends only
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col className="col-md-3">
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Weekends as needed
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col></Col>
                  <Col></Col>
                </Row>

                <Row className="mb-2">
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Day
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Night
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Evening
                      </Label>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Regular 8 hour shift
                      </Label>
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
