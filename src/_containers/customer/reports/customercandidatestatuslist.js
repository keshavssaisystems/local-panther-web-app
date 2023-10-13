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
import { data } from "./data";
const columns = [
  {
    name: "Candidate Id",
    selector: (row) => row.candidateid,
    sortable: true,
  },
  {
    name: "Name",
    selector: (row) => row.name,
    sortable: true,
  },
  {
    name: "Email",
    selector: (row) => row.email,
    sortable: true,
  },
  {
    name: "Phone",
    selector: (row) => row.phone,
    sortable: true,
  },
  {
    name: "Skills",
    selector: (row) => row.skills,
    sortable: true,
  },
  {
    name: "Education",
    selector: (row) => row.education,
    sortable: true,
  },
  {
    name: "Experience",
    selector: (row) => row.experience,
    sortable: true,
  },
  {
    name: "Location",
    selector: (row) => row.location,
    sortable: true,
  },
  {
    name: "Certifications",
    selector: (row) => row.certifications,
    sortable: true,
  },
];

export function CustomerReportCandidateStatus() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getCustReportJobList());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jobList = useSelector((state) => state?.customerReportReducer?.jobList);

  return (
    <>
      <PageTitle
        heading={"Customer Candidate Status List Report"}
        icon={titlelogo}
      />
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

              <Table columns={columns} data={data} fixedHeader />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
