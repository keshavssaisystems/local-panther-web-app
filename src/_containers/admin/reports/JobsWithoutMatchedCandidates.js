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
  DropdownItem } from "reactstrap";

import { SkillsFilter, LocationFilter } from "../filterComponent";
import { Table } from "_widgets";
import { getReportDataThunk } from "../_redux/report.slice";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";


export function JobsWithoutMatchedCandidates({ title }) {
  const dispatch = useDispatch()
  let { id: reportId } = useParams();

  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  let [filter, setFilter] = useState({
    '@startdate': null,
    '@enddate': null,
    '@skillid': null,
    '@cityid': null
  });

  const { 
    reportData: data = [],
    loading = false 
  } = useSelector((state) => state?.adminReportReducer ?? {});

  const getReportData = () => {
    let parameter = "";
    for (const key in filter) {
      if (Object.hasOwnProperty.call(filter, key)) {
        parameter += key + '=' + filter[key]+',';
      }
    }
    parameter = parameter.replace(/,\s*$/, "");
    dispatch(getReportDataThunk({reportId, parameter}))
  }
  
  useEffect(() => {
    getReportData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value
    })
  }
  
  const handleDateChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: moment(value).format('YYYY-MM-DD')
    })
  }

  const applyFilter = () => {
    getReportData();
  }
  
  const clearFilter = () => {
    const initFilter = {
      '@startdate': null,
      '@enddate': null,
      '@skillid': null,
      '@cityid': null
    };
    setFilter(initFilter);
    setStartDate(null)
    setEndDate(null)
    getReportData();
  }

  const columns = [
    {
        name: 'Candidate',
        selector: row => row?.candidatename,
        sortable: true,
        wrap: true,
        width: '150px'
    },
    {
        name: 'Experience',
        selector: row => row?.experience,
        sortable: true,
        wrap: true,
        width: '100px'
    },
    {
        name: 'Skills',
        selector: row => typeof row?.skill === 'string' && row?.skill,
        wrap: true,
    },
    {
        name: 'Education',
        selector: row => row?.education,
        wrap: true,
        width: '150px'
    },
    {
        name: 'Matched Jobs',
        selector: row => row?.matchedjobs,
        wrap: true,
        width: '100px'
    },
    {
      name: 'Address',
      selector: row => row?.address,
      sortable: true,
      wrap: true,
      width: '300px'
    }
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
                  <DropdownToggle className="btn-icon btn-icon-only" color="link">
                    <i className="pe-7s-menu btn-icon-wrapper" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-shadow dropdown-menu-hover-link">
                    <DropdownItem header>Download Report</DropdownItem>
                    <DropdownItem>
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
              <Row style={{zIndex: 9, position: 'relative'}}>
                <Col lg="2" md="2" sm="12" sx="12">
                  <SkillsFilter name={"@skillid"} placeholder={"Select Skills"} onChange={handleChange}/>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <LocationFilter name={"@cityid"} placeholder={"Select Location"} onChange={handleChange}/>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <DatePicker
                        dateFormat={'yyyy-MM-dd'}
                        name="@startdate"
                        placeholderText="From"
                        className="form-control"
                        selected={startDate}
                        onChange={(date) => {
                          handleDateChange("@startdate", date)
                          setStartDate(date)
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
                        dateFormat={'yyyy-MM-dd'}
                        name="@enddate"
                        placeholderText="To"
                        className="form-control"
                        selected={endDate}
                        onChange={(date) => {
                          handleDateChange("@enddate", date)
                          setEndDate(date)
                        }}
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="1" md="2" sm="12" sx="12">
                  <Button
                    style={{background: 'rgb(47 71 155)'}}
                    className="btn-square btn btn-primary"
                    type="button"
                    onClick={() => applyFilter()}
                  >  Search
                  </Button>
                </Col>
                <Col lg="1" md="2" sm="12" sx="12">
                  <Button
                      className="btn-square btn btn-primary"
                      type="button"
                      onClick={() => clearFilter()}
                    > Clear
                  </Button>
                </Col>
              </Row>

              <Table 
                progressPending={loading}
                progressComponent={<Loader type="line-scale-pulse-out-rapid" className="d-flex justify-content-center" />}
                columns={columns}
                data={data}
                // onRowClicked={handleRowClicked}
                fixedHeader
                fixedHeaderScrollHeight="400px"
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
