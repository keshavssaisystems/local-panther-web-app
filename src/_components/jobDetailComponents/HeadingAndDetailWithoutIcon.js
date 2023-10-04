import React from "react";
import "./jobDetails.scss";

export function HeadingAndDetailWithoutIcon({ heading, detail, type }) {
  return (
    <>
      <div className="detail-padding">
        <h6 className="fw-bold mb-0 job-heading">{heading}</h6>
        <p className="mb-0 mt-1 mr-1">
          {type === "list" ? (
            detail
          ) : (
            <div dangerouslySetInnerHTML={{ __html: detail }}></div>
          )}
        </p>
      </div>
    </>
  );
}
