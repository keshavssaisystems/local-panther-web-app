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
import editIcon from "../../assets/utils/images/pencil.svg";
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
import { profileActions } from "_store";

import "./profile.scss";
import { BsPencil, BsTrash3, BsUpload } from "react-icons/bs";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import errorIcon from "../../assets/utils/images/error_icon.png";
import * as Yup from "yup";
import PerfectScrollbar from "react-perfect-scrollbar";
import { QualificationModal } from "./qualificationModal";

import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatePicker from "react-datepicker";
import { useDispatch, useSelector } from "react-redux";

export function CandidateQualification(props) {
  debugger;
  const [isPersonalModal, setPersonalModal] = useState(false);
  const [tabs, setTabs] = useState([
    { id: 1, title: "Tab 1", content: <QualificationModal /> },
  ]);

  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [deleteConfirmation, setDeleteConfirm] = useState(false);

  const [qualificationDetails, setDetails] = useState(props.qualificationInfo);

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

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      undefined,
      options
    );
    return formattedDate;
  };

  const validationSchema = Yup.object().shape({
    jobTitle: Yup.string().required("Job Title is required").max(50),
    company: Yup.string().max(500),
    jobDescription: Yup.string().max(500),
    city: Yup.string().required("City is required").max(50),
    state: Yup.string().required("State is required").max(50),
    country: Yup.string(),
    currentlyWorking: Yup.string(),
    fromDate: Yup.string().when("currentlyWorking", {
      is: true,
      then: Yup.string().required("From Date is Required"),
      otherwise: Yup.string(), // No requirement when something is not enabled
    }),

    toDate: Yup.string().when("currentlyWorking", {
      is: true,
      then: Yup.string().required("To Date is Required"),
      otherwise: Yup.string(), // No requirement when something is not enabled
    }),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  function onSubmit(payload) {}
  const edit = function (data) {
    setSelectedData(data);
    setEditModal(true);
  };
  const deleteData = async function (id) {
    debugger;
    let response = await dispatch(profileActions.deleteQualification(id));
    debugger;
    setDeleteConfirm(true);
  };

  const loadData = function () {
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
    console.log(tabs);
  };
  const handlePageChange = () => {
    setPersonalModal(false);
    setEditModal(false);
  };
  const close = function () {
    setPersonalModal(false);
    setEditModal(false);
  };

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <div className="mt-3 scroll-area-md" style={{ marginLeft: "10px" }}>
            <PerfectScrollbar>
              <Row className="mb-3">
                <Col>
                  <strong className="card-title-text">Qualifications</strong>
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
                {qualificationDetails.map((item) => (
                  <div>
                    <Col>
                      <strong className="me-2 content-title">
                        {item.jobtitle}{" "}
                      </strong>
                      <BsPencil
                        className="icons"
                        onClick={(evt) => edit(item)}
                      />{" "}
                      <BsTrash3
                        className="icons"
                        onClick={() =>
                          deleteData(item.candidatequalificationid)
                        }
                      />
                    </Col>

                    <p className="mb-0 card-p-text-black">
                      {item.company}
                      {", "}
                      {item.cityname}
                      {", "}
                      {item.statename}
                      {", "}
                      {item.countryname}
                      {", "}
                      {item.zipCode}
                      {"  "}
                    </p>
                    <p className="card-p-text-black">
                      {formatDate(item.startdate)}
                      {" to "}
                      {formatDate(item.enddate)}
                      {/* {" ("}
                      {item.experience}
                      {")"} */}
                    </p>
                    {/* <p className="card-p-text">{item.jobDescription}</p> */}
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
                View all {qualificationDetails.length} Details
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
                Add/Edit Work Experience
              </strong>
            </ModalHeader>
            <ModalBody>
              <QualificationModal
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
                    {qualificationDetails.map((item) => (
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
                          {item.statename}
                          {", "}
                          {item.countryname}
                          {", "}
                          {item.zipCode}
                          {"  "}
                        </p>
                        <p className="card-p-text-black">
                          {formatDate(item.startdate)}
                          {" to "}
                          {formatDate(item.enddate)}
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
              Qualification Deleted Successfully
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
                    onClick={(evt) => loadData()}
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
