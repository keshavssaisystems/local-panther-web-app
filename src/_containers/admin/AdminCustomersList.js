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

export const AdminCustomersList = () => {
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
      name: "Company",
      id: "sills",
      selector: row => row.skills,
      sortable: true,
    },
    {
      name: "Address",
      selector: row => row.address,
      sortable: true,
    },
    {
      name: "City",
      selector: row => row.country,
      sortable: true,
    },
    {
      name: "State",
      selector: row => row.country,
      sortable: true,
    },
    {
      name: "Phone",
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: "Email",
      selector: row => row.email,
      sortable: true,
    },
    {
      name: "Status",
      selector: row => row.statuses,
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
          <PageTitle heading="Customers List" icon={titlelogo} />
        </Col>
        <Col md="12">
          <Card className="mb-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                <i className="header-icon lnr-laptop-phone me-3 text-muted opacity-6"> {" "} </i>
              </div>

            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="2" md="2" sm="12" sx="12">
                  <Input name="company" type="select">
                    <option value="">Company</option>  {/* Default : All */}
                  </Input>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">
                  <Input name="isActive" type="select">
                    <option value="">Active</option>
                  </Input>
                </Col>
                <Col lg="2" md="2" sm="12" sx="12">  {/* Default : All */}
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
                <Col lg="2" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="admin-list align-items-right">
                        <Button className="mb-2 me-2  " color="primary">
                          Add
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

export default AdminCustomersList;