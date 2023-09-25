import React from "react";
import { Button } from "reactstrap";

export default function PublishJobStep() {
  return (
    <>
      <div className="form-wizard-content">
        <div className="no-results">
          <div className="sa-icon sa-success animate">
            <span className="sa-line sa-tip animateSuccessTip" />
            <span className="sa-line sa-long animateSuccessLong" />
            <div className="sa-placeholder" />
            <div className="sa-fix" />
          </div>
          <div className="results-subtitle mt-4">Successfull!</div>
          <div className="results-title">
            Your job with <b>Java Developer</b> has successfully created!
          </div>
          <div className="mt-3 mb-3" />
          <div className="text-center">
            <Button color="primary" size="lg" className="btn-shadow btn-wide">
              Save as draft
            </Button>{" "}
            {"   "}
            <Button color="success" size="lg" className="btn-shadow btn-wide">
              Publish job
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
