import { useEffect, useState } from "react";
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
} from "reactstrap";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faSearch,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import {
  getCustReportIVDCandList,
  getCandidateDropdown,
  getJobDropdown,
} from "./customerreport.slice";

import DataTable from "react-data-table-component";
import { useParams } from "react-router";
import moment from "moment";
import Loader from "react-loaders";
import { exportToExcel } from "react-json-to-excel";
import { NoDataFound } from "_components/common/nodatafound";
import "./customerreport.scss";

const columns = [
  {
    name: <span className="table-title">Job Code</span>,
    selector: (row) => (
      <span className="table-cell" title={row.jobid}>
        {row.jobid}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Title</span>,
    selector: (row) => (
      <span className="table-cell" title={row.jobtitle}>
        {row.jobtitle}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Status</span>,
    selector: (row) => (
      <span className="table-cell" title={row.jobstatus}>
        {row.jobstatus}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Candidate Name</span>,
    selector: (row) => (
      <span className="table-cell" title={row.candidatename}>
        {row.candidatename}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Interviewed date</span>,
    selector: (row) => (
      <span
        className="table-cell"
        title={
          row.scheduledate ? moment(row.scheduledate).format("MM/DD/YYYY") : ""
        }
      >
        {row.scheduledate ? moment(row.scheduledate).format("MM/DD/YYYY") : ""}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Interviewers</span>,
    selector: (row) => (
      <span className="table-cell" title={row.intervieweremailids}>
        {row.intervieweremailids}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Comments/Notes</span>,
    selector: (row) => (
      <span className="table-cell" title={row.interviewnotes}>
        {row.interviewnotes}
      </span>
    ),
    sortable: true,
  },
];

export function CustomerReportInterviewedCandidates() {
  const dispatch = useDispatch();

  const { id } = useParams();
  let [filter, setFilter] = useState({});
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  let [jobId, setJobId] = useState();
  let [candidateId, setCandidateId] = useState();
  const [excelData, setExcelData] = useState([]);

  const interviewedCandidateList = useSelector(
    (state) => state?.customerReportReducer?.interviewedCandidateList
  );
  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  const jobDropDownList = useSelector(
    (state) => state?.customerReportReducer?.jobDropDownList
  );
  const candidateDropDownList = useSelector(
    (state) => state?.customerReportReducer?.candidateDropDownList
  );
  useEffect(() => {
    if (interviewedCandidateList?.length > 0) {
      let filteredData = interviewedCandidateList.map((data) => {
        return {
          "Job Code": data.jobid,
          Title: data.jobtitle,
          Status: data.jobstatus,
          "Candidate Name": data.candidatename,
          "Interviewed date": data.scheduledate
            ? moment(data.scheduledate).format("MM/DD/YYYY")
            : "",
          Interviewers: data.intervieweremailids,
          "Comments/Notes": data.interviewnotes,
        };
      });
      setExcelData(filteredData);
    }
  }, [interviewedCandidateList]);
  useEffect(() => {
    onGetCustReportIVDCandList({});
    dispatch(getCandidateDropdown());
    dispatch(getJobDropdown());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onGetCustReportIVDCandList = (filter) => {
    let data = {
      ...filter,
      reportId: id,
    };
    dispatch(getCustReportIVDCandList(data));
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
    onGetCustReportIVDCandList({});
  };

  const onSubmitHandler = () => {
    onGetCustReportIVDCandList(filter);
  };

  return (
    <>
      <PageTitle
        heading={"Customer Interviewed Candidates Report"}
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
                          "customerInterviewedCandidatesReport"
                        )
                      }
                    >
                      <FontAwesomeIcon className="pe-2" icon={faFileExcel} />
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
                        maxDate={endDate}
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
                        minDate={startDate}
                        onChange={(date) => {
                          handleDateChange("endDate", date);
                          setEndDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="3" md="3" sm="12" sx="12">
                  <Button
                    style={{ background: "rgb(47 71 155)" }}
                    className=" me-4"
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
                    {interviewedCandidateList.length > 0 ? (
                      <DataTable
                        columns={columns}
                        data={interviewedCandidateList}
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
