import React, { useEffect, useState } from "react";
import {
  Modal,
  CardBody,
  Card,
  Row,
  Col,
  Button,
  Label,
  Input,
  FormGroup,
} from "reactstrap";
import errorIcon from "../../assets/utils/images/error_icon.png";
import "./prescreen.scss";
import { getProfileActions } from "_store";
import { useDispatch, useSelector } from "react-redux";

export const DeactivateReasonModal = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getProfileActions.getReasonList(
        props.title === "rescheduling"
          ? "InterviewRescheduleReason"
          : props.title === "deactivating account"
          ? "deactivateaccountreason"
          : "rejectionreason"
      )
    );
  }, []);
  const [reason, setReason] = useState(0);
  const [reasonText, setReasonText] = useState(0);
  const [save, setSave] = useState(false);
  const reasonList = useSelector((state) => state.getProfile.reasonList);

  const handleReasonSelect = (data) => {
    setReason(Number(data));
    setReasonText(reasonList?.find((x) => x.id === Number(data))?.name);
  };

  const onSubmitReject = () => {
    if (reason === 0) {
      setSave(true);
      return false;
    }
    props.callBack(
      props.title === "deactivating account" ? reason : reasonText
    );
  };
  return (
    <Modal
      className="prescreen-modal modal-dialog-reject-align"
      isOpen={props.isRMOpen}
    >
      <Card>
        <CardBody>
          <div className="d-flex justify-content-center mb-3">
            <img src={errorIcon} alt="error-icon" />
          </div>
          <div className="mb-0 d-flex justify-content-center reject-reason-text">
            Please provide a reason for
          </div>
          <div className="mb-3 d-flex justify-content-center reject-reason-text">
            {props.title}
          </div>
          <div>
            <Row>
              <Col>
                <FormGroup>
                  <Label className="reject-modal-label" for="exampleText">
                    Reason{" "}
                    <span
                      className="required-icon"
                      style={{ color: "#ff0000" }}
                    >
                      *
                    </span>
                  </Label>
                  <Input
                    id="reason"
                    name="reason"
                    type="select"
                    onChange={(evt) => handleReasonSelect(evt.target.value)}
                    style={{
                      borderColor: save && reason === 0 ? "#ff0000" : "#ced4da",
                    }}
                  >
                    <option key={0} value={0}>
                      Select reason
                    </option>
                    {reasonList?.length > 0 &&
                      reasonList?.map((options) => (
                        <option key={options.id} value={options.id}>
                          {options.name}
                        </option>
                      ))}
                  </Input>

                  {save && reason === 0 ? (
                    <p className="filter-info-text">Reason is required</p>
                  ) : (
                    <></>
                  )}
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col className="d-flex justify-content-center">
                <Button
                  className="me-2 reject-modal-btn"
                  onClick={(evt) => onSubmitReject()}
                >
                  Submit
                </Button>
                <Button
                  className="reject-close-btn"
                  onClick={(evt) => props.callBackError()}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </Modal>
  );
};
