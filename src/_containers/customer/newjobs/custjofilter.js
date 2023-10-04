import React, { useState } from "react";
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
    if (event.target.value === "Search") {
      props.setPlaceHolder("Search");
    } else {
      props.setPlaceHolder("Search " + event.target.value.toLowerCase());
    }
  };
  const getFilterValue = (event) => {
    event.preventDefault();
    props.onSearchData();
  };
  return (
    <>
      <Col md="12">
        <Card className="main-card mb-3 card-filter">
          <CardBody>
            <Form onSubmit={(e) => getFilterValue(e)}>
              <Row>
                <Col sm={6} md={6} lg={5} xl={3}>
                  <InputGroup>
                    <Input
                      name="searchType"
                      type="select"
                      className="fw-bold search-dropdown"
                      value={props.selectedOpt}
                      onChange={(e) => getSelectData(e)}
                    >
                      <option value={"Search"}>Search</option>
                      {/* <option value={"State"}>State</option>
                      <option value={"City"}>City</option>
                      <option value={"Skill"}>Skill</option> */}
                    </Input>
                    <Input
                      type="search"
                      placeholder={props.placeHolder}
                      value={props.searchText}
                      name="searchValue"
                      onChange={(e) => props.setSearchText(e.target.value)}
                    />
                    <Button
                      //   disabled={props.searchText === ""}
                      color={"primary"}
                      className="input-group-text"
                      type="submit"
                    >
                      <BsSearch />
                    </Button>
                  </InputGroup>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
};
