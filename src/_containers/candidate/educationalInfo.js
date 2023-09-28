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

import errorIcon from "../../assets/utils/images/error_icon.png";
import { EducationModal } from "./educationModal";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsPencil, BsTrash3, BsUpload } from "react-icons/bs";

import DatePicker from "react-datepicker";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import candidatelogo from "../../assets/utils/images/candidate.svg";

export function CandidateEducation(props) {
  const dispatch = useDispatch();

  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const [educationalDetails, setDetails] = useState([
    {
      id: 1,
      educationLevel: "Master's degree",
      field: "Computer Science",
      school: "International College of Arts and Science",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      currentlyStudying: false,
      fromDate: "August 2014",
      toDate: "September 2018",
    },
    {
      id: 2,
      educationLevel: "Master's degree",
      field: "Computer Science",
      school: "International College of Arts and Science",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      currentlyStudying: true,
      fromDate: "",
      toDate: "",
    },
    {
      id: 3,
      id: 2,
      educationLevel: "Master's degree",
      field: "Computer Science",
      school: "International College of Arts and Science",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      currentlyStudying: true,
      fromDate: "",
      toDate: "",
    },
    {
      id: 2,
      educationLevel: "Master's degree",
      field: "Computer Science",
      school: "International College of Arts and Science",
      state: "Los Angeles",
      country: "United States",
      zipCode: 90001,
      currentlyStudying: true,
      fromDate: "",
      toDate: "",
    },
  ]);
  const [viewModal, setViewModal] = useState(false);

  let data = [
    {
      id: 0,
      educationLevel: "",
      error: false,
    },
  ];

  const [countryList, setCountryList] = useState([
    {
      value: 1,
      type: "USA",
    },
    {
      value: 2,
      type: "India",
    },
  ]);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const selectDate = function () {};

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

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <div className="mt-3" style={{ marginLeft: "10px" }}>
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
              {educationalDetails.map((item) => (
                <div className="mb-2">
                  <Col>
                    <strong className="me-2 content-title">
                      {item.educationLevel} {", "}
                      {item.field}
                    </strong>
                    <BsPencil className="icons" onClick={() => edit(item)} />{" "}
                    <BsTrash3
                      className="icons"
                      onClick={(evt) => setDeleteConfirm(true)}
                    />
                  </Col>
                  <Label className="mb-0 mt-0 card-p-text-black">
                    {item.school}
                    {", "}
                    {item.city}
                    {", "}
                    {item.state}
                    {", "}
                    {item.country}
                    {", "}
                    {item.zipCode}
                    {"  "}
                  </Label>

                  {item.currentlyStudying ? (
                    <p className="card-p-text-black">Curretly Studying </p>
                  ) : (
                    <div>
                      <p className="card-p-text-black">
                        {item.fromDate}
                        {" to "}
                        {item.toDate}
                      </p>
                    </div>
                  )}
                </div>
              ))}
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
                    {educationalDetails.map((item) => (
                      <div className="mb-2">
                        <Col>
                          <strong className="me-2 content-title">
                            {item.educationLevel} {", "}
                            {item.field}
                          </strong>
                        </Col>
                        <Label className="mb-0 mt-0 card-p-text-black">
                          {item.school}
                          {", "}
                          {item.city}
                          {", "}
                          {item.state}
                          {", "}
                          {item.country}
                          {", "}
                          {item.zipCode}
                          {"  "}
                        </Label>

                        {item.currentlyStudying ? (
                          <p className="card-p-text-black">
                            Curretly Studying{" "}
                          </p>
                        ) : (
                          <div>
                            <p className="card-p-text-black">
                              {item.fromDate}
                              {" to "}
                              {item.toDate}
                            </p>
                          </div>
                        )}
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
                    onClick={(evt) => setDeleteConfirm(false)}
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
    </div>
  );
}
