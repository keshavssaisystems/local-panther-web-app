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
  ButtonGroup,
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
    name: "No. of Positions",
    selector: (row) => row.noofopenposition,
    sortable: true,
  },
  {
    name: "Posted date",
    selector: (row) =>
      row.createddate ? moment(row.createddate).format("MM/DD/YYYY") : "",
    sortable: true,
  },
  {
    name: "No. of Matched",
    selector: (row) => row.matchedcandidates,
    sortable: true,
  },
  {
    name: "No. of Liked",
    selector: (row) => row.likedcandidates,
    sortable: true,
  },
  {
    name: "No. of Maybe",
    selector: (row) => row.maybecandidates,
    sortable: true,
  },
  {
    name: "No. of Accepted",
    selector: (row) => row.acceptedcandidates,
    sortable: true,
  },
  {
    name: "No. of Rejected",
    selector: (row) => row.rejectedcandidates,
    sortable: true,
  },
  {
    name: "No. of Interviews Scheduled",
    selector: (row) => row.scheduledinterviews,
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
                        exportToExcel(excelData, "customerJobsReport")
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
                  <DataTable
                    columns={columns}
                    data={jobList}
                    fixedHeader
                    pagination
                  />
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
