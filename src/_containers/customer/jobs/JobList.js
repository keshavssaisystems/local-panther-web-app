import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import { JobListing } from "../../../_components/job/JobListing";
import { useDispatch, useSelector } from "react-redux";
import { jobListActions } from "_store";
import { JobFilter } from "_components/job/JobFilter";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

export function JobList() {
  const dispatch = useDispatch();
  let filterObj = {
    jobId: "",
    pageNo: 1,
    searchText: "",
    minExperience: "",
    employentModeId: "",
    pageSize: "5",
    skillId: "",
    locationId: "",
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
      employentModeId: "",
      pageSize: "5",
      skillId: "",
      locationId: "",
    };
    getJobList(filterOnPageChange);
  };
  const onfliterData = (filterArray) => {
    filterObj = {
      jobId: "",
      pageNo: 1,
      searchText: "",
      employentModeId: filterArray.employementType,
      pageSize: "5",
      skillId: filterArray.skills,
      locationId: filterArray.location,
    };
    getJobList(filterObj);
  };
  const onSearchData = (searchValue) => {
    filterObj = {
      jobId: "",
      pageNo: 1,
      searchText: searchValue,
      employentModeId: "",
      pageSize: "5",
      skillId: "",
      locationId: "",
    };
    getJobList(filterObj);
  };
  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading="Open Jobs" icon={titlelogo} />
        </Col>
        <JobFilter
          onFilter={(e) => onfliterData(e)}
          onSearch={(e) => onSearchData(e)}
        />
        <p className="mb-1 row-count">{JobList.totalRows} jobs</p>
        <JobListing
          jobData={JobList.jobList}
          onPageChange={onPageChange}
          pageSize={5}
          type={"Open"}
          totalRows={JobList.totalRows}
        />
      </Row>
    </>
  );
}
