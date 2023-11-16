import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  CompanyFilter,
  SkillsFilter,
  LocationFilter,
} from "../filterComponent";
import { Popup } from "_widgets";
import {
  openJobsThunk,
  scheduledInterviewListThunk,
} from "../_redux/report.slice";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { exportToExcel } from "react-json-to-excel";
import DataTable from "react-data-table-component";
import { NoDataFound } from "_components/common/nodatafound";
import "./adminreports.scss";

export function OpenJobs({ title }) {
  const dispatch = useDispatch();
  const {
    openJobsList: data = [],
    scheduledInterviewList = [],
    scheduledLoading = false,
    loading = false,
  } = useSelector((state) => state?.adminReportReducer ?? {});

  let [isOpen, setIsOpen] = useState(false);
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  let [company, setCompany] = useState([]);
  let [skill, setSkill] = useState([]);
  let [location, setLocation] = useState([]);
  let [filter, setFilter] = useState({});

  const [excelData, setExcelData] = useState([]);
  useEffect(() => {
    dispatch(openJobsThunk());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      let filteredData = data.map((rec) => {
        return {
          Company: rec?.companyname,
          Title: rec?.jobtitle,
          Location: rec?.address,
          Experience: rec?.experiencelevel,
          Skills: rec?.musthaveskills,
          Posted: rec.jobposteddate
            ? moment(data.jobposteddate).format("MM/DD/YYYY")
            : "",
          Position: rec.noofopenposition,
          Hired: rec.hired,
          Matched: rec.matched,
          Liked: rec.like,
          Applied: rec.applied,
          Scheduled: rec.scheduled,
          Accepted: rec.accept,
          Rejected: rec.reject,
        };
      });
      setExcelData(filteredData);
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
    dispatch(openJobsThunk(filter));
  };

  const clearFilter = () => {
    setFilter({});
    setStartDate(null);
    setEndDate(null);
    setCompany([]);
    setSkill([]);
    setLocation([]);
    dispatch(openJobsThunk());
  };

  const handleSheduleClick = (jobId) => {
    dispatch(scheduledInterviewListThunk({ jobId }));
    setIsOpen(true);
  };

  /* const handleRowClicked = (e) => {
    dispatch()
    setIsOpen(true)
  } */

  const columns = [
    {
      name: <span className="table-title">Company</span>,
      selector: (row) => (
        <span className="table-cell" title={row.companyname}>
          {row.companyname}
        </span>
      ),
      sortable: true,
      // width: "150px",
    },
    {
      name: <span className="table-title">Title</span>,
      selector: (row) => (
        <span className="table-cell" title={row.jobtitle}>
          {row.jobtitle}
        </span>
      ),
      sortable: true,
      // width: "150px",
    },
    {
      name: <span className="table-title">Location</span>,
      selector: (row) => (
        <span className="table-cell" title={row.address}>
          {row.address}
        </span>
      ),
      sortable: true,
      // width: "150px",
    },
    {
      name: <span className="table-title">Experience</span>,
      selector: (row) => (
        <span className="table-cell" title={row.experiencelevel}>
          {row.experiencelevel}
        </span>
      ),
      sortable: true,
      // width: "120px",
    },
    {
      name: <span className="table-title">Skills</span>,
      selector: (row) => (
        <span className="table-cell" title={row.musthaveskills}>
          {row.musthaveskills}
        </span>
      ),

      sortable: true,
      width: "15%",
    },
    {
      name: <span className="table-title">Posted</span>,
      selector: (row) => (
        <span
          className="table-cell"
          title={
            row.jobposteddate
              ? moment(row.jobposteddate).format("MM/DD/YYYY")
              : ""
          }
        >
          {row.jobposteddate
            ? moment(row.jobposteddate).format("MM/DD/YYYY")
            : ""}
        </span>
      ),
      // format: (row) => moment(row.jobposteddate).format("MM/DD/YYYY"),
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="table-title">Position</span>,
      selector: (row) => (
        <span className="table-cell" title={row.noofopenposition}>
          {row.noofopenposition}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="table-title">Hired</span>,
      selector: (row) => (
        <span className="table-cell" title={row.hired}>
          {row.hired}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="table-title">Matched</span>,
      selector: (row) => (
        <span className="table-cell" title={row.matched}>
          {row.matched}
        </span>
      ),
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="table-title">Liked</span>,
      selector: (row) => (
        <span className="table-cell" title={row.like}>
          {row.like}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="table-title">Applied</span>,
      selector: (row) => (
        <span className="table-cell" title={row.applied}>
          {" "}
          {row.applied}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="table-title">Scheduled</span>,
      selector: (row) => (
        <span className="table-cell" title={row.scheduled}>
          {row.scheduled}
        </span>
      ),
      cell: (row) =>
        // <Button
        //   color="primary"
        //   onClick={() => handleSheduleClick(row.jobid)}
        //   id={row.jobid}
        // >
        //   {row.scheduled}
        // </Button>
        row.scheduled,

      sortable: true,
      width: "120px",
    },
    {
      name: <span className="table-title">Accepted</span>,
      selector: (row) => (
        <span className="table-cell" title={row.accept}>
          {row.accept}
        </span>
      ),

      sortable: true,
      width: "120px",
    },
    {
      name: <span className="table-title">Rejected</span>,
      selector: (row) => (
        <span className="table-cell" title={row.reject}>
          {row.reject}
        </span>
      ),

      sortable: true,
      width: "120px",
    },
  ];
  const scheduledListColumns = [
    {
      name: <span className="table-title">Candidate</span>,
      selector: (row) => (
        <span className="table-cell" title={row.candidatename}>
          {" "}
          {row.candidatename}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "150px",
    },
    {
      name: <span className="table-title">Skills</span>,
      selector: (row) => (
        <span className="table-cell" title={row.candidateskills}>
          {row.candidateskills}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "400px",
    },
    {
      name: <span className="table-title">Duration</span>,
      selector: (row) => (
        <span className="table-cell" title={row.duration}>
          {row.duration}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "100px",
    },
    {
      name: <span className="table-title">Format</span>,
      selector: (row) => (
        <span className="table-cell" title={row.format}>
          {row.format}
        </span>
      ),
      sortable: true,
      wrap: true,
      width: "100px",
    },
    {
      name: <span className="table-title">Title</span>,
      selector: (row) => (
        <span className="table-cell" title={row.jobtitle}>
          {row.jobtitle}
        </span>
      ),
      wrap: true,
    },
    {
      name: <span className="table-title">Note</span>,
      selector: (row) => (
        <span className="table-cell" title={row.interviewnotes}>
          {row.interviewnotes}
        </span>
      ),
      wrap: true,
      width: "300px",
    },
    {
      name: <span className="table-title">Scheduled Date</span>,
      selector: (row) => (
        <span
          className="table-cell"
          title={
            row.scheduledate
              ? moment(row.scheduledate).format("MM/DD/YYYY")
              : ""
          }
        >
          {row.scheduledate
            ? moment(row.scheduledate).format("MM/DD/YYYY")
            : ""}
        </span>
      ),
      // format: (row) => ,
      wrap: true,
    },
    {
      name: <span className="table-title">Interviewer Email</span>,
      selector: (row) => (
        <span className="table-cell" title={row.intervieweremailids}>
          {row.intervieweremailids}
        </span>
      ),
      sortable: true,
      wrap: true,
    },
  ];

  return (
    <>
      <PageTitle heading={title} icon={titlelogo} />
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
                        exportToExcel(excelData, "adminOpenJobsReport")
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
              <Row style={{ zIndex: 9, position: "relative" }}>
                <Col lg="2" md="2" sm="12" sx="12">
                  <CompanyFilter
                    name={"companyId"}
                    placeholder={"Select Company"}
                    onChange={(name, value, e) => {
                      handleChange(name, value);
                      setCompany(e);
                    }}
                    value={company}
                  />
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <SkillsFilter
                    name={"skillId"}
                    placeholder={"Select Skills"}
                    onChange={(name, value, e) => {
                      handleChange(name, value);
                      setSkill(e);
                    }}
                    value={skill}
                  />
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <LocationFilter
                    name={"cityId"}
                    placeholder={"Select Location"}
                    onChange={(name, value, e) => {
                      handleChange(name, value);
                      setLocation(e);
                    }}
                    value={location}
                  />
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <DatePicker
                        dateFormat={"yyyy-MM-dd"}
                        name="startDate"
                        placeholderText="From"
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
                        dateFormat={"yyyy-MM-dd"}
                        name="endDate"
                        placeholderText="To"
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
                <Col lg="1" md="2" sm="12" sx="12">
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
                <Col lg="1" md="2" sm="12" sx="12">
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

      <Popup
        isOpen={isOpen}
        size={"lg"}
        title={"Scheduled List"}
        setIsOpen={setIsOpen}
        data={scheduledInterviewList}
        columns={scheduledListColumns}
        scheduledLoading={scheduledLoading}
      />
    </>
  );
}
