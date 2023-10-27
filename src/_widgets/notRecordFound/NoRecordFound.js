import React from "react";
import PerfectScrollbar from "react-perfect-scrollbar";

export const NoRecordFound = () => {
  return (
    <div className="scroll-area-sm">
      <PerfectScrollbar>
        <div className="no-results pb-0">
          <div className="sa-icon sa-error mt-0 animate">
            <span className="sa-line sa-tip animateErrorTip" />
            <span className="sa-line sa-long animateErrorLong" />
            <div className="sa-placeholder" />
            <div className="sa-fix" />
          </div>
          <div className="results-title">There are no record found!</div>
        </div>
      </PerfectScrollbar>
    </div>
  );
}
