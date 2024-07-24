import React, { useState, useEffect } from "react";
import { Label, ModalHeader, ModalBody } from "reactstrap";
import { additionalInfoDetailsSlice } from "_store";
import {
  Row,
  Col,
  Modal,
  Card,
  CardBody,
  Button,
  CardHeader,
} from "reactstrap";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import errorIcon from "../../assets/utils/images/error_icon.png";
import successIcon from "../../assets/utils/images/success_icon.svg";
import { useDispatch } from "react-redux";
import Loader from "react-loaders";
import "./profile.scss";
import { AdditionalInfoModal } from "./additionalInfoModal";
import { useSelector } from "react-redux";
import { NoProfileData } from "_components/common/noProfileData";

export function AdditionalInformation(props) {
  const dispatch = useDispatch();
  const [isPersonalModal, setPersonalModal] = useState(false);

  const loader = useSelector((state) => state.getProfile.loader);

  const [selected, setSelectedData] = useState({});
  const [deleteId, setDeleteId] = useState(0);
  const [deleteConfirmation, setDeleteConfirm] = useState(false);

  const [check, setCheck] = useState("");

  const personal_Info = useSelector(
    (state) => state.getProfile.profileData.personalInfo
  );

  const additional_details = useSelector(
    (state) => state.getProfile.profileData.additionalInfo
  );
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));

  const [additionalDetails, setDetails] = useState([]);
  const [getResponse, setGetResponse] = useState([]);

  useEffect(() => {
    setDetails(additional_details);
    let data = [];
    additional_details.forEach((item) => {
      let obj = {
        summary: personal_Info?.summary,
        additionalInfo: personal_Info?.additionalinformation,
        language: item.candidateLanguageDetailsDtos,
        candidateadditioninformationid: item.candidateadditioninformationid,
      };
      data.push(obj);
    });
    let filter_data = [...getResponse];
    filter_data = data;
    setGetResponse(filter_data);
  }, [additional_details]);

  const edit = function (check, data) {
    let new_data;
    if (check === "add") {
      new_data = data;
      setCheck("add");
    } else {
      setCheck("edit");
      new_data = getResponse[0];
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

  const handlePageChange = () => {
    setSuccess(false);
    setPersonalModal(false);
    setDeleteConfirm(false);
    props.onCallBack();
  };
  const deleteModal = function (id) {
    setDeleteId(
      localStorage.getItem("admcandid")
        ? localStorage.getItem("admcandid")
        : userDetails.InternalUserId
    );
    setDeleteConfirm(true);
  };

  async function deleteAdditionalInfo(event) {
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
          <CardHeader className="card-title-text  text-capitalize ">
            Additional information
            {getResponse?.[0]?.summary === "" &&
            getResponse?.[0]?.additionalInfo === "" &&
            getResponse?.[0]?.language?.length === 0 ? (
              <div className="float-end me-2 ms-auto">
                <Label className="link-text" onClick={(evt) => edit("add")}>
                  Add
                </Label>
              </div>
            ) : (
              ""
            )}
          </CardHeader>
          <CardBody className="scroll-area-lg">
            {!loader ? (
              <div>
                {getResponse?.[0]?.summary !== "" ||
                getResponse?.[0]?.additionalInfo !== "" ||
                getResponse?.[0]?.language?.length > 0 ? (
                  <div>
                    {getResponse.map((item) => (
                      <div>
                        {(item.additionalInfo ||
                          item.summary ||
                          item.language?.length > 0) && (
                          <div className="float-end">
                            <BsPencil
                              className="icons"
                              onClick={(evt) => edit("edit", item)}
                            />{" "}
                            <BsTrash3
                              className="icons"
                              onClick={() =>
                                deleteModal(item.candidateadditioninformationid)
                              }
                            />
                          </div>
                        )}

                        {item.summary !== "" && (
                          <div>
                            <strong className="content-title">Summary</strong>
                            <div className="mt-2 card-p-text-black mb-3">
                              {item.summary}
                            </div>
                          </div>
                        )}

                        {item.additionalInfo ? (
                          <div className="mb-3">
                            <strong className="content-title">
                              Additional Information
                            </strong>

                            <div className="mt-2 card-p-text-black">
                              {item.additionalInfo}
                            </div>
                          </div>
                        ) : (
                          ""
                        )}

                        {item.language?.length > 0 ? (
                          <div>
                            <strong className="content-title">Languages</strong>

                            {item.language?.map((column, ind) => (
                              <div className="mt-2">
                                <div className="card-p-text-black mb-1">
                                  {column.language}{" "}
                                  {column.proficiency
                                    ? "- " + column.proficiency
                                    : ""}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <></>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Row style={{ textAlign: "center" }}>
                    <Col>
                      {" "}
                      <NoProfileData imageSize={"25px"} />
                    </Col>
                  </Row>
                )}
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
              want to delete the Additional Information?
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
