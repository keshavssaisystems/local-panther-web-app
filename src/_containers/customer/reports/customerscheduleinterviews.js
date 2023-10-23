import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Input,
  Col,
  Row,
  FormGroup,
  InputGroup,
  Button,
  Card,
  CardBody,
  CardHeader,
  UncontrolledButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
} from "reactstrap";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faSearch } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import {
  getCustReportScheduleIVList,
  getCandidateDropdown,
  getJobDropdown,
} from "./customerreport.slice";
import { useParams } from "react-router-dom";

import DataTable from "react-data-table-component";
import moment from "moment";
import Loader from "react-loaders";
import { exportToExcel } from "react-json-to-excel";
import { NoDataFound } from "_components/common/nodatafound";
import "./customerreport.scss";
const columns = [
  {
    name: "Job Code",
    selector: (row) => row.jobid,
    sortable: true,
  },
  {
    name: "Title",
    selector: (row) => row.jobtitle,
    sortable: true,
  },
  {
    name: "Status",
    selector: (row) => row.jobstatus,
    sortable: true,
  },
  {
    name: "Candidate Name",
    selector: (row) => row.candidatename,
    sortable: true,
  },
  {
    name: "Scheduled date",
    selector: (row) =>
      row.scheduledate ? moment(row.scheduledate).format("MM/DD/YYYY") : "",
    sortable: true,
  },
  {
    name: "Interviewers",
    selector: (row) => row.intervieweremailids,
    sortable: true,
  },
  {
    name: "Meeting Status",
    selector: (row) => row.meetingstatus,
    sortable: true,
  },
];

export function CustomerReportScheduledInterviews() {
  const dispatch = useDispatch();
  const { id } = useParams();
  let [filter, setFilter] = useState({});
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  let [jobId, setJobId] = useState();
  let [candidateId, setCandidateId] = useState();
  const [excelData, setExcelData] = useState([]);

  const schdInterviewList = useSelector(
    (state) => state?.customerReportReducer?.schdInterviewList
  );
  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  const jobDropDownList = useSelector(
    (state) => state?.customerReportReducer?.jobDropDownList
  );
  const candidateDropDownList = useSelector(
    (state) => state?.customerReportReducer?.candidateDropDownList
  );
  useEffect(() => {
    onGetCustReportScheduleIVList({});
    dispatch(getCandidateDropdown());
    dispatch(getJobDropdown());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (schdInterviewList?.length > 0) {
      let filteredData = schdInterviewList.map((data) => {
        return {
          "Job Code": data.jobid,
          Title: data.jobtitle,
          Status: data.jobstatus,
          "Candidate Name": data.candidatename,
          "Scheduled date": data.scheduledate
            ? moment(data.scheduledate).format("MM/DD/YYYY")
            : "",
          Interviewers: data.intervieweremailids,
          "Meeting Status": data.meetingstatus,
        };
      });
      setExcelData(filteredData);
    }
  }, [schdInterviewList]);

  const onGetCustReportScheduleIVList = (filter) => {
    let data = {
      ...filter,
      reportId: id,
    };
    dispatch(getCustReportScheduleIVList(data));
  };

  const handleChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  const handleDateChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: moment(value).format("YYYY-MM-DD"),
    });
  };

  const onSubmitClear = () => {
    setFilter({});
    setStartDate(null);
    setEndDate(null);
    setCandidateId("");
    setJobId("");
    onGetCustReportScheduleIVList({});
  };

  const onSubmitHandler = () => {
    onGetCustReportScheduleIVList(filter);
  };

  return (
    <>
      <PageTitle
        heading={"Customer Scheduled Interview Report"}
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
                        exportToExcel(
                          excelData,
                          "customerScheduledInterviewReport"
                        )
                      }
                    >
                      <i className="dropdown-icon lnr-arrow-down-circle"> </i>
                      <span>Excel</span>
                    </DropdownItem>
                    <DropdownItem>
                      <i className="dropdown-icon lnr-arrow-down-circle"> </i>
                      <span>pdf</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    {/* <Label for="candidateid">Candidate Id</Label> */}
                    {/* <Input
                      name="candidateid"
                      id="candidateid"
                      placeholder="Candidate Id"
                      value={candidateId}
                      onChange={(e) => {
                        handleChange("candidateid", e.target.value);
                        setCandidateId(e.target.value);
                      }}
                    /> */}
                    <Input
                      type="select"
                      value={candidateId}
                      name="candidateid"
                      id="candidateid"
                      placeholder="Candidate Id"
                      onChange={(e) => {
                        handleChange("candidateid", e.target.value);
                        setCandidateId(e.target.value);
                      }}
                    >
                      <option value={""}>Select a Candidate</option>
                      {candidateDropDownList?.length > 0 ? (
                        candidateDropDownList.map((data) => (
                          <option
                            value={data.candidateid}
                            key={data.candidateid}
                          >
                            {data.firstname + " " + data.lastname}
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
                    {/* <Label for="jobid">Job Id</Label> */}
                    {/* <Input
                      name="jobid"
                      id="jobid"
                      placeholder="Job Id"
                      value={jobId}
                      onChange={(e) => {
                        handleChange("jobid", e.target.value);
                        setJobId(e.target.value);
                      }}
                    /> */}
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
                    <InputGroup>
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <DatePicker
                        name="startDate"
                        id="startDate"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        selected={startDate}
                        onChange={(date) => {
                          handleDateChange("startDate", date);
                          setStartDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <DatePicker
                        name="endDate"
                        id="endDate"
                        placeholderText="MM/DD/YYYY"
                        className="form-control"
                        selected={endDate}
                        onChange={(date) => {
                          handleDateChange("endDate", date);
                          setEndDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <ButtonGroup>
                        <Button
                          style={{ background: "rgb(47 71 155)" }}
                          className="btn-square btn btn-primary me-4"
                          type="button"
                          onClick={() => onSubmitHandler()}
                        >
                          <FontAwesomeIcon icon={faSearch} /> Search
                        </Button>
                        <Button
                          style={{ background: "rgb(47 71 155)" }}
                          className="btn-square btn btn-primary"
                          type="button"
                          onClick={() => onSubmitClear()}
                        >
                          Clear
                        </Button>
                      </ButtonGroup>
                    </InputGroup>
                  </FormGroup>
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
                    {schdInterviewList.length > 0 ? (
                      <DataTable
                        columns={columns}
                        data={schdInterviewList}
                        fixedHeader
                        pagination
                      />
                    ) : (
                      <Row className="center-align">
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
