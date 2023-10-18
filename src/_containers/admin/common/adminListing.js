import React from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import { customers, company, users, roles, menuMapping } from "_containers/admin/common/adminColumnsListing"
import PageTitle from "_components/common/pagetitle";
import { Row, Col, Card, CardBody, CardHeader, Button, FormGroup, InputGroup, Input } from "reactstrap";
import "_containers/admin/common/adminListing.scss"
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from '_containers/admin/_redux/adminListing.slice'
import { useEffect } from "react";


export const AdminListing = ({entity}) => {
  const dispatch = useDispatch()
  const {
    companiesData,
    loading = false } = useSelector((state) => state?.adminListing ?? {});

  let title, icon, listingTitle, columns = [], searchFilter = [], buttonsList = [];

  switch (entity) {
    case "customers":
      title = customers.title;
      icon = companyLogo;
      columns = customers.columns;
      searchFilter = customers.searchFilter;
      buttonsList = customers.buttonsList;
      listingTitle = customers.listingTitle;
      break;
    case "company":
      title = company.title;
      icon = companyLogo;
      columns = company.columns;
      searchFilter = company.searchFilter;
      buttonsList = company.buttonsList;
      listingTitle = company.listingTitle;
      break;
    case "users":
      title = users.title;
      icon = companyLogo;
      columns = users.columns;
      searchFilter = users.searchFilter;
      buttonsList = users.buttonsList;
      listingTitle = users.listingTitle;
      break;
    case "roles":
      title = roles.title;
      icon = companyLogo;
      columns = roles.columns;
      searchFilter = roles.searchFilter;
      buttonsList = roles.buttonsList;
      listingTitle = roles.listingTitle;
      break;
    case "menuMapping":
      title = menuMapping.title;
      icon = companyLogo;
      columns = menuMapping.columns;
      searchFilter = menuMapping.searchFilter;
      buttonsList = menuMapping.buttonsList;
      listingTitle = menuMapping.listingTitle;
      break;
    default:
      break;
  }

  const companyURLParams = {
    isActive: true,
    pageSize: 500,
  };

  useEffect(() => {
    if (entity === "company") {
      dispatch(getCompanies(companyURLParams))
    }
  }, [])


  const customStyles = {
    headCells: {
      style: {
        color: "#2F479B",
        fontFamily: "Capitana",
        fontSize: "16px",
        fontWeight: "400"
      },
    }
  };

  const cardFilters = (searchFilter).map( item => (
    < Col lg = "3" md = "3" sm = "12" sx = "12" >
      <Input name={item.id} type="select">
        <option value="">{item.name}</option>
      </Input>
    </Col >
  ))

  const cardButtons = (buttonsList).map(item => (
    <Col lg="3" md="2" sm="12" sx="12">
      <FormGroup>
        <InputGroup>
          <div className="admin-list btn-actions-pane-right ">
            <Button className="mb-2 me-2  " color="primary">
              {item.name}
            </Button>
          </div>
        </InputGroup>
      </FormGroup>
    </Col>
  ))

  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading={title} icon={icon} />
        </Col>
        <Col md="12">
          <Card className="mb-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                <i className="header-icon lnr-laptop-phone me-3 text-muted opacity-6"> {" "} </i>
                {listingTitle}
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                {cardFilters}
                {cardButtons}
              </Row>
              <DataTable data={companiesData}
                columns={columns}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="400px"
                customStyles={customStyles}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
