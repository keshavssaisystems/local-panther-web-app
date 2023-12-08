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

import { SkillsFilter, LocationFilter } from "../filterComponent";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faFileExcel } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import { newCandidateThunk } from "../_redux/report.slice";
import { exportToExcel } from "react-json-to-excel";
import DataTable from "react-data-table-component";
import { NoDataFound } from "_components/common/nodatafound";
import { getProfileActions } from "_store";
import { BuildCVModal } from "_components/modal/buildcvmodal";
import "./adminreports.scss";

export function NewCandidate({ title }) {
  const dispatch = useDispatch();
  const columns = [
    {
      name: <span className="table-title">Name</span>,
      cell: (row) => (
        <span className="table-cell" title={row.candidatename}>
          <Button
            color="link"
            onClick={() => onCandidateClick(row.candidateid)}
          >
            {row.candidatename}
          </Button>
        </span>
      ),
      sortable: true,
      selector: (row) => row.candidatename,
      minWidth: "250px",
    },
    {
      name: <span className="table-title">Skills</span>,
      cell: (row) => (
        <span className="table-cell" title={row.skills}>
          {row.skills}
        </span>
      ),
      sortable: true,

      selector: (row) => row.skills,
      minWidth: "350px",
    },
    {
      name: <span className="table-title">Experience</span>,
      cell: (row) => (
        <span className="table-cell" title={row.experience}>
          {row.experience}
        </span>
      ),
      sortable: true,
      selector: (row) => row.experience,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Location</span>,
      cell: (row) => (
        <span className="table-cell" title={row.location}>
          {row.location}{" "}
        </span>
      ),
      sortable: true,
      selector: (row) => row.location,
      minWidth: "200px",
    },
    {
      name: <span className="table-title">Created</span>,
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
  ];
  const { newCandidate: data = [], loading = false } = useSelector(
    (state) => state?.adminReportReducer ?? {}
  );

  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  let [filter, setFilter] = useState({});

  const [excelData, setExcelData] = useState([]);
  let [skill, setSkill] = useState([]);
  let [location, setLocation] = useState([]);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    dispatch(newCandidateThunk());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      let filteredData = data.map((rec) => {
        return {
          Name: rec?.candidatename,
          Skills: rec?.skills,
          Experience: rec?.experience,
          Location: rec?.location,

          Created: rec.createddate
            ? moment(rec.createddate).format("MM/DD/YYYY")
            : "",
        };
      });
      setExcelData([{ sheetName: "NewCandidates", details: filteredData }]);
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
    dispatch(newCandidateThunk(filter));
  };

  const clearFilter = () => {
    setFilter({});
    setStartDate(null);
    setEndDate(null);
    setSkill([]);
    setLocation([]);
    dispatch(newCandidateThunk());
  };

  const onCandidateClick = async (candidateId) => {
    const response = await dispatch(
      getProfileActions.getCandidate(candidateId)
    );
    if (response?.payload) {
      setShowProfileModal(true);
    }
  };

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
                          "adminNewCandidateReport",
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
                <Col xxl="2" xl="3" lg="3" md="4" sm="12" xs="12">
                  <SkillsFilter
                    name={"skillId"}
                    placeholder={"Search Skill"}
                    onChange={(name, value, e) => {
                      handleChange(name, value);
                      setSkill(e);
                    }}
                    value={skill}
                  />
                </Col>
                <Col xxl="2" xl="3" lg="3" md="4" sm="12" xs="12">
                  <LocationFilter
                    name={"cityId"}
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
                        name="startDate"
                        placeholderText="From"
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
                <Col xxl="2" xl="2" lg="3" md="4" sm="12" xs="12">
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
        {showProfileModal ? (
          <>
            <BuildCVModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
            />
          </>
        ) : (
          <></>
        )}
      </>
    </>
  );
}
