import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import "./customer.scss";
import { AddEditCompany } from "../common/addEditCompany";
import { dropdownActions } from "_store";

export const AddUpdateCustomer = ({
  openModal,
  onClose,
  postData,
  isEdit,
  data,
  putData,
}) => {
  const dispatch = useDispatch();
  const [editData, setEditData] = useState(data);
  const [modal, setModal] = useState(false);
  const [companyValidation, setCompanyValidation] = useState(false);
  const [firstNameValidation, setFirstNameValidation] = useState(false);

  const [lastNameValidation, setLastNameValidation] = useState(false);
  const [PrefixValidation, setPrefixValidation] = useState(false);
  const [prefixMinLengthValidation, setPrefixMinLengthValidation] =
    useState(false);
  const [emailValidation, setEmailValidation] = useState(false);
  const [locationValidation, setLocationValidation] = useState(false);
  const companiesList = useSelector((state) => state.dropdown.companyList);
  const [save, setSave] = useState(false);
  const [companyModal, setCompanyModal] = useState(false);

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
    setSave(false);
    let obj = {
      prefix: "",
      companyid: 0,
      firstname: "",
      lastname: "",
      address: "",
      zipcode: "",
      phone: "",
      email: "",
      cityid: 0,
      stateid: 0,
      cityname: "",
      statename: "",
    };
    setEditData(obj);
    setModal(!modal);
  };

  const handleInputChange = (event, check) => {
    let data = { ...editData };
    if (check === "prefix") {
      data.prefix = event.target.value;
      if (data.prefix === "") {
        setPrefixValidation(true);
      } else {
        if (data.prefix.length < 2) {
          setPrefixMinLengthValidation(true);
        } else {
          setPrefixMinLengthValidation(false);
        }
        setPrefixValidation(false);
      }
    } else if (check === "company") {
      data.company = parseInt(event.target.value);
      if (data.company === 0) {
        setCompanyValidation(true);
      } else {
        setCompanyValidation(false);
      }
    } else if (check === "firstname") {
      data.firstname = event.target.value;

      if (data.firstname === "") {
        setFirstNameValidation(true);
      } else {
        setFirstNameValidation(false);
      }
    } else if (check === "lastname") {
      data.lastname = event.target.value;
      if (data.lastname === "") {
        setLastNameValidation(true);
      } else {
        setLastNameValidation(false);
      }
    } else if (check === "email") {
      data.email = event.target.value;
      if (data.email === "") {
        setEmailValidation(true);
      } else {
        setEmailValidation(false);
      }
    } else if (check === "phonenumber") {
      data.phonenumber = event.target.value;
    } else if (check === "location") {
      data.cityid = parseInt(event);

      if (data.cityid === 0) {
        setLocationValidation(true);
      } else {
        setLocationValidation(false);
      }
    } else if (check === "address") {
      data.address = event.target.value;
    } else if (check === "zip") {
      data.zip = event.target.value;
    }
    setEditData(data);
  };

  const getValidation = (event) => {
    event.preventDefault();
    setSave(true);
    parseInt(event.target.elements.companyname.value) === 0
      ? setCompanyValidation(true)
      : setCompanyValidation(false);

    event.target.elements.prefix.value === ""
      ? setPrefixValidation(true)
      : setPrefixValidation(false);

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
      setSave(false);
      getSubmitForm(event);
    }
  };
  const checkCityValid = function () {
    // if (cityList?.length === 0) {
    //   setCityReqError(true);
    // } else {
    //   setCityReqError(false);
    // }
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
      customerid: isEdit === true ? editData?.customerid : 0,
      companyid: Number(event.target.elements.companyname.value),
      userid: 0,
      userroleid: 2,
      title: event.target.elements.prefix.value,
      firstname: event.target.elements.firstname.value,
      lastname: event.target.elements.lastname.value,
      email: event.target.elements.email.value,
      password: "",
      phonenumber: phoneData,
      address: "",
      zipcode: "",
      cityid: Number(locationData.cityId),
      stateid: Number(locationData.stateId),
      countryid: 1,
      isactive: true,
      currentUserId: Number(localStorage.getItem("userId")),
    };
    isEdit === true ? putData(data) : postData(data);
  };

  const closeCompanyModal = () => {
    dispatch(dropdownActions.getCompanyListThunk());
    setCompanyModal(false);
  };
  return (
    <Modal
      isOpen={openModal}
      fullscreen={"lg"}
      size="lg"
      backdrop={"static"}
      toggle={() => toggle()}
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
              <Col md={6}>
                <FormGroup>
                  <Label for="companyname">
                    Company <span style={{ color: "red" }}>* </span>
                  </Label>

                  {!isEdit && (
                    <a
                      className="float-end"
                      href="javascript:void(0)"
                      onClick={() => setCompanyModal(true)}
                    >
                      {" "}
                      +Add company
                    </a>
                  )}

                  <Input
                    type="select"
                    name="companyname"
                    placeholder="company..."
                    className={`form-control placeholder-name ${
                      companyValidation ? "is-invalid" : ""
                    }`}
                    onChange={(e) => handleInputChange(e, "company")}
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
                              : options.companyid === editData?.companyid
                          }
                        >
                          {options.companyname}
                        </option>
                      ))}
                  </Input>
                  {companyValidation && save && (
                    <FormText color="danger">Please select company</FormText>
                  )}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="prefix">
                    Prefix <span style={{ color: "red" }}>* </span>
                  </Label>
                  <Input
                    type="text"
                    name="prefix"
                    placeholder="Enter prefix"
                    defaultValue={editData?.title}
                    onInput={(e) => handleInputChange(e, "prefix")}
                    className={`form-control placeholder-name ${
                      PrefixValidation ? "is-invalid" : ""
                    }`}
                    minLength={2}
                    maxLength={5}
                  />
                  {PrefixValidation && save && (
                    <FormText color="danger">Please enter prefix</FormText>
                  )}

                  {prefixMinLengthValidation && !PrefixValidation && (
                    <FormText color="danger">
                      Please enter minimum 2 characters
                    </FormText>
                  )}
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="firstname">
                    First name <span style={{ color: "red" }}>* </span>
                  </Label>
                  <Input
                    type="text"
                    name="firstname"
                    placeholder="First name..."
                    defaultValue={editData?.firstname}
                    onInput={(e) => handleInputChange(e, "firstname")}
                    className={`form-control placeholder-name ${
                      firstNameValidation ? "is-invalid" : ""
                    }`}
                    maxLength={50}
                  />
                  {firstNameValidation && save && (
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
                    defaultValue={editData?.lastname}
                    className={`form-control placeholder-name ${
                      lastNameValidation ? "is-invalid" : ""
                    }`}
                    maxLength={50}
                    onInput={(e) => handleInputChange(e, "lastname")}
                  />
                  {lastNameValidation && save && (
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
                    defaultValue={editData?.email}
                    className={`form-control placeholder-name ${
                      emailValidation ? "is-invalid" : ""
                    }`}
                    disabled={isEdit}
                    maxLength={70}
                    onInput={(e) => handleInputChange(e, "email")}
                  />
                  {emailValidation && save && (
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
                    maxLength={20}
                    placeholder="Eg: (987)-654-3210"
                    onInput={(e) => handleInputChange(e, "phonenumber")}
                    defaultValue={editData?.phonenumber}
                  />
                </FormGroup>
              </Col>
              {/* <Col md={12}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input
                    type="textarea"
                    name="address"
                    onInput={(e) => handleInputChange(e, "address")}
                    placeholder="address..."
                    defaultValue={editData?.address}
                    maxLength={100}
                  />
                </FormGroup>
              </Col> */}
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
                    onChange={(e) => handleInputChange(e, "location")}
                    className={`placeholder-name ${
                      locationValidation ? "async-border-red" : ""
                    }`}
                    defaultValue={
                      isEdit === false
                        ? []
                        : {
                            value:
                              editData?.cityid +
                              ", " +
                              editData?.stateid +
                              ", " +
                              editData?.cityname +
                              ", " +
                              editData?.statename,
                            label:
                              editData?.cityname + ", " + editData?.statename,
                          }
                    }
                  />
                  {locationValidation && save && (
                    <FormText color="danger">
                      Please select city, state
                    </FormText>
                  )}
                </FormGroup>
              </Col>
              {/* <Col md={6}>
                <FormGroup>
                  <Label for="zipcode">Zip code</Label>
                  <InputMask
                    className="form-control"
                    mask="99999"
                    maskChar={null}
                    onInput={(e) => handleInputChange(e, "zipcode")}
                    name="zipcode"
                    id="zipcode"
                    placeholder="Zipcode"
                    defaultValue={editData?.zipcode}
                  />
                </FormGroup>
              </Col> */}

              {/* <Col md={6}>
                <FormGroup>
                  <Label for="country" className="fw-semi-bold">
                    <span className="text-danger">* </span>Country
                  </Label>
                  <AsyncSelect
                    name="country"
                    placeholder="Select country"
                    placeholderText="search"
                    isMulti={false}
                    className={`placeholder-name ${
                      countryValue === 0 ? "async-border-red" : ""
                    }`}
                    defaultOptions={countryList}
                    onChange={(e) => onSelectCountryDropdown(e)}
                    onMenuOpen={() => checkCityValid()}
                  />
                  <div className="async-error-text">
                    {countryValue === 0 ? "Country is required" : ""}
                  </div>
                </FormGroup>
              </Col> */}
            </Row>
            <Col></Col>
            <Button
              className="mt-3 float-end"
              type="submit"
              color="primary"
              //   disabled={formState.isSubmitting}
            >
              {isEdit === true ? "Update" : "Save"}
            </Button>
          </Form>
        </Row>
      </ModalBody>

      {companyModal ? (
        <AddEditCompany
          openModal={openModal}
          isAddMode={true}
          onClose={() => closeCompanyModal(false)}
        />
      ) : (
        <></>
      )}
    </Modal>
  );
};
