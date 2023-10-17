import React from "react";
import PageTitle from "_components/common/pagetitle";
import titlelogo from "assets/utils/images/candidate.svg";
import { Row, Col, Card, CardBody, CardHeader, Button, FormGroup, InputGroup, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { makeData } from "./Examples/candidatesUtils";
import "./adminList.scss"

const AdminCustomersList = () => {
  const data = makeData();

  const columns = [
    {
      name: "Name",
      id: "name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "Company",
      id: "company",
      selector: row => row.company,
      sortable: true,
    },
    {
      name: "Address",
      selector: row => row.address,
      sortable: true,
    },
    {
      name: "City",
      selector: row => row.city,
      sortable: true,
    },
    {
      name: "State",
      selector: row => row.state,
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
                <Col lg="3" md="2" sm="12" sx="12">
                  <Input name="company" type="select">
                    <option value="">Company</option>  {/* Default : All */}
                  </Input>
                </Col>
                <Col lg="3" md="2" sm="12" sx="12">
                  <Input name="isActive" type="select">
                    <option value="">Active</option>
                  </Input>
                </Col>
                <Col lg="3" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="admin-list ">
                        <Button className="mb-2 me-2  " color="primary">
                          Search
                        </Button>
                      </div>
                    </InputGroup>
                  </FormGroup>
                </Col>
                <Col lg="3" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="admin-list btn-actions-pane-right ">
                        <Button className="mb-2 me-2 " color="primary">
                          Add
                        </Button>
                      </div>
                    </InputGroup>
                  </FormGroup>
                </Col>
              </Row>
              <DataTable data={data}
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