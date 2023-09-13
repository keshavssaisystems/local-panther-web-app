import React, { useEffect } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import { JobListing } from "../../../_components/job/JobListing";
import { useDispatch, useSelector } from "react-redux";
import { jobListActions } from "_store";
import { JobFilter } from "_components/job/JobFilter";

export function JobList() {
  const dispatch = useDispatch();
  let filterObj = {
    jobId: "",
    pageNo: 1,
    searchText: "",
    minExperience: "",
    employentModeId: "",
    pageSize: "5",
  };
  useEffect(() => {
    getJobList(filterObj);
  }, []);
  const getJobList = async function (filterObj) {
    await dispatch(jobListActions.getJobList(filterObj));
  };
  let JobList = useSelector((state) => state.jobList);
  const onPageChange = (page) => {
    let filterOnPageChange = {
      jobId: "",
      pageNo: page,
      searchText: "",
      minExperience: "",
      employentModeId: "",
      pageSize: "5",
    };
    getJobList(filterOnPageChange);
  };
  const onfliterData = (term) => {
    console.log();
  };
  return (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardBody>
              <CardTitle className="mb-0">Open Jobs </CardTitle>
            </CardBody>
          </Card>
        </Col>
        <JobFilter onFilter={onfliterData} />
        <p className="mb-1 row-count">{JobList.totalRows} jobs</p>
        <JobListing
          jobData={JobList}
          onPageChange={onPageChange}
          pageSize={5}
          type={"Open"}
        />
      </Row>
    </>
  );
}
