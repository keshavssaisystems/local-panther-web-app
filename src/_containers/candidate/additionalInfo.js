import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
  Table,
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
import PerfectScrollbar from "react-perfect-scrollbar";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import candidatelogo from "../../assets/utils/images/candidate.svg";

export function AdditionalInformation(props) {
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};

  const [additionalDetails, setDetails] = useState([
    {
      id: 1,
      summary:
        "Highly motivated and results-driven professional with a strong background in software development and project management.Dedicated to delivering high-quality solutions and exceeding client expectations.Adept at colloborating with cross-functional teams to achieve project goals and deadlines.",
      additionalInfo: [
        {
          name: "Technical Skills",
          value: "Java,Python,C++,SQL",
        },
        {
          name: "volunteerExp",
          value: "Mentorship program for underprivileged youth",
        },
        {
          name: "hobbies",
          value: "Hiking,playing guitar",
        },
      ],
      languages: [
        {
          name: "Telugu",
          type: "Fluent",
        },
        {
          name: "English",
          type: "Fluent",
        },
        {
          name: "Hindi",
          type: "Beginner",
        },
      ],
    },
  ]);

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
        <Card className="card-hover-shadow-2x mb-3">
          <div className="mt-3 scroll-area-lg" style={{ marginLeft: "10px" }}>
            <PerfectScrollbar>
              <Row className="mb-2">
                <Col>
                  <strong className="card-title-text">
                    Additional Information
                  </strong>
                </Col>

                <Col>
                  <img
                    src={editIcon}
                    alt="edit-icon"
                    className=" me-2 edit-icon float-end"
                    onClick={(evt) => setPersonalModal(true)}
                  ></img>
                </Col>
              </Row>
              <Row>
                {additionalDetails.map((item) => (
                  <div>
                    <Row>
                      <strong className="content-title mb-1">Summary</strong>
                      <p className="me-2 card-p-text">{item.summary} </p>
                    </Row>
                    <Row>
                      <strong className="content-title">
                        Additional Information
                      </strong>
                      <ul>
                        {item.additionalInfo.map((col) => (
                          <li>
                            <Label className="card-p-text-black">
                              {col.name}: {col.value}
                            </Label>
                          </li>
                        ))}
                      </ul>
                    </Row>
                    <Row>
                      <strong className="content-title">Languages</strong>
                      <Table
                        responsive
                        borderless
                        className="align-middle mb-0 candidate-table"
                      >
                        <thead>
                          <tr className="candidate-table-header">
                            <th>Language</th>
                            <th>Proficiency</th>
                            <th></th>
                            <th></th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.languages.map((column, ind) => (
                            <tr>
                              <td>{column.name}</td>
                              <td>{column.type}</td>
                              <td></td>
                              <td></td>
                              <td></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Row>
                  </div>
                ))}
              </Row>
            </PerfectScrollbar>
          </div>
          <CardFooter
            className="d-flex justify-content-center"
            style={{ border: "none" }}
          >
            <div className="link-text">
              View all {additionalDetails.length} Details
            </div>
          </CardFooter>
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
                Add/Edit Additional Information
              </strong>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="summary" className="input-label">
                        Summary
                      </Label>
                      <Input
                        placeholder="Enter Summary"
                        name="summary"
                        type="textarea"
                        id="summary"
                        {...register("educationLevel")}
                        className="field-input placeholder-text form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="language" className="input-label">
                        Language
                      </Label>
                      <input
                        placeholder="Enter Language"
                        name="language"
                        type="text"
                        id="language"
                        {...register("language")}
                        className="field-input placeholder-text form-control"
                      />
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="proficiency" className="input-label">
                        Proficiency
                      </Label>
                      <Input
                        className="reason-dropdown-input dropdown-placeholder"
                        type="select"
                        id="proficiency"
                        name="proficiency"
                        placeholderText="Select Proficiency"
                      >
                        {countryList.map((col) => (
                          <option key={col.value} value={col.value}>
                            {col.type}
                          </option>
                        ))}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="state" className="input-label">
                        Additional Information
                      </Label>
                      <Input
                        placeholder="Enter Additional Information"
                        name="state"
                        type="textarea"
                        id="state"
                        {...register("state")}
                        className="field-input placeholder-text form-control"
                      />
                    </FormGroup>
                  </Col>
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
