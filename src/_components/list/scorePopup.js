import React, { useState } from "react";
import {
  Nav,
  NavItem,
  PopoverBody,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "reactstrap";
import "./scorePopup.scss";

export function ScorePopup({ scoreJson }) {
  // const [open, setOpen] = useState("1");
  // const toggle = (id) => {
  //   if (open === id) {
  //     setOpen();
  //   } else {
  //     setOpen(id);
  //   }
  // };
  try {
    let validatedJson = JSON.parse(scoreJson);
    let keys = [
      "jobtitlescore",
      "locationscore",
      "skillsscore",
      "experiencescore",
      "educationscore",
    ];
    let displayName = {
      jobtitlescore: "Job title",
      locationscore: "Location",
      skillsscore: "Skills",
      experiencescore: "Experience",
      educationscore: "Education",
    };
    return (
      <>
        <PopoverBody className="score-popup">
          <Nav vertical className="popup-width">
            <NavItem className="popup-note">
              The percentage above is calculated based on the score below
            </NavItem>
            {/* <Accordion open={open} toggle={toggle}> */}
            {keys?.map((key, index) => (
              // <AccordionItem>
              // <AccordionHeader targetId={index + 1}>
              <NavItem className="nav-item-header-custom">
                {displayName[key]}
                <div className="counter float-end mb-0">
                  {validatedJson[key] === undefined ? "-" : validatedJson[key]}
                </div>
              </NavItem>
              // </AccordionHeader>
              // <AccordionBody accordionId={index + 1}>Test</AccordionBody>
              // </AccordionItem>
            ))}
            {/* </Accordion> */}
          </Nav>
        </PopoverBody>
      </>
    ); // { name: 'John Doe', age: 30 }
  } catch (error) {
    console.log("The JSON string is not valid.");
  }
}
