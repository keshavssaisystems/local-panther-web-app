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
  InputGroup,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import editIcon from "../../assets/utils/images/pencil.svg";
import { BsPencil, BsTrash3, BsUpload } from "react-icons/bs";
import { useDispatch } from "react-redux";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { CertificationsModal } from "./certificationsModal";
import "./profile.scss";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import PerfectScrollbar from "react-perfect-scrollbar";

export function CertificationDetails(props) {
  const dispatch = useDispatch();
  const [selectedCandidate, setSelectedCandidate] = useState(
    props.selectedData
  );
  const [editModal, setEditModal] = useState(false);

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
  const [selectedData, setSelectedData] = useState({});
  const [certificationDetails, setDetails] = useState([
    {
      id: 1,
      name: "Certified Project Management Professional(PMP)",
      expired: "No",
      fromDate: "August 2022",
      toDate: "May 2023",
      description:
        "This certification demonstrates expertise in project management methodologies and practices.Issued by the Project Management Institute(PMI),it signifies the ability to lead and manage complex projects.",
    },
    {
      id: 2,
      name: "Certified ScrumMaster(CSM)",
      expired: "No",
      fromDate: "August 2022",
      toDate: "May 2023",
      description:
        "This certification demonstrates expertise in project management methodologies and practices.Issued by the Project Management Institute(PMI),it signifies the ability to lead and manage complex projects.",
    },
    {
      id: 3,
      name: "Microsoft Certified Azure Administrator",
      expired: "No",
      fromDate: "August 2022",
      toDate: "May 2023",
      description:
        "This certification demonstrates expertise in project management methodologies and practices.Issued by the Project Management Institute(PMI),it signifies the ability to lead and manage complex projects.",
    },
    {
      id: 4,
      name: "Certified Project Management Professional(PMP)",
      expired: "No",
      fromDate: "August 2022",
      toDate: "May 2023",
      description:
        "This certification demonstrates expertise in project management methodologies and practices.Issued by the Project Management Institute(PMI),it signifies the ability to lead and manage complex projects.",
    },
  ]);

  const [isPersonalModal, setPersonalModal] = useState(false);
  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const addEditPersonalInfo = function () {
    setPersonalModal(true);
  };
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const selectDate = function () {};
  const [viewModal, setViewModal] = useState(false);

  const close = function () {
    setPersonalModal(false);
  };
  const edit = function (data) {
    setSelectedData(data);
    setEditModal(true);
  };

  const handlePageChange = () => {
    setPersonalModal(false);
    setEditModal(false);
  };

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <div className="mt-3 scroll-area-lg" style={{ marginLeft: "10px" }}>
            <PerfectScrollbar>
              <Row>
                <Col>
                  <strong className="card-title-text">
                    Certifications and licenses
                  </strong>
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
                {certificationDetails.map((item) => (
                  <div>
                    <strong className="me-2 content-title">{item.name} </strong>
                    <BsPencil
                      className="icons"
                      onClick={() => edit(item)}
                    />{" "}
                    <BsTrash3 className="icons" />
                    <p className="mb-0 card-p-text-black">
                      Does not Expired: {item.expired}
                    </p>
                    <p className="card-p-text-black">
                      {item.fromDate}
                      {" to "}
                      {item.toDate}
                    </p>
                    <p className="card-p-text">{item.description}</p>
                  </div>
                ))}
              </Row>
            </PerfectScrollbar>
          </div>
          <CardFooter
            className="d-flex justify-content-center"
            style={{ border: "none" }}
          >
            <div className="view-link-text">
              <span onClick={() => setViewModal(true)}>
                {" "}
                View all {certificationDetails.length} Details
              </span>
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
            <ModalHeader toggle={() => close()} charCode="Y">
              <strong className="card-title-text">
                Add/Edit Certifications/Licenses
              </strong>
            </ModalHeader>
            <ModalBody>
              <CertificationsModal
                check={"add"}
                selected={selectedData}
                onCallBack={handlePageChange}
              />
              {/* <Form onSubmit={handleSubmit(onSubmit)}>
                <Row>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="certification" className="input-label">
                        Certification/License
                        <span className="required-icon">*</span>
                      </Label>
                      <input
                        placeholder="Enter Certification/license"
                        maxLength={50}
                        name="certification"
                        type="text"
                        id="certification"
                        {...register("certification")}
                        className={`field-input placeholder-text form-control ${
                          errors.certification ? "is-invalid" : ""
                        }`}
                      />

                      <div className="invalid-feedback">
                        {errors.certification?.message}
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <FormGroup check>
                      <Input name="immediateJoin" type="checkbox" />{" "}
                      <Label check className="input-label">
                        Does not Expire
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col md={4}>
                    <FormGroup>
                      <Label for="gender" className="input-label">
                        From Date
                      </Label>
                      <InputGroup>
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <DatePicker
                          className="form-control"
                          placeholderText="DD/MM/YYYY"
                          selected={fromDate}
                          onChange={(evt) => selectDate()}
                        />
                      </InputGroup>
                    </FormGroup>
                  </Col>
                  <Col md={4}>
                    <FormGroup>
                      <Label for="gender" className="input-label">
                        To Date
                      </Label>
                      <InputGroup>
                        <div className="input-group-text">
                          <FontAwesomeIcon icon={faCalendarAlt} />
                        </div>
                        <DatePicker
                          className="form-control"
                          placeholderText="DD/MM/YYYY"
                          selected={toDate}
                          onChange={(evt) => selectDate()}
                        />
                      </InputGroup>
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
              </Form> */}
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
                Add/Edit Certifications/Licenses
              </strong>
            </ModalHeader>
            <ModalBody>
              <CertificationsModal
                check={"edit"}
                selected={selectedData}
                onCallBack={handlePageChange}
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
                    {certificationDetails.map((item) => (
                      <div>
                        <strong className="me-2 content-title">
                          {item.name}{" "}
                        </strong>
                        <p className="mb-0 card-p-text-black">
                          Does not Expired: {item.expired}
                        </p>
                        <p className="card-p-text-black">
                          {item.fromDate}
                          {" to "}
                          {item.toDate}
                        </p>
                        <p className="card-p-text">{item.description}</p>
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
    </div>
  );
}
