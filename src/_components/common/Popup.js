import React, { useEffect, useState } from "react";
import { Card, CardBody, Modal, Row, Col, Button } from "reactstrap";
import successIcon from "../../assets/utils/images/success_icon.svg";
import "./Popup.scss";

export function Popup({ type, message, action }) {
  const [show, setShow] = useState(action);
  useEffect(() => {
    setShow(action);
  }, [action]);

  return (
    <>
      <Modal isOpen={show}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3 mt-4">
              <img src={successIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center popup-message">
              {message}
            </div>
            <div className="mb-0 d-flex justify-content-center popup-message">
              successfully{" "}
            </div>
            <div className="margin-custom">
              <Row>
                <Col className="d-flex justify-content-center mb-4 ">
                  <Button className="" onClick={() => setShow(!show)}>
                    OK
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
