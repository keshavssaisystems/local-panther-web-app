import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, CardBody, CardTitle, Button } from "reactstrap";
import { JobListing } from "../_components/Job/JobListing";
import { useDispatch, useSelector } from "react-redux";
import { jobListActions } from "_store";
import { employmentModeReducer } from "_store";
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
  const [minValue, setMinValue] = useState();
  const [maxValue, setMaxValue] = useState();

  const [selectedEmpMode, setSelectedEmpMode] = useState("");
  const [input, setInput] = useState("");
  const [list, setList] = useState([]);
  const empModeData = useSelector((state) => state.empmode.user.data);

  var minExp = useRef();
  var maxExp = useRef();
  useEffect(() => {
    dispatch(employmentModeReducer.getEmpmode());
  }, [dispatch]);
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

    if (minExp.current != undefined && minExp.current != null) {
      data.minExperience = minExp.current;
    }
    if (maxExp.current != undefined && maxExp.current != null) {
      data.maxExperience = minExp.current;
    }

    let response = await dispatch(jobListActions.getJobList(data));
    setList(response.payload.data.jobList);
  };

  const handleExperience = function (check, event) {
    check == "min"
      ? (minExp.current = Number(event))
      : (maxExp.current = Number(event));
  };

  const collectSearchData = (evt) => {
    searchData.current = evt.target.value;
    setInput(evt.target.value);
  };
  const inputClear = () => {
    searchData.current = "";
    document.getElementById("search-input").value = "";
    getJobList();
  };

  const onPageChange = (page) => {};
  return (
    <>
      <Row>
        <Col md="12">
          <Card className="main-card mb-3">
            <CardBody>
              <CardTitle className="mb-0">Recommended Jobs </CardTitle>

              <Row>
                <Col md="3">
                  {/* <div className="m-5">
                    <Label for="minExperience">Minimum Experience:</Label>
                    <Input
                      type="number"
                      id="minExperience"
                      placeholder="Enter min experience"
                      value={minExp.current}
                      onChange={(e) => handleExperience("min", e.target.value)}
                    />
                  </div> */}
                  <div className="m-5">
                    <select
                      id="empModeSelect"
                      value={selectedEmpMode}
                      onChange={handleEmpModeChange}
                    >
                      <option value="">Select an option</option>
                      {empModeData.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </Col>

                <Col md="3">
                  {/* <div className="m-5">
                    <Label for="maxExperience">Maximum Experience:</Label>
                    <Input
                      type="number"
                      id="maxExperience"
                      placeholder="Enter max experience"
                      value={maxValue}
                      onChange={(e) => handleExperience("max", e.target.value)}
                    />
                  </div> */}
                  <div className="m-5">
                    <Button type="buton" color="primary" onClick={getJobList}>
                      Apply Filters
                    </Button>
                  </div>
                </Col>
                <Col md="6">
                  {" "}
                  <div className="input-holder m-5">
                    <input
                      type="text"
                      id="search-input"
                      className="search-input"
                      value={searchData.current}
                      onChange={collectSearchData}
                      placeholder="Search by name,skill,location"
                    />
                    <button
                      onClick={inputClear}
                      className="btn-close"
                      color="primary"
                    />
                    <Button
                      onClick={getJobList}
                      className="search-icon"
                      color="primary"
                    >
                      <span />
                      search
                    </Button>
                  </div>
                </Col>
                <Col md="3">
                  <div className="m-4"></div>
                </Col>
              </Row>
              <Row>
                <Col md="3">
                  <div className="m-4"></div>
                </Col>
                <Col md="3">
                  {/* <div className="m-4">
                    <select className="m-5">
                      <option value="" selected>
                        Enter location
                      </option>
                    </select>
                  </div> */}
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

              <Col> </Col>
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
