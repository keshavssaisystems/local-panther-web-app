import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
// import { JobListing } from "../../../_components/job/JobListing";
import { JobListing } from "../../../_components/job/JobListing";
import { useDispatch, useSelector } from "react-redux";
import { jobListActions } from "_store";
import { JobFilter } from "_components/job/JobFilter";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

export function JobList() {
  const [page, setPage] = useState(1);
  const [searchVal, setSearchVal] = useState("");
  const [locVal, setLocVal] = useState("");
  const [skillsVal, setSkillsVal] = useState("");
  const [empTypeVal, setEmpTypeVal] = useState("");

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
      searchText: searchVal,
      employentModeId: empTypeVal,
      pageSize: "5",
      skillId: skillsVal,
      locationId: locVal,
    };
    getJobList(filterOnPageChange);
  };
  const onfliterData = (filterArray) => {
    filterObj = {
      jobId: "",
      pageNo: 1,
      searchText: searchVal,
      employentModeId: filterArray.employementType,
      pageSize: "5",
      skillId: filterArray.skills,
      locationId: filterArray.location,
    };
    setEmpTypeVal(filterArray.employementType);
    setSkillsVal(filterArray.skills);
    setLocVal(filterArray.location);
    getJobList(filterObj);
  };
  const onSearchData = (searchValue) => {
    filterObj = {
      jobId: "",
      pageNo: 1,
      searchText: searchValue,
      employentModeId: empTypeVal,
      pageSize: "5",
      skillId: skillsVal,
      locationId: locVal,
    };
    setSearchVal(searchValue);
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
          setPage={setPage}
        />
        <p className="mb-1 row-count">{JobList.totalRows} jobs</p>
        {JobList?.jobList?.length ? (
          <JobListing
            jobData={JobList.jobList}
            onPageChange={onPageChange}
            pageSize={5}
            type={"Open"}
            totalRows={JobList.totalRows}
            page={page}
            setPage={setPage}
          />
        ) : (
          <></>
        )}
      </Row>
    </>
  );
}
