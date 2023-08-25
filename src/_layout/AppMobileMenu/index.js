import React from "react";
import { Slider } from "react-burgers";
import cx from "classnames";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "reactstrap";

export function AppMobileMenu() {
  return (
    <>
      <div className="app-header__mobile-menu">
        <div onClick={this.toggleMobileSidebar}>
          <Slider width={26} lineHeight={2} lineSpacing={5} color="#6c757d"
            active={this.state.active} onClick={() => this.setState({ active: !this.state.active })}/>
        </div>
      </div>
      <div className="app-header__menu">
        <span onClick={this.toggleMobileSmall}>
          <Button size="sm"
            className={cx("btn-icon btn-icon-only", {
              active: this.state.activeSecondaryMenuMobile,
            })}
            color="primary"
            onClick={() =>
              this.setState({
                activeSecondaryMenuMobile: !this.state
                  .activeSecondaryMenuMobile,
              })
            }>
            <div className="btn-icon-wrapper">
              <FontAwesomeIcon icon={faEllipsisV} />
            </div>
          </Button>
        </span>
      </div>
    </>
  );
}

