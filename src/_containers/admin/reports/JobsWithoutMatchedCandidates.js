import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import moment from "moment";
import Loader from "react-loaders";

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

import {
  SkillsFilter,
  LocationFilter,
  CompanyFilter,
} from "../filterComponent";

import {
  getReportDataThunk,
  getAdminReportJobDetail,
} from "../_redux/report.slice";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faFileExcel } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { exportToExcel } from "react-json-to-excel";
import DataTable from "react-data-table-component";
import { NoDataFound } from "_components/common/nodatafound";
import { CustJobDetailModal } from "_components/modal/custjobdetailmodal";
import "./adminreports.scss";

const initFilter = {
  "@startdate": null,
  "@enddate": null,
  "@companyid": null,
  "@skillid": null,
  "@cityid": null,
};

export function JobsWithoutMatchedCandidates({ title }) {
  const dispatch = useDispatch();
  let { id: reportId } = useParams();

  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  let [company, setCompany] = useState([]);
  let [skill, setSkill] = useState([]);
  let [location, setLocation] = useState([]);
  let [filter, setFilter] = useState(initFilter);

  const [excelData, setExcelData] = useState([]);
  const [showJDModal, setShowJDModal] = useState(false);
  const {
    reportData: data = [],
    loading = false,
    jobDetail = [],
  } = useSelector((state) => state?.adminReportReducer ?? {});

  const getReportData = (isClearAll) => {
    let parameter = "";
    if (isClearAll) {
      filter = initFilter;
    }

    for (const key in filter) {
      if (Object.hasOwnProperty.call(filter, key)) {
        if (
          (key.indexOf("startdate") !== -1 || key.indexOf("enddate") !== -1) &&
          filter[key] !== null
        ) {
          parameter += key + "='" + filter[key] + "',";
        } else {
          parameter += key + "=" + filter[key] + ",";
        }
      }
    }
    parameter = parameter.replace(/,\s*$/, "");
    dispatch(getReportDataThunk({ reportId, parameter }));
  };

  useEffect(() => {
    getReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      let filteredData = data.map((rec) => {
        return {
          Company: rec?.companyname,

          "Job Title": rec?.jobtitle,
          Skills:
            typeof rec?.musthaveskills === "string" && rec?.musthaveskills,
          "Nice to have":
            typeof rec?.nicetohaveskills === "string" && rec?.nicetohaveskills,

          "Open position": rec.noofopenposition,
          Address: rec.address,
        };
      });
      setExcelData([
        {
          sheetName: "JobsWithoutMatchedCandidate",
          details: filteredData,
        },
      ]);
    }
  }, [data]);

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

  const applyFilter = () => {
    getReportData();
  };

  const clearFilter = () => {
    setFilter(initFilter);
    setStartDate(null);
    setEndDate(null);
    setCompany([]);
    setSkill([]);
    setLocation([]);
    getReportData(true);
  };

  const openJobDetails = async (jobId) => {
    let res = await dispatch(getAdminReportJobDetail(jobId));

    if (res?.payload?.statusCode === 200) {
      setShowJDModal(true);
    }
  };

  const columns = [
    {
      name: <span className="table-title">Company</span>,
      cell: (row) => (
        <span className="table-cell" title={row?.companyname}>
          {row?.companyname}
        </span>
      ),
      sortable: true,
      selector: (row) => row.companyname,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Job Title</span>,
      cell: (row) => (
        <span className="table-cell" title={row?.jobtitle}>
          <Button
            className="no-padding"
            color="link"
            onClick={() => openJobDetails(row.jobid)}
          >
            {row?.jobtitle}
          </Button>
        </span>
      ),
      sortable: true,
      selector: (row) => row.jobtitle,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Skills</span>,
      cell: (row) => (
        <span
          className="table-cell"
          title={typeof row?.musthaveskills === "string" && row?.musthaveskills}
        >
          {typeof row?.musthaveskills === "string" && row?.musthaveskills}
        </span>
      ),
      selector: (row) => row.musthaveskills,
      minWidth: "350px",
      sortable: true,
    },
    {
      name: <span className="table-title">Nice to have</span>,
      cell: (row) => (
        <span
          className="table-cell"
          title={
            typeof row?.nicetohaveskills === "string" && row?.nicetohaveskills
          }
        >
          {typeof row?.nicetohaveskills === "string" && row?.nicetohaveskills}
        </span>
      ),
      selector: (row) => row.nicetohaveskills,
      minWidth: "350px",
      sortable: true,
    },
    {
      name: <span className="table-title">Open position</span>,
      cell: (row) => (
        <span className="table-cell" title={row?.noofopenposition}>
          {row?.noofopenposition}
        </span>
      ),
      selector: (row) => row.noofopenposition,
      minWidth: "150px",
      sortable: true,
    },
    {
      name: <span className="table-title">Address</span>,
      cell: (row) => (
        <span className="table-cell" title={row?.address}>
          {row?.address}
        </span>
      ),
      sortable: true,
      selector: (row) => row.address,
      minWidth: "250px",
    },
  ];

  return (
    <>
      <PageTitle heading={title} icon={titlelogo} />
      <Row className="admin-report-calendar">
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
                          "adminJobsWithoutMatchedCandidateReport",
                          true
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
              <Row style={{ zIndex: 9, position: "relative" }}>
                <Col
                  xxl="2"
                  xl="3"
                  lg="3"
                  md="4"
                  sm="12"
                  xs="12"
                  className="pe-1"
                >
                  <CompanyFilter
                    name={"@companyid"}
                    placeholder={"Search Company"}
                    onChange={(name, value, e) => {
                      handleChange(name, value);
                      setCompany(e);
                    }}
                    value={company}
                  />
                </Col>
                <Col xxl="2" xl="3" lg="3" md="4" sm="12" xs="12">
                  <SkillsFilter
                    name={"@skillid"}
                    placeholder={"Search Skills"}
                    onChange={(name, value, e) => {
                      handleChange(name, value);
                      setSkill(e);
                    }}
                    value={skill}
                  />
                </Col>
                <Col xxl="2" xl="3" lg="3" md="4" sm="12" xs="12">
                  <LocationFilter
                    name={"@cityid"}
                    placeholder={"Search Location"}
                    onChange={(name, value, e) => {
                      handleChange(name, value);
                      setLocation(e);
                    }}
                    value={location}
                  />
                </Col>
                <Col xxl="2" xl="2" lg="3" md="4" sm="12" xs="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <DatePicker
                        dateFormat={"yyyy-MM-dd"}
                        name="@startdate"
                        placeholderText="From"
                        className="form-control"
                        selected={startDate}
                        maxDate={endDate}
                        showMonthDropdown
                        showYearDropdown
                        onChange={(date) => {
                          handleDateChange("@startdate", date);
                          setStartDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col xxl="2" xl="2" lg="3" md="4" sm="12" xs="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <DatePicker
                        dateFormat={"yyyy-MM-dd"}
                        name="@enddate"
                        placeholderText="To"
                        className="form-control"
                        selected={endDate}
                        minDate={startDate}
                        showMonthDropdown
                        showYearDropdown
                        onChange={(date) => {
                          handleDateChange("@enddate", date);
                          setEndDate(date);
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col xxl="1" xl="1" lg="1" md="2" sm="12" xs="12">
                  <Button
                    style={{ background: "rgb(47 71 155)" }}
                    color="primary"
                    type="button"
                    onClick={() => applyFilter()}
                  >
                    {" "}
                    Search
                  </Button>
                </Col>
                <Col xxl="1" xl="1" lg="1" md="2" sm="12" xs="12">
                  <Button
                    color="link"
                    type="button"
                    onClick={() => clearFilter()}
                  >
                    {" "}
                    Clear
                  </Button>
                </Col>
              </Row>

              {/* <Table
                progressPending={loading}
                progressComponent={
                  <Loader
                    type="line-scale-pulse-out-rapid"
                    className="d-flex justify-content-center"
                  />
                }
                columns={columns}
                data={data}
                // onRowClicked={handleRowClicked}
                fixedHeader
                fixedHeaderScrollHeight="400px"
              /> */}
              {loading ? (
                <Loader
                  type="line-scale-pulse-out-rapid"
                  className="d-flex justify-content-center"
                />
              ) : (
                <>
                  {data.length > 0 ? (
                    <DataTable
                      columns={columns}
                      data={data}
                      fixedHeader
                      pagination
                      className="admin-list-view"
                    />
                  ) : (
                    <Row className="center-align ">
                      <NoDataFound></NoDataFound>
                    </Row>
                  )}
                </>
              )}
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
