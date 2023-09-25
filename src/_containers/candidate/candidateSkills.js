import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
} from "reactstrap";
import { Link } from "react-router-dom";
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

export function CandidateSkills(props) {
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};

  const [skills, setSkills] = useState([
    {
      name: "HTML",
      experience: "5 years",
    },
    {
      name: "JavaScript",
      experience: "7 years",
    },
    {
      name: "C#",
      experience: "2 years",
    },
    {
      name: "Java",
      experience: "1 year",
    },
    {
      name: "React Js",
      experience: "1 year",
    },
    {
      name: "Angular",
      experience: "2 years",
    },
  ]);

  // form validation rules
  const validationSchema = Yup.object().shape({
    skills: Yup.string().required("skills is Required is required").max(50),
    experience: Yup.string(),
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
        <Row>
          <Col sm="12" lg="12">
            <Card className="main-card mb-3" style={{ height: "156%" }}>
              <div className="mt-3" style={{ marginLeft: "10px" }}>
                <Row className="mb-3">
                  <Col>
                    <strong className="card-title-text">Skills</strong>
                  </Col>

                  <Col>
                    <Label
                      className="float-end me-3 link-text"
                      onClick={(evt) => setPersonalModal(true)}
                    >
                      Add
                    </Label>
                  </Col>
                </Row>
                <Row className="mb-10" style={{ marginLeft: "2px" }}>
                  {skills.map((item) => (
                    <Button
                      className="
                       mb-2 me-2 skills-view me-2 mb-2 btn-shadow btn-outline-2x"
                      outline
                      color="light"
                    >
                      <strong className="content-title">
                        {" "}
                        {item.name + ", "}
                      </strong>
                      <span className="card-p-text me-1">
                        {item.experience + " "}
                      </span>
                      <span aria-hidden="true" style={{ fontSize: "15px" }}>
                        x
                      </span>
                    </Button>
                  ))}
                </Row>
                <Link
                  size="lg"
                  color="success"
                  className="mb-0 float-end me-3 mb-2"
                >
                  {skills.length > 10 ? "View All" : ""}
                </Link>
              </div>
            </Card>
          </Col>
        </Row>
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
                Add/Edit Skill Details
              </strong>
            </ModalHeader>
            <ModalBody>
              <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="educationLevel" className="input-label">
                        Skills
                        <span className="required-icon">*</span>
                      </Label>
                      <input
                        placeholder="Enter Skills"
                        name="skills"
                        type="text"
                        id="skills"
                        {...register("skills")}
                        className={`field-input placeholder-text form-control ${
                          errors.skills ? "is-invalid" : ""
                        }`}
                      />
                      <div className="invalid-feedback">
                        {errors.skills?.message}
                      </div>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="experience" className="input-label">
                        Experience
                      </Label>
                      <input
                        placeholder="Enter Experience"
                        name="experience"
                        type="text"
                        id="experience"
                        {...register("experience")}
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
