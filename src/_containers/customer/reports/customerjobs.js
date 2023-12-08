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
import {
  faCalendarAlt,
  faSearch,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import {
  getCustReportJobList,
  getCustReportJobDetail,
} from "./customerreport.slice";
import { useParams } from "react-router-dom";
import moment from "moment";
import DataTable from "react-data-table-component";
import Loader from "react-loaders";
import { exportToExcel } from "react-json-to-excel";
import { NoDataFound } from "_components/common/nodatafound";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import "./customerreport.scss";

export function CustomerReportJobList() {
  const dispatch = useDispatch();
  const { id } = useParams();

  let [filter, setFilter] = useState({});
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  const [excelData, setExcelData] = useState([]);
  const [showJDModal, setShowJDModal] = useState(false);

  const jobList = useSelector((state) => state?.customerReportReducer?.jobList);
  const loading = useSelector((state) => state?.customerReportReducer?.loading);
  const jobDetail = useSelector(
    (state) => state?.customerReportReducer?.jobDetail
  );
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
      setExcelData([
        {
          sheetName: "CustoemerJobList",
          details: filteredData,
        },
      ]);
    }
  }, [jobList]);

  const onGetCustReportJobList = (filter) => {
    let data = {
      ...filter,
      reportId: id ? id : 10,
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

  const openJobDetails = async (jobId) => {
    let res = await dispatch(getCustReportJobDetail(jobId));

    if (res?.payload?.statusCode === 200) {
      setShowJDModal(true);
    }
  };

  const columns = [
    {
      name: <span className="table-title">Job Code</span>,
      cell: (row) => (
        <span className="table-cell" title={row.jobid}>
          {row.jobid}
        </span>
      ),
      sortable: true,
      selector: (row) => row.jobid,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">Title</span>,
      cell: (row) => (
        <span className="table-cell" title={row.jobtitle}>
          <Button
            className="no-padding"
            color="link"
            onClick={() => openJobDetails(row.jobid)}
          >
            {row.jobtitle}
          </Button>
        </span>
      ),
      sortable: true,
      selector: (row) => row.jobtitle,
      minWidth: "400px",
    },
    {
      name: <span className="table-title">Status</span>,
      cell: (row) => (
        <span className="table-cell" title={row.jobstatus}>
          {row.jobstatus}
        </span>
      ),
      sortable: true,
      selector: (row) => row.jobstatus,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">No. of Positions</span>,
      cell: (row) => (
        <span className="table-cell" title={row.noofopenposition}>
          {row.noofopenposition}
        </span>
      ),
      sortable: true,
      selector: (row) => row.noofopenposition,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">Posted date</span>,
      cell: (row) => (
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
      selector: (row) => row.createddate,
      minWidth: "180px",
    },
    {
      name: <span className="table-title">No. of Matched</span>,
      cell: (row) => (
        <span className="table-cell" title={row.matchedcandidates}>
          {row.matchedcandidates}
        </span>
      ),
      sortable: true,
      selector: (row) => row.matchedcandidates,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">No. of Liked</span>,
      cell: (row) => (
        <span className="table-cell" title={row.likedcandidates}>
          {row.likedcandidates}
        </span>
      ),
      sortable: true,
      selector: (row) => row.likedcandidates,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">No. of Maybe</span>,
      cell: (row) => (
        <span className="table-cell" title={row.maybecandidates}>
          {row.maybecandidates}
        </span>
      ),
      sortable: true,
      selector: (row) => row.maybecandidates,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">No. of Accepted</span>,
      cell: (row) => (
        <span className="table-cell" title={row.acceptedcandidates}>
          {row.acceptedcandidates}
        </span>
      ),
      sortable: true,
      selector: (row) => row.acceptedcandidates,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">No. of Rejected</span>,
      cell: (row) => (
        <span className="table-cell" title={row.rejectedcandidates}>
          {row.rejectedcandidates}
        </span>
      ),
      sortable: true,
      selector: (row) => row.rejectedcandidates,
      minWidth: "150px",
    },
    {
      name: <span className="table-title">No. of Interviews Scheduled</span>,
      cell: (row) => (
        <span className="table-cell" title={row.scheduledinterviews}>
          {row.scheduledinterviews}
        </span>
      ),
      sortable: true,
      selector: (row) => row.scheduledinterviews,
      minWidth: "150px",
    },
  ];

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
                        exportToExcel(excelData, "customerJobsReport", true)
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
                <Col lg="2" md="4" sm="12" sx="12">
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
                        showMonthDropdown
                        showYearDropdown
                        onChange={(date) => {
                          handleDateChange("startDate", date);
                          setStartDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="2" md="4" sm="12" sx="12">
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
                        showMonthDropdown
                        showYearDropdown
                        onChange={(date) => {
                          handleDateChange("endDate", date);
                          setEndDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="3" md="4" sm="12" sx="12">
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
      <>
        {" "}
        {showJDModal && jobDetail?.length > 0 ? (
          <CustJobDetailModal
            isOpen={showJDModal}
            data={jobDetail}
            onClose={() => setShowJDModal(false)}
            isAdmin={true}
          />
        ) : (
          <></>
        )}
      </>
    </>
  );
}
