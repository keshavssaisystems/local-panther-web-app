import React, { useState } from "react";
import { Row, Col, Label, Button } from "reactstrap";
import { SpeechToTextInput } from "_components/common/speechToTextInput";

import "./createJob.scss";

export default function AIJobOffCanvas({ aiDescriptionData }) {
  return (
    <>
      <Row className="mt-4">
        <Col md={12} className="ml-15">
          <div
            class="offcanvas offcanvas-end"
            tabindex="-1"
            id="offcanvasRight"
            aria-labelledby="offcanvasRightLabel"
          >
            <div class="offcanvas-header">
              <h5 id="offcanvasRightLabel">AI Generate JD</h5>
              <button
                type="button"
                class="btn-close text-reset"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div class="offcanvas-body" style={{ padding: "4px" }}>
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  width: "98%",
                  textAlign: "center",
                }}
              >
                <SpeechToTextInput></SpeechToTextInput>
                <Button color="primary">Use this draft and proceed</Button>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
