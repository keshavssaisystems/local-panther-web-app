import React from "react";
import "./jobDetails.scss";
import {
  BsBriefcase,
  BsListStars,
  BsClock,
  BsPersonAdd,
  BsBuildings,
  BsPersonVcard,
  BsCashStack,
  BsStopwatch,
  BsPersonGear,
  BsPinMap,
  BsMortarboard,
  BsPostcard,
  BsJournalBookmark,
} from "react-icons/bs";
import { Col, Row } from "reactstrap";

export function HeadingAndDetailWithDiv({ heading, detail, iconId }) {
  return (
    <>
      <div>
        <Row>
          <Col md="1" className="padding-demo-1">
            <div className="detail-padding-icon">
              {iconId === 1 && <BsPersonVcard />}
              {iconId === 2 && <BsBuildings />}
              {iconId === 3 && <BsClock />}
              {iconId === 4 && <BsListStars />}
              {iconId === 5 && <BsBriefcase />}
              {iconId === 6 && <BsPersonAdd />}
              {iconId === 7 && <BsCashStack />}
              {iconId === 8 && <BsStopwatch />}
              {iconId === 9 && <BsPersonGear />}
              {iconId === 10 && <BsPinMap />}
              {iconId === 11 && <BsMortarboard />}
              {iconId === 12 && <BsPostcard />}
              {iconId === 13 && <BsJournalBookmark />}
            </div>
          </Col>
          <Col className="padding-demo-2">
            <div className="detail-padding">
              <h6 className="fw-bold mb-0 job-heading">{heading}</h6>
              <p className="mb-0 mt-1">{detail}</p>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
