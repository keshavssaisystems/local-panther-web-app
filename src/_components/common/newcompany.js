import React, { useEffect } from "react";
import { Form, FormGroup, Label, Input, FormText, Row, Col } from "reactstrap";
import { useSelector } from "react-redux";

export const NewCompany = (props) => {
  const onChangeVal = (evt) => {
    props.updateVal(evt);
  };
  useEffect(() => {
    if (props.editingData && props.editMode) {
      const { companyname, industryname, description, noofemployees, ...otherData } = props.editingData;
      props.updateVal({ target: { name: 'newCompName', value: companyname } });
      props.updateVal({ target: { name: 'newIndusName', value: industryname } });
      props.updateVal({ target: { name: 'newCompDesc', value: description } });
      props.updateVal({ target: { name: 'newCompEmp', value: noofemployees } });
     }
  }, [props.editingData, props.editMode]);
  const stateList = useSelector((state) => state.state.user.data);

  return (
    <Form>
      <Row>
        <Col md={12}>
          <FormGroup>
            <Label for="newCompName">
              Company  <span style={{ color: "red" }}>* </span>
            </Label>
            <Input
              value={props?.data?.newCompName?.value}
              invalid={props?.data?.newCompName?.error}
              type="input"
              name="newCompName"
              id="newCompName"
              onChange={(e) => onChangeVal(e)}
            />
            {props?.data?.newCompName?.error ? (
              <FormText color="danger">Please enter company name</FormText>
            ) : (
              <></>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="newIndusName">
              Industry <span style={{ color: "red" }}>* </span>
            </Label>
            <Input
              value={props?.data?.newIndusName?.value}
              invalid={props?.data?.newIndusName?.error}
              type="input"
              name="newIndusName"
              id="newIndusName"
              onChange={(e) => onChangeVal(e)}
            />
            {props?.data?.newIndusName?.error ? (
              <FormText color="danger">Please enter industry name</FormText>
            ) : (
              <></>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="newCompDesc">About company</Label>
            <Input
              value={props?.data?.newCompDesc?.value}
              type="text"
              invalid={props?.data?.newCompDesc?.error}
              name="newCompDesc"
              id="newCompDesc"
              onChange={(e) => onChangeVal(e)}
            />  {props?.data?.newCompDesc?.error ? (
              <FormText color="danger"> Description should not contain numbers or special characters</FormText>
            ) : (
              <></>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="newCompEmp">No. of Employees</Label>
            <Input
              value={props?.data?.newCompEmp?.value}
              type="number"
              invalid={props?.data?.newCompEmp?.error}
              name="newCompEmp"
              id="newCompEmp"
              onChange={(e) => onChangeVal(e)}
            /> {props?.data?.newCompEmp?.error ? (
              <FormText color="danger">Please enter valid number</FormText>
            ) : (
              <></>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="newCompPhonenum">
              Phone
            </Label>
            <Input
              value={props?.data?.newCompPhonenum?.value}
              invalid={props?.data?.newCompPhonenum?.error}
              type="input"
              name="newCompPhonenum"
              id="newCompPhonenum"
              onChange={(e) => onChangeVal(e)}
            />
            {props?.data?.newCompPhonenum?.error ? (
              <FormText color="danger">Please enter a valid phone number.</FormText>
            ) : (
              <></>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="newCompEmail">
              Email
            </Label>
            <Input
              value={props?.data?.newCompEmail?.value}
              invalid={props?.data?.newCompEmail?.error}
              type="input"
              name="newCompEmail"
              id="newCompEmail"
              onChange={(e) => onChangeVal(e)}
            />
            {props?.data?.newCompEmail?.error ? (
              <FormText color="danger">Please enter contact Email-ID in proper format</FormText>
            ) : (
              <></>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="newCompCity">
              City
              <span style={{ color: "red" }}>* </span>
            </Label>
            <Input
              value={props?.data?.newCompCity?.value}
              invalid={props?.data?.newCompCity?.error}
              type="input"
              name="newCompCity"
              id="newCompCity"
              onChange={(e) => onChangeVal(e)}
            />
            {props?.data?.newCompCity?.error ? (
              <FormText color="danger">
                Please enter company city
              </FormText>
            ) : (
              <></>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="newCompState">
              State
            </Label>
            <Input
              value={props?.data?.newCompState?.value}
              invalid={props?.data?.newCompState?.error}
              type="select"
              name="newCompState"
              id="newCompState"
              onChange={(e) => onChangeVal(e)}
            >
              <option key={0}>
                Select state
              </option>
              {stateList?.length > 0 &&
                stateList?.map((options) => (
                  <option
                    key={options.id}
                    value={options.id}
                  >
                    {options.name}
                  </option>
                ))}
            </Input>
          </FormGroup>
        </Col>
        {props.editMode && (
          <Col md={12}>
            <FormGroup>
              <Label for="newCompCountry">
                Country
                         </Label>
              <Input
                value={props?.data?.newCompCountry?.value}
                invalid={props?.data?.newCompCountry?.error}
                type="select"
                name="newCompCountry"
                id="newCompCountry"
                onChange={(e) => onChangeVal(e)}
              />
            </FormGroup>
          </Col>
        )}
        <Col md={12}>
          <FormGroup>
            <Label for="newCompZip">
              Zip code
            </Label>
            <Input
              value={props?.data?.newCompZip?.value}
              invalid={props?.data?.newCompZip?.error}
              type="input"
              name="newCompZip"
              id="newCompZip"
              onChange={(e) => onChangeVal(e)}
            />
            {props?.data?.newCompZip?.error ? (
              <FormText color="danger">Please enter zip code</FormText>
            ) : (
              <></>
            )}
          </FormGroup>
        </Col>
        <Col md={12}>
          <FormGroup>
            <Label for="logo">
              Logo
            </Label>
            <Input
              type="file"
              name="logo"
              id="logo"
              onChange={(e) => onChangeVal(e)}
            />
            {props.logoFile && (
              <img
                src={URL.createObjectURL(props.logoFile)}
                alt="Logo Preview"
                style={{ maxWidth: "100px", maxHeight: "100px", marginTop: "10px" }}
              />
            )}
          </FormGroup>
        </Col>
      </Row>
    </Form>

  );
};
