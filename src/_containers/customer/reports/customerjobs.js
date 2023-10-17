import { useEffect } from "react";
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

import { Table } from "_widgets";

import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faSearch } from "@fortawesome/free-solid-svg-icons";

import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";

import { getCustReportJobList } from "./customerreport.slice";
import { useParams } from "react-router-dom";
import { data } from "./data";
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
    selector: (row) => row.createddate,
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
  useEffect(() => {
    dispatch(getCustReportJobList({ reportId: id }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jobList = useSelector((state) => state?.customerReportReducer?.jobList);

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
              <Row style={{ display: "none" }}>
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
                      />
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <Button
                        style={{ background: "rgb(47 71 155)" }}
                        className="btn-square btn btn-primary"
                        type="button"
                      >
                        <FontAwesomeIcon icon={faSearch} /> Search
                      </Button>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>

              <Table columns={columns} data={jobList} fixedHeader />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
