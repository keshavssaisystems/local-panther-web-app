import React, { useState, useEffect } from "react";
import { Label, Input, CardFooter, ModalHeader, ModalBody } from "reactstrap";
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
  Form,
} from "reactstrap";
import Tabs from "react-responsive-tabs";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import editIcon from "../../assets/utils/images/pencil.svg";

export function ResumeDetails(props) {
  const dispatch = useDispatch();

  const [isModal, setModal] = useState(false);

  const addEditResumeDetails = function () {
    setModal(true);
  };

  // form validation rules
  const validationSchema = Yup.object().shape({
    resumePath: Yup.string().required("Firstname is required").max(50),
    lastname: Yup.string().required("Lastname is required").max(50),
    phonenumber: Yup.string().required("Phone Number is required").max(20),
    email: Yup.string().required("Email is required").max(50),
    city: Yup.string().required("City is required").max(50),
    state: Yup.string().required("State is required").max(50),
    location: Yup.string(),
    country: Yup.string(),
    address: Yup.string().max(50),
    zipCode: Yup.string().max(50),
    gender: Yup.string(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const handleUpload = (data) => {
    debugger;
  };

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
            <Card className="card-hover-shadow-2x mb-3">
              <div className="mt-3" style={{ marginLeft: "10px" }}>
                <Row className="mb-2">
                  <Col>
                    <strong className="card-title-text">Resume</strong>
                  </Col>
                </Row>
                <Row>
                  <Label className="card-p-text">
                    Recommend to use build resume option and/or use provided
                    resume template for upload resume
                  </Label>
                </Row>
                <Row className="mb-1">
                  <strong className="content-title">
                    Jon_Doe_Java_developer.docx{" "}
                    <i className="pe-7s-download icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1"></i>{" "}
                    <i className="pe-7s-trash icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1"></i>
                  </strong>
                </Row>
                <Row className="mb-2">
                  <p>
                    <i className="pe-7s-download icon-container icon-gradient bg-amy-crisp btn-icon-wrapper mb-2 me-1"></i>{" "}
                    <a href="/example.pdf" download="example.pdf">
                      Click here{" "}
                    </a>
                    <Label className="card-p-text-black">
                      to download standard template
                    </Label>
                  </p>
                </Row>
                <Row className="me-2 mb-2 ml-5" style={{ marginLeft: "2px" }}>
                  <Col className="div-box me-1">
                    <Row className="mb-3 mt-2">
                      <p className="card-p-text-black">
                        Upload your resume here
                      </p>
                    </Row>
                    <Row>
                      <input
                        type="file"
                        onChange={(evt) => handleUpload(evt)}
                      />
                    </Row>
                  </Col>
                  <Col className="div-box">
                    <Row className="mt-2">
                      <p className="card-p-text-black">Build your own resume</p>
                    </Row>
                    <FormGroup>
                      <Row style={{ marginLeft: "5px" }}>
                        <Button
                          style={{ width: "120px" }}
                          className="mb-2 me-2 btn-icon btn-pill"
                          color="primary"
                          onClick={() => addEditResumeDetails()}
                        >
                          <i className="pe-7s-upload icon-container btn-icon-wrapper">
                            {" "}
                          </i>
                          Build
                        </Button>

                        {/* <Button
                          style={{ width: "120px" }}
                          className="mb-2 save-btn me-2 btn-icon upload-btn"
                          onClick={() => addEditResumeDetails()}
                        >
                          <i className="pe-7s-upload btn-icon-wrapper"> </i>
                          Build Resume
                        </Button> */}
                      </Row>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {isModal ? (
        <div className="resume-details">
          <Modal
            className="modal-dialog-align resume-details"
            size="md"
            isOpen={isModal}
          >
            <ModalBody>
              <CardBody>
                <div
                  className="mb-0 d-flex justify-content-center success-modal-text mb-2"
                  style={{ color: "#2f479b" }}
                >
                  Build your own Resume!!
                </div>
                <div
                  className="mb-0 d-flex justify-content-center "
                  style={{ fontWeight: "500", fontSize: "18px" }}
                >
                  Please fill Profile, Resume, Qualifications,
                </div>
                <div
                  className="mb-0 d-flex justify-content-center "
                  style={{ fontWeight: "500", fontSize: "18px" }}
                >
                  Education,Skills, Certifications and
                </div>
                <div
                  className="mb-0 d-flex justify-content-center "
                  style={{ fontWeight: "500", fontSize: "18px" }}
                >
                  licenses, Additional Information,Job preferences
                </div>
                <div
                  className="mb-0 d-flex justify-content-center "
                  style={{ fontWeight: "500", fontSize: "18px" }}
                >
                  to create your own template
                </div>
                <Row>
                  <Col className="d-flex justify-content-center interview-btn">
                    <Button
                      color="primary"
                      className="me-2 accept-modal-btn"
                      onClick={(evt) => setModal(false)}
                    >
                      OK
                    </Button>
                  </Col>
                </Row>
              </CardBody>
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
