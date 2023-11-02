import React, { useEffect, useState } from "react";
import { Card, CardBody, Modal, Row, Col, Button } from "reactstrap";
import successIcon from "../../assets/utils/images/success_icon.svg";
import errorIcon from "../../assets/utils/images/error_icon.png";
import "./Popup.scss";

export function SuccessPopUp(props) {
  return (
    <>
      <Card>
        <CardBody>
          <div className="d-flex justify-content-center mb-3 mt-4">
            <img
              src={props?.icon === "success" ? successIcon : errorIcon}
              alt="success-icon"
            />
          </div>
          <div className="m-3 d-flex justify-content-center popup-message">
            {props?.message}
          </div>
          <div className="mb-0 d-flex justify-content-center popup-message">
            {props.tryAgain !== false ? (
              <span>
                {props?.icon === "success"
                  ? "successfully"
                  : "Please try again"}
              </span>
            ) : (
              ""
            )}
          </div>

          <div className="margin-custom">
            <Row>
              <Col className="d-flex justify-content-center mb-4 ">
                <Button
                  style={{ backgroundColor: "#2f479b" }}
                  className=" btn-text"
                  onClick={() => props?.callBack()}
                >
                  OK
                </Button>
              </Col>
            </Row>
          </div>
        </CardBody>
      </Card>
    </>
  );
}
