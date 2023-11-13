import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Col,
  Row,
  FormGroup,
  Button,
  Card,
  CardBody,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import {
  getCustReportMatchedCandList,
  getJobDropdown,
  getRecommendedJobStatus,
} from "./customerreport.slice";
import { useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import Loader from "react-loaders";
import { updateMonthstoYears, USPhoneNumber } from "_helpers/helper";
import { exportToExcel } from "react-json-to-excel";
import { NoDataFound } from "_components/common/nodatafound";
import "./customerreport.scss";

const columns = [
  // {
  //   name: "Candidate Id",
  //   selector: (row) => row?.candidateid,
  //   sortable: true,
  // },
  {
    name: <span className="table-title">Name</span>,
    selector: (row) => (
      <span className="table-cell" title={row?.candidatename}>
        {row?.candidatename}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Email</span>,
    selector: (row) => (
      <span className="table-cell" title={row.email}>
        {row.email}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Phone</span>,
    selector: (row) => (
      <span
        className="table-cell"
        title={row.phone ? USPhoneNumber(row.phone) : ""}
      >
        {row.phone ? USPhoneNumber(row.phone) : ""}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Skills</span>,
    selector: (row) => (
      <span className="table-cell" title={row?.skill}>
        {row?.skill}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Education</span>,
    selector: (row) => (
      <span className="table-cell" title={row?.education ? row?.education : ""}>
        {row?.education ? row?.education : ""}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Experience</span>,
    selector: (row) => (
      <span
        className="table-cell"
        title={row.experience > 0 ? updateMonthstoYears(row.experience) : ""}
      >
        {row.experience > 0 ? updateMonthstoYears(row.experience) : ""}
      </span>
    ),
    sortable: true,
  },
  // {
  //   name: "Location",
  //   selector: (row) =>
  //     Object.keys(row?.location).length > 0 ? row?.location : "",
  //   sortable: true,
  // },
  {
    name: <span className="table-title">Certifications</span>,
    selector: (row) => (
      <span
        className="table-cell"
        title={row?.certification ? row?.certification : ""}
      >
        {row?.certification ? row?.certification : ""}
      </span>
    ),
    sortable: true,
  },
];

export function CustomerReportMatchedCandidate() {
  const dispatch = useDispatch();

  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [jobId, setJobId] = useState();
  let [recommStatusId, setRecommStatusId] = useState();
  const [excelData, setExcelData] = useState([]);
  const matchedCandidateList = useSelector(
    (state) => state?.customerReportReducer?.matchedCandidateList
  );
  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  const jobDropDownList = useSelector(
    (state) => state?.customerReportReducer?.jobDropDownList
  );
  const recommendedJobStatusList = useSelector(
    (state) => state?.customerReportReducer?.recommendedJobStatusList
  );

  useEffect(() => {
    onGetCustReportMatchedCandList({});
    dispatch(getJobDropdown());
    dispatch(getRecommendedJobStatus());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (matchedCandidateList?.length > 0) {
      let filteredData = matchedCandidateList.map((data) => {
        return {
          Name: data.candidatename,
          Email: data.email,
          Phone: data.phone ? USPhoneNumber(data.phone) : "",
          Skills: data?.skill,
          Education: data?.education ? data?.education : "",
          Experience: data.experience,
          Certifications: data.certification,
        };
      });
      setExcelData(filteredData);
    }
  }, [matchedCandidateList]);

  const onGetCustReportMatchedCandList = (filter) => {
    let data = {
      ...filter,
      reportId: id,
    };

    dispatch(getCustReportMatchedCandList(data));
  };

  const onSubmitHandler = () => {
    onGetCustReportMatchedCandList(filter);
  };

  const handleChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const onSubmitClear = () => {
    setFilter({});
    setJobId("");
    setRecommStatusId("");
    onGetCustReportMatchedCandList({});
  };

  return (
    <>
      <PageTitle
        heading={"Customer Matched Candidate List by Job Report"}
        icon={titlelogo}
      />
      <Row>
        <Col md="12" lg="12" xl="12">
          <Card className="mb-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                Filter by
              </div>
              <div className="btn-actions-pane-right actions-icon-btn">
                <UncontrolledButtonDropdown>
                  <DropdownToggle
                    className="btn-icon btn-icon-only"
                    color="link"
                  >
                    <i className="pe-7s-menu btn-icon-wrapper" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
                    <DropdownItem header>Download Report</DropdownItem>
                    <DropdownItem
                      onClick={() =>
                        exportToExcel(excelData, "customerMatchedJobListReport")
                      }
                    >
                      <i className="dropdown-icon lnr-arrow-down-circle"> </i>
                      <span>Excel</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <Input
                      type="select"
                      value={jobId}
                      name="jobid"
                      id="jobid"
                      placeholder="Job Id"
                      onChange={(e) => {
                        handleChange("jobid", e.target.value);
                        setJobId(e.target.value);
                      }}
                    >
                      <option value={""}>Select a Job</option>
                      {jobDropDownList?.length > 0 ? (
                        jobDropDownList.map((data) => (
                          <option value={data.jobid} key={data.jobid}>
                            {data.jobtitle}
                          </option>
                        ))
                      ) : (
                        <></>
                      )}
                    </Input>
                  </FormGroup>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <Input
                      type="select"
                      value={recommStatusId}
                      name="customerrecommendedjobstatusid"
                      id="customerrecommendedjobstatusid"
                      placeholder="Recommended Status Id"
                      onChange={(e) => {
                        handleChange(
                          "customerrecommendedjobstatusid",
                          e.target.value
                        );
                        setRecommStatusId(e.target.value);
                      }}
                    >
                      <option value={""}>Matched</option>
                      {recommendedJobStatusList?.length > 0 ? (
                        recommendedJobStatusList.map((data) => (
                          <option value={data.id} key={data.id}>
                            {data.name}
                          </option>
                        ))
                      ) : (
                        <></>
                      )}
                    </Input>
                  </FormGroup>
                </Col>

                <Col lg="3" md="3" sm="12" sx="12">
                  <Button
                    style={{ background: "rgb(47 71 155)" }}
                    className="me-4"
                    color="primary"
                    type="button"
                    onClick={() => onSubmitHandler()}
                  >
                    <FontAwesomeIcon icon={faSearch} /> Search
                  </Button>
                  <Button
                    // style={{ background: "rgb(47 71 155)" }}
                    color="link"
                    type="button"
                    onClick={() => onSubmitClear()}
                  >
                    Clear
                  </Button>
                  {/* </ButtonGroup>
                    </InputGroup>
                  </FormGroup> */}
                </Col>
              </Row>
              <Row className="mt-1">
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {matchedCandidateList.length > 0 ? (
                      <DataTable
                        columns={columns}
                        data={matchedCandidateList}
                        fixedHeader
                        pagination
                        className="cust-rep-list-view"
                      />
                    ) : (
                      <Row className="center-align ">
                        <NoDataFound></NoDataFound>
                      </Row>
                    )}
                  </>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
