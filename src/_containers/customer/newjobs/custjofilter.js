import React from "react";
import {
  Card,
  CardBody,
  Form,
  Col,
  Row,
  InputGroup,
  Input,
  Button,
} from "reactstrap";
import { BsSearch } from "react-icons/bs";

export const CustJobFilter = (props) => {
  const getSelectData = (event) => {
    event.preventDefault();
    props.setSelectedOpt(event.target.value);
    props.setSearchText("");

    if (event.target.value === "JobTitle") {
      props.setPlaceHolder("Search job title");
    } else {
      props.setPlaceHolder("Search " + event.target.value.toLowerCase());
    }
  };
  const getFilterValue = (event) => {
    event.preventDefault();
    props.onSearchData();
  };
  const getJobStatusData = (event) => {
    props.onJobStatusChange(event);
  };
  return (
    <>
      <Col md="12">
        <Card className="main-card mb-3 card-filter">
          <CardBody>
            <Row>
              <Col lg={3} md={6}>
                <Form onSubmit={(e) => getFilterValue(e)}>
                  <InputGroup>
                    <Input
                      name="searchType"
                      type="select"
                      className="fw-bold search-dropdown"
                      value={props.selectedOpt}
                      onChange={(e) => getSelectData(e)}
                    >
                      <option value={"JobTitle"}>Search</option>
                      <option value={"State"}>State</option>
                      <option value={"City"}>City</option>
                      <option value={"Skills"}>Skill</option>
                    </Input>
                    <Input
                      type="search"
                      placeholder={props.placeHolder}
                      value={props.searchText}
                      name="searchValue"
                      onChange={(e) => props.setSearchText(e.target.value)}
                    />
                    <Button
                      color={"primary"}
                      className="input-group-text"
                      type="submit"
                    >
                      <BsSearch />
                    </Button>
                  </InputGroup>
                </Form>
              </Col>
              <Col lg={3} md={1}></Col>
              <Col lg={3} md={1}></Col>
              <Col lg={3} md={4}>
                <Input
                  name="jobStatus"
                  type="select"
                  defaultValue=""
                  onChange={(e) => getJobStatusData(e.target.value)}
                >
                  <option value={""}>All jobs</option>
                  <option value={"Publish"}>Publish jobs</option>
                  <option value={"Draft"}>Draft jobs</option>
                  <option value={"Closed"}>Closed jobs</option>
                </Input>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};
