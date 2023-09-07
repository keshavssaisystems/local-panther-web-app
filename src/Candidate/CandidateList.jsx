import { Title } from "chart.js";
import React, { useState, useEffect } from "react";
import {
  Table,
  Label,
  Input,
  Pagination,
  PaginationItem,
  PaginationLink,
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import {
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
// import Select from "react-select";
import { candidateActions } from "_store";
import { Row, Col, Button } from "reactstrap";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { CandidateDetails } from "./candidateDetails";

export function CandidateList() {
  const dispatch = useDispatch();

  let jobId = 2;
  const [candidatesList, setCandidateList] = useState([]);
  const [getCandidateList, setList] = useState([]);
  const [showCandidate, setshowCandidate] = useState(false);
  const [selectedCandidate, setselectedCandidate] = useState();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setpageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState();
  const [isExpError, setIsExpError] = useState(false);
  let expError = false;
  const [searchText, setSearchText] = useState("");
  let minExp;
  let maxExp;
  let searchData = "";

  const [expList, setExpList] = useState([
    {
      value: 1,
      label: "1",
    },
    {
      value: 2,
      label: "2",
    },
    {
      value: 1,
      label: "3",
    },
    {
      value: 2,
      label: "4",
    },
    {
      value: 1,
      label: "5",
    },
    {
      value: 2,
      label: "6",
    },
  ]);

  useEffect(() => {
    getCandidatesList();
  }, []);

  useEffect(() => {
    setCandidateList(getCandidateList);
  }, [getCandidateList]);

  useEffect(() => {
    setIsExpError(expError);
  }, [expError]);

  const getCandidatesList = async function() {
    console.log(searchText);
    if (isExpError) {
      return;
    }
    let url =
      "JobApplications/GetJobAppliedCandidatesList/" +
      2 +
      "?pageSize=" +
      pageSize +
      "&pageNumber=" +
      pageIndex +
      "&isActive=true";

    if (searchText) {
      url += "&searchText=" + searchText;
    }
    if (minExp != undefined) {
      url += "&minExperience=" + minExp;
    }
    if (maxExp != undefined) {
      url += "&maxExperience=" + maxExp;
    }

    let response = await dispatch(candidateActions.getCandidates({ url }));
    setList(response.payload.data.candidateList);
    setTotalRecords(response.payload.data.totalRecords);
  };
  console.log("response", getCandidateList);
  const onchangePage = function(data) {
    setPageIndex(data.target.value);
    getCandidatesList();
  };

  const onHandleExpChange = function(check, event) {
    check == "min" ? (minExp = Number(event)) : (maxExp = Number(event));
    if (minExp && maxExp) {
      if (minExp > maxExp) {
        expError = true;
        return;
      }
    } else {
      expError = false;
    }
  };

  const applyMask = function(inputValue) {
    const numCharsToMask = inputValue.length - 3;
    const maskedValue =
      "*".repeat(inputValue.length - numCharsToMask) +
      inputValue.slice(-numCharsToMask);

    return maskedValue;
  };
  const formatPhoneNumber = function(inputValue) {
    // Apply the mask: (xxx) - xxx - 8684

    const maskedValue = "*".repeat(10 - 4) + inputValue.slice(-4);
    const formatedValue = maskedValue.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "($1) - $2 - $3"
    );

    return formatedValue;
  };

  const maskEmail = function(inputValue) {
    // Extract the part before the '@' symbol
    const username = inputValue.substring(0, inputValue.indexOf("@"));

    // Mask the username with 'x's
    const maskedUsername = "x".repeat(username.length);

    // Combine masked username with '@' symbol and domain
    const maskedValue =
      maskedUsername + inputValue.substring(inputValue.indexOf("@"));

    return maskedValue;
  };

  const onSelectCandidate = function(data) {
    setselectedCandidate(data);
    setshowCandidate(true);
  };

  const onSearch = function(data) {
    searchData = data;
    setSearchText(searchData);
    console.log(searchText);
  };
  const onClearSearch = function() {
    window.location.reload();
  };

  return (
    <div>
      {!showCandidate ? (
        <Card>
          <CardTitle
            className="mt-3 ml-3"
            style={{ fontSize: "21px", marginLeft: "20px" }}
          >
            Candidate List{isExpError}
          </CardTitle>
          <CardBody>
            <div>
              <Row>
                <Col className="col-md-5">
                  <Row>
                    <Col className="col-md-3 mb-3">
                      <Input
                        type="text"
                        id="minExperience"
                        name="minExperience"
                        placeholder="Min Exp"
                        onInput={(evt) =>
                          onHandleExpChange("min", evt.target.value)
                        }
                      ></Input>
                    </Col>
                    {isExpError ? (
                      <Label style={{ color: "warn" }}>
                        Minimum experience should be less than Max Experience
                      </Label>
                    ) : (
                      ""
                    )}

                    <Col className="col-md-3 mb-3">
                      <Input
                        type="text"
                        id="maxExperience"
                        name="maxExperience"
                        placeholder="Max Exp"
                        onInput={(evt) =>
                          onHandleExpChange("max", evt.target.value)
                        }
                      ></Input>
                    </Col>

                    <Col className="col-md-6">
                      <Button
                        style={{ backgroundColor: "rgb(33 91 153)" }}
                        className="col-md-4 me-2"
                        onClick={(evt) => getCandidatesList()}
                      >
                        submit
                      </Button>
                      <Button
                        style={{ backgroundColor: "rgb(33 91 153)" }}
                        className="col-md-3"
                        onClick={(evt) => onClearSearch()}
                      >
                        reset
                      </Button>
                    </Col>
                  </Row>
                </Col>

                <Col className="col-md-5">
                  <div
                    className={cx("search-wrapper", {
                      active: true,
                    })}
                    style={{ marginLeft: "75%" }}
                  >
                    <div className="input-holder">
                      <input
                        type="text"
                        className="search-input"
                        onInput={(evt) => onSearch(evt.target.value)}
                        placeholder="Search by name,skill,location"
                      />
                      <button
                        onClick={(evt) => getCandidatesList()}
                        className="search-icon"
                      >
                        <span />
                      </button>
                    </div>
                    <button
                      onClick={(evt) => onClearSearch()}
                      style={{ left: "220px" }}
                      className="btn-close"
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Table striped className="mb-0 mt-2">
                  <thead>
                    <tr>
                      <th>First Name</th>
                      <th>Last Name</th>
                      <th>Experience</th>
                      <th>Mobile Number</th>
                      <th>Email</th>
                    </tr>
                  </thead>

                  {candidatesList.length > 0 ? (
                    <tbody>
                      {candidatesList.map((col) => (
                        <tr>
                          <th
                            style={{ cursor: "pointer" }}
                            scope="row"
                            onClick={(evt) => onSelectCandidate(col)}
                          >
                            {applyMask(col.firstname)}
                          </th>
                          <td>{applyMask(col.lastname)}</td>
                          <td>{col.experienceyears + " years"}</td>
                          <td>{formatPhoneNumber(col.phonenumber)}</td>
                          <td>{maskEmail(col.email)}</td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <></>
                  )}
                </Table>
              </Row>
            </div>
          </CardBody>
        </Card>
      ) : (
        <div>
          <CandidateDetails
            selectedData={selectedCandidate}
            jobId={jobId}
          ></CandidateDetails>
        </div>
      )}
    </div>
  );
}
