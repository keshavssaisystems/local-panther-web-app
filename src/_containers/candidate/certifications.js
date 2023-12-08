import React, { useState, useEffect } from "react";
import { Label, CardFooter, ModalHeader, ModalBody } from "reactstrap";
import { certificateDetailsSlice } from "_store";
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
} from "_helpers/helper";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";

import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import { CertificationsModal } from "./certificationsModal";
import "./profile.scss";
import Loader from "react-loaders";

import PerfectScrollbar from "react-perfect-scrollbar";
import { NoDataFound } from "_components/common/nodatafound";

export function CertificationDetails(props) {
  const dispatch = useDispatch();
  const [editModal, setEditModal] = useState(false);
  const loader = useSelector((state) => state.getProfile.loader);
  const [deleteId, setDeleteId] = useState(0);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [certificationDetails, setDetails] = useState([]);

  const certification_details = useSelector(
    (state) => state.getProfile.profileData.certificationsInfo
  );

  useEffect(() => {
    setDetails(certification_details);
  }, [certification_details]);

  const [isPersonalModal, setPersonalModal] = useState(false);

  const [viewModal, setViewModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const close = function () {
    setPersonalModal(false);
    setEditModal(false);
  };
  const edit = function (data) {
    setSelectedData(data);
    setEditModal(true);
  };

  const handlePageChange = () => {
    setPersonalModal(false);
    setDeleteConfirm(false);
    setEditModal(false);
    setSuccess(false);
    setError(false);
    props.onCallBack();
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
            Certifications and licenses
            <div className="float-end me-2 ms-auto">
              <Label
                className="link-text"
                onClick={(evt) => setPersonalModal(true)}
              >
                Add
              </Label>
            </div>
          </CardHeader>
          <CardBody className="scroll-area-lg">
            {!loader ? (
              <div>
                <PerfectScrollbar>
                  <Row>
                    {certificationDetails ? (
                      <div>
                        {certificationDetails.length > 0 ? (
                          certificationDetails.map((item, index) => (
                            <div className="mb-4">
                              <strong className="me-2 content-title">
                                {certificationDetails[index].certificationtype}{" "}
                                {" - "}{" "}
                                {certificationDetails[index].certificationname}{" "}
                              </strong>
                              <div className="float-end">
                                <BsPencil
                                  className="icons"
                                  onClick={() => edit(item)}
                                />{" "}
                                <BsTrash3
                                  className="icons"
                                  onClick={() =>
                                    deleteModal(
                                      certificationDetails[index]
                                        .candidatecertificationid
                                    )
                                  }
                                />
                              </div>
                              <p
                                className="mb-1 mt-1 card-p-text-black"
                                style={{ fontWeight: "600px" }}
                              >
                                <strong>Expired : </strong>
                                {certificationDetails[index].isexpired
                                  ? "No"
                                  : "Yes"}
                              </p>
                              {certificationDetails[index].startdate &&
                              certificationDetails[index].enddate ? (
                                <p
                                  className="mb-1 mt-1 card-p-text-black"
                                  style={{ fontWeight: "600px" }}
                                >
                                  <strong>Certification period : </strong>
                                  {getDate(certificationDetails[index])}
                                </p>
                              ) : (
                                <div>
                                  {certificationDetails[index].startdate ||
                                  certificationDetails[index].enddate ? (
                                    <p
                                      className="mb-1 mt-1 card-p-text-black"
                                      style={{ fontWeight: "600px" }}
                                    >
                                      <strong>Certification period : </strong>
                                      {getDate(certificationDetails[index])}
                                    </p>
                                  ) : (
                                    ""
                                  )}
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
                      </div>
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
                <Loader active={loader} type="line-scale-pulse-out-rapid" />
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
                Add/Edit Certifications/Licenses
              </strong>
            </ModalHeader>
            <ModalBody>
              <CertificationsModal
                check={"add"}
                selected={selectedData}
                onCallCertification={() => handlePageChange()}
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
                onCallCertification={() => handlePageChange()}
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
              want to delete the Certification/License!!
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
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => handlePageChange()}
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
