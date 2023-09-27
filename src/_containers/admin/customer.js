import React, { useState } from "react";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Input,
  Card,
  CardBody,
  CardHeader,
  Button,
} from "reactstrap";
import { NewCompany } from "_components/common/newcompany";
import { ExistingCompany } from "_components/common/existingcomp";
import { NewCustomer } from "_components/common/addCustomer";
import { existingCompanies } from "./data";

export const OnboardCustomer = () => {
  const [activeTab, setActiveTab] = useState(true);
  const [newComp, setNewComp] = useState({
    newCompName: { value: "", error: false },
    newCompDesc: { value: "" },
    newCompEmp: { value: "" },
    newCompAdd: { value: "", error: false },
    newCompState: { value: "", error: false },
    newCompZip: { value: "", error: false },
  });
  const [extComp, setExtComp] = useState({
    existingComp: { value: "", error: false, selectedComp: "" },
  });

  const [customer, setCustomer] = useState({
    custFName: { value: "", error: false },
    custLName: { value: "", error: false },
    custTitle: { value: "", error: false },
    custEmail: { value: "", error: false },
    custPhone: { value: "", error: false },
  });

  const onRadioSelect = (evt) => {
    if (evt === "new") {
      setActiveTab(true);
    } else {
      setActiveTab(false);
    }
  };

  const onUpdateNewComp = (evt) => {
    let newData = { ...newComp };
    newData[evt.target.name].value = evt.target.value;
    setNewComp(newData);
  };

  const onUpdateExtComp = (evt, val) => {
    let newData = { ...extComp };
    newData[evt.target.name].value = evt.target.value;
    newData[evt.target.name].selectedComp = val;
    setExtComp(newData);
  };

  const onUpdateCustomer = (evt) => {
    let newData = { ...customer };
    newData[evt.target.name].value = evt.target.value;
    if (evt.target.name === "custEmail") {
      newData[evt.target.name].error =
        !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(evt.target.value);
    }
    setCustomer(newData);
  };

  const onSaveClick = () => {
    if (activeTab) {
      let newCompData = { ...newComp };
      let newCustData = { ...customer };
      if (newCompData.newCompName.value === "") {
        newCompData.newCompName.error = true;
      }
      if (newCompData.newCompAdd.value === "") {
        newCompData.newCompAdd.error = true;
      }
      if (newCompData.newCompState.value === "") {
        newCompData.newCompState.error = true;
      }
      if (newCompData.newCompZip.value === "") {
        newCompData.newCompZip.error = true;
      }

      if (newCustData.custFName.value === "") {
        newCustData.custFName.error = true;
      }
      if (newCustData.custLName.value === "") {
        newCustData.custLName.error = true;
      }
      if (newCustData.custTitle.value === "") {
        newCustData.custTitle.error = true;
      }
      if (newCustData.custEmail.value === "") {
        newCustData.custEmail.error = true;
      }
      if (newCustData.custPhone.value === "") {
        newCustData.custPhone.error = true;
      }

      setNewComp(newCompData);
      setCustomer(newCustData);
    } else {
      let newCustData = { ...customer };
      let newExtCmp = { ...extComp };
      if (newExtCmp.existingComp.value === "") {
        newExtCmp.existingComp.error = true;
      }

      if (newCustData.custFName.value === "") {
        newCustData.custFName.error = true;
      }
      if (newCustData.custLName.value === "") {
        newCustData.custLName.error = true;
      }
      if (newCustData.custTitle.value === "") {
        newCustData.custTitle.error = true;
      }
      if (newCustData.custEmail.value === "") {
        newCustData.custEmail.error = true;
      }
      if (newCustData.custPhone.value === "") {
        newCustData.custPhone.error = true;
      }
      setExtComp(newExtCmp);
      setCustomer(newCustData);
    }
  };

  return (
    <>
      <Row>
        <Col md={12}>
          <h3>Company:</h3>
        </Col>
        {/* <Row xs={1} sm={1} md={2} lg={2} xl={2}> */}
        <Col md={6}>
          <Card>
            <CardHeader>
              <FormGroup check>
                <Input
                  name="new"
                  type="radio"
                  checked={activeTab}
                  onClick={(evt) => onRadioSelect("new")}
                />{" "}
                <Label check>New</Label>
              </FormGroup>
            </CardHeader>
            <CardBody>
              <Row xs={1} sm={1} md={1} lg={1} xl={1}>
                <Col>
                  {activeTab ? (
                    <NewCompany
                      data={newComp}
                      updateVal={(e) => onUpdateNewComp(e)}
                    />
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <CardHeader>
              <FormGroup check>
                <Input
                  name="existing"
                  type="radio"
                  checked={!activeTab}
                  onClick={(evt) => onRadioSelect("ext")}
                />{" "}
                <Label check>Existing</Label>
              </FormGroup>
            </CardHeader>
            <CardBody>
              <Row xs={1} sm={1} md={1} lg={1} xl={1}>
                <Col>
                  {!activeTab ? (
                    <ExistingCompany
                      companies={existingCompanies}
                      extComp={extComp}
                      onUpdateExtComp={(e, val) => onUpdateExtComp(e, val)}
                    />
                  ) : (
                    <></>
                  )}
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
        {/* </Row> */}
      </Row>
      <Row>
        <Col md={12}>
          <h3>Customer:</h3>
        </Col>
        <Col md={12}>
          <Card>
            <CardBody>
              <Row xs={1} sm={1} md={1} lg={1} xl={1}>
                <Col>
                  <NewCustomer
                    data={customer}
                    onUpdateCustomer={(e) => onUpdateCustomer(e)}
                  />
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="pt-4" md={1}>
        <Col>
          <Button color="primary" onClick={() => onSaveClick()}>
            Save
          </Button>
        </Col>
      </Row>
    </>
  );
};
