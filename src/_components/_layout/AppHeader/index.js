import React from "react";
import cx from "classnames";

import CSSTransitionGroup from "react-transition-group/TransitionGroup";

import { UserBox } from "./Components/UserBox";
import logo from "../../../assets/utils/images/panther-logo.png";

export function AppHeader({
  headerBackgroundColor = 'white',
  enableMobileMenuSmall = true,
  enableHeaderShadow = true
  }) {
    return (
      <>
        <CSSTransitionGroup component="div"
          className={cx("app-header", headerBackgroundColor, {
            "header-shadow": enableHeaderShadow,
          })}
          transitionname="HeaderAnimation" transitionAppear={true}
          transitionAppearTimeout={1500} transitionEnter={false} transitionLeave={false}>

          <div
            className={cx("app-header__content", {
              "header-mobile-open": enableMobileMenuSmall,
            })}>
            <div className="app-header-left">
              <img src={logo} width={"130px"} alt="logo"/>
            </div>
            <div className="app-header-right">
              <UserBox />
            </div>
          </div>
        </CSSTransitionGroup>
      </>
    );
}


