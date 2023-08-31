import React, { useState } from "react";
import { Card, CardBody, CardTitle, Form, FormGroup, Button, Col } from "reactstrap";
import { customerOptionsDummy, locationOptionsDummy, experienceOptionDummy} from "./Dummy";
import { FilterSelect, FilterMultipleSelect } from "./formComponents/FilterSelect";

export function JobFilter({onFilter}) {
    const [filterData, setFilterData] = useState({customer: "", location: "", minExperience: "", maxExperience : "" }) 
    const onSubmitHandler = (event) => {
        event.preventDefault();
        let responseBody = {};
        responseBody.customer = event.target.elements.customer.value;
        responseBody.location = event.target.elements.location.value;
        responseBody.minExperience = event.target.elements.minExperience.value;
        responseBody.maxExperience = event.target.elements.maxExperience.value;
        setFilterData(responseBody);
    }
    onFilter(filterData);
    return (
        <>
            <Col md="3">
                <Card className="main-card mb-3">
                    <CardBody>
                        <CardTitle>Filter</CardTitle>
                        <Form onSubmit={onSubmitHandler}>
                            {/* <FormGroup>
                                <FilterSelect id="customer" name="customer" label="Company" optionData={customerOptionsDummy} />
                            </FormGroup> */}
                            <FormGroup>
                                <FilterSelect id="location" name="location" label="City" optionData={locationOptionsDummy} /> 
                            </FormGroup>
                            <FormGroup>
                                <FilterMultipleSelect id="experience" name1="minExperience" label="Experience" optionData={experienceOptionDummy}  name2="maxExperience" />
                            </FormGroup>
                            <Button color="primary" className="float-end">
                            Submit
                            </Button>
                        </Form>
                    </CardBody>
                </Card>
            </Col>
        </>
    );
}
