import React from "react";
import { Card, Col, Row } from "reactstrap";
import "./dashboard.scss";
import { useNavigate } from "react-router-dom";

export function WidgetCard({
  cardOptions,
  threeCols = false,
  showIcons = false,
}) {
  const navigate = useNavigate();
  const redirectPath = (link) => {
    navigate(link);
  };
  return (
    <>
      <Col>
        <Card className="main-card mb-3 counter-widget">
          <div className="grid-menu grid-menu-2col">
            <Row className="g-0">
              {cardOptions.map((options, index) => (
                <Col
                  sm={threeCols ? "4" : "6"}
                  key={index}
                  className={threeCols && (index + 1) % 2 ? "" : "right-border"}
                >
                  <div
                    className="widget-chart widget-chart-hover"
                    onClick={(e) => redirectPath(options?.path)}
                  >
                    <div className="icon-wrapper rounded-circle">
                      <div
                        className={"icon-wrapper-bg bg-" + options.className}
                      />
                      {showIcons ? (
                        <img src={options.icon} />
                      ) : (
                        <i
                          className={
                            options.icon + " text-" + options.className
                          }
                        />
                      )}
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
