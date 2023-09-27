import React, { useEffect, useState } from "react";
import { Row, Col } from "reactstrap";
import { JobListing } from "../../_components/job/JobListing";
import { useDispatch, useSelector } from "react-redux";
import { recommendedjobListActions } from "../../_store";
import { JobFilter } from "_components/job/JobFilter";
import PageTitle from "../../_components/common/pagetitle";
import titlelogo from "../../assets/utils/images/candidate.svg";

export function RecommendedJobList() {
  const dispatch = useDispatch();
  let [page, setPage] = useState(1);
  let filterObj = {
    candidateId: "1",
    pageNo: page,
    searchText: "",
    employentModeId: "",
    pageSize: "5",
    locationId: "",
    skillId: "",
  };
  let recommendedJobList = useSelector((state) => state.recommendedjobList);
  let JobList =
    recommendedJobList.recommendedjobList.candidateRecommendedJobDtoList;
  let recommendedTotalRows =
    recommendedJobList.recommendedjobList.totalRows ?? 0;
  useEffect(() => {
    getRecommendedJobList(filterObj);
  }, []);
  const getRecommendedJobList = async function (filterObj) {
    await dispatch(recommendedjobListActions.getrecommendedJobList(filterObj));
  };
  const onPageChange = (pageValue) => {
    setPage(pageValue);
    let filterOnPageChange = {
      candidateId: "1",
      pageNo: page,
      searchText: "",
      employentModeId: "",
      pageSize: "5",
      locationId: "",
      skillId: "",
    };
    getRecommendedJobList(filterOnPageChange);
  };
  const onfliterData = (filterArray) => {
    filterObj = {
      candidateId: "",
      pageNo: 1,
      searchText: "",
      employentModeId: filterArray.employementType,
      pageSize: "5",
      skillId: filterArray.skills,
      locationId: filterArray.location,
    };
    getRecommendedJobList(filterObj);
  };
  const onSearchData = (searchValue) => {
    filterObj = {
      candidateId: "1",
      pageNo: 1,
      searchText: searchValue,
      employentModeId: "",
      pageSize: "5",
      locationId: "",
      skillId: "",
    };
    getRecommendedJobList(filterObj);
  };
  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading="Recommended Jobs" icon={titlelogo} />
        </Col>
        <JobFilter onFilter={onfliterData} onSearch={onSearchData} />
        <p className="mb-1 row-count">{recommendedTotalRows} jobs</p>
        {JobList ? (
          <JobListing
            jobData={JobList}
            onPageChange={onPageChange}
            type={"Recommended"}
            pageSize={"5"}
            totalRows={recommendedTotalRows}
          />
        ) : (
          <></>
        )}
      </Row>
    </>
  );
}
