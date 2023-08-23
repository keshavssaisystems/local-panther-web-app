import React from "react";
import cx from "classnames";

// import Nav from "../AppNav/VerticalNavWrapper";

import { CSSTransition } from "react-transition-group";

// import PerfectScrollbar from "react-perfect-scrollbar";
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
        <CSSTransition component="div"
          className={cx("app-sidebar", backgroundColor, {
            "sidebar-shadow": enableSidebarShadow,
          })}
          transitionName="SidebarAnimation" transitionAppear={true}
          transitionAppearTimeout={1500} transitionEnter={false} transitionLeave={false}>
          {/* <HeaderLogo /> */}
          {/* <PerfectScrollbar>
            <div className="app-sidebar__inner">
              <Nav />
            </div>
          </PerfectScrollbar> */}
          <div className={cx("app-sidebar-bg", backgroundImageOpacity)}
            style={{
              backgroundImage: enableBackgroundImage
                ? "url(" + backgroundImage + ")"
                : null,
            }}>   
          </div>
        </CSSTransition>
      </>
    );
}
