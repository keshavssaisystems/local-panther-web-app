import React, { useState, useEffect } from "react";
import { Label, CardFooter, ModalHeader, ModalBody } from "reactstrap";

import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Button,
  CardHeader,
} from "reactstrap";
import { profileActions } from "_store";
import {
  formatDate,
  formatDateQualification,
  calculateExperience,
  getDate,
} from "_helpers/helper";
import successIcon from "../../assets/utils/images/success_icon.svg";
import "./profile.scss";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import errorIcon from "../../assets/utils/images/error_icon.png";
import PerfectScrollbar from "react-perfect-scrollbar";
import { QualificationModal } from "./qualificationModal";
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-loaders";
import { NoDataFound } from "_components/common/nodatafound";

export function CandidateQualification(props) {
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [tabs, setTabs] = useState([
    { id: 1, title: "Tab 1", content: <QualificationModal /> },
  ]);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const loading = useSelector((state) => state.getProfile.loader);
  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const qualification_Details = useSelector(
    (state) => state.getProfile.profileData.qualificationsInfo
  );
  const [qualificationDetails, setDetails] = useState([]);

  useEffect(() => {
    setDetails(qualification_Details);
  }, [qualification_Details]);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [deleteId, setDeleteId] = useState(0);
  const edit = function (data) {
    setSelectedData(data);
    setEditModal(true);
  };
  const deleteData = async function () {
    let response = await dispatch(profileActions.deleteQualification(deleteId));

    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  };

  const deleteModal = function (data) {
    setDeleteId(data);
    setDeleteConfirm(true);
  };

  const closeModal = function () {
    setDeleteConfirm(false);
    setSuccess(false);
    setError(false);
    props.onCallBack();
  };

  const [newTabId, setNewTabId] = useState(2);
  const addMoreTabs = function () {
    const newTab = {
      id: 1,
      content: <QualificationModal />,
    };
    setTabs([...tabs, newTab]);
    setNewTabId(newTabId + 1);
  };
  const handlePageChange = function () {
    setPersonalModal(false);
    setEditModal(false);
    props.onCallBack();
  };
  const close = function () {
    setPersonalModal(false);
    setEditModal(false);
  };

  const getText = function (data) {
    let text = "";
    if (data.company != "") {
      text = data.company;
      if (data.cityname != "" && data.cityname) {
        text += ", " + data.cityname;
      }
      if (data.statename != "" && data.statename) {
        text += ", " + data.statename;
      }

      if (data.countryname != "" && data.countryname) {
        text += ", " + data.countryname;
      }
    } else if (data.cityname != "") {
      text = data.cityname;
      if (data.statename != "" && data.statename) {
        text += ", " + data.statename;
      }
      if (data.countryname != "" && data.countryname) {
        text += ", " + data.countryname;
      }
    } else if (data.statename != "" && data.statename) {
      text = data.statename;
      if (data.countryname != "" && data.countryname) {
        text += ", " + data.countryname;
      }
    } else if (data.countryname != "" && data.countryname) {
      text = data.countryname;
      text += data.countryname;
    }

    return text;
  };

  const checkEndDate = function (date) {
    if (new Date(date) == new Date()) {
      return "Present";
    } else {
      formatDate(date);
    }
  };

  return (
    <div>
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <CardHeader className="card-title-text  text-capitalize ">
            Qualifications
            <div className="float-end me-2 ms-auto">
              <Label
                className="link-text"
                onClick={(evt) => setPersonalModal(true)}
              >
                Add
              </Label>
            </div>
          </CardHeader>

          <CardBody className="scroll-area-md">
            {!loading ? (
              <div>
                <PerfectScrollbar>
                  <Row>
                    {qualificationDetails?.length > 0 ? (
                      qualificationDetails.map((item) => (
                        <div className="mb-4">
                          <Col>
                            <strong className="me-2 content-title">
                              {item.jobtitle}{" "}
                            </strong>
                            <div className="float-end">
                              <BsPencil
                                className="icons"
                                onClick={(evt) => edit(item)}
                              />{" "}
                              <BsTrash3
                                className="icons"
                                onClick={() =>
                                  deleteModal(item.candidatequalificationid)
                                }
                              />
                            </div>
                          </Col>

                          <span className="mt-1 card-p-text-black">
                            {getText(item)}
                          </span>

                          {item.startdate ? (
                            <div className="mt-1 card-p-text-black">
                              {getDate(item)}
                              {calculateExperience(
                                item.startdate,
                                item.enddate
                              )}
                            </div>
                          ) : (
                            <></>
                          )}
                        </div>
                      ))
                    ) : (
                      <Row style={{ textAlign: "center" }}>
                        <Col>
                          {" "}
                          <NoDataFound imageSize={"25px"} />
                        </Col>
                      </Row>
                    )}
                  </Row>
                </PerfectScrollbar>
              </div>
            ) : (
              <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
                <Loader active={loading} type="line-scale-pulse-out-rapid" />
              </div>
            )}
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
            <ModalHeader toggle={() => close()} charCode="Y">
              <strong className="card-title-text">
                Add/Edit Work Experience
              </strong>
            </ModalHeader>
            <ModalBody>
              <QualificationModal
                OnCallQualification={() => handlePageChange()}
                selected={selectedData}
                check={"add"}
              />
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}

      {viewModal ? (
        <div>
          <Modal className="personal-information" size="lg" isOpen={viewModal}>
            <ModalBody>
              <div>
                <CardBody>
                  <Row className="mt-2 mb-3 float-end">
                    <span
                      className="float-end"
                      style={{ cursor: "pointer" }}
                      onClick={() => setViewModal(false)}
                    >
                      X
                    </span>
                  </Row>
                  <Row className="mt-3">
                    {qualificationDetails?.map((item) => (
                      <div>
                        <Col>
                          <strong className="me-2 content-title">
                            {item.jobtitle}{" "}
                          </strong>
                        </Col>

                        <p className="mb-0 card-p-text-black">
                          {item.company}
                          {", "}
                          {item.cityname}
                          {", "}
                          {item.countryname}
                          {", "}
                          {item.zipCode}
                          {"  "}
                        </p>

                        <p className="card-p-text-black">
                          {formatDate(item.startdate)}
                          {" to "}
                          {checkEndDate(item.enddate)}
                          {" ("}
                          {item.experience}
                          {")"}
                        </p>

                        {/* <p className="card-p-text">{item.jobDescription}</p> */}
                      </div>
                    ))}
                  </Row>
                </CardBody>
                <CardFooter>
                  <div className="float-end">
                    <Button
                      type="button"
                      className="close-btn"
                      onClick={() => setViewModal(false)}
                    >
                      Close
                    </Button>
                  </div>
                </CardFooter>
              </div>
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}

      {editModal ? (
        <div>
          <Modal className="personal-information" size="lg" isOpen={editModal}>
            <ModalHeader toggle={() => close()} charCode="Y">
              <strong className="card-title-text">
                Add/Edit Work Experience
              </strong>
            </ModalHeader>
            <ModalBody>
              <QualificationModal
                OnCallQualification={() => handlePageChange()}
                selected={selectedData}
                check={"edit"}
              />
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}
      <Modal className="modal-reject-align profile-view" isOpen={success}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              {message}
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
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
              want to delete the Qualification!!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => deleteData()}
                  >
                    YES
                  </Button>
                  <Button
                    className="success-close-btn"
                    onClick={(evt) => closeModal(false)}
                  >
                    NO
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
