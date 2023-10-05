import React from "react";
import cx from "classnames";

import CSSTransitionGroup from "react-transition-group/TransitionGroup";

import { UserBox } from "./Components/UserBox";
import logo from "../../../assets/utils/images/panther-logo.png";
import { useSelector } from "react-redux";
import "./appheader.scss";
export function AppHeader({
  headerBackgroundColor = "white",
  enableMobileMenuSmall = true,
  enableHeaderShadow = true,
}) {
  const userroleid = useSelector((state) => state.auth.userroleid);
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
            <img src={logo} width={"130px"} height={"48px"} alt="logo" />
          </div>
          <div className="user-title">
            <h4>
              {userroleid === 1
                ? "OpenWrox - Admin"
                : userroleid === 2
                ? "OpenWrox - Customer"
                : "OpenWrox - Candidate"}
            </h4>
          </div>
          <div className="app-header-right">
            <UserBox />
          </div>
        </div>
      </CSSTransitionGroup>
    </>
  );
}
