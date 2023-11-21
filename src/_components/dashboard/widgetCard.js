import React from "react";
import { Card, Col, Row } from "reactstrap";
import "./dashboard.scss";

export function WidgetCard({ cardOptions }) {
  return (
    <>
      <Col>
        <Card className="main-card mb-3 counter-widget">
          <div className="grid-menu grid-menu-2col">
            <Row className="g-0">
              {cardOptions.map((options) => (
                <Col sm="6">
                  <div className="widget-chart widget-chart-hover">
                    <div className="icon-wrapper rounded-circle">
                      <div
                        className={"icon-wrapper-bg bg-" + options.className}
                      />
                      <i
                        className={options.icon + " text-" + options.className}
                      />
                    </div>
                    <div className="widget-numbers">{options.count}</div>
                    <div className="widget-subheading">{options.title}</div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </Col>
    </>
  );
}
