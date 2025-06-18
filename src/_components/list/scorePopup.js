import React, { useState } from "react";
import {
  Nav,
  NavItem,
  PopoverBody,
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  Row,
  Col,
} from "reactstrap";
import "./scorePopup.scss";

export function ScorePopup({ scoreJson }) {
  try {
    const [open, setOpen] = useState(1);
    const toggle = (id) => {
      if (open === id) {
        setOpen();
      } else {
        setOpen(id);
      }
    };
    let validatedJson = JSON.parse(scoreJson);
    let isHiringManager =
      localStorage.getItem("userroleid") &&
      localStorage.getItem("userroleid") === "2";

    let keys = [
      "jobtitlescore",
      "locationscore",
      "skillsscore",
      "experiencescore",
      "educationscore",
    ];

    let text_keys = [
      "job_position_description",
      "location_description",
      "skills_description",
      "experience_description",
      "education_field_description",
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

            {isHiringManager ? (
              <>
                <Accordion open={open} toggle={toggle}>
                  {keys?.map((key, index) => (
                    <AccordionItem>
                      <AccordionHeader targetId={index + 1}>
                        <div className="nav-item-header-custom">
                          <Row>
                            <Col
                              md={10}
                              className={open === index + 1 ? "active" : ""}
                            >
                              {displayName[key]}
                            </Col>
                            <Col md={2}>
                              <div className="counter float-end mb-0">
                                {validatedJson[key] === undefined
                                  ? "-"
                                  : validatedJson[key]}
                              </div>
                            </Col>
                          </Row>
                        </div>
                      </AccordionHeader>
                      <AccordionBody accordionId={index + 1}>
                        <>
                          {index + 1 === 1 && (
                            <div>
                              {validatedJson["job_position_description"]}
                            </div>
                          )}
                          {index + 1 === 2 && (
                            <div>{validatedJson["location_description"]}</div>
                          )}
                          {index + 1 === 3 && (
                            <div>{validatedJson["skills_description"]}</div>
                          )}
                          {index + 1 === 4 && (
                            <div>{validatedJson["experience_description"]}</div>
                          )}
                          {index + 1 === 5 && (
                            <div>
                              {validatedJson["education_field_description"]}
                            </div>
                          )}
                        </>
                      </AccordionBody>
                    </AccordionItem>
                  ))}
                </Accordion>
              </>
            ) : (
              <>
                {keys?.map((key, index) => (
                  <NavItem className="nav-item-header-custom">
                    {displayName[key]}
                    <div className="counter float-end mb-0">
                      {validatedJson[key] === undefined
                        ? "-"
                        : validatedJson[key]}
                    </div>
                  </NavItem>
                ))}
              </>
            )}
          </Nav>
        </PopoverBody>
      </>
    ); // { name: 'John Doe', age: 30 }
  } catch (error) {
    console.log("The JSON string is not valid.");
  }
}
