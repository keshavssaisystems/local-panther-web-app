import React from "react";
import { useSelector } from "react-redux";
import {
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Row,
  Col,
  FormText,
} from "reactstrap";

export const NewCustomer = (props) => {
  const onChangeVal = (evt) => {
    // props.onUpdateCustomer(evt);
  };
  const stateList = useSelector((state) => state.state.user.data);
  return (
    <Row>
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
          </Col><Col md={12}>
            <FormGroup>
              <Label for="custFName">
                First Name<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                value={props?.data?.custFName?.value}
                invalid={props?.data?.custFName?.error}
                type="input"
                onChange={(e) => onChangeVal(e)}
                name="custFName"
                id="custFName"
              />
              {props?.data?.custFName?.error ? (
                <FormText color="danger">Please enter customer first name</FormText>
              ) : (
                <></>
              )}
            </FormGroup></Col>  <Col md={12}>
            <FormGroup>
              <Label for="custLName">
                Last Name<span style={{ color: "red" }}>* </span>
              </Label>
              <Input
                value={props?.data?.custLName?.value}
                invalid={props?.data?.custLName?.error}
                type="input"
                name="custLName"
                id="custLName"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.custLName?.error ? (
                <FormText color="danger">Please enter customer last name</FormText>
              ) : (
                <></>
              )}
            </FormGroup></Col>
          <Col md={12}>
            <FormGroup>
              <Label for="custTitle">
                Address
              </Label>
              <Input
                value={props?.data?.custTitle?.value}
                invalid={props?.data?.custTitle?.error}
                type="input"
                name="custTitle"
                id="custTitle"
                onChange={(e) => onChangeVal(e)}
              />
              {props?.data?.custTitle?.error ? (
                <FormText color="danger">Please enter customer title</FormText>
              ) : (
                <></>
              )}
            </FormGroup></Col>
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
                <span style={{ color: "red" }}>* </span>
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

                      // selected={options.id == item.experience}

                      key={options.id}

                      value={options.id}

                    >

                      {options.name}

                    </option>

                  ))}

              </Input>





              {/* {props?.data?.newCompState?.error ? (
              <FormText color="danger">
                Please enter company city and state
              </FormText>
            ) : (
              <></>
            )} */}
            </FormGroup>
          </Col>
          <Col md={12}>
            <FormGroup>
              <Label for="newCompZip">
                Zip code
                {/* <span style={{ color: "red" }}>* </span> */}
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
              <Label for="newCompPhonenum">
                Phone
                {/* <span style={{ color: "red" }}>* </span> */}
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
                <span style={{ color: "red" }}>* </span>
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
        </Row>
      </Form>
      <Col>
        {/* <Button color="primary">+ Add another</Button> */}
      </Col>
    </Row>
  );
};
