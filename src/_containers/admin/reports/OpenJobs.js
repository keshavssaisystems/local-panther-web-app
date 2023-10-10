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
  DropdownItem } from "reactstrap";

import { CompanyFilter, SkillsFilter, LocationFilter } from "../filterComponent";
import { Table, Popup } from "_widgets";
import { openJobsThunk, scheduledInterviewListThunk } from "../_redux/report.slice";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";


export function OpenJobs() {
  const dispatch = useDispatch()
  const { 
    openJobsList: data = [], 
    scheduledInterviewList = [],
    scheduledLoading = false, 
    loading = false } = useSelector((state) => state?.adminReportReducer ?? {});
  
  let [isOpen, setIsOpen] = useState(false);
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  let [filter, setFilter] = useState({});

  useEffect(() => {
    dispatch(openJobsThunk())
    
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
    dispatch(openJobsThunk(filter))
  }
  
  const clearFilter = () => {
    setFilter({})
    setStartDate(null)
    setEndDate(null)
    dispatch(openJobsThunk())
  }

  const handleSheduleClick = (jobid) => {
    dispatch(scheduledInterviewListThunk(jobid))
    setIsOpen(true)
  }

  /* const handleRowClicked = (e) => {
    dispatch()
    setIsOpen(true)
  } */

  const columns = [
    {
        name: 'Company',
        selector: row => row.companyname,
        sortable: true,
        wrap: true,
    },
    {
        name: 'Title',
        selector: row => row.jobtitle,
        sortable: true,
        wrap: true,
    },
    {
        name: 'Location',
        selector: row => row.address,
        sortable: true,
        wrap: true,
    },
    {
        name: 'Experiance',
        selector: row => row.experiencelevel,
        sortable: true,
        wrap: true,
    },
    {
        name: 'Skills',
        selector: row => row.musthaveskills,
        wrap: true,
    },
    {
        name: 'Posted',
        selector: row => row.jobposteddate,
        format: (row) => moment(row.jobposteddate).format('YYYY-MM-DD HH:mm'),
        wrap: true,
    },
    {
      name: 'Position',
      selector: row => row.noofopenposition,
      sortable: true,
      width: "90px"
    },
    {
      name: 'Hired',
      selector: row => row.reject,
      wrap: true,
      width: "70px"
    },
    {
        name: 'Matched',
        selector: row => row.matched,
        wrap: true,
        width: "80px"
    },
    {
        name: 'Liked',
        selector: row => row.like,
        wrap: true,
        width: "70px"
    },
    {
        name: 'Applied',
        selector: row => row.applied,
        wrap: true,
        width: "80px"
    },
    {
        name: 'Scheduled',
        selector: row => row.scheduled,
        cell:(row)=><button style={{border: '0px', width: '100%', height: '100%' }} onClick={() => handleSheduleClick(row.jobid)} id={row.jobid}>{row.scheduled}</button>,
        wrap: true,
        width: "80px"
    },
    {
        name: 'Accepted',
        selector: row => row.accept,
        wrap: true,
        width: "80px"
    },
    {
        name: 'Rejected',
        selector: row => row.reject,
        wrap: true,
        width: "80px"
    },
  ];
  const scheduledListColumns = [
    {
        name: 'Candidate',
        selector: row => row.candidatename,
        sortable: true,
        wrap: true,
        width: '150px'
    },
    {
        name: 'Skills',
        selector: row => row.candidateskills,
        sortable: true,
        wrap: true,
    },
    {
        name: 'Duration',
        selector: row => row.duration,
        sortable: true,
        wrap: true,
        width: '100px'
    },
    {
        name: 'Format',
        selector: row => row.format,
        sortable: true,
        wrap: true,
        width: '100px'
    },
    {
        name: 'Title',
        selector: row => row.jobtitle,
        wrap: true,
    },
    {
        name: 'Note',
        selector: row => row.interviewnotes,
        wrap: true,
    },
    {
        name: 'Scheduled Date',
        selector: row => row.scheduledate,
        format: (row) => moment(row.scheduledate).format('YYYY-MM-DD HH:mm'),
        wrap: true,
    },
    {
      name: 'Interviewer Email',
      selector: row => row.intervieweremailids,
      sortable: true,
      wrap: true
    },
  ];


  return (
    <>
      <PageTitle heading="Open Jobs" icon={titlelogo} />
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
                  <CompanyFilter name={"companyId"} placeholder={"Select Company"} onChange={handleChange}/>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <SkillsFilter name={"skillId"} placeholder={"Select Skills"} onChange={handleChange}/>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <LocationFilter name={"cityId"} placeholder={"Select Location"} onChange={handleChange}/>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <DatePicker
                        dateFormat={'yyyy-MM-dd'}
                        name="startDate"
                        placeholderText="From"
                        className="form-control"
                        selected={startDate}
                        onChange={(date) => {
                          handleDateChange("startDate", date)
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
                        name="endDate"
                        placeholderText="To"
                        className="form-control"
                        selected={endDate}
                        onChange={(date) => {
                          handleDateChange("endDate", date)
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
