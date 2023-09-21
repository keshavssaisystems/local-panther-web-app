import React, { useState } from "react";
import { Label, Input, FormGroup, Form, Row, Col, Button } from "reactstrap";

export function PaymentAndBenefits({ data, payPeriodTypeOption }) {
  const [paymentAndBenefits, setPaymentAndBenefits] = useState();
  const getFormData = (event) => {
    event.preventDefault();
    setPaymentAndBenefits({
      payPeriodType: event.target.elements.payPeriodType.value,
      minimumAmount: event.target.elements.minimumAmount.value,
      maximumAmount: event.target.elements.maximumAmount.value,
      compensationPackage: event.target.elements.compensationPackage.value,
      benefits: event.target.elements.benefits.value,
    });
    console.log(paymentAndBenefits);
  };
  return (
    <>
      <Form onSubmit={(e) => getFormData(e)}>
        <Row>
          <Col>
            {" "}
            <FormGroup>
              <Label className="fw-semi-bold">Pay period type</Label>
              <Input
                id={"payPeriodType"}
                name={"payPeriodType"}
                type={"select"}
              >
                <option key={0}>Select pay period type</option>
                {payPeriodTypeOption.length > 0 &&
                  payPeriodTypeOption.map((options) => (
                    <option key={options.id} value={options.label}>
                      {options.label}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for={"minimumAmount"} className="fw-semi-bold">
                Minimum amount
              </Label>
              <Input
                id={"minimumAmount"}
                name={"minimumAmount"}
                type={"number"}
                placeholder="Enter Minimum Amount"
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="maximumAmount" className="fw-semi-bold">
                Maximum amount
              </Label>
              <Input
                id={"maximumAmount"}
                name={"maximumAmount"}
                type={"number"}
                placeholder="Enter Maximum Amount"
              />
            </FormGroup>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            <FormGroup>
              <Label for="compensationPackage" className="fw-semi-bold">
                Compensation package
              </Label>
              <Input
                id={"compensationPackage"}
                name={"compensationPackage"}
                type={"textarea"}
                placeholder="Enter compensation package"
                maxLength={1000}
              />
            </FormGroup>
          </Col>
          <Col>
            <FormGroup>
              <Label for="benefits" className="fw-semi-bold">
                Benefits
              </Label>
              <Input
                id={"benefits"}
                name={"benefits"}
                type={"textarea"}
                placeholder="Enter benefits"
                maxLength={1000}
              />
            </FormGroup>
          </Col>
        </Row>
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
      </Form>
    </>
  );
}
