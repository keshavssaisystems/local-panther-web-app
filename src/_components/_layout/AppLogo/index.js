import React from "react";
import { Slider } from "react-burgers";

// import { AppMobileMenu } from "../AppMobileMenu";

export function HeaderLogo() {
  return (
    <>
      <div className="app-header__logo">
        <div className="logo-src" />
        <div className="header__pane ml-auto">
          <div>
            <Slider width={26} lineHeight={2} lineSpacing={5} color="#6c757d"/>
          </div>
        </div>
      </div>
      {/* <AppMobileMenu /> */}
    </>
  );
}