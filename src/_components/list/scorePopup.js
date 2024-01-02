import React from "react";
import { Nav, NavItem, PopoverBody } from "reactstrap";
import "./scorePopup.scss";

export function ScorePopup({ scoreJson }) {
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
            {keys?.map((key) => (
              <NavItem className="nav-item-header-custom">
                {displayName[key]}
                <div className="counter float-end mb-0">
                  {validatedJson[key] === undefined ? "-" : validatedJson[key]}
                </div>
              </NavItem>
            ))}
          </Nav>
        </PopoverBody>
      </>
    ); // { name: 'John Doe', age: 30 }
  } catch (error) {
    console.log("The JSON string is not valid.");
  }
}
