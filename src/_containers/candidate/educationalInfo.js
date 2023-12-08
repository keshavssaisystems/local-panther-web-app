import React, { useState, useEffect } from "react";
import { Label, CardFooter, ModalHeader, ModalBody } from "reactstrap";
import { educationDetailsSlice } from "_store";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Button,
  CardHeader,
} from "reactstrap";
import {
  formatDate,
  endDateValidation,
  formatMonthYear,
  getEducText,
} from "_helpers/helper";

import errorIcon from "../../assets/utils/images/error_icon.png";
import { EducationModal } from "./educationModal";
import Loader from "react-loaders";

import { BsPencil, BsTrash3 } from "react-icons/bs";
import { NoDataFound } from "_components/common/nodatafound";
import { useDispatch, useSelector } from "react-redux";
import "./profile.scss";

import successIcon from "../../assets/utils/images/success_icon.svg";

export function CandidateEducation(props) {
  const dispatch = useDispatch();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const educational_details = useSelector(
    (state) => state.getProfile.profileData.educationInfo
  );
  const loader = useSelector((state) => state.getProfile.loader);
  const [educationalDetails, setDetails] = useState([]);
  const [viewModal, setViewModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  useEffect(() => {
    setDetails(educational_details);
  }, [educational_details]);

  const [isPersonalModal, setPersonalModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});

  const close = function () {
    setPersonalModal(false);
    setEditModal(false);
  };
  const handlePageChange = () => {
    setPersonalModal(false);
    setEditModal(false);
    props.onCallBack();
  };

  const edit = function (data) {
    setSelectedData(data);
    setEditModal(true);
  };
  const closeModal = function () {
    setSuccess(false);
    setError(false);
    setDeleteConfirm(false);
    setPersonalModal(false);
    setEditModal(false);
    props.onCallBack();
  };

  const deleteModal = function (data) {
    setDeleteId(data);
    setDeleteConfirm(true);
  };

  const deleteQualification = async function () {
    let response = await dispatch(
      educationDetailsSlice.deleteEducationThunk(deleteId)
    );
    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  };

  const getTitle = function (item) {
    let text = "";
    if (item.levelofeducation != "" && item.levelofeducation) {
      text = item.levelofeducation;
      if (item.fieldofstudy != "" && item.fieldofstudy) {
        text += ", " + item.fieldofstudy;
      }
    } else if (item.fieldofstudy != "" && item.fieldofstudy) {
      text = item.fieldofstudy;
    }
    return text;
  };
  const getDate = function (data) {
    let text = "";
    if (data.startdate) {
      text = formatMonthYear(data.startdate);

      if (data.enddate) {
        text += " to " + endDateValidation(data.enddate);
      }
    } else if (data.enddate) {
      text = endDateValidation(data.enddate);
    }
    return text;
  };

  return (
    <div>
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <CardHeader className="card-title-text  text-capitalize ">
            Education
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
            <div>
              {!loader ? (
                <Row>
                  {educationalDetails.length > 0 ? (
                    educationalDetails.map((item) => (
                      <div className="mb-2">
                        <Col>
                          <strong className="me-2 content-title">
                            {getTitle(item)}
                          </strong>
                          <div className="float-end">
                            <BsPencil
                              className="icons"
                              onClick={() => edit(item)}
                            />{" "}
                            <BsTrash3
                              className="icons"
                              onClick={(evt) =>
                                deleteModal(item.candidateeducationid)
                              }
                            />
                          </div>
                        </Col>
                        {item.cityname !== "" ||
                        item.statename !== "" ||
                        item.countryname !== "" ||
                        item.school !== "" ? (
                          <Label className="mb-0 mt-0 card-p-text-black">
                            {getEducText(item)}
                          </Label>
                        ) : (
                          ""
                        )}
                        {item.iscurrentlystudying ? (
                          <p className="mt-1 card-p-text-black">
                            Currently attending{" "}
                          </p>
                        ) : (
                          <div>
                            <p className="mt-1 card-p-text-black">
                              {getDate(item)}
                            </p>
                          </div>
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
              ) : (
                <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
                  <Loader active={true} type="line-scale-pulse-out-rapid" />
                </div>
              )}
            </div>
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
                Add/Edit Education Details
              </strong>
            </ModalHeader>
            <ModalBody>
              <EducationModal
                onCallEducation={() => handlePageChange()}
                selected={selectedData}
                check={"add"}
              />
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
                Add/Edit Education Details
              </strong>
            </ModalHeader>
            <ModalBody>
              <EducationModal
                onCallEducation={() => handlePageChange()}
                selected={selectedData}
                check={"edit"}
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
                    {educationalDetails.length > 0 ? (
                      educationalDetails.map((item) => (
                        <div className="mb-2">
                          <Col>
                            <strong className="me-2 content-title">
                              {item.levelofeducation}
                              {item.fieldofstudy
                                ? +", " + item.fieldofstudy
                                : ""}
                            </strong>
                          </Col>
                          <Label className="mb-0 mt-0 card-p-text-black">
                            {item.school}
                            {item.cityname ? ", " + item.cityname : ""}
                            {item.statename ? ", " + item.statename : ""}
                            {item.countryname ? ", " + item.countryname : ""}
                          </Label>

                          {item.currentlyStudying ? (
                            <p className="card-p-text-black">
                              Curretly Studying{" "}
                            </p>
                          ) : (
                            <div>
                              <p className="card-p-text-black">
                                {formatMonthYear(item.startdate)}
                                {" to "}
                                {formatMonthYear(item.enddate)}
                              </p>
                            </div>
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
              want to delete the Education details!!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => deleteQualification(false)}
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
    </div>
  );
}
