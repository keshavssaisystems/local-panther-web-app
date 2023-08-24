import React from "react";
import cx from "classnames";

import { CSSTransition } from "react-transition-group";

import { SearchBox } from "./Components/SearchBox";
// import MegaMenu from "./Components/MegaMenu";
import { UserBox } from "./Components/UserBox";
// import HeaderRightDrawer from "./Components/HeaderRightDrawer";

// import HeaderDots from "./Components/HeaderDots";

export function AppHeader({
  headerBackgroundColor,
  enableMobileMenuSmall,
  enableHeaderShadow
  }) {
    return (
      <>
        <CSSTransition component="div"
          className={cx("app-header header-shadow", headerBackgroundColor, {
            "header-shadow": enableHeaderShadow,
          })}
          transitionName="HeaderAnimation" transitionAppear={true}
          transitionAppearTimeout={1500} transitionEnter={false} transitionLeave={false}>

          <div
            className={cx("app-header__content", {
              "header-mobile-open": enableMobileMenuSmall,
            })}>
            <div className="app-header-left">
              <SearchBox />
              {/* <MegaMenu /> */}
            </div>
            <div className="app-header-right">
              {/* <HeaderDots /> */}
              <UserBox />
              {/* <HeaderRightDrawer /> */}
            </div>
          </div>
        </CSSTransition>
      </>
    );
}


