import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";

import {
  addSubsidiary,
  editSubsidiary,
} from "_containers/admin/_redux/addCustomer.slice";
import AsyncSelect from "react-select/async";
import { getLocationFilter } from "_store";

import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  Button,
  ModalHeader,
  Modal,
  ModalBody,
  Input,
} from "reactstrap";
import InputMask from "react-input-mask";

export const AddEditSubsidary = (props) => {
  const dispatch = useDispatch();
  const companyDropdown = useSelector((state) => state.dropdown.companyList);
  const { openModal, isAddMode, data, onClose } = props;

  const [editData, setEditData] = useState(data);

  const [cityList, setCityList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [companyValidation, setCompanyValidation] = useState(false);
  const [subsidaryValidation, setSubsidaryValidation] = useState(false);

  const [locationValidation, setLocationValidation] = useState(false);
  const [countryValidation, setCountryValidation] = useState(false);

  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  useEffect(() => {
    let country_response;
    country_response = cityList.map(({ countryid: value, ...rest }) => {
      return {
        value,
        label: `${rest.countryname}`,
      };
    });

    let data = [];
    if (country_response.length > 0) {
      data = Array.from(new Set(country_response.map((item) => item.id))).map(
        (id) => {
          return country_response.find((item) => item.id === id);
        }
      );
      setCountryList(data);
    } else {
      setCountryList(data);
    }
  }, [cityList]);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  // form validation rules
  const validationSchema = Yup.object().shape({
    company: Yup.string().required("Company is required"),
    subsidary: Yup.string().required("Subsidary is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string(),
    aboutCompany: Yup.string().max(50),
    numOfEmployees: Yup.string(),
    phone: Yup.string(),
    email: Yup.string().matches(emailRegex, "Email is not valid"),
    zipcode: Yup.string(),
    countryid: Yup.string().required("Country is required"),
    address: Yup.string(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };

  // get functions to build form with useForm() hook
  const { register, formState, setValue } = useForm(formOptions);
  const { errors } = formState;

  const loadOptions = async function (inputValue) {
    const { data = [] } = await getLocationFilter(inputValue);
    setCityList(data);

    let filter_data = data.map(({ cityid: value, ...rest }) => {
      return {
        value,
        label: `${rest.location + ", " + rest.statename}`,
      };
    });

    return filter_data;
  };

  const handleInputChange = (event, check) => {
    let data = { ...editData };
    if (check === "company") {
      data.companyid = event.target.value;
      if (data.company === 0) {
        setCompanyValidation(true);
      } else {
        setCompanyValidation(false);
      }
    } else if (check === "subsidary") {
      data.subsidiaryname = event.target.value;
      if (data.subsidary === 0) {
        setSubsidaryValidation(true);
      } else {
        setSubsidaryValidation(false);
      }
    } else if (check === "description") {
      data.description = event.target.value;
    } else if (check === "numberOfEmployees") {
      data.noofemployees = parseInt(event.target.value);
    } else if (check === "location") {
      data.cityid = parseInt(event.value);
      data.stateid = String(
        cityList?.find((x) => x.cityid === parseInt(event.value))?.stateid
      );
      if (data.cityid === 0) {
        setLocationValidation(true);
      } else {
        setLocationValidation(false);
      }
    } else if (check === "country") {
      data.countryid = parseInt(event.value);

      if (data.countryid === 0) {
        setCountryValidation(true);
      } else {
        setCountryValidation(false);
      }
    } else if (check === "address") {
      data.address = event.target.value;
    } else if (check === "zipcode") {
      data.zipcode = event.target.value;
    }
    setEditData(data);
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
    setSuccess(false);
    setError(false);
    onClose();
  };

  const getValidation = (event) => {
    event.preventDefault();
    Number(event.target.elements.company.value) === 0
      ? setCompanyValidation(true)
      : setCompanyValidation(false);
    event.target.elements.city.value === ""
      ? setLocationValidation(true)
      : setLocationValidation(false);
    event.target.elements.subsidary.value === ""
      ? setSubsidaryValidation(true)
      : setSubsidaryValidation(false);

    event.target.elements.countryid.value === ""
      ? setCountryValidation(true)
      : setCountryValidation(false);
    if (
      event.target.elements.company.value !== "" &&
      event.target.elements.city.value !== "" &&
      event.target.elements.countryid.value !== ""
    ) {
      onSubmit();
    }
  };

  const onSubmit = async () => {
    let payload = {
      subsidiaryid: 0,
      companyid: Number(editData.companyid),
      subsidiaryname: editData.subsidiaryname,
      address: editData.address,
      zipcode: editData.zipcode,
      cityid: Number(editData.cityid),
      stateid: Number(editData.stateid),
      countryid: Number(editData.countryid),
      isactive: true,
      currentuserid: Number(
        JSON.parse(localStorage.getItem("userDetails"))?.UserId
      ),
    };
    let response;
    if (isAddMode) {
      response = await dispatch(addSubsidiary({ payload }));
    } else {
      payload.subsidiaryid = editData.subsidiaryid;
      let id = editData.subsidiaryid;
      response = await dispatch(editSubsidiary({ id, payload }));
    }

    if (response.payload) {
      setSuccess(true);
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
    } else {
      setError(true);
      showSweetAlert({
        title: "Something went wrong, please try again later",
        type: "warning",
      });
    }
  };

  return (
    <Modal
      isOpen={openModal}
      fullscreen={"lg"}
      size="lg"
      backdrop={"static"}
      toggle={() => onClose()}
      onClosed={() => onClose()}
    >
      <ModalHeader toggle={() => onClose()}>
        <strong className="card-title-text">
          {isAddMode ? "Add New Subsidiary" : "Edit Subsidiary"}
        </strong>
      </ModalHeader>
      <ModalBody>
        <Row>
          <Form onSubmit={(e) => getValidation(e)}>
            <Row>
              <Col md={6}>
                <FormGroup>
                  <Label for="company">
                    Company <span style={{ color: "red" }}>* </span>
                  </Label>
                  <Input
                    type="select"
                    name="company"
                    className={`field-input placeholder-text form-control ${
                      companyValidation ? "is-invalid error-text" : "input-text"
                    }`}
                    onChange={(e) => handleInputChange(e, "company")}
                  >
                    <option value={0}>All companies</option>
                    {companyDropdown?.length > 0 &&
                      companyDropdown?.map((options) => (
                        <option
                          selected={options.companyid === editData.companyid}
                          key={options.companyid}
                          value={options.companyid}
                        >
                          {" "}
                          {options.companyname}{" "}
                        </option>
                      ))}
                  </Input>

                  <div className="invalid-feedback">
                    {companyValidation ? "Company is required" : ""}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="subsidary">
                    Subsidiary <span style={{ color: "red" }}>* </span>
                  </Label>
                  <input
                    type="text"
                    name="subsidary"
                    defaultValue={isAddMode ? "" : data?.subsidiaryname}
                    onInput={(e) => handleInputChange(e, "subsidary")}
                    placeholder="Enter subsidiary"
                    className={`field-input placeholder-text form-control ${
                      subsidaryValidation
                        ? "is-invalid error-text"
                        : "input-text"
                    }`}
                    maxLength={50}
                  />
                  <div className="invalid-feedback">
                    {subsidaryValidation ? "Subsidiary is required" : ""}
                  </div>
                </FormGroup>
              </Col>
              <Col md={12}>
                <FormGroup>
                  <Label for="address">Address</Label>
                  <input
                    type="text"
                    name="address"
                    defaultValue={isAddMode ? "" : data?.address}
                    onInput={(e) => handleInputChange(e, "address")}
                    placeholder="Enter address"
                    maxLength={100}
                    className={`field-input placeholder-text form-control`}
                  />
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="city" className="fw-semi-bold">
                    City, State <span className="text-danger">*</span>
                  </Label>
                  <AsyncSelect
                    name="city"
                    placeholder="Search to select"
                    placeholderText="search"
                    loadOptions={loadOptions}
                    isMulti={false}
                    className={`placeholder-name ${
                      locationValidation ? "async-border-red" : "async-no-error"
                    }`}
                    {...register("city")}
                    onChange={(e) => handleInputChange(e, "location")}
                    defaultValue={
                      isAddMode
                        ? []
                        : {
                            value:
                              data?.cityid +
                              ", " +
                              data?.stateid +
                              ", " +
                              data?.cityname +
                              ", " +
                              data?.statename,
                            label: data?.cityname + ", " + data?.statename,
                          }
                    }
                  />
                  <div className="async-error-text">
                    {locationValidation ? "City, State is required" : ""}
                  </div>
                </FormGroup>
              </Col>
              <Col md={6}>
                <FormGroup>
                  <Label for="country" className="fw-semi-bold">
                    Country <span className="text-danger">*</span>
                  </Label>
                  <AsyncSelect
                    name="country"
                    placeholder="Select country"
                    placeholderText="search"
                    isMulti={false}
                    {...register("countryid")}
                    defaultOptions={countryList}
                    className={`placeholder-name ${
                      countryValidation ? "async-border-red" : "async-no-error"
                    }`}
                    onChange={(e) => handleInputChange(e, "country")}
                    // onMenuOpen={() => checkCityValid()}

                    defaultValue={
                      isAddMode
                        ? []
                        : {
                            value: 1,
                            label: data?.countryname,
                          }
                    }
                  />
                  <div className="async-error-text">
                    {countryValidation ? "Country is required" : ""}
                  </div>
                </FormGroup>
              </Col>

              <Col md={6}>
                <FormGroup>
                  <Label for="zipcode">Zip code</Label>
                  <InputMask
                    mask="99999"
                    type="text"
                    name="zipcode"
                    maxLength={50}
                    onInput={(e) => handleInputChange(e, "zipcode")}
                    placeholder="Enter zipcode"
                    defaultValue={isAddMode ? "" : data?.zipcode}
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
              className="mt-3 float-end"
              type="submit"
              color="primary"
              disabled={formState.isSubmitting}
            >
              {/* {isAddMode ? "Submit" : "Update"} */}
              Submit
            </Button>
          </Form>
        </Row>
      </ModalBody>
      {success && (
        <>
          {" "}
          <SweetAlert
            title={showAlert.title}
            show={showAlert.show}
            type={showAlert.type}
            onConfirm={() => closeSweetAlert()}
          />
          {showAlert.description}
        </>
      )}

      {error && (
        <>
          {" "}
          <SweetAlert
            title={showAlert.title}
            show={showAlert.show}
            type={showAlert.type}
            onConfirm={() => setError(false)}
          />
          {showAlert.description}
        </>
      )}
    </Modal>
  );
};
