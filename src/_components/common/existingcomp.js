import React from "react";
import { Form, FormGroup, Label, Input, Row, Col, FormText } from "reactstrap";

export const ExistingCompany = (props) => {
  const onChangeComp = (e) => {
    let comp = props.companies.filter((data) => data.name === e.target.value);
    props.onUpdateExtComp(e, comp);
  };
  return (
    <>
      <Form>
        <FormGroup>
          <Label for="existingComp">Company Name:</Label>
          <Input
            type="select"
            name="existingComp"
            id="existingComp"
            invalid={props?.extComp?.existingComp?.error}
            value={props?.extComp?.existingComp?.value}
            onChange={(e) => onChangeComp(e)}
          >
            {props?.companies?.length > 0 ? (
              <>
                <option value="" hidden></option>
                {props.companies.map((data) => {
                  return (
                    <option value={data.name} key={data.name + data.zipcode}>
                      {data.name + ", " + data.address}
                    </option>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </Input>
          {props?.extComp?.existingComp?.error ? (
            <FormText color="danger">Please select existing company</FormText>
          ) : (
            <></>
          )}
        </FormGroup>
      </Form>
      <Row md={1}>
        {props?.extComp?.existingComp?.selectedComp?.length > 0 ? (
          <>
            <Col>{props?.extComp?.existingComp?.selectedComp[0]?.name}</Col>
            <Col>
              <i className="lnr-map-marker icon-gradient bg-deep-blue"> </i>
              {props?.extComp?.existingComp?.selectedComp[0]?.address}
            </Col>
            <Col>
              {" "}
              <i className="lnr-location icon-gradient bg-deep-blue"> </i>
              {props?.extComp?.existingComp?.selectedComp[0]?.zipcode}
            </Col>
          </>
        ) : (
          <></>
        )}
      </Row>
    </>
  );
};
