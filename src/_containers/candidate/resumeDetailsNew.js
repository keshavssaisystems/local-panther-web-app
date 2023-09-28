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
import candidatelogo from "../../assets/utils/images/candidate.svg";

export function ResumeDetailsNew(props) {
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
  const handleUpload = (data) => {};

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  function onSubmit(payload) {}

  return (
    <div className="resume-details">
      <Card>
        <CardBody>
          <Row className="info-text mb-2">
            <Label>
              Recommend to use build resume option and/or use provided resume
              template for upload resume
            </Label>
          </Row>
          <Row className="mb-2">
            <Col className="col-md-3">
              <strong className="card-label" style={{ fontWeight: "600" }}>
                Upload Resume
              </strong>
            </Col>
            <Col className="col-md-7" style={{ marginLeft: "20px" }}>
              <input type="file" onChange={(evt) => handleUpload(evt)} />
            </Col>
          </Row>

          <Row>
            <Col className="col-md-3 card-label me -2">
              <strong> Build your own Resume</strong>
            </Col>
            <Col className="col-md-7">
              <FormGroup>
                <Col>
                  <Button
                    className="mb-2 me-2 btn-icon upload-btn"
                    onClick={() => addEditResumeDetails()}
                  >
                    <i className="pe-7s-upload btn-icon-wrapper"> </i>
                    Build Resume
                  </Button>
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col className="col-md-3 card-label me -2">
              <strong>Download Standard Template here</strong>
            </Col>
            <Col className="col-md-7">
              <a href="/example.pdf" download="example.pdf">
                resume-template
              </a>
            </Col>
          </Row>
        </CardBody>
      </Card>

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
