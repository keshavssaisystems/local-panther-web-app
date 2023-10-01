import React, { useState, useEffect } from "react";
import {
  Label,
  Input,
  CardFooter,
  ModalHeader,
  ModalBody,
  CardTitle,
  Table,
} from "reactstrap";
import { additionalInfoDetailsSlice } from "_store";
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
import { BsPencil, BsTrash3 } from "react-icons/bs";
import errorIcon from "../../assets/utils/images/error_icon.png";

import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import { AdditionalInfoModal } from "./additionalInfoModal";

export function AdditionalInformation(props) {
  const dispatch = useDispatch();
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};
  const [commentLength, setCommentLength] = useState(0);
  const [summary, setSummaryLength] = useState("");
  const [info, setInfoLength] = useState("");
  const selected = {};
  const [deleteId, setDeleteId] = useState(0);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);
  const [additionalDetails, setDetails] = useState([
    {
      id: 1,
      summary:
        "Highly motivated and results-driven professional with a strong background in software development and project management.Dedicated to delivering high-quality solutions and exceeding client expectations.Adept at colloborating with cross-functional teams to achieve project goals and deadlines.",
      additionalInfo: [
        {
          name: "Technical Skills",
          value: "Java,Python,C++,SQL",
        },
        {
          name: "volunteerExp",
          value: "Mentorship program for underprivileged youth",
        },
        {
          name: "hobbies",
          value: "Hiking,playing guitar",
        },
      ],
      languages: [
        {
          name: "Telugu",
          type: "Fluent",
        },
        {
          name: "English",
          type: "Fluent",
        },
        {
          name: "Hindi",
          type: "Beginner",
        },
      ],
    },
  ]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState(false);

  const [countryList, setCountryList] = useState([]);
  const close = function () {
    setPersonalModal(false);
  };
  // form validation rules
  const validationSchema = Yup.object().shape({
    summary: Yup.string().max(500, "Summary should not extend 500 characters"),
    language: Yup.string().max(50),
    proficiency: Yup.string().max(50),
    additionalInfo: Yup.string().max(
      200,
      "Summary should not extend 500 characters"
    ),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, handleSubmit, formState } = useForm(formOptions);
  const { errors, isSubmitting } = formState;
  function onSubmit(payload) {}

  const handlePageChange = () => {
    setPersonalModal(false);
  };
  const deleteModal = function (id) {
    setDeleteId(id);
    setDeleteConfirm(true);
  };

  async function deleteAdditionalInfo() {
    let response = await dispatch(
      additionalInfoDetailsSlice.deleteadditionalInfoThunk(deleteId)
    );
    if (response.payload) {
      setSuccess(true);
      setMessage(response.payload.message);
    } else {
      setError(true);
    }
  }

  return (
    <div>
      {/* {selectedCandidate ? ( */}
      <div className="profile-view">
        <Card className="card-hover-shadow-2x mb-3">
          <div className="mt-3 scroll-area-lg" style={{ marginLeft: "10px" }}>
            <PerfectScrollbar>
              <Row className="mb-2">
                <Col>
                  <strong className="card-title-text">
                    Additional Information
                  </strong>
                </Col>

                <Col style={{ marginTop: "10px" }}>
                  <div className="float-end">
                    <BsPencil
                      className="icons"
                      onClick={(evt) => setPersonalModal(true)}
                    />{" "}
                    <BsTrash3
                      className="me-3 icons"
                      onClick={() => deleteModal(additionalDetails.id)}
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                {additionalDetails.length > 0 ? (
                  additionalDetails.map((item) => (
                    <div>
                      <Row>
                        <strong className="content-title mb-1">Summary</strong>
                        <p className="me-2 card-p-text">{item.summary} </p>
                      </Row>
                      <Row>
                        <strong className="content-title mb-2">
                          Additional Information
                        </strong>
                        <ul>
                          {item.additionalInfo.map((col) => (
                            <li>
                              <Label className="card-p-text-black">
                                {col.name}: {col.value}
                              </Label>
                            </li>
                          ))}
                        </ul>
                      </Row>
                      <Row>
                        <strong className="content-title">Languages</strong>
                        <Table
                          responsive
                          borderless
                          className="align-middle mb-0 candidate-table"
                        >
                          <thead>
                            <tr className="candidate-table-header">
                              <th>Language</th>
                              <th>Proficiency</th>
                              <th></th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody className="card-p-text-black">
                            {item.languages.map((column, ind) => (
                              <tr>
                                <td>{column.name}</td>
                                <td>{column.type}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Row>
                    </div>
                  ))
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
            <div className="view-link-text"></div>
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
                Add/Edit Additional Information
              </strong>
            </ModalHeader>
            <ModalBody>
              <AdditionalInfoModal
                check={"add"}
                onCallBack={handlePageChange}
                selected={selected}
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
                    onClick={(evt) => deleteAdditionalInfo(false)}
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
