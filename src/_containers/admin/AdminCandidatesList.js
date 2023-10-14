import React from "react";
import PageTitle from "_components/common/pagetitle";
import titlelogo from "assets/utils/images/candidate.svg";
import { Row, Col, Card, CardBody, CardHeader, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonGroup, FormGroup, InputGroup, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { makeData } from "./Examples/candidatesUtils";
import { FaEllipsisV } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt, faEllipsisV, faSearch } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import ReactDatePicker from "react-datepicker";
import "./adminList.scss"

export const AdminCandidatesList = () => {
  const data = makeData();

  const actionDots = () => 
    <ButtonGroup size="sm">
      <div className="d-block w-100 text-center">
        <UncontrolledButtonDropdown direction="start">
          <DropdownToggle
            className="btn-icon btn-icon-only btn btn-link"
            color="link"
          >
            <FontAwesomeIcon icon={FaEllipsisV} />
          </DropdownToggle>
          <DropdownMenu className="rm-pointers dropdown-menu-hover-link">
            <DropdownItem>
              <i className="dropdown-icon lnr-layers"></i>
              <span>View activities</span>
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    </ButtonGroup>

  const columns = [
    {
      name: "Name",
      id: "sills",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Skills",
      id: "sills",
      selector: row => row.skills,
      sortable: true,
    },
    {
      name: "Location",
      selector: row => row.address,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
    },
    {
      name: "Contact",
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: "Country",
      selector: row => row.country,
      sortable: true,
    },
    {
      name: "Status",
      selector: row => row.status,
      sortable: true,
    },
    {
      name: "Registration",
      selector: row => row.date,
      sortable: true,
    }
  ];
  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading="Candidates List" icon={titlelogo} />
        </Col>
        <Col md="12">
          <Card className="mb-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                <i className="header-icon lnr-laptop-phone me-3 text-muted opacity-6"> {" "} </i>
                {/* Filter by */}
              </div>
              {/* <div className="btn-actions-pane-right actions-icon-btn">
                <UncontrolledButtonDropdown>
                  <DropdownToggle className="btn-icon btn-icon-only" color="link">
                    <i className="pe-7s-menu btn-icon-wrapper" />
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-right rm-pointers dropdown-menu-shadow dropdown-menu-hover-link">
                    <DropdownItem header>Header</DropdownItem>
                    <DropdownItem>
                      <i className="dropdown-icon lnr-inbox"> </i>
                      <span>Menus</span>
                    </DropdownItem>
                    <DropdownItem>
                      <i className="dropdown-icon lnr-file-empty"> </i>
                      <span>Settings</span>
                    </DropdownItem>
                    <DropdownItem>
                      <i className="dropdown-icon lnr-book"> </i>
                      <span>Actions</span>
                    </DropdownItem>
                    <DropdownItem divider />
                    <div className="p-3 text-end">
                      <Button className="me-2 btn-shadow btn-sm" color="link">
                        View Details
                      </Button>
                      <Button className="me-2 btn-shadow btn-sm" color="primary">
                        Action
                      </Button>
                    </div>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div> */}
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="2" md="2" sm="12" sx="12">
                  <Input name="skills" type="select">
                    <option value="">Select skills</option>
                  </Input>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <Input name="location" type="select">
                    <option value="">Select location</option>
                  </Input>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <Input name="isActive" type="select">
                    <option value="">Select isActive</option>
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
                        placeholderText="Start date  dd/mm/yyyy"
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
                      <ReactDatePicker
                        name="fromDate"
                        id="fromDate"
                        placeholderText="End date  dd/mm/yyyy"
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
                      <div className="admin-list">
                      <Button className="mb-2 me-2  " color="primary">
                        {/* <FontAwesomeIcon icon={faSearch} /> */}
                          Search
                        </Button>
                    </div>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <DataTable data={data}
                // headRow={style={color='#2F479B'}}}
                columns={columns}
                pagination
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

export default AdminCandidatesList;