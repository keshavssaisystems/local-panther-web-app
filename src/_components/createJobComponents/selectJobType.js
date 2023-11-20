import React, { useState } from "react";
import { Row, Col, FormGroup, Label, Input, CardTitle, Form } from "reactstrap";
import SearchPreviousJob from "./searchPreviousJob";
import "./createJob.scss";

export default function SelectJobType({
  getJobTypeData,
  jobList,
  postSearch,
  readyForNextStep,
  recommendedJobList,
}) {
  const [jobType, setJobType] = useState("new_template");
  const [showJobTable, setShowJobTable] = useState(false);
  const getOldJobId = (event) => {
    getJobTypeData({
      type: jobType,
      jobId: event,
    });
    readyForNextStep(false);
  };
  const onButtonClick = (event) => {
    setJobType(event.target.value);
    if (
      event.target.value === "previous_template" ||
      event.target.value === "recommendation_template"
    ) {
      setShowJobTable(true);
      readyForNextStep(true);
    } else {
      setShowJobTable(false);
      getJobTypeData({
        type: event.target.value,
        jobId: "",
      });
      readyForNextStep(false);
    }
  };

  return (
    <>
      <div className="form-wizard-content">
        <Row className="mt-4">
          <Col md={10} style={{ marginLeft: "15px" }}>
            <CardTitle className="mb-1 select-option-label">
              Select option
            </CardTitle>
            <p className="mt-0 mb-2 text-muted-custom">
              Please select one option to create a new job
            </p>
            <Form>
              <FormGroup check>
                <Input
                  type="radio"
                  name="jobType"
                  id="previous"
                  value={"previous_template"}
                  onClick={(e) => onButtonClick(e)}
                />
                <Label for="previous" check className="radio-label-custom">
                  Use a previous job as a template
                </Label>{" "}
                {"  "}
                <p className="mt-0 mb-2 text-muted-custom">
                  Copy a past job post & edit as needed
                </p>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="radio"
                  name="jobType"
                  id="new"
                  value={"new_template"}
                  defaultChecked={true}
                  onClick={(e) => onButtonClick(e)}
                />
                <Label for="new" check className="radio-label-custom">
                  Start with new
                </Label>
                {"  "}
                <p className="mt-0 mb-2 text-muted-custom">Beginning a new</p>
              </FormGroup>
              <FormGroup check>
                <Input
                  type="radio"
                  name="jobType"
                  id="recommendation"
                  value={"recommendation_template"}
                  onClick={(e) => onButtonClick(e)}
                />
                <Label
                  for="recommendation"
                  check
                  className="radio-label-custom"
                >
                  Use recommendations to create a new job
                </Label>
                {"  "}
                <p className="mt-0 mb-2 text-muted-custom">
                  Generate a job post from available jobs and edit from there
                </p>
              </FormGroup>
            </Form>
          </Col>
        </Row>
        {showJobTable === true && (
          <SearchPreviousJob
            getJobId={(e) => getOldJobId(e)}
            jobList={jobList}
            postSearch={(e) => postSearch(e)}
            recommendedJobList={recommendedJobList}
            jobType={jobType}
          />
        )}
      </div>
    </>
  );
}
