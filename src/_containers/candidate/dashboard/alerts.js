import React, { useState } from "react";
import {
  CardHeader,
  Card,
  CardFooter,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import alertsIcon from "../../../assets/utils/images/alert-reminder.svg";
import { useSelector } from "react-redux";
import { NoDataFound } from "_components/common/nodatafound";
import Loader from "react-loaders";
import { BsTrash3 } from "react-icons/bs";
import { getTimezoneDateTimeForNow } from "_helpers/helper";
import "./dashboard.scss";
import "../../../_components/modal/alertmodal.scss";
import moment from "moment";
import { Link } from "react-router-dom";

export function Alerts(props) {
  const totalRecords = useSelector(
    (state) => state.candidateListReducer.totalRecords
  );

  const alerts = useSelector((state) => state.candidateDashboard.alertsList);
  const loader = useSelector((state) => state.candidateDashboard.alertsLoader);
  const colors = ["dot-danger", "dot-success", "dot-primary"];
  return (
    <>
      <Card className="card-hover-shadow-2x mb-3 alert-cont">
        {props.type === "view" ? (
          <></>
        ) : (
          <CardHeader className="card-header-tab">
            <div className="card-header-title font-size-md text-capitalize fw-bold">
              <img src={alertsIcon} alt="alerts-img" className="me-2" />
              Alerts & Notifications
            </div>
          </CardHeader>
        )}
        <div
          className={
            props.type === "view" ? "scroll-area-lg" : "scroll-area-md"
          }
        >
          {!loader ? (
            <>
              <PerfectScrollbar>
                <div className="p-2">
                  {alerts?.length > 0 ? (
                    <>
                      {props.type === "view" ? (
                        <>
                          {alerts.map((item) => (
                            <ListGroup className="todo-list-wrapper" flush>
                              <ListGroupItem>
                                <div className="widget-content p-0">
                                  <div className="widget-content-wrapper">
                                    <div
                                      className={
                                        item.notificationstatusid === 3
                                          ? "widget-content-left viewed-alerts"
                                          : "widget-content-left hand-cursor"
                                      }
                                      onClick={() =>
                                        props.onReadNotification(
                                          item.queueid,
                                          item.notificationstatusid
                                        )
                                      }
                                    >
                                      <div
                                        className="widget-heading alert-heading"
                                        title={item.notificationmessage}
                                      >
                                        {item.notificationmessage}
                                      </div>

                                      <div
                                        className="widget-subheading alert-desc"
                                        title={item.notificationdetails}
                                      >
                                        {item.notificationdetails}
                                      </div>
                                      <div
                                        className="widget-subheading alert-desc"
                                        style={{ paddingBottom: "6px" }}
                                      >
                                        Posted{" "}
                                        {getTimezoneDateTimeForNow(
                                          moment(
                                            item.modifieddate
                                              ? item.modifieddate
                                              : item.createddate
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div className="widget-content-right widget-content-actions todo-icons">
                                      <BsTrash3
                                        size={"16px"}
                                        onClick={() => [
                                          props.onDeleteNotification(
                                            item.queueid
                                          ),
                                        ]}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </ListGroup>
                          ))}
                        </>
                      ) : (
                        <>
                          {alerts.slice(0, 5).map((item) => (
                            <ListGroup className="todo-list-wrapper" flush>
                              <ListGroupItem>
                                <div className="widget-content p-0">
                                  <div className="widget-content-wrapper">
                                    <div
                                      className={
                                        item.notificationstatusid === 3
                                          ? "widget-content-left viewed-alerts"
                                          : "widget-content-left hand-cursor"
                                      }
                                      onClick={() =>
                                        props.onReadNotification(
                                          item.queueid,
                                          item.notificationstatusid
                                        )
                                      }
                                    >
                                      <div
                                        className="widget-heading alert-heading"
                                        title={item.notificationmessage}
                                      >
                                        {item.notificationmessage}
                                      </div>

                                      <div
                                        className="widget-subheading alert-desc"
                                        title={item.notificationdetails}
                                      >
                                        {item.notificationdetails}
                                      </div>
                                      <div
                                        className="widget-subheading alert-desc"
                                        style={{ paddingBottom: "6px" }}
                                      >
                                        Posted{" "}
                                        {getTimezoneDateTimeForNow(
                                          moment(
                                            item.modifieddate
                                              ? item.modifieddate
                                              : item.createddate
                                          )
                                        )}
                                      </div>
                                    </div>
                                    <div className="widget-content-right widget-content-actions todo-icons">
                                      <BsTrash3
                                        size={"16px"}
                                        onClick={() => [
                                          props.onDeleteNotification(
                                            item.queueid
                                          ),
                                        ]}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </ListGroupItem>
                            </ListGroup>
                          ))}
                        </>
                      )}
                    </>
                  ) : (
                    <Row style={{ textAlign: "center" }}>
                      <Col>
                        {" "}
                        <NoDataFound imageSize={"25px"} />
                      </Col>
                    </Row>
                  )}
                </div>
              </PerfectScrollbar>
              {alerts?.length > 5 && props.type !== "view" ? (
                <div style={{ textAlign: "center", paddingBottom: "1rem" }}>
                  {" "}
                  <Link style={{ width: "100%" }} to={"/notification"}>
                    {" "}
                    View All Notifications
                  </Link>
                </div>
              ) : (
                <></>
              )}
            </>
          ) : (
            <div className="d-flex justify-content-center align-items-center loader">
              <Loader active={loader} type="line-scale-pulse-out-rapid" />
            </div>
          )}
        </div>
      </Card>
    </>
  );
}
