import React, { useState } from "react";
import { useSelector } from "react-redux";
import InputMask from "react-input-mask";
import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Modal,
  Button,
  Input,
  ModalHeader,
  ModalBody,
  FormText,
} from "reactstrap";
import AsyncSelect from "react-select/async";
import { getLocation } from "_store";

export const AddUpdateCustomer = ({
  openModal,
  onClose,
  postData,
  isEdit,
  editData,
  putData,
}) => {
  console.log(editData);
  const [modal, setModal] = useState(false);
  const [companyValidation, setCompanyValidation] = useState(false);
  const [firstNameValidation, setFirstNameValidation] = useState(false);
  const [lastNameValidation, setLastNameValidation] = useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [locationValidation, setLocationValidation] = useState(false);
  const companiesList = useSelector((state) => state.dropdown.companyList);
  const loadOptions = async (inputValue) => {
    if (inputValue.length > 2) {
      const { data = [] } = await getLocation(inputValue);
      return data.map(({ cityid: value, ...rest }) => {
        return {
          value: `${value}, ${rest.stateid}, ${rest.location}, ${rest.statename}`,
          label: `${rest.location}, ${rest.statename}`,
        };
      });
    }
  };
  const toggle = () => {
    setModal(!modal);
  };
  const getValidation = (event) => {
    event.preventDefault();
    event.target.elements.companyname.value === 0
      ? setCompanyValidation(true)
      : setCompanyValidation(false);
    event.target.elements.firstname.value === ""
      ? setFirstNameValidation(true)
      : setFirstNameValidation(false);
    event.target.elements.lastname.value === ""
      ? setLastNameValidation(true)
      : setLastNameValidation(false);
    event.target.elements.email.value === ""
      ? setEmailValidation(true)
      : setEmailValidation(false);
    event.target.elements.location.value === ""
      ? setLocationValidation(true)
      : setLocationValidation(false);
    if (
      event.target.elements.companyname.value !== 0 &&
      event.target.elements.firstname.value !== "" &&
      event.target.elements.lastname.value !== "" &&
      event.target.elements.email.value !== "" &&
      event.target.elements.location.value !== ""
    ) {
      getSubmitForm(event);
    }
  };
  const getLocationData = (data) => {
    let slicedData = data.split(", ");
    return {
      stateId: slicedData[1],
      cityId: slicedData[0],
    };
  };
  const getValidPhoneNo = (data) => {
    return data
      .replace("(", "")
      .replace(")", "")
      .replace("-", "")
      .replace("-", "");
  };
  const getSubmitForm = (event) => {
    let locationData = getLocationData(event.target.elements.location.value);
    let phoneData = getValidPhoneNo(event.target.elements.phonenumber.value);
    let data = {
      customerid: isEdit === true ? editData.customerid : 0,
      companyid: Number(event.target.elements.companyname.value),
      userid: 0,
      userroleid: 2,
      title: event.target.elements.firstname.value,
      firstname: event.target.elements.firstname.value,
      lastname: event.target.elements.lastname.value,
      email: event.target.elements.email.value,
      password: "",
      phonenumber: phoneData,
      address: event.target.elements.address.value,
      zipcode: event.target.elements.zipcode.value,
      cityid: Number(locationData.cityId),
      stateid: Number(locationData.stateId),
      countryid: 1,
      isactive: true,
      currentUserId: Number(localStorage.getItem("userId")),
    };
    isEdit === true ? putData(data) : postData(data);
  };
  return (
    <Modal
      isOpen={openModal}
      fullscreen={"lg"}
      size="lg"
      backdrop={"static"}
      toggle={toggle}
      onClosed={() => onClose()}
    >
      <ModalHeader toggle={() => onClose()}>
        <strong className="card-title-text">
          {isEdit === true ? "Edit" : "Add"} Customer
        </strong>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Form onSubmit={(e) => getValidation(e)}>
            <Row>
              <Col md={8}>
                <FormGroup>
                  <Label for="companyname">
                    Company <span style={{ color: "red" }}>* </span>
                  </Label>
                  <Input
                    type="select"
                    name="companyname"
                    placeholder="company..."
                  >
                    <option key={0} value={0}>
                      Select company
                    </option>
                    {companiesList?.length > 0 &&
                      companiesList?.map((options) => (
                        <option
                          key={options.companyid}
                          value={options.companyid}
                          selected={
                            isEdit === false
                              ? options.companyid === 0
                              : options.companyid === editData.companyid
                          }
                        >
                          {options.companyname}
                        </option>
                      ))}
                  </Input>
                  {companyValidation && (
                    <FormText color="danger">Please select company</FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={4}></Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="firstname">
                    First name <span style={{ color: "red" }}>* </span>
                  </Label>
                  <Input
                    type="text"
                    name="firstname"
                    placeholder="First name..."
                    defaultValue={isEdit === false ? "" : editData.firstname}
                  />
                  {firstNameValidation && (
                    <FormText color="danger">Please enter first name</FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="lastname">
                    Last name <span style={{ color: "red" }}>* </span>
                  </Label>
                  <Input
                    type="text"
                    name="lastname"
                    placeholder="Last name..."
                    defaultValue={isEdit === false ? "" : editData.lastname}
                  />
                  {lastNameValidation && (
                    <FormText color="danger">Please enter last name</FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="email">
                    Email <span style={{ color: "red" }}>* </span>
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    placeholder="Email..."
                    defaultValue={isEdit === false ? "" : editData.email}
                  />
                  {emailValidation && (
                    <FormText color="danger">Please enter valid email</FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="phonenumber">Phone</Label>
                  <InputMask
                    className="form-control"
                    mask="(999)-999-9999"
                    maskChar={null}
                    name="phonenumber"
                    id="phonenumber"
                    placeholder="Eg: (987)-654-3210"
                    defaultValue={isEdit === false ? "" : editData.phonenumber}
                  />
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input
                    type="textarea"
                    name="address"
                    placeholder="address..."
                    defaultValue={isEdit === false ? "" : editData.address}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="state">
                    City, State <span style={{ color: "red" }}>* </span>
                  </Label>
                  <AsyncSelect
                    name={"location"}
                    placeholder={"Select city, state"}
                    // defaultOptions={defaultOption}
                    loadOptions={loadOptions}
                    isMulti={false}
                    // styles={customStyles}
                    defaultValue={
                      isEdit === false
                        ? {}
                        : {
                            value:
                              editData.cityid +
                              ", " +
                              editData.stateid +
                              ", " +
                              editData.cityname +
                              ", " +
                              editData.statename,
                            label:
                              editData.cityname + ", " + editData.statename,
                          }
                    }
                  />
                  {locationValidation && (
                    <FormText color="danger">
                      Please select city, state
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="zipcode">Zip code</Label>
                  <InputMask
                    className="form-control"
                    mask="99999"
                    maskChar={null}
                    name="zipcode"
                    id="zipcode"
                    placeholder="Zipcode"
                    defaultValue={isEdit === false ? "" : editData.zipcode}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Col></Col>
            <Button
              type="submit"
              color="primary"
              //   disabled={formState.isSubmitting}
            >
              {isEdit === true ? "Update" : "Save"}
            </Button>
          </Form>
        </Row>
      </ModalBody>
    </Modal>
  );
};
