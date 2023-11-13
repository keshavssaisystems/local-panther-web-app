import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
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
import { faCalendarAlt, faSearch } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import { getCustReportJobList } from "./customerreport.slice";
import { useParams } from "react-router-dom";
import moment from "moment";
import DataTable from "react-data-table-component";
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
    name: <span className="table-title">No. of Positions</span>,
    selector: (row) => (
      <span className="table-cell" title={row.noofopenposition}>
        {row.noofopenposition}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">Posted date</span>,
    selector: (row) => (
      <span
        className="table-cell"
        title={
          row.createddate ? moment(row.createddate).format("MM/DD/YYYY") : ""
        }
      >
        {row.createddate ? moment(row.createddate).format("MM/DD/YYYY") : ""}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">No. of Matched</span>,
    selector: (row) => (
      <span className="table-cell" title={row.matchedcandidates}>
        {row.matchedcandidates}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">No. of Liked</span>,
    selector: (row) => (
      <span className="table-cell" title={row.likedcandidates}>
        {row.likedcandidates}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">No. of Maybe</span>,
    selector: (row) => (
      <span className="table-cell" title={row.maybecandidates}>
        {row.maybecandidates}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">No. of Accepted</span>,
    selector: (row) => (
      <span className="table-cell" title={row.acceptedcandidates}>
        {row.acceptedcandidates}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">No. of Rejected</span>,
    selector: (row) => (
      <span className="table-cell" title={row.rejectedcandidates}>
        {row.rejectedcandidates}
      </span>
    ),
    sortable: true,
  },
  {
    name: <span className="table-title">No. of Interviews Scheduled</span>,
    selector: (row) => (
      <span className="table-cell" title={row.scheduledinterviews}>
        {row.scheduledinterviews}
      </span>
    ),
    sortable: true,
  },
];

export function CustomerReportJobList() {
  const dispatch = useDispatch();
  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  const [excelData, setExcelData] = useState([]);

  const jobList = useSelector((state) => state?.customerReportReducer?.jobList);
  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  useEffect(() => {
    onGetCustReportJobList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (jobList?.length > 0) {
      let filteredData = jobList.map((data) => {
        return {
          "Job Code": data.jobid,
          Title: data.jobtitle,
          Status: data.jobstatus,
          "No. of Positions": data.noofopenposition,
          "Posted date": data.createddate
            ? moment(data.createddate).format("MM/DD/YYYY")
            : "",
          "No. of Matched": data.matchedcandidates,
          "No. of Liked": data.likedcandidates,
          "No. of Maybe": data.maybecandidates,
          "No. of Accepted": data.acceptedcandidates,
          "No. of Rejected": data.rejectedcandidates,
          "No. of Interviews Scheduled": data.scheduledinterviews,
        };
      });
      setExcelData(filteredData);
    }
  }, [jobList]);

  const onGetCustReportJobList = (filter) => {
    let data = {
      ...filter,
      reportId: id,
    };
    dispatch(getCustReportJobList(data));
  };

  const onSubmitHandler = () => {
    onGetCustReportJobList(filter);
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
    onGetCustReportJobList({});
  };

  return (
    <>
      <PageTitle heading={"Customer Job List Report"} icon={titlelogo} />
      <Row className="cust-report-job-cont">
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
                        exportToExcel(excelData, "customerJobsReport")
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
                  {/* <ButtonGroup> */}
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
                  {/* </ButtonGroup> */}
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
                    {jobList.length > 0 ? (
                      <DataTable
                        columns={columns}
                        data={jobList}
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
