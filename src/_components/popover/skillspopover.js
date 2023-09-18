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

export const SkillsPopover = (props) => {
  debugger;
  return (
    <UncontrolledPopover
      className="skills-layout"
      trigger={"legacy"}
      target={`skillspopover${props.ind}`}
    >
      <PopoverHeader className="skills-popover-header">Skills</PopoverHeader>
      <PopoverBody>
        {props.data ? (
          <div>
            <Row className="skills-font">{props.data.secondaryskills}</Row>
          </div>
        ) : (
          <></>
        )}
      </PopoverBody>
    </UncontrolledPopover>
  );
};
