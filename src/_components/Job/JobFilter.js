import React from "react";
import { Card, CardBody, Form, Button, Col, Row } from "reactstrap";
import { EmploymentMode } from "_components/dropdownComponents/EmploymentMode";
import { FilterSearch } from "_components/common/filterSearch";
import { SkillsFilter } from "_components/dropdownComponents/SkillsFilter";
import { Location } from "_components/dropdownComponents/Location";

export function JobFilter({ onFilter, onSearch }) {
  const onSubmitHandler = (event) => {
    event.preventDefault();
    let processedData = processFormData(event);
    let responseBody = {};
    responseBody.skills = processedData[1].toString();
    responseBody.location = processedData[0].toString();
    responseBody.employementType = event.target.elements.employmentType.value;
    onFilter(responseBody);
  };
  const processFormData = (targetEvent) => {
    let locationArray = [];
    let skillsArray = [];
    let eventLength = targetEvent.target.length;
    for (let index = 0; index < eventLength; index++) {
      let getSplitData = targetEvent.target.elements[index].value.split(", ");
      if (
        targetEvent.target.elements[index].type === "hidden" &&
        getSplitData.length > 1
      ) {
        locationArray.push(getSplitData[0]);
      }
      if (
        targetEvent.target.elements[index].type === "hidden" &&
        getSplitData.length === 1
      ) {
        skillsArray.push(getSplitData[0]);
      }
    }
    return [locationArray, skillsArray];
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
                      <Location
                        label={"Location"}
                        name={"location"}
                        id={"location"}
                        defaultOption={"Search by city"}
                        showValidation={false}
                        validationMessage={""}
                        mandatory={false}
                      />
                    </Col>
                    <Col>
                      <SkillsFilter
                        label={"Skills"}
                        name={"skillsDD"}
                        id={"skillsDD"}
                        defaultOption={"Search skills"}
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
