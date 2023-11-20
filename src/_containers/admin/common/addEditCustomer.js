import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import {
  getStatesList,
  getCitiesList,
  getCompaniesList,
  addCustomer,
} from "_containers/admin/_redux/addCustomer.slice";
// import { getState } from '_store/dropdownstate.slice'

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
} from "reactstrap";

export const AddEditCustomer = (props) => {
  const { entity, isAddMode, data } = props;
  // const customerId = data?.customerid;
  const dispatch = useDispatch();
  const { companyDropdownData } = useSelector(
    (state) => state?.addCustomer ?? {}
  );
  const { statesList, citiesList, companiesList } = useSelector(
    (state) => state.addCustomer
  );
  // console.log("NG stateList in Add edit component", statesList)
  // console.log("NG citiesList in Add edit component", citiesList)
  // console.log("NG companiesList in Add edit component", companiesList)

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  /*
  companyid
  countryid
  countryname
  customerid
  cityid : city
  stateid : state
  isactive
  title
  userid
  userroleid
  
  companyname : companyname
  firstname
  lastname
  address
  cityname : city
  statename : //need to figure out label for the value
  zipcode
  phonenumber
  email

  */
  // form validation rules
  const validationSchema = Yup.object().shape({
    companyname: Yup.string().required("Company name is required").max(50),
    firstname: Yup.string().required("First name is required").max(50),
    lastname: Yup.string().required("Last name is required").max(50),
    city: Yup.string().required("City is required").max(30),
    state: Yup.string().required("State is required").max(30),
    address: Yup.string().max(50),
    phonenumber: Yup.string()
      .required("Phone# is required")
      .matches(phoneRegExp, "Phone# is not valid")
      .max(20),
    email: Yup.string()
      .required("Email is required")
      .matches(emailRegex, "Email is not valid")
      .max(30),
    zipcode: Yup.string().max(15),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // functions to build form returned by useForm() hook
  // const { register, handleSubmit, reset, setValue, getValues, formState } = useForm({
  //   resolver: yupResolver(validationSchema)
  // });

  // get functions to build form with useForm() hook
  const { register, handleSubmit, reset, setValue, getValues, formState } =
    useForm(formOptions);
  const { errors, isSubmitting } = formState;

  const createEntity = async (data) => {
    // citiesList.find((cty)=> {return })
    const payload = {
      ...data,
      stateid: data.state,
      companyid: data.companyname,
      title: data.firstname,
    };
    console.log("NG Create customer payload", payload);
    await dispatch(addCustomer(payload));
    props.setIsAddMode(false);
  };

  function updateEntity(customerId, data) {
    // update entity here
  }

  const onSubmit = (data) => {
    return isAddMode ? createEntity(data) : updateEntity(0, data);
  };

  useEffect(() => {
    dispatch(getStatesList());
    dispatch(getCitiesList());
    dispatch(getCompaniesList());

    if (!isAddMode) {
      console.log("NG This is EDIT mode !!!");
      // set default to state, city, companyname
      const formFields = [
        "firstname",
        "lastname",
        "address",
        "cityname",
        "zipcode",
        "phonenumber",
        "email",
      ];
      formFields.forEach((field) => {
        // stateid
        setValue(field, data[field]);
      });
      setValue("state", data["stateid"]);
      setValue("city", data["cityid"]);
      setValue("company", data["companyid"]);
    }
  }, []);

  return (
    <Modal
      isOpen={props.openModal}
      fullscreen={"lg"}
      size="lg"
      backdrop={"static"}
      // toggle={() => close()}
      // onClosed={() => close()}
    >
      <ModalHeader charCode="Y">
        <strong className="card-title-text">
          {!isAddMode
            ? `Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}`
            : `Add New ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}
        </strong>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Form onSubmit={handleSubmit(onSubmit)}>
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
                    className={`field-input placeholder-text form-control ${
                      errors?.companyname
                        ? "is-invalid error-text"
                        : "input-text"
                    }`}
                    {...register("companyname")}
                    value={getValues("company")}
                  >
                    <option key={0} value="">
                      Select company
                    </option>
                    {companiesList?.length > 0 &&
                      companiesList?.map((options) => (
                        <option key={options.id} value={options.id}>
                          {options.name}
                        </option>
                      ))}
                  </Input>
                  <div className="invalid-feedback">
                    {errors?.companyname?.message}
                  </div>
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
                    {...register("firstname")}
                    placeholder="First name..."
                    className={`field-input placeholder-text form-control ${
                      errors?.firstname ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.firstname?.message}
                  </div>
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
                    {...register("lastname")}
                    placeholder="Last name..."
                    className={`field-input placeholder-text form-control ${
                      errors?.lastname ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.lastname?.message}
                  </div>
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
                    {...register("email")}
                    placeholder="Email..."
                    className={`field-input placeholder-text form-control ${
                      errors?.email ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.email?.message}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="phonenumber">Phone</Label>
                  <Input
                    type="text"
                    name="phonenumber"
                    {...register("phonenumber")}
                    placeholder="phonenumber..."
                    className={`field-input placeholder-text form-control ${
                      errors?.phonenumber
                        ? "is-invalid error-text"
                        : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.phonenumber?.message}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <Input
                    type="text"
                    name="address"
                    {...register("address")}
                    placeholder="address..."
                    className={`field-input placeholder-text form-control ${
                      errors?.address ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.address?.message}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="city">
                    City
                    <span style={{ color: "red" }}>* </span>
                  </Label>
                  <input
                    type="text"
                    name="city"
                    {...register("city")}
                    placeholder="city..."
                    className={`field-input placeholder-text form-control ${
                      errors?.city ? "is-invalid error-text" : "input-text"
                    }`}
                    value={getValues("city")}
                  />
                  <div className="invalid-feedback">
                    {errors?.city?.message}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="state">State</Label>
                  <Input
                    type="select"
                    name="state"
                    placeholder="state..."
                    className={`field-input placeholder-text form-control ${
                      errors?.state ? "is-invalid error-text" : "input-text"
                    }`}
                    {...register("state")}
                    value={getValues("state")}
                  >
                    <option key={0} value="">
                      {" "}
                      Select state{" "}
                    </option>
                    {statesList?.length > 0 &&
                      statesList?.map((options) => (
                        <option key={options.id} value={options.id}>
                          {options.name}
                        </option>
                      ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="zipcode">Zip code</Label>
                  <Input
                    type="text"
                    name="zipcode"
                    {...register("zipcode")}
                    placeholder="zipcode..."
                    className={`field-input placeholder-text form-control ${
                      errors?.zipcode ? "is-invalid error-text" : "input-text"
                    }`}
                  />
                  <div className="invalid-feedback">
                    {errors?.zipcode?.message}
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Col></Col>
            <Button
              type="submit"
              color="primary"
              disabled={formState.isSubmitting}
            >
              {isAddMode ? "Submit" : "Update"}
            </Button>
          </Form>
        </Row>
      </ModalBody>
    </Modal>
  );
};
