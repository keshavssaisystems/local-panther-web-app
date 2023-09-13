import React, { useState } from "react";
import { Card, CardBody, Form, Button, Col, Row } from "reactstrap";
import { EmploymentMode } from "_components/dropdownComponents/EmploymentMode";
import { InputFormGroup } from "_components/formComponents/InputFormGroup";

export function JobFilter({ onFilter }) {
  const [filterData, setFilterData] = useState({
    customer: "",
    location: "",
    minExperience: "",
    maxExperience: "",
  });
  const handleChange = (e) => {
    e.preventDefault();
    const { target } = e;
    const { name, value } = target;
    setFilterData({
      ...filterData,
      [name]: value,
    });
    console.log("filterData :>> ", filterData);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    let responseBody = {};
    responseBody.customer = event.target.elements.customer.value;
    responseBody.location = event.target.elements.location.value;
    responseBody.minExperience = event.target.elements.minExperience.value;
    responseBody.maxExperience = event.target.elements.maxExperience.value;
    setFilterData(responseBody);
  };
  onFilter(filterData);
  return (
    <>
      <Col md="12">
        <Card className="main-card mb-3">
          <CardBody>
            <Form onSubmit={onSubmitHandler}>
              <Row>
                <Col md={9}>
                  <Row>
                    <Col>
                      <InputFormGroup
                        label={"Location"}
                        name={"location"}
                        id={"location"}
                        type={"text"}
                        onChange={handleChange}
                        placeholder={"Search by city"}
                        showValidation={false}
                        validationMessage={""}
                        mandatory={false}
                      />
                    </Col>
                    <Col>
                      <InputFormGroup
                        label={"Skills"}
                        name={"skills"}
                        id={"skills"}
                        type={"text"}
                        onChange={handleChange}
                        placeholder={"Search skills"}
                        showValidation={false}
                        validationMessage={""}
                        mandatory={false}
                      />
                    </Col>
                    <Col>
                      <EmploymentMode
                        showValidation={false}
                        validationMessage={""}
                        mandatory={false}
                        defaultOption={"Select Employment Type"}
                      />
                    </Col>
                    <Col>
                      <Button className="search-button">Search</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Form>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
