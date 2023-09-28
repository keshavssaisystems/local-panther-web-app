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
import { profileActions } from "_store";
import { useDispatch } from "react-redux";
import { BsDownload, BsTrash3, BsUpload } from "react-icons/bs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import editIcon from "../../assets/utils/images/pencil.svg";
import { useDropzone } from "react-dropzone";
import errorIcon from "../../assets/utils/images/error_icon.png";

export function ResumeDetails(props) {
  const dispatch = useDispatch();

  const [resumeDetails, setResumeDetails] = useState(props.resumeInfo);
  const [candidateDetails, setCandidateDetails] = useState(
    props.candidateDetails
  );
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const [isModal, setModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);

  useEffect(() => {
    getFileName();
  }, []);

  const addEditResumeDetails = function () {
    setModal(true);
  };
  const closeModal = function () {
    setSuccess(false);
    setError(false);
    props.onCallBack();
  };
  const [acceptedFiles, setAcceptedFiles] = useState([]);

  const formatDate = function () {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(
      resumeDetails.uploadeddate
    ).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const addEditResume = async function (acceptedFiles) {
    let response;
    debugger;
    if (resumeDetails) {
      const form = new FormData();
      form.append("Candidateresumeid", resumeDetails.candidateresumeid);
      form.append(
        "Candidateid",
        JSON.parse(localStorage.getItem("userDetails")).InternalUserId
      );
      form.append("Resumepath", "");
      form.append("Resumefile", acceptedFiles[0]);
      form.append("Isparsed", false);
      form.append(
        "CurrentUserId",
        JSON.parse(localStorage.getItem("userDetails")).UserId
      );
      let candidateresumeid = resumeDetails.candidateresumeid;
      response = await dispatch(
        await profileActions.updateResume(candidateresumeid, form)
      );
    } else {
      const form = new FormData();
      debugger;
      form.append(
        "Candidateid",
        JSON.parse(localStorage.getItem("userDetails")).InternalUserId
      );
      form.append("Resumefile", acceptedFiles[0]);

      response = await dispatch(profileActions.addResume(form));
    }
    if (response.payload) {
      if (response.payload.status == "Success") {
        setSuccess(true);
      } else {
        setError(true);
      }
    } else {
      setError(true);
    }

    // props.onCallBack();
  };

  const deleteResume = async function () {
    let resumeId = resumeDetails.candidateresumeid;

    let response = await dispatch(profileActions.deleteResume(resumeId));
    setDeleteConfirm(false);
    props.onCallBack();
  };

  const onDrop = (acceptedFiles) => {
    addEditResume(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    allow: "application/pdf",
  });

  const getFileName = function () {
    let name = "";

    if (resumeDetails) {
      if (resumeDetails.resumepath) {
        const lastIndex = resumeDetails.resumepath.lastIndexOf(".");
        let jobTitle = candidateDetails.position
          ? candidateDetails.position.replace(/ /g, "_")
          : "";
        if (lastIndex !== -1) {
          name =
            candidateDetails.lastname +
            (jobTitle ? "_" + jobTitle : "") +
            "." +
            resumeDetails.resumepath.slice(lastIndex + 1);
        }
      }
      setFileName(name);
    }
  };

  const handleChange = function (data) {};

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

                {resumeDetails ? (
                  <Row className="mb-1">
                    {resumeDetails.resumepath ? (
                      <div>
                        <strong className="content-title">
                          <span className="me-2">{fileName}</span>{" "}
                          <a
                            href={resumeDetails.resumepath}
                            download={fileName}
                            className="me-2"
                          >
                            <BsDownload />
                          </a>
                          <BsTrash3 onClick={() => setDeleteConfirm(true)} />
                        </strong>
                        <div className="card-p-text">
                          Uploaded on {formatDate(resumeDetails.uploadeddate)}
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </Row>
                ) : (
                  <></>
                )}

                <Row className="mb-1 mt-3">
                  <p>
                    <BsDownload />
                    <a
                      href="/example.pdf"
                      download="template.pdf"
                      className="card-p-text-black"
                      style={{ color: "#2F479B", marginLeft: "2px" }}
                    >
                      Click here{" "}
                    </a>
                    <Label className="card-p-text-black">
                      to download standard template
                    </Label>
                  </p>
                </Row>
                <Row className="me-2 mb-2 ml-5" style={{ marginLeft: "2px" }}>
                  <Col className="div-box me-1">
                    <Row className="mt-2">
                      <p className="card-p-text-black">
                        Upload your resume here
                      </p>
                    </Row>
                    <Row>
                      <div {...getRootProps()} className="dropzone">
                        <input {...getInputProps()} />
                        <Row>
                          <label>
                            <div
                              className="dropZone"
                              id="dragbox"
                              onChange={handleChange}
                            >
                              <Button
                                style={{
                                  width: "auto",
                                  backgroundColor: "#2F2E2E",
                                }}
                                className="mb-2 mt-0 btn-icon btn-pill btn-text"
                                color="primary"
                              >
                                <span className="me-2">
                                  <BsUpload />
                                </span>

                                <span className="me-2">Upload</span>
                              </Button>
                            </div>
                          </label>
                        </Row>
                        <span className="file-info">
                          Support formats:doc, docx, pdf,rtf, upto 2 MB
                        </span>
                      </div>
                    </Row>
                  </Col>
                  <Col className="div-box">
                    <Row className="mt-2">
                      <p className="card-p-text-black">Build your own resume</p>
                    </Row>
                    <FormGroup>
                      <Row style={{ marginLeft: "5px" }}>
                        <Button
                          style={{ width: "auto", backgroundColor: "#2F479B" }}
                          className="mb-2 me-2 btn-icon btn-pill btn-text"
                          color="primary"
                          onClick={() => addEditResumeDetails()}
                        >
                          <span className="me-2">
                            <BsUpload />
                          </span>

                          <span className="me-2">Build</span>
                        </Button>
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

      <Modal
        className="modal-reject-align profile-view"
        isOpen={deleteConfirmation}
      >
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Are you sure
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              want to delete the Resume!!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => deleteResume()}
                  >
                    YES
                  </Button>
                  <Button
                    className="success-close-btn"
                    onClick={(evt) => setDeleteConfirm(false)}
                  >
                    NO
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="modal-reject-align profile-view" isOpen={success}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Resume Uploaded Successfully
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Thank you!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => closeModal()}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="modal-reject-align profile-view" isOpen={error}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Something went wrong
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Please try again later
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => closeModal()}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </div>
  );
}
