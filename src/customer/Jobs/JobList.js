import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import { JobFilter } from "../../_components/Job/JobFilter";
import { JobListing } from "../../_components/Job/JobListing";
import { useDispatch, useSelector } from 'react-redux';
import { jobListActions } from '_store';

export function JobList() {
  const dispatch = useDispatch();
  let filterObj = {
    "jobId" : "",
    "pageNo" : 1,
    "searchText" : "", 
    "minExperience" : "", 
    "employentModeId" : ""  
  }
  useEffect(() => {
    getJobList(filterObj)
  },[]);
  const getJobList = async function (filterObj){
    console.log(filterObj);
    await dispatch(jobListActions.getJobList(filterObj));
  }
  let JobList = useSelector(state => state.jobList);
  const onFilterClick = (filterData) => {
    console.log(filterData);
  }
  const onPageChange = (page) => {
    let filterOnPageChange = {
      "jobId" : "",
      "pageNo" : page
    };
    console.log(filterOnPageChange);
    console.log(page);
    getJobList(filterOnPageChange);
  }
  return (
      <>
        <Row>
          <Col md="12">
            <Card className="main-card mb-3">
              <CardBody>
                <CardTitle className="mb-0">Open Jobs <Button className="float-end mb-0" color="primary">Create Job</Button></CardTitle>
              </CardBody>
            </Card>
          </Col>
          <JobFilter onFilter={onFilterClick} />
          <JobListing jobData={JobList} 
          onPageChange={onPageChange} pageSize={5}
           />
        </Row>
      </>
  );
}
