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
import successIcon from "../../assets/utils/images/success_icon.svg";
import { useDispatch } from "react-redux";
import PerfectScrollbar from "react-perfect-scrollbar";
import Loader from "react-loaders";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import "./profile.scss";
import { AdditionalInfoModal } from "./additionalInfoModal";
import { useSelector } from "react-redux";

export function AdditionalInformation(props) {
  const dispatch = useDispatch();
  const [isPersonalModal, setPersonalModal] = useState(false);
  const selectDate = function () {};
  const loader = useSelector((state) => state.getProfile.loader);
  const [commentLength, setCommentLength] = useState(0);
  const [summary, setSummaryLength] = useState("");
  const [info, setInfoLength] = useState("");
  const [selected, setSelectedData] = useState({});
  const [deleteId, setDeleteId] = useState(0);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);

  const [check, setCheck] = useState("");

  const additional_details = useSelector(
    (state) => state.getProfile.profileData.additionalInfo
  );

  const [additionalDetails, setDetails] = useState([]);
  const [getResponse, setGetResponse] = useState([]);

  useEffect(() => {
    setDetails(additional_details);

    let data = [];

    let language = [];

    additional_details.forEach((item) => {
      let obj = {
        summary: item.summary,
        additionalInfo: item.additionalinformation,
        language: [],
        candidateadditioninformationid: item.candidateadditioninformationid,
      };
      let lan_data = {
        name: item.language,
        proficiency: item.proficiency,
      };
      language.push(lan_data);
      data.push(obj);
    });

    data.language = language;
    let filter_data = [...getResponse];
    filter_data = data;
    setGetResponse(filter_data);
  }, [additional_details]);

  const convertText = function (htmlContent) {
    let data;
    const lines = htmlContent.split("<p>").map((line, index) => {
      if (index === 0) {
        data = "";
      } else {
        data += `<li>${line.replace("</p>", "")}</li>`;
      }
    });
    if (data != "") {
      return data;
    } else {
      return data;
    }
  };

  const edit = function (check, data) {
    let new_data;
    if (check == "add") {
      new_data = data;
      setCheck("add");
    } else {
      setCheck("edit");
      new_data = additionalDetails
        ? additionalDetails.find(
            (x) =>
              x.candidateadditioninformationid ==
              data.candidateadditioninformationid
          )
        : additionalDetails;
    }

    setSelectedData(new_data);
    setPersonalModal(true);
  };

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
    setSuccess(false);
    setPersonalModal(false);
    setDeleteConfirm(false);
    props.onCallBack();
  };
  const deleteModal = function (id) {
    setDeleteId(id);
    setDeleteConfirm(true);
  };

  async function deleteAdditionalInfo() {
    let response = await dispatch(
      additionalInfoDetailsSlice.deleteadditionalInfoThunk(deleteId)
    );
    setDeleteConfirm(false);
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
            <Row className="mb-2">
              <Col>
                <strong className="card-title-text">
                  Additional information
                </strong>
              </Col>
              <Col>
                <Label
                  className="float-end me-3 link-text"
                  onClick={(evt) => edit("add")}
                >
                  Add
                </Label>
              </Col>
            </Row>
            {!loader ? (
              <div>
                {getResponse.length > 0 ? (
                  <Row>
                    {getResponse.map((item) => (
                      <div>
                        <Row>
                          <Col>
                            <strong className="content-title mb-1">
                              Summary
                            </strong>
                          </Col>

                          <Col style={{ marginTop: "10px" }}>
                            <div className="float-end">
                              <BsPencil
                                className="icons"
                                onClick={(evt) => edit("edit", item)}
                              />{" "}
                              <BsTrash3
                                className="me-3 icons"
                                onClick={() =>
                                  deleteModal(
                                    item.candidateadditioninformationid
                                  )
                                }
                              />
                            </div>
                          </Col>
                        </Row>
                        <div>
                          <ul
                            dangerouslySetInnerHTML={{
                              __html: convertText(item.summary),
                            }}
                          />
                        </div>
                        <div>
                          {item.additionalInfo ? (
                            <div>
                              <Row>
                                <Col>
                                  <strong className="content-title mb-1">
                                    Additional Information
                                  </strong>
                                </Col>
                              </Row>
                              <div>
                                <ul
                                  dangerouslySetInnerHTML={{
                                    __html: convertText(item.additionalInfo),
                                  }}
                                />
                              </div>
                            </div>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    ))}
                    <Row>
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
                            {getResponse.language.map((column, ind) => (
                              <tr>
                                <td>{column.name}</td>
                                <td>{column.proficiency}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Row>
                    </Row>
                  </Row>
                ) : (
                  <div className="d-flex justify-content-center">
                    No Data Available
                  </div>
                )}
              </div>
            ) : (
              <div className="loader-wrapper d-flex justify-content-center align-items-center loader">
                <Loader active={loader} type="line-scale-pulse-out-rapid" />
              </div>
            )}
          </div>
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
                check={check}
                onCallAdditionalInfo={() => handlePageChange()}
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
