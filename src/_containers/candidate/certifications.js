import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
} from "reactstrap";
import { certificateDetailsSlice } from "_store";
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
import { formatDate } from "_helpers/helper";
import editIcon from "../../assets/utils/images/pencil.svg";
import { BsPencil, BsTrash3, BsUpload } from "react-icons/bs";
import { useDispatch } from "react-redux";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
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

  const [deleteId, setDeleteId] = useState(0);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [certificationDetails, setDetails] = useState(props.certificationsInfo);

  // const formatDate = (dateString) => {
  //   if (dateString) {
  //     const options = { year: "numeric", month: "short", day: "numeric" };
  //     const formattedDate = new Date(dateString).toLocaleDateString(
  //       undefined,
  //       options
  //     );
  //     return formattedDate;
  //   } else {
  //     return "";
  //   }
  // };

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
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

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

  const deleteModal = function (id) {
    setDeleteId(id);
    setDeleteConfirm(true);
  };

  const deleteQualification = async function () {
    let response = await dispatch(
      certificateDetailsSlice.deletecertificateThunk(deleteId)
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
                {certificationDetails ? (
                  <div>
                    {certificationDetails.length > 0 ? (
                      certificationDetails.map((item, index) => (
                        <div>
                          <strong className="me-2 content-title">
                            {certificationDetails[index].certificationname}{" "}
                          </strong>
                          <div className="float-end">
                            <BsPencil
                              className="icons"
                              onClick={() => edit(item)}
                            />{" "}
                            <BsTrash3
                              className="icons me-3"
                              onClick={() =>
                                deleteModal(
                                  certificationDetails[index]
                                    .candidatecertificationid
                                )
                              }
                            />
                          </div>
                          <p className="mb-0 card-p-text-black">
                            Expired:{" "}
                            {certificationDetails[index].isexpired
                              ? "Yes"
                              : "No"}
                          </p>
                          <p className="card-p-text-black">
                            {certificationDetails[index].startdate
                              ? formatDate(
                                  certificationDetails[index].startdate
                                )
                              : ""}
                            {" to "}
                            {certificationDetails[index].enddate
                              ? formatDate(certificationDetails[index].enddate)
                              : ""}
                          </p>
                          <p className="card-p-text">
                            {certificationDetails[index].description}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="d-flex justify-content-center">
                        No Data available
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="d-flex justify-content-center">
                    No Data available
                  </div>
                )}
              </Row>
            </PerfectScrollbar>
          </div>
          {/* <CardFooter
            className="d-flex justify-content-center"
            style={{ border: "none" }}
          >
            <div className="view-link-text">
              <span onClick={() => setViewModal(true)}>
                {" "}
                View all {certificationDetails.length} Details
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
                Add/Edit Certifications/Licenses
              </strong>
            </ModalHeader>
            <ModalBody>
              <CertificationsModal
                check={"add"}
                selected={selectedData}
                onCallBack={handlePageChange}
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
                    {certificationDetails?.map((item, index) => (
                      <div>
                        <strong className="me-2 content-title">
                          {certificationDetails[index].name}{" "}
                        </strong>
                        <p className="mb-0 card-p-text-black">
                          Does not Expired:{" "}
                          {certificationDetails[index].expired}
                        </p>
                        <p className="card-p-text-black">
                          {certificationDetails[index].fromDate}
                          {" to "}
                          {certificationDetails[index].toDate}
                        </p>
                        <p className="card-p-text">
                          {certificationDetails[index].description}
                        </p>
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
    </div>
  );
}
