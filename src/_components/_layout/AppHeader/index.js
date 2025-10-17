import React, { useState } from "react";
import cx from "classnames";
import CSSTransitionGroup from "react-transition-group/TransitionGroup";
import { UserBox } from "./Components/UserBox";
import logo from "../../../assets/utils/images/panther-logo-2.png";
import smlogo from "../../../assets/utils/images/panther-logo-2.png";
import { useSelector } from "react-redux";
import "./appheader.scss";
import { ChatCounter } from "./Components/chatCounter";
import { NotificationCounter } from "./Components/notificationCounter";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Row, Col } from "reactstrap";
import { CompleteCandProfileModal } from "_components/modal/completeCandProfileModal";
import { isDesktop } from "../../../_helpers/helper";
import GetAppPopup from "../../common/GetAppPopup";

export function AppHeader({
  headerBackgroundColor = "white",
  enableMobileMenuSmall = true,
  enableHeaderShadow = true,
  unAuth = false,
  isSidebarOpen = true,
  onCloseSidebar,
  onOpenSidebar,
}) {
  const userroleid = useSelector((state) => state.auth.userroleid);
  const [showCPModal, setShowCPModal] = useState(false);
  let userDetail = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails"))
    : {};
  let isCompanyAdmin = localStorage.getItem("isCompanyAdmin")
    ? localStorage.getItem("isCompanyAdmin") === "true"
    : false;
  const [showGetAppPopup, setShowGetAppPopup] = useState(false);
  return (
    <>
      <CSSTransitionGroup
        component="div"
        className={cx("app-header", headerBackgroundColor, {
          "header-shadow": enableHeaderShadow,
        })}
        transitionname="HeaderAnimation"
      >
        <div
          className={cx("app-header__content", {
            "header-mobile-open": enableMobileMenuSmall,
          })}
        >
          <div className="app-header-left">
            <Row>
              <Col className="no-padding">
                {isSidebarOpen ? (
                  <Link to="/">
                    <div
                      className=""
                      style={{ width: "135px", height: "55px" }}
                    >
                      <img
                        src={
                          localStorage.getItem("logo")
                            ? localStorage.getItem("logo")
                            : logo
                        }
                        style={{
                          objectFit: "contain",
                          height: "100%",
                          width: "100%",
                          background: "#FFF",
                          cursor: "not-allowed",
                        }}
                        alt="logo"
                      />
                    </div>
                  </Link>
                ) : (
                  <></>
                )}
              </Col>
              <Col style={{ lineHeight: "50px" }}>
                {unAuth ? (
                  <></>
                ) : (
                  <>
                    {isSidebarOpen ? (
                      <FontAwesomeIcon
                        style={{ fontSize: "24px", marginTop: "15px" }}
                        icon={faBars}
                        onClick={() => onCloseSidebar()}
                      />
                    ) : (
                      <div
                        className=""
                        style={{ width: "135px", height: "55px" }}
                      >
                        <img
                          src={
                            localStorage.getItem("logo")
                              ? localStorage.getItem("logo")
                              : smlogo
                          }
                          alt="Open side Menu"
                          style={{
                            objectFit: "contain",
                            height: "100%",
                            width: "100%",
                            cursor: "pointer",
                            background: "#FFF",
                          }}
                          onClick={() => onOpenSidebar()}
                        />
                      </div>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </div>
          {!unAuth ? (
            <>
              <div className="user-title">
                <h4>
                  Welcome, {userDetail?.FirstName} {userDetail?.LastName}
                  {/* {userroleid === 1
                    ? "OpenWorX Admin"
                    : userroleid === 2
                    ? isCompanyAdmin
                      ? "Company Admin"
                      : "Hiring Manager"
                    : "Candidate"} */}
                </h4>
              </div>
              <div className="app-header-right">
                {userroleid !== 1 && <ChatCounter />}
                <span>
                  <NotificationCounter></NotificationCounter>
                </span>
                {isDesktop() && userroleid === 3 && (
                  <button className="btn btn-primary get-app-btn-lm-10" onClick={() => setShowGetAppPopup(true)}>Get App</button>
                )}
                <UserBox />
                
                <CompleteCandProfileModal
                  isOpen={showCPModal}
                  onCloseModal={() => {
                    setShowCPModal(false);
                  }}
                ></CompleteCandProfileModal>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </CSSTransitionGroup>
      <GetAppPopup isOpen={showGetAppPopup} toggle={() => setShowGetAppPopup(false)} />
    </>
  );
}
