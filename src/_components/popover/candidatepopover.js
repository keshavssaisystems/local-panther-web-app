import React from "react";
import {
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Row,
  Col,
  Label,
} from "reactstrap";
import {
  applyMask,
  formatPhoneNumber,
  maskEmail,
  getApplicationDate,
} from "_helpers/helper";

export const CandidatePopover = (props) => {
  return (
    <UncontrolledPopover
      className="detail-popover"
      trigger={"legacy"}
      target={`candidatepopover${props.ind}`}
    >
      <PopoverHeader>
        {props.data ? (
          <div>
            <Row>
              <span className=" popover-name">
                {applyMask(props.data.firstname + props.data.lastname)}
              </span>
            </Row>
            <Row>
              <Col className="col-md-4">
                <span className="popover-job-title">
                  {props.data.primaryskills}
                </span>
              </Col>
              <Col className="col-md-8">
                <h6 className=" popover-job-title float-end">
                  {getApplicationDate(props.data.applicationdate)}
                </h6>
              </Col>
            </Row>
          </div>
        ) : (
          <></>
        )}
      </PopoverHeader>
      <PopoverBody className="popover-content">
        <Row>
          <Col>
            <Label className="popover-label">Email :</Label>{" "}
            <span>{maskEmail(props.data.email)}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Label className="popover-label">Contact :</Label>{" "}
            <span>{formatPhoneNumber(props.data.phonenumber)}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Label className="popover-label">Willing to Relocate :</Label>{" "}
            <span>{props.data.isrelocate ? "No" : "Yes"}</span>
          </Col>
        </Row>
        <Row>
          <Col>
            <Label className="popover-label">
              Video Conference Capabilities :
            </Label>{" "}
            <span>{props.data.isvideoconference ? "No" : "Yes"}</span>
          </Col>
        </Row>
      </PopoverBody>
    </UncontrolledPopover>
  );
};
