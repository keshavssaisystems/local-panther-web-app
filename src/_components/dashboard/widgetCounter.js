import React from "react";
import { Card, Col } from "reactstrap";
import "./dashboard.scss";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function WidgetCounter({ cardOptions }) {
  return (
    <>
      {cardOptions.map((options) => (
        <Col
          key={options.id}
          xs="12"
          sm="9"
          md="6"
          lg="3"
          className="widget-counter"
        >
          <Card
            className={
              "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-primary " +
              options.color
            }
          >
            <div className="widget-chat-wrapper-outer">
              <div className="widget-chart-content">
                <div className="widget-content-left fsize-1">
                  <div className="widget-main-title">{options.title}</div>
                  <div className="widget-main-subtitle">{options.subTitle}</div>
                </div>
                <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                  <div className="widget-chart-flex align-items-center">
                    <div>
                      <span className={"opacity-10 pe-2 " + options.arrowColor}>
                        {options.arrowDirection === "" ? (
                          ""
                        ) : options.arrowDirection === "faAngleUp" ? (
                          <FontAwesomeIcon icon={faAngleUp} />
                        ) : (
                          <FontAwesomeIcon icon={faAngleDown} />
                        )}
                      </span>
                      {options.count}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </>
  );
}
