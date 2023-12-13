import React, { useState } from "react";
import {
  Label,
  Input,
  FormGroup,
  Form,
  Row,
  Col,
  Button,
  FormText,
} from "reactstrap";

export function PaymentAndBenefits({
  data,
  payPeriodTypeOption,
  postData,
  prevStep,
  previousData,
}) {
  const [successMessage, setSuccessMessage] = useState(false);
  const [preValue, setPreValue] = useState({
    payPeriodType:
      data === undefined || data.payPeriodType === undefined
        ? ""
        : data.payPeriodType,
    minimumAmount:
      data === undefined || data.minimumAmount === undefined
        ? ""
        : data.minimumAmount,
    maximumAmount:
      data === undefined || data.maximumAmount === undefined
        ? ""
        : data.maximumAmount,
    compensationPackage:
      data === undefined || data.compensationPackage === undefined
        ? ""
        : data.compensationPackage,
    benefits:
      data === undefined || data.benefits === undefined ? "" : data.benefits,
  });
  const [previousValue, setPreviousValue] = useState({
    payPeriodType:
      previousData[0] === undefined ||
      previousData[0].payperiodtypeid === undefined
        ? ""
        : previousData[0].payperiodtypeid,
    minimumAmount:
      previousData[0] === undefined ||
      previousData[0].minimumamount === undefined
        ? ""
        : previousData[0].minimumamount,
    maximumAmount:
      previousData[0] === undefined ||
      previousData[0].maximumamount === undefined
        ? ""
        : previousData[0].maximumamount,
    compensationPackage:
      previousData[0] === undefined ||
      previousData[0].compensationpackage === undefined
        ? ""
        : previousData[0].compensationpackage,
    benefits:
      previousData[0] === undefined || previousData[0].benefits === undefined
        ? ""
        : previousData[0].benefits,
  });
  const getFormData = (event) => {
    event.preventDefault();
    let data = {
      payPeriodType: event.target.elements.payPeriodType.value,
      minimumAmount: event.target.elements.minimumAmount.value,
      maximumAmount: event.target.elements.maximumAmount.value,
      compensationPackage: event.target.elements.compensationPackage.value,
      benefits: event.target.elements.benefits.value,
      payPeriodTypeOption: payPeriodTypeOption,
    };
    postData(data);
    setSuccessMessage(true);
  };
  return (
    <>
      <Form onSubmit={(e) => getFormData(e)}>
        <Row>
          <Col md={6} lg={3}>
            {" "}
            <FormGroup>
              <Label className="fw-semi-bold">Pay period type</Label>
              <Input
                id={"payPeriodType"}
                name={"payPeriodType"}
                type={"select"}
              >
                <option key={0} value={""}>
                  Select pay period type
                </option>
                {payPeriodTypeOption.length > 0 &&
                  payPeriodTypeOption.map((options) => (
                    <option
                      key={options.id}
                      value={options.id}
                      selected={
                        prevStep === 3
                          ? preValue.payPeriodType
                          : previousValue.payPeriodType === options.id
                      }
                    >
                      {options.name}
                    </option>
                  ))}
              </Input>
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for={"minimumAmount"} className="fw-semi-bold">
                Minimum amount
              </Label>
              <Input
                id={"minimumAmount"}
                name={"minimumAmount"}
                type={"number"}
                min={0}
                defaultValue={
                  prevStep === 3
                    ? preValue.minimumAmount
                    : previousValue.minimumAmount
                }
                placeholder="Enter minimum amount"
              />
            </FormGroup>
          </Col>
          <Col md={6} lg={3}>
            <FormGroup>
              <Label for="maximumAmount" className="fw-semi-bold">
                Maximum amount
              </Label>
              <Input
                id={"maximumAmount"}
                name={"maximumAmount"}
                type={"number"}
                min={0}
                defaultValue={
                  prevStep === 3
                    ? preValue.maximumAmount
                    : previousValue.maximumAmount
                }
                placeholder="Enter maximum amount"
              />
            </FormGroup>
          </Col>
          <Col md={6} lg={3}></Col>
        </Row>
        <Row>
          <Col md={6} lg={6}>
            <FormGroup>
              <Label for="compensationPackage" className="fw-semi-bold">
                Compensation package
              </Label>
              <Input
                id={"compensationPackage"}
                name={"compensationPackage"}
                type={"textarea"}
                placeholder="Enter compensation package"
                defaultValue={
                  prevStep === 3
                    ? preValue.compensationPackage
                    : previousValue.compensationPackage
                }
                maxLength={1000}
              />
            </FormGroup>
          </Col>
          <Col md={6} lg={6}>
            <FormGroup>
              <Label for="benefits" className="fw-semi-bold">
                Benefits
              </Label>
              <Input
                id={"benefits"}
                name={"benefits"}
                type={"textarea"}
                placeholder="Enter benefits"
                defaultValue={
                  prevStep === 3 ? preValue.benefits : previousValue.benefits
                }
                maxLength={1000}
              />
            </FormGroup>
          </Col>
        </Row>
        {successMessage === true && (
          <FormText
            color="success"
            className="d-flex align-items-center justify-content-center"
          >
            Payment & benefits added successfully{" "}
          </FormText>
        )}
        <Button color="primary" className="float-end mb-3">
          Save
        </Button>
      </Form>
    </>
  );
}
