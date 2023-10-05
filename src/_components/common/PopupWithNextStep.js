import React, { useEffect, useState } from "react";
import { Card, CardBody, Modal, Row, Col, Button } from "reactstrap";
import successIcon from "../../assets/utils/images/success_icon.svg";
import "./Popup.scss";
import { useNavigate } from "react-router-dom";

export function PopupWithNextStep({
  message,
  action,
  nextStepMessage,
  noAction,
  yesAction,
}) {
  const [show, setShow] = useState(action);
  useEffect(() => {
    setShow(action);
  }, [action]);
  const navigate = useNavigate();
  const yesClick = () => {
    setShow(!show);
    window.location.reload(false);
    navigate(yesAction);
  };
  const noClick = () => {
    setShow(!show);
    navigate(noAction);
  };

  return (
    <>
      <Modal isOpen={show}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3 mt-3">
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center popup-message">
              {message}
            </div>
            <div className="mb-0 d-flex justify-content-center popup-message">
              successfully.{" "}
            </div>
            <div className="margin-custom-v2">
              <Row className="d-flex justify-content-center mb-4 ">
                <span className="d-flex justify-content-center next-step-message">
                  {nextStepMessage}
                </span>
              </Row>
              <Row>
                <Col className="d-flex justify-content-center mb-3 ">
                  <Button
                    className="me-2 button-dark-custom"
                    onClick={(evt) => noClick()}
                  >
                    No
                  </Button>
                  <Button
                    className="button-custom"
                    onClick={(evt) => yesClick()}
                  >
                    Yes
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
    </>
  );
}
