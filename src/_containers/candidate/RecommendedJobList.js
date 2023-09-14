import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle } from "reactstrap";
import { JobListing } from "../../_components/job/JobListing";
import { useDispatch, useSelector } from "react-redux";
import { jobListActions } from "../../_store";
import { empmodeActions } from "_store";
import { JobFilter } from "_components/job/JobFilter";
import { BsFillPeopleFill } from "react-icons/bs";

export function RecommendedJobList() {
  const dispatch = useDispatch();

  const [filter, setFilter] = useState({
    jobId: "",
    pageNo: 1,
    searchText: "",
    employentModeId: null,
    pageSize: "5",
  });
  const onfliterData = (term) => {};
  let JobList = useSelector((state) => state.jobList);
  let stateUpdate = "true";
  var searchData = useRef("");
  const [pageSize, setPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [filteredJobList, setFilteredJobList] = useState({});

  const [selectedEmpMode, setSelectedEmpMode] = useState("");
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const empModeData = useSelector((state) => state.empmode.user.data);

  const handleEmpModeChange = (event) => {
    setSelectedEmpMode(event.target.value);
  };
  useEffect(() => {
    getJobList();
  }, []);

  useEffect(() => {
    setFilteredJobList(JobList);
  }, [list]);
  useEffect(() => {
    dispatch(empmodeActions.getEmpmode());
  }, [dispatch]);

  const getJobList = async function () {
    let data = {
      jobId: "",
      pageNo: filter.pageNo,
      pageSize: pageSize,
      searchText: searchData.current,
      employentModeId: selectedEmpMode,
    };

    filter.searchText = searchData.current;

    let response = await dispatch(jobListActions.getJobList(data));
    setList(response.payload.data.jobList);
  };

  const collectSearchData = (evt) => {
    searchData.current = evt.target.value;
    setInput(evt.target.value);
  };
  const inputClear = () => {
    searchData.current = "";

    getJobList();
  };

  const onPageChange = (page) => {};
  return (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardBody>
              <CardTitle className="mb-0">
                {" "}
                <BsFillPeopleFill /> Recommended Jobs{" "}
              </CardTitle>
            </CardBody>
          </Card>
        </Col>
        <JobFilter onFilter={onfliterData} />
        <p className="mb-1 row-count">{filteredJobList.totalRows} jobs</p>
        {filteredJobList.jobList ? (
          <JobListing
            jobData={filteredJobList}
            onPageChange={onPageChange}
            type={"Recommended"}
            pageSize={pageSize}
          />
        ) : (
          <></>
        )}
      </Row>
    </>
  );
}
