import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import { JobFilter } from "./JobFilter";
import { JobListing } from "./JobListing";
import { useDispatch, useSelector } from 'react-redux';
import { jobListActions } from '_store';

export function JobList() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    "pageNo" : 1
  })
  useEffect(() => {
    getJobList()
  },[]);
  const getJobList = async function (){
    await dispatch(jobListActions.getJobList(filter));
  }
  let JobList = useSelector(state => state.jobList);
  const onFilterClick = (filterData) => {
    console.log(filterData);
  }
  const onPageChange = (page) => {
    console.log(page);
    // setFilter({
    //   "pageNo" : page
    // });

    // getJobList()
  }
  // useEffect(() => {
  //   getJobList()
  //   console.log("Strng");
  // },filter.pageNo);
  // console.log(page);
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
          onPageChange={onPageChange}
           />
        </Row>
      </>
  );
}
