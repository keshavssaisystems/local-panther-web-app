import React from "react";
import PageTitle from "_components/common/pagetitle";
import titlelogo from "assets/utils/images/candidate.svg";
import { Row, Col, Card, CardBody, CardHeader,  Button, FormGroup, InputGroup, Input } from "reactstrap";
import DataTable from "react-data-table-component";
import { makeData } from "./Examples/candidatesUtils";
import "./adminList.scss"

export const AdminCompanyList = () => {
  const data = makeData();

  const columns = [
    {
      name: "Company",
      id: "name",
      selector: row => row.name,
      sortable: true,
    },
    {
      name: "City",
      id: "sills",
      selector: row => row.city,
      sortable: true,
    },
    {
      name: "State",
      selector: row => row.state,
      sortable: true,
    },
    {
      name: "Zip",
      selector: row => row.email,
      sortable: true,
    },
    {
      name: "Industry",
      selector: row => row.phone,
      sortable: true,
    },
  ];
  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading="Company" icon={titlelogo} />
        </Col>
        <Col md="12">
          <Card className="mb-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                <i className="header-icon lnr-laptop-phone me-3 text-muted opacity-6"> {" "} </i>
                {/* Filter by */}
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                <Col lg="3" md="2" sm="12" sx="12">
                  <Input name="industry" type="select">
                    <option value="">Industry</option>
                  </Input>
                </Col>
                <Col lg="3" md="2" sm="12" sx="12">
                  <Input name="city-state" type="select">
                    <option value="">City/state</option>
                  </Input>
                </Col>
                <Col lg="3" md="2" sm="12" sx="12">
                  <FormGroup>
                    <InputGroup>
                      <div className="admin-list">
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

export default AdminCompanyList;