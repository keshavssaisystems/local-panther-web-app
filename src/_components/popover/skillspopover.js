import React from "react";
import {
  UncontrolledPopover,
  PopoverHeader,
  PopoverBody,
  Row,
} from "reactstrap";

export const SkillsPopover = (props) => {
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
