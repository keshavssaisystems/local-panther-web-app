import React, { useState } from "react";
import { Card, CardBody, Form, Button, Col, Row } from "reactstrap";
import { EmploymentMode } from "_components/dropdownComponents/EmploymentMode";
import { InputFormGroup } from "_components/formComponents/InputFormGroup";
import { FilterSearch } from "_components/common/filterSearch";
import { Skills } from "_components/dropdownComponents/Skills";

export function JobFilter({ onFilter, onSearch }) {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    let responseBody = {};
    responseBody.skills = event.target.elements.skills.value;
    responseBody.location = event.target.elements.location.value;
    responseBody.employementType = event.target.elements.employmentType.value;
    onFilter(responseBody);
  };
  const getSearchValue = (search) => {
    onSearch(search);
  };

  return (
    <>
      <Col md="12">
        <Card className="main-card mb-3">
          <CardBody>
            <Row>
              <Col md={9}>
                <Form onSubmit={onSubmitHandler}>
                  <Row>
                    <Col>
                      <InputFormGroup
                        label={"Location"}
                        name={"location"}
                        id={"location"}
                        type={"text"}
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
                </Form>
              </Col>
              <Col>
                <FilterSearch
                  placeholder={"Search by job title"}
                  searchValue={getSearchValue}
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </>
  );
}
