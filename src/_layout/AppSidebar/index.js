import React from "react";
import cx from "classnames";

import { Nav } from "../AppNav/VerticalNavWrapper";

import CSSTransitionGroup from "react-transition-group/TransitionGroup";

import PerfectScrollbar from "react-perfect-scrollbar";
// import { HeaderLogo } from "../../_layout/AppLogo";


export function AppSidebar({
    backgroundColor,
    enableBackgroundImage,
    enableSidebarShadow,
    backgroundImage,
    backgroundImageOpacity
  }) {
    return (
      <>
        <div className="sidebar-mobile-overlay"/>
        <CSSTransitionGroup component="div"
          className={cx("app-sidebar", backgroundColor, {
            "sidebar-shadow": enableSidebarShadow,
          })}
          transitionname="SidebarAnimation" transitionAppear={true}
          transitionAppearTimeout={1500} transitionEnter={false} transitionLeave={false}>
          {/* <HeaderLogo /> */}
          <PerfectScrollbar>
            <div className="app-sidebar__inner">
              <Nav />
            </div>
          </PerfectScrollbar>
          <div className={cx("app-sidebar-bg", backgroundImageOpacity)}
            style={{
              backgroundImage: enableBackgroundImage
                ? "url(" + backgroundImage + ")"
                : null,
            }}>   
          </div>
        </CSSTransitionGroup>
      </>
    );
}
