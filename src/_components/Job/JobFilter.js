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

export function JobFilter({ onFilter, onSearch, setPage }) {
  const [placeHolder, setPlaceHolder] = useState("Search");
  const getSelectData = (event) => {
    event.preventDefault();
    if (event.target.value === "Search") {
      setPlaceHolder("Search");
    } else {
      setPlaceHolder("Search " + event.target.value.toLowerCase());
    }
  };
  const getFilterValue = (event) => {
    event.preventDefault();
    console.log(event);
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
                      onChange={(e) => getSelectData(e)}
                    >
                      <option>Search</option>
                      <option>State</option>
                      <option>City</option>
                      <option>Skill</option>
                      <option>Title</option>
                    </Input>
                    <Input
                      type="search"
                      placeholder={placeHolder}
                      name="searchValue"
                    />
                    <Button
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
}
