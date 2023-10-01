import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
} from "reactstrap";
import { educationDetailsSlice } from "_store";
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
import { formatDate } from "_helpers/helper";

import errorIcon from "../../assets/utils/images/error_icon.png";
import { EducationModal } from "./educationModal";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsPencil, BsTrash3, BsUpload } from "react-icons/bs";

import DatePicker from "react-datepicker";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import "./profile.scss";

import successIcon from "../../assets/utils/images/success_icon.svg";

export function CandidateEducation(props) {
  const dispatch = useDispatch();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const [educationalDetails, setDetails] = useState(props.educationInfo);
  const [viewModal, setViewModal] = useState(false);
  const [deleteId, setDeleteId] = useState(0);

  let data = [
    {
      candidateeducationid: 0,
      candidateid: 0,
      levelofeducation: "",
      fieldofstudy: "",
      school: "",
      city: [
        {
          cityid: 0,
          cityname: "",
        },
      ],
      state: [
        {
          stateid: 0,
          statename: "",
        },
      ],
      country: [
        {
          countryid: 0,
          countryname: "",
        },
      ],
      iscurrentlystudying: true,
      startdate: null,
      enddate: null,
      isactive: false,
      currentUserId: null,
    },
  ];

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const selectDate = function () {};

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "short", day: "numeric" };
  //   const formattedDate = new Date(dateString).toLocaleDateString(
  //     undefined,
  //     options
  //   );
  //   return formattedDate;
  // };

  function onSubmit(payload) {}
  const close = function () {
    setPersonalModal(false);
  };
  const handlePageChange = () => {
    setPersonalModal(false);
    setEditModal(false);
  };

  const edit = function (data) {
    setSelectedData(data);
    setEditModal(true);
  };
  const closeModal = function () {
    window.location.reload();
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

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <div className="mt-3 scroll-area-md" style={{ marginLeft: "10px" }}>
            {/* <PerfectScrollbar> */}
            <Row>
              <Col>
                <strong className="card-title-text">Education</strong>
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
            <Row>
              {educationalDetails.length > 0 ? (
                educationalDetails.map((item) => (
                  <div className="mb-2">
                    <Col>
                      <strong className="me-2 content-title">
                        {item.levelofeducation} {", "}
                        {item.fieldofstudy}
                      </strong>
                      <div className="float-end">
                        <BsPencil
                          className="icons"
                          onClick={() => edit(item)}
                        />{" "}
                        <BsTrash3
                          className="icons me-3"
                          onClick={(evt) =>
                            deleteModal(item.candidateeducationid)
                          }
                        />
                      </div>
                    </Col>
                    <Label className="mb-0 mt-0 card-p-text-black">
                      {item.school}
                      {item.cityname ? ", " + item.cityname : ""}
                      {item.statename ? ", " + item.statename : ""}
                      {item.countryname ? ", " + item.countryname : ""}
                      {/* {", "}
                    {item.zipCode}
                    {"  "} */}
                    </Label>

                    {item.iscurrentlystudying ? (
                      <p className="card-p-text-black">Curretly Studying </p>
                    ) : (
                      <div>
                        <p className="card-p-text-black">
                          {formatDate(item.startdate)}
                          {" to "}
                          {formatDate(item.enddate)}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="d-flex justify-content-center">
                  No Data available
                </div>
              )}
            </Row>
            {/* </PerfectScrollbar> */}
          </div>
          {/* <CardFooter
            className="d-flex justify-content-center"
            style={{ border: "none" }}
          >
            <div className="view-link-text">
              <span onClick={() => setViewModal(true)}>
                View all {educationalDetails.length} Details
              </span>
            </div>
          </CardFooter> */}
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
                onCallBack={handlePageChange}
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
                onCallBack={handlePageChange}
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
                                {formatDate(item.startdate)}
                                {" to "}
                                {formatDate(item.enddate)}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="d-flex justify-content-center">
                        No Data available
                      </div>
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
              want to delete the Qualification!!
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
