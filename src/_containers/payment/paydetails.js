import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Label,
  Button,
  FormGroup,
  Form,
  FormFeedback,
  InputGroup,
} from "reactstrap";
import InputMask from "react-input-mask";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import { dropdownActions, getLocationFilter, paymentActions } from "_store";
import AsyncSelect from "react-select/async";
import Cards from "react-credit-cards-2";
import paymentIcons from "assets/utils/images/payment";
import {
  formatCreditCardNumber,
  formatExpirationDate,
  formatCVC,
} from "./paymenthelper";
import { useParams } from "react-router-dom";
import "./payment.scss";

export const PaymentDetails = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [companyValue, setCompanyValue] = useState(0);
  const [currencyValue, setCurrencyValue] = useState(1);
  const [sameAsCust, setSameAsCust] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [countryList, setCountryList] = useState([]);
  const [countryValue, setCountryValue] = useState(0);
  const [cityValue, setCityValue] = useState(0);
  const [cityReqError, setCityReqError] = useState(false);
  const [issuer, setIssuer] = useState("unknown");
  const [cardnumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");
  const [name, setName] = useState("");

  const companyDropdown = useSelector((state) => state.dropdown.companyList);
  const userDetails = useSelector((state) => state.payment.userDetails);
  const currencyType = useSelector((state) => state.payment.currencyType);

  const schema = Yup.object().shape({
    name: Yup.string()
      .required("First name is required")
      .matches(/^[A-Za-z ]*$/, "Please enter valid name"),
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        "Please enter valid email"
      ),
    phoneNumber: Yup.string().required("Phone number is required"),
    companyid: Yup.string().required("Company is required"),
    cityid: Yup.string().required("City, State is required"),
    stateid: Yup.string(),
    zipcode: Yup.string().required("Zip code is required"),
    countryid: Yup.string().required("Country is required"),
    currency: Yup.string().required("Currency is required"),
    // cardnumber: Yup.string().required("Card number is required"),
    // expiry: Yup.string().required("Expiry date is required"),
    // cvv: Yup.string().required("Security code is required"),
  });

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  useEffect(() => {
    dispatch(dropdownActions.getCompanyListPublicThunk());
    dispatch(paymentActions.getpaymentCurrencyType());
  }, []);

  useEffect(() => {
    if (id && sameAsCust) {
      dispatch(paymentActions.getCustomerUserDetails(id));
    }
  }, [id, sameAsCust]);
  useEffect(() => {
    if (userDetails?.customerid) {
      setValue("name", userDetails.firstname + " " + userDetails.lastname);
      setValue("companyid", String(userDetails.companyid));
      setCompanyValue(userDetails.companyid);
      setValue("email", userDetails.email);
      setValue("phoneNumber", userDetails.phonenumber);
      setValue("zipcode", userDetails.zipcode);
      // setValue("cityid", userDetails.cityid);
      // setValue("stateid", userDetails.stateid);
      // setValue("countryid", userDetails.countryid);

      setValue("currency", 1);
      setCurrencyValue(1);
    }
  }, [userDetails]);
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

  const onSelectCompanyDropdown = (data) => {
    setCompanyValue(data);
    setValue("companyid", String(data));
  };

  const onSelectCurrencyDropdown = (data) => {
    setCurrencyValue(data);
    setValue("currency", data);
  };

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

  const setAsyncSelectValue = (data) => {
    setValue("cityid", String(data.value));
    setCityValue(data.value);
    let state = String(cityList?.find((x) => x.cityid === data.value)?.stateid);
    setValue("stateid", state);
  };

  const setCardDetails = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "cardnumber") {
      setCardNumber(formatCreditCardNumber(e.target.value));
    } else if (e.target.name === "expiry") {
      setExpiry(formatExpirationDate(e.target.value));
    } else if (e.target.name === "cvv") {
      setCVV(formatCVC(e.target.value));
    }
  };

  const onSelectCountryDropdown = (data) => {
    setCountryValue(data.value);
    setValue("countryid", String(data.value));
  };

  const checkCityValid = function () {
    if (cityList?.length === 0) {
      setCityReqError(true);
    } else {
      setCityReqError(false);
    }
  };

  const handleCallback = (issuer, isValid) => {
    // if (isValid) {
    setIssuer(issuer);
    // }
  };
  const onSameCustomer = (e) => {
    setSameAsCust(e.target.checked);
  };

  const onSubmit = async (formData) => {
    let payload = {
      billingdetailid: 0,
      customerid: id,
      name: formData.name,
      phonenumber: formData.phoneNumber,
      companyid: formData.companyid,
      email: formData.email,
      address: "",
      cityid: formData.cityid,
      stateid: formData.stateid,
      zipcode: formData.zipcode,
      countryid: formData.countryid,
      currencyid: formData.currency,
      creditcardtypeid: 0,
      creditcardnumber: "string",
      expirydate: "string",
      securitycode: "string",
      currentUserId: 0,
    };
  };
  return (
    <Row>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <h3 className="mt-2 pay-title">Billing Contact</h3>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <Input
            disabled={sameAsCust}
            type="checkbox"
            onChange={(e) => onSameCustomer(e)}
          ></Input>
          <Label className="ms-1 same-as-cust">Same as customer</Label>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <span className="sub-text">
            If this box is checked, pre-populate the data from the Customer
            details
          </span>
        </Col>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="firstName" className="input-label">
                Name <span className="text-danger">*</span>
              </Label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter Name"
                {...register("name")}
                className={`form-control placeholder-name ${
                  errors.name ? "is-invalid" : ""
                }`}
                maxLength={50}
                onChange={(e) => setCardDetails(e)}
              />
              <FormFeedback>{errors.name?.message}</FormFeedback>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="companyid" className="input-label">
                Company <span className="text-danger">*</span>
              </Label>
              <Input
                type="select"
                name="companyid"
                {...register("companyid")}
                value={companyValue}
                className={`form-control placeholder-name ${
                  errors.companyid && companyValue === 0 ? "is-invalid" : ""
                }`}
                onChange={(e) => onSelectCompanyDropdown(e.target.value)}
              >
                <option value={0}>Select Company</option>
                {companyDropdown?.length > 0 &&
                  companyDropdown?.map((options) => (
                    <option key={options.companyid} value={options.companyid}>
                      {" "}
                      {options.companyname}{" "}
                    </option>
                  ))}
              </Input>
              <FormFeedback>
                {errors.companyid && companyValue === 0
                  ? errors.companyid.message
                  : ""}
              </FormFeedback>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="email" className="input-label">
                Email <span className="text-danger">*</span>
              </Label>
              <InputGroup>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Enter Email"
                  {...register("email")}
                  className={`form-control placeholder-name ${
                    errors.email ? "is-invalid" : ""
                  }`}
                  autoComplete="off"
                  maxLength={70}
                />
                <FormFeedback>{errors.email?.message}</FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="phoneNumber" className="input-label">
                Phone <span className="text-danger">*</span>
              </Label>

              <InputGroup>
                <InputMask
                  placeholder="Enter Phone Number"
                  type="text"
                  mask="(999)-999-9999"
                  name="phoneNumber"
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  className={`form-control placeholder-name ${
                    errors.phoneNumber ? "is-invalid" : ""
                  }`}
                  // maxLength={20}
                />

                <FormFeedback>{errors.phoneNumber?.message}</FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                City, State <span className="text-danger">* </span>
              </Label>
              <AsyncSelect
                name="city"
                placeholder="Search to select"
                placeholderText="search"
                loadOptions={loadOptions}
                isMulti={false}
                className={`placeholder-name ${
                  errors.cityid && cityValue === 0
                    ? "async-border-red"
                    : "async-no-error"
                }`}
                {...register("cityid")}
                onChange={(e) => setAsyncSelectValue(e)}
              />
              <div className="async-error-text">
                {errors.cityid && cityValue === 0
                  ? "City, State is required"
                  : ""}
              </div>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="zipcode" className="input-label">
                Zip code <span className="text-danger">*</span>
              </Label>
              <InputGroup>
                <InputMask
                  type="text"
                  mask="99999"
                  name="zipcode"
                  id="zipcode"
                  placeholder="Enter Company Zipcode"
                  {...register("zipcode")}
                  className={`form-control placeholder-name ${
                    errors.zipcode ? "is-invalid" : ""
                  }`}
                  autoComplete="off"
                />
                <FormFeedback>{errors.zipcode?.message}</FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="country" className="fw-semi-bold">
                Country <span className="text-danger">* </span>
              </Label>
              <AsyncSelect
                name="country"
                placeholder="Select Country"
                placeholderText="search"
                isMulti={false}
                className={`placeholder-name ${
                  errors.countryid && countryValue === 0
                    ? "async-border-red"
                    : ""
                }`}
                {...register("countryid")}
                defaultOptions={countryList}
                onChange={(e) => onSelectCountryDropdown(e)}
                onMenuOpen={() => checkCityValid()}
              />
              <div className="async-error-text">
                {errors.countryid && countryValue === 0
                  ? "Country is required"
                  : ""}
              </div>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="companyzip" className="input-label">
                Currency <span className="text-danger">*</span>
              </Label>

              <Input
                type="select"
                name="currency"
                id="currency"
                placeholder="Select Currency"
                {...register("currency")}
                className={`form-control placeholder-name ${
                  errors.currency && currencyValue === 0 ? "is-invalid" : ""
                }`}
                autoComplete="off"
                onChange={(e) => onSelectCurrencyDropdown(e.target.value)}
              >
                {" "}
                {currencyType?.length > 0 &&
                  currencyType?.map((options) => (
                    <option key={options.id} value={options.id}>
                      {" "}
                      {options.name}{" "}
                    </option>
                  ))}
              </Input>
              <FormFeedback>
                {errors.currency && currencyValue === 0
                  ? errors.currency.message
                  : ""}
              </FormFeedback>
            </FormGroup>
          </Col>
        </Row>

        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <h3 className="mt-2 pay-title">Payment Details</h3>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <img
            src={paymentIcons.card}
            alt="payment card"
            className={issuer === "unknown" ? "card-border me-2" : "me-2"}
            width={32}
            height={22}
          ></img>
          <img
            src={paymentIcons.master}
            alt="payment master card"
            className={issuer === "mastercard" ? "card-border me-2" : "me-2"}
            width={32}
            height={22}
          ></img>
          <img
            src={paymentIcons.amex}
            alt="payment amex card"
            className={
              issuer === "american-express" ? "card-border me-2" : "me-2"
            }
            width={32}
            height={22}
          ></img>
          <img
            src={paymentIcons.visa}
            alt="payment visa card"
            className={issuer === "visa" ? "card-border me-2" : "me-2"}
            width={32}
            height={22}
          ></img>
          <img
            src={paymentIcons.discover}
            alt="payment discover card"
            className={issuer === "discover" ? "card-border me-2" : "me-2"}
            width={32}
            height={22}
          ></img>
        </Col>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
            <FormGroup>
              <Label for="cardnumber" className="input-label">
                Card number <span className="text-danger">*</span>
              </Label>

              <InputGroup>
                {/* <InputMask
                  placeholder="Enter Card Number"
                  type="text"
                  mask="9999 9999 9999 9999"
                  name="cardnumber"
                  id="cardnumber"
                  {...register("cardnumber")}
                  className={`form-control placeholder-name ${
                    errors.cardnumber ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setCardDetails(e)}
                  // maxLength={20}
                /> */}
                <input
                  type="tel"
                  name="cardnumber"
                  id={"cardnumber"}
                  className="form-control"
                  placeholder="Card Number"
                  pattern="[\d| ]{16,22}"
                  required
                  value={cardnumber}
                  onChange={(e) => setCardDetails(e)}
                />

                {/* <FormFeedback>{errors.cardnumber?.message}</FormFeedback> */}
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
            <FormGroup>
              <Label for="expiry" className="input-label">
                Expiry date <span className="text-danger">*</span>
              </Label>

              <InputGroup>
                {/* <InputMask
                  placeholder="MM/YY"
                  mask="99/99"
                  type="text"
                  name="expiry"
                  id="expiry"
                  {...register("expiry")}
                  className={`form-control placeholder-name ${
                    errors.expiry ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setCardDetails(e)}
                  // maxLength={20}
                /> */}
                <input
                  type="tel"
                  name="expiry"
                  id="expiry"
                  className="form-control"
                  placeholder="Valid Thru"
                  pattern="\d\d/\d\d"
                  required
                  value={expiry}
                  onChange={(e) => setCardDetails(e)}
                  // onFocus={this.handleInputFocus}
                />
                {/* <FormFeedback>{errors.expiry?.message}</FormFeedback> */}
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={3} xl={3} xxl={3}>
            <FormGroup>
              <Label for="cvv" className="input-label">
                Security code <span className="text-danger">*</span>
              </Label>

              <InputGroup>
                {/* <InputMask
                  placeholder="CVV"
                  type="text"
                  mask="9999"
                  name="cvv"
                  id="cvv"
                  {...register("cvv")}
                  className={`form-control placeholder-name ${
                    errors.cvv ? "is-invalid" : ""
                  }`}
                  onChange={(e) => setCardDetails(e)}
                  // maxLength={20}
                />

                <FormFeedback>{errors.cvv?.message}</FormFeedback> */}
                <input
                  type="tel"
                  name="cvv"
                  id="cvv"
                  className="form-control"
                  placeholder="CVC"
                  pattern="\d{3,4}"
                  required
                  value={cvv}
                  onChange={(e) => setCardDetails(e)}
                />
              </InputGroup>
            </FormGroup>
          </Col>
        </Row>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <span className="sub-text">
            Note: No charges will be made to the payment method until services
            are delivered.
          </span>
        </Col>
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          style={{ textAlign: "end" }}
        >
          <Button color="primary">Agreed & Submit</Button>
        </Col>
      </Form>
      <div style={{ display: "none" }}>
        <Cards
          number={cardnumber}
          expiry={expiry}
          cvc={cvv}
          name={name}
          callback={({ issuer }, isValid) => handleCallback(issuer, isValid)}
        />
      </div>
    </Row>
  );
};
