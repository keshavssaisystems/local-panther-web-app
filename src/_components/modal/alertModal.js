import React from "react";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownToggle,
  ModalHeader,
  ModalBody,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  DropdownItem,
} from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";
import { NoDataFound } from "_components/common/nodatafound";
import { BsTrash3 } from "react-icons/bs";
import { getTimezoneDateTimeForNow } from "_helpers/helper";
import moment from "moment";
import { Link } from "react-router-dom";
import "./alertmodal.scss";

export const AlertModal = (props) => {
  return (
    <div className="alert-mod alert-cont">
      <div className="widget-content-wrapper">
        <div className="widget-content-left">
          <UncontrolledButtonDropdown>
            <DropdownToggle
              color="link"
              className="alert-mod"
              style={{ paddingLeft: "2px", paddingRight: "2px" }}
            >
              <button
                style={{ paddingLeft: "2px", paddingRight: "2px" }}
                className=" btn-icon btn-icon-only btn btn-link btn-sm"
              >
                <i className="pe-7s-bell btn-icon-wrapper font-size-xlg"> </i>
                <>
                  {props?.notiCount !== 0 ? (
                    <>
                      <span className="badge rounded-pill bg-primary">
                        {props?.notiCount}
                      </span>
                    </>
                  ) : (
                    <></>
                  )}
                </>
              </button>
            </DropdownToggle>
            <DropdownMenu end className="rm-pointers dropdown-menu-lg">
              <ModalHeader charCode="Y">
                <strong className="card-title-text">
                  Alerts & Notifications
                </strong>
              </ModalHeader>
              <ModalBody
                style={{ maxHeight: "60vh", overflow: "auto", padding: "0px" }}
                className="alert-cont"
              >
                <PerfectScrollbar>
                  <div>
                    {props?.data?.length > 0 ? (
                      props.data.slice(0, 5).map((item) => (
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
                                      props.onDeleteNotification(item.queueid),
                                    ]}
                                  />
                                </div>
                              </div>
                            </div>
                          </ListGroupItem>
                        </ListGroup>
                      ))
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
                {props?.data?.length > 5 ? (
                  <div style={{ textAlign: "center" }}>
                    {" "}
                    <DropdownItem>
                      <Link style={{ width: "100%" }} to={"/notification"}>
                        {" "}
                        View All Notifications
                      </Link>
                    </DropdownItem>
                  </div>
                ) : (
                  <></>
                )}
              </ModalBody>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>
      </div>
    </div>
  );
};
