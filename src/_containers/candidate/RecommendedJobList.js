import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import { JobListing } from "../../_components/Job/JobListing";
import { useDispatch, useSelector } from "react-redux";
import { jobListActions } from "../../_store";
import { employmentModeReducer } from "../../_store";
import cx from "classnames";

export function RecommendedJobList() {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    jobId: "",
    pageNo: 1,
    searchText: "",
    employentModeId: null,
    pageSize: "5",
  });
  let JobList = useSelector((state) => state.jobList);
  let stateUpdate = "true";
  var searchData = useRef("");
  const [pageSize, setPage] = useState(5);
  const [searchText, setSearchText] = useState("");
  const [filteredJobList, setFilteredJobList] = useState({});


  const [selectedEmpMode, setSelectedEmpMode] = useState("");
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const empModeData = useSelector((state) => state?.empmode?.user.data);

  var minExp = useRef();
  var maxExp = useRef();
  const handleEmpModeChange = (event) => {
    setSelectedEmpMode(event.target.value);
  };
  useEffect(() => {
    getJobList();
  }, []);

  useEffect(() => {
    setFilteredJobList(JobList);
  }, [list]);

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

  const onPageChange = (page) => { };
  return (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardBody>
              <CardTitle className="mb-2">Recommended Jobs </CardTitle>

              <Row>
                <Col md="3">
                  <div className="m-5">
                    <select
                      id="empModeSelect"
                      value={selectedEmpMode}
                      onChange={handleEmpModeChange}
                    >
                      <option value="">Select an option</option>
                      {empModeData?.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>




              </Row>
              <Row>
                <Col md="3">

                </Col>

              </Row>

              <Col md="3">
                <div
                  className={cx("search-wrapper", {
                    active: true,
                  })}
                  style={{ marginLeft: "75%" }}
                ></div>
              </Col>
              <Col md="3">
                <div
                  className={cx("search-wrapper", {
                    active: true,
                  })}
                  style={{ marginLeft: "75%" }}
                ></div>
              </Col>


            </CardBody>
          </Card>
        </Col>

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
