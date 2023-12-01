import React, { useState, useEffect, useRef } from "react";
import { Label, ModalBody } from "reactstrap";
import {
  Row,
  Col,
  Modal,
  ModalHeader,
  Card,
  CardBody,
  Button,
  FormGroup,
  CardTitle,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import classnames from "classnames";
import { formatDate } from "_helpers/helper";
import { profileActions } from "_store";
import { useDispatch, useSelector } from "react-redux";
import { BsDownload, BsTrash3, BsUpload } from "react-icons/bs";
import axios from "axios";
import "./profile.scss";
import successIcon from "../../assets/utils/images/success_icon.svg";
import { useDropzone } from "react-dropzone";
import Loader from "react-loaders";
import Dropzone from "react-dropzone";
import errorIcon from "../../assets/utils/images/error_icon.png";

import { ProfilePDF } from "./profilePDF";
import CardHeader from "react-bootstrap/esm/CardHeader";

export function ResumeDetails(props) {
  const dispatch = useDispatch();

  const resumeDetails = useSelector(
    (state) => state.getProfile.profileData.resumeInfo
  );
  const resumeTemplate = useSelector(
    (state) => state.getResumeTemplate.user.data
  );
  const [candidateDetails, setCandidateDetails] = useState(
    props.candidateDetails
  );
  const [fileName, setFileName] = useState("");
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [sizeError, setSizeError] = useState(false);
  const [isModal, setModal] = useState(false);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const [buildModal, setBuildModal] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [selectedFile, setSelectedFile] = useState();

  let url = `${process.env.REACT_APP_PANTHER_URL}`;

  const loading = useSelector((state) => state.getProfile.loader);

  useEffect(() => {
    getFileName();
  }, [resumeDetails]);

  const addEditResumeDetails = function () {
    setModal(true);
  };
  const closeModal = function () {
    setSuccess(false);
    setError(false);
    props.onCallBack();
  };

  const addEditResume = async function (acceptedFiles) {
    const authData = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const config = {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${authData}`,
      },
    };

    if (resumeDetails) {
      const form = new FormData();
      form.append("Candidateresumeid", resumeDetails.candidateresumeid);
      form.append(
        "Candidateid",
        JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId
      );
      form.append("Resumepath", "");
      form.append("Resumefile", acceptedFiles[0]);
      form.append("Isparsed", false);
      form.append(
        "CurrentUserId",
        JSON.parse(localStorage.getItem("userDetails")).UserId
      );
      let candidateresumeid = resumeDetails.candidateresumeid;

      axios
        .put(
          `${url}/PutResume/` + resumeDetails.candidateresumeid,
          form,
          config
        )
        .then((result) => {
          if (result.data.statusCode == 204) {
            setSuccess(true);
            setMessage(result.data.message);
          } else {
            setError(true);
          }
        })
        .catch((error) => {});
    } else {
      const form = new FormData();
      form.append(
        "Candidateid",
        JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId
      );
      form.append("Resumefile", acceptedFiles[0]);

      axios
        .post(`${url}/PostResume`, form, config)
        .then((result) => {
          if (result.data) {
            if (result.data.status === "Success") {
              setSuccess(true);
              setMessage(result.data.message);
            } else {
              setError(true);
            }
          } else {
            setError(true);
          }
        })
        .catch((error) => {});
    }
  };

  const close = function () {
    setBuildModal(false);
  };

  const deleteResume = async function () {
    let resumeId = resumeDetails.candidateresumeid;

    let response = await dispatch(profileActions.deleteResume(resumeId));
    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }

    setDeleteConfirm(false);
    props.onCallBack();
  };

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles[0].size > 5 * 1024 * 1024) {
      setSizeError(true);

      return;
    }
    let name = acceptedFiles[0].name.replace(/^.*[\\\/]/, "");

    setFileName(name);
    addEditResume(acceptedFiles);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: ".pdf, .docx, .doc",
  });
  const onCancel = (acceptedFiles) => {
    setSelectedFile(null);
  };

  const getFileName = function () {
    let name = "";

    if (resumeDetails) {
      if (resumeDetails.resumepath) {
        name = resumeDetails.resumepath.replace(/^.*[\\\/]/, "");
      }
      setFileName(name);
    }
  };

  const handlePrint = function () {
    setBuildModal(true);
  };
  const handleChange = function (data) {};

  const toggle = function (data) {
    setActiveTab(data);
  };

  return (
    <div>
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <CardHeader className="card-title-text  text-capitalize ">
            <Nav>
              {/* <NavItem>
                  <NavLink
                    href="#"
                    className={classnames({
                      active: activeTab === "1",
                    })}
                    onClick={() => {
                      toggle("1");
                    }}
                  >
                    Template
                  </NavLink>
              </NavItem> */}
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "1",
                  })}
                  onClick={() => {
                    toggle("1");
                  }}
                >
                  Upload resume
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  className={classnames({
                    active: activeTab === "2",
                  })}
                  onClick={() => {
                    toggle("2");
                  }}
                >
                  Build resume
                </NavLink>
              </NavItem>
            </Nav>
          </CardHeader>
          <CardBody className="scroll-area-md">
            <TabContent activeTab={activeTab}>
              {/* <TabPane tabId="1">
                <p>
                  <BsDownload />
                  <a
                    href={resumeTemplate?.[0]?.name}
                    download="Resume_Template.docx"
                    className="card-p-text-black"
                    style={{ color: "#2F479B", marginLeft: "2px" }}
                  >
                    Click here{" "}
                  </a>
                  <Label className="card-p-text-black">
                    to download standard template
                  </Label>
                </p>
              </TabPane> */}
              <TabPane tabId="1">
                {resumeDetails?.resumepath ? (
                  <div className="mb-2">
                    <strong className="content-title">
                      <span className="me-2">{fileName}</span>{" "}
                      <div className="float-end">
                        <a
                          target="blank"
                          href={resumeDetails?.resumepath}
                          download={fileName}
                          className="me-3"
                        >
                          <BsDownload />
                        </a>
                        <BsTrash3
                          style={{ color: "#545cd8" }}
                          onClick={() => setDeleteConfirm(true)}
                        />
                      </div>
                    </strong>
                    <div className="card-p-text mt-1 mb-2">
                      Uploaded on {formatDate(resumeDetails?.uploadeddate)}
                    </div>
                  </div>
                ) : (
                  <></>
                )}
                <Row>
                  <Col>
                    <div className="dropzone-wrapper dropzone-wrapper-sm">
                      <Dropzone
                        onDrop={(e) => onDrop(e)}
                        onFileDialogCancel={onCancel}
                      >
                        {() => (
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <div className="dropzone-content">
                              <p>Upload your own resume</p>
                              <p>
                                Try dropping some files here, or click to select
                                files to upload.
                              </p>
                            </div>
                          </div>
                        )}
                      </Dropzone>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <div className="file-info mt-2">
                    Support formats: doc, docx, pdf, upto 5 MB
                  </div>
                </Row>
                <Row>
                  <Col className="divider me-2" />

                  <Col className="col-md-1 login-mt d-flex justify-content-center align-items-center">
                    or
                  </Col>
                  <Col className="divider" />
                </Row>
                <p>
                  <BsDownload />
                  <a
                    href={resumeTemplate?.[0]?.name}
                    download="Resume_Template.docx"
                    className="card-p-text-black"
                    style={{ color: "#2F479B", marginLeft: "2px" }}
                  >
                    Click here{" "}
                  </a>
                  <Label className="card-p-text-black">
                    to download standard template
                  </Label>
                </p>
                {/* <Row>
                  <Col className="col-4">
                    <b className="mb-2 d-block mt-2">Dropped Files</b>
                    <ListGroup>
                      <ListGroupItem key={fileName}>{fileName}</ListGroupItem>
                    </ListGroup>
                  </Col>
                </Row> */}
                {/* <div className=" div-box">
                  <div className=" mb-2 card-p-text-black">
                    Upload your resume here
                  </div>
                  <Row>
                    <label>
                      <div
                        className="dropZone"
                        id="dragbox"
                        onChange={handleChange}
                      >
                        <input {...getInputProps()} />
                        <Button
                          style={{
                            width: "auto",
                            backgroundColor: "#2F2E2E",
                            borderColor: "#2F2E2E",
                            float: "left",
                            marginRight: "15px",
                          }}
                          {...getRootProps()}
                          className="mb-2 mt-0 btn-icon btn-pill btn-text dropzone"
                          color="primary"
                        >
                          <span className="me-2">
                            <BsUpload />
                          </span>

                          <span className="me-2">Upload</span>
                        </Button>
                      </div>
                      <div className="file-info" style={{ paddingTop: "10px" }}>
                        Support formats: doc, docx, pdf, upto 5 MB
                      </div>
                    </label>
                  </Row>
                </div> */}
              </TabPane>
              <TabPane tabId="2">
                <div className="div-box build-resume-box">
                  <div className="mb-2 card-p-text-black">
                    Build your own resume
                  </div>

                  <div className="file-info">
                    <div className="mb-2">
                      The system generates a standard resume format by
                      incorporating all necessary information from the candidate
                      profile page, including demographics, work experience,
                      education, skills, certifications, licenses, languages,
                      and summary.
                    </div>
                    <span>
                      <FormGroup>
                        <Row>
                          <Col className="col-5">
                            After submitting all necessary data
                          </Col>
                        </Row>
                        <Row className="mt-2">
                          <Col>
                            <Button
                              style={{
                                width: "auto",
                                backgroundColor: "#2F479B",
                              }}
                              className="me-2 btn-icon btn-pill btn-text"
                              color="primary"
                              onClick={() => handlePrint()}
                            >
                              <span className="me-2">
                                <BsUpload />
                              </span>

                              <span className="me-2">Build</span>
                            </Button>
                          </Col>
                        </Row>
                      </FormGroup>
                    </span>
                  </div>
                </div>
              </TabPane>
            </TabContent>
          </CardBody>
        </Card>
      </div>

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
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              {message}
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text"></div>
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
                    onClick={(evt) => setError(false)}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="modal-reject-align profile-view" isOpen={sizeError}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              File size should not exceed 5 MB
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              Please try again
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => setSizeError(false)}
                  >
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal className="personal-information" size="lg" isOpen={buildModal}>
        <ModalHeader toggle={() => close()} charCode="Y"></ModalHeader>

        <ProfilePDF />
      </Modal>
    </div>
  );
}
