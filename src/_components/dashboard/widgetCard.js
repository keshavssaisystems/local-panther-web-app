import React from "react";
import { Card, Col, Row } from "reactstrap";

export function WidgetCard({ classType, title, count, icon }) {
  return (
    <>
      <Card
        className={
          "widget-chart widget-chart2 text-start mb-3 card-btm-border card-shadow-" +
          classType +
          " border-" +
          classType
        }
      >
        <div className="widget-chat-wrapper-outer">
          <Row>
            <Col md="4">
              <div className="icon-wrapper rounded-circle mt-1">
                <div className={"icon-wrapper-bg bg-" + classType} />
                <i className={icon + " text-" + classType} />
              </div>
            </Col>
            <Col>
              <div className="widget-chart-content">
                <div className="widget-title opacity-5 ">{title}</div>
                <div className="widget-numbers mt-2 fsize-4 mb-0 w-100">
                  <div className="widget-chart-flex align-items-center">
                    <div>{count}</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Card>
    </>
  );
}
