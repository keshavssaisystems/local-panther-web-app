import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";

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
  DropdownItem } from "reactstrap";

import { Table } from "_widgets";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faSearch, faFileExcel, faFilePdf } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { openJobsThunk } from "../_redux/report.slice";

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

export function OpenJobs() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(openJobsThunk())
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const { openJobsList: data = [] } = useSelector((state) => state?.adminReportReducer ?? {});
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
              <Row>
                <Col lg="2" md="2" sm="12" sx="12">
                  <Input name="skills" type="select">
                    <option value="">Select skills</option>
                  </Input>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <Input name="skills" type="select">
                    <option value="">Select Location</option>
                  </Input>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                      <DatePicker
                        name="fromDate"
                        id="fromDate"
                        placeholderText="DD/MM/YYYY"
                        className="form-control"
                        // selected={item.startdate}
                        // onChange={(evt) =>
                        //   handleInputChange("fromDate", index, evt)
                        // }
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
                        name="fromDate"
                        id="fromDate"
                        placeholderText="DD/MM/YYYY"
                        className="form-control"
                        // selected={item.startdate}
                        // onChange={(evt) =>
                        //   handleInputChange("fromDate", index, evt)
                        // }
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <Button
                        style={{background: 'rgb(47 71 155)'}}
                        className="btn-square btn btn-primary"
                        type="button"
                        // onClick={() => onSubmit()}
                      >
                      <FontAwesomeIcon icon={faSearch} />  Search
                      </Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>

              <Table 
                columns={columns}
                data={data}
                fixedHeader
                fixedHeaderScrollHeight="370px"
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
