import React, { useState } from "react";
import { Row, Col, Table, Input, FormGroup, Form } from "reactstrap";
import cx from "classnames";
import "./createJob.scss";
import moment from "moment/moment";
import { JobShortDetailModal } from "./jobShortDetailModal";

export default function SearchPreviousJob({
  getJobId,
  jobList,
  postSearch,
  recommendedJobList,
  jobType,
}) {
  let current = Number(jobList.totalRows) / 5;
  if (current * 5 !== jobList.totalRows) {
    current++;
  }
  const [showButton, setShowButton] = useState(false);
  const getSearchValue = (event) => {
    event.preventDefault();
    postSearch(event.target.elements.search.value);
  };
  const removeSearchValue = (event) => {
    event.preventDefault();
    event.target.form[0].value = "";
    setShowButton(false);
    postSearch("");
  };
  const onSearch = (event) => {
    if (event.target.value.length > 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
  };
  const getJobIdOnClick = (event) => {
    getJobId(event.target.value);
  };
  return (
    <>
      <Row className="mt-4">
        <Col md={4} className="ml-15">
          <Form onSubmit={getSearchValue}>
            <FormGroup>
              <div className={cx("search-wrapper", { active: true })}>
                <div className="input-holder">
                  <input
                    type="text"
                    className="search-input"
                    id="search"
                    name="search"
                    placeholder={"Search by job title"}
                    onChange={(e) => onSearch(e)}
                  />
                  <button className="search-icon">
                    <span />
                  </button>
                </div>
                {showButton === true && (
                  <button
                    style={{ left: "220px", padding: "0px" }}
                    className="btn-close close-button"
                    onClick={(e) => removeSearchValue(e)}
                  />
                )}
              </div>
            </FormGroup>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col md={11} className="ml-15">
          <Table className="mb-0" striped bordered>
            <thead>
              <tr>
                <th width={"4%"}> </th>
                <th className="table-header-custom">Job</th>
                <th className="table-header-custom">Date posted</th>
                <th className="table-header-custom">Locations</th>
                <th className="table-header-custom">Action</th>
              </tr>
            </thead>
            <tbody>
              {jobList?.jobList?.length > 0 &&
                jobType === "previous_template" &&
                jobList?.jobList?.map((job) => (
                  <tr key={job.jobid}>
                    <td align="center">
                      <Input
                        type="radio"
                        name="jobs"
                        id={"jobRows_" + job.jobid}
                        value={job.jobid}
                        onClick={(e) => getJobIdOnClick(e)}
                      />
                    </td>
                    <td>{job.jobtitle}</td>
                    <td>
                      {moment(job.jobcreatedatetime).format("MMM D, YYYY")}
                    </td>
                    <td>{job.cityname + ", " + job.statename}</td>
                    <td>
                      <JobShortDetailModal data={job} />
                    </td>
                  </tr>
                ))}
              {recommendedJobList?.jobList?.length > 0 &&
                jobType === "recommendation_template" &&
                recommendedJobList?.jobList?.map((job) => (
                  <tr key={job.jobid}>
                    <td align="center">
                      <Input
                        type="radio"
                        name="jobs"
                        id={"jobRows_" + job.jobid}
                        value={job.jobid}
                        onClick={(e) => getJobIdOnClick(e)}
                      />
                    </td>
                    <td>{job.jobtitle}</td>
                    <td>
                      {moment(job.jobcreatedatetime).format("MMM D, YYYY")}
                    </td>
                    <td>{job.cityname + ", " + job.statename}</td>
                    <td>
                      <JobShortDetailModal data={job} />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </>
  );
}
