import React from "react";

import cx from "classnames";

export function SearchBox() {
  return (
    <>
      <div
        className={cx("search-wrapper", {
          active: true,
        })}>
        <div className="input-holder">
          <input type="text" className="search-input" placeholder="Type to search"/>
          <button
            className="search-icon">
            <span />
          </button>
        </div>
        {/* <button
          className="close"/> */}
      </div>
    </>
  );
}

