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
  FormText,
  InputGroupText,
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
import SweetAlert from "react-bootstrap-sweetalert";
import Payment from "payment";
import { history } from "_helpers";
import { Link } from "react-router-dom";
import "./payment.scss";

export const PaymentDetails = ({
  isAdmin = false,
  selectedCustomer = {},
  onClose,
  authUser,
}) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [companyValue, setCompanyValue] = useState(0);
  const [currencyValue, setCurrencyValue] = useState(1);
  const [sameAsCust, setSameAsCust] = useState(false);
  const [cityList, setCityList] = useState([]);

  const [countryList, setCountryList] = useState([]);
  const [countryValue, setCountryValue] = useState("");
  const [cityValue, setCityValue] = useState("");
  const [cityReqError, setCityReqError] = useState(false);
  const [issuer, setIssuer] = useState("unknown");
  const [cardnumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCVV] = useState("");
  const [name, setName] = useState("");
  const [cardholder, setCardHolder] = useState("");
  const [cardholderErr, setCardHolderErr] = useState(false);
  const [cardNumberErr, setCardNumberErr] = useState(false);
  const [expiryErr, setExpiryErr] = useState(false);
  const [invalidExp, setInvalidExp] = useState(false);
  const [cvvErr, setCVVErr] = useState(false);
  const [validCard, setValidCard] = useState(false);
  const [deletedCard, setDeletedCard] = useState(false);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const companyDropdown = useSelector((state) => state.dropdown.companyList);
  const userDetails = useSelector((state) => state.payment.userDetails);
  const currencyType = useSelector((state) => state.payment.currencyType);
  const billingDetails = useSelector((state) => state.payment.billingDetails);
  const cardType = useSelector((state) => state.payment.cardType);
  const schema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
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
    address: Yup.string().required("Address is required"),
    // cardnumber: Yup.string().required("Card number is required"),
    // expiry: Yup.string().required("Expiry date is required"),
    // cvv: Yup.string().required("Security code is required"),
  });

  const { register, handleSubmit, formState, setValue, getValues } = useForm({
    resolver: yupResolver(schema),
  });
  const { errors } = formState;

  useEffect(() => {
    dispatch(paymentActions.clearUserData());
    dispatch(dropdownActions.getCompanyListPublicThunk());
    dispatch(paymentActions.getpaymentCurrencyType());
    dispatch(paymentActions.getCardTypeDrpDwn());

    return () => {
      dispatch(paymentActions.clearBillingData());
      dispatch(paymentActions.clearUserData());
    };
    setValue("currency", 1);
  }, []);

  useEffect(() => {
    if (id && sameAsCust) {
      dispatch(paymentActions.getCustomerUserDetails(id));
    }
  }, [id, sameAsCust]);
  useEffect(() => {
    if (userDetails?.customerid) {
      setDetails(userDetails);
      if (userDetails?.billingdetailstatus && (authUser || isAdmin)) {
        dispatch(paymentActions.getBillingDetails(userDetails?.customerid));
      }
    }
  }, [userDetails]);

  useEffect(() => {
    if (selectedCustomer?.customerid) {
      dispatch(paymentActions.updateUserDetails(selectedCustomer));
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (billingDetails?.billingdetailid) {
      setCardData(billingDetails);
    }
  }, [billingDetails]);
  const setCardData = (billingDetails) => {
    // setCardNumber(formatCreditCardNumber(billingDetails?.creditcardnumber));
    setCardNumber(billingDetails?.creditcardnumber);
    setExpiry(formatExpirationDate(billingDetails?.expirydate));
    // setCVV(formatCVC(billingDetails?.securitycode));
    setCVV(billingDetails?.securitycode);
    setCardHolder(billingDetails?.cardholdername);
  };
  const setDetails = (userDetails) => {
    setValue("name", userDetails.firstname + " " + userDetails.lastname);
    setValue("companyid", String(userDetails.companyid));
    setCompanyValue(userDetails.companyid);
    setValue("email", userDetails.email);
    setValue("phoneNumber", userDetails.phonenumber);
    setValue("zipcode", userDetails.zipcode);
    // let cityData = [
    //   // {
    //   {
    //     value: userDetails.cityid,
    //     label: `${userDetails.cityname + ", " + userDetails.statename}`,
    //   },
    //   //   cityid: userDetails.cityid,
    //   //   countryid: userDetails.countryid,
    //   //   countryname: userDetails.countryname,
    //   //   location: userDetails.cityname,
    //   //   stateid: userDetails.stateid,
    //   //   statename: userDetails.statename,
    //   //   zipcode: null,
    //   // },
    // ];
    // setDefaultCityList(cityData);

    // let countryData = [
    //   {
    //     value: userDetails.countryid,
    //     label: userDetails.countryname,
    //   },
    // ];
    // setCountryList(countryData);
    setValue("currency", 1);
    setCurrencyValue(1);

    setValue("cityid", String(userDetails.cityid));
    setCityValue({
      value: userDetails.cityid,
      label: `${userDetails.cityname + ", " + userDetails.statename}`,
    });
    setValue("stateid", userDetails.stateid);
    setValue("countryid", String(userDetails.countryid));
    setCountryValue({
      value: userDetails.countryid,
      label: `${userDetails.countryname}`,
    });
  };
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

      setCountryValue(data[0]);
      setValue("countryid", String(data[0].value));
      setCountryList(data);
    } else {
      if (data.length > 0) {
        setCountryValue(data[0]);
        setValue("countryid", String(data[0].value));
      }

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
    // setDefaultCityList(filter_data);
    return filter_data;
  };

  const setAsyncSelectValue = (data) => {
    console.log(data);
    setValue("cityid", String(data.value));
    setCityValue(data);
    let state = String(cityList?.find((x) => x.cityid === data.value)?.stateid);
    setValue("stateid", state);
  };

  const setCardDetails = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else if (e.target.name === "cardnumber") {
      setCardNumberErr(e.target.value === "");
      setCardNumber(formatCreditCardNumber(e.target.value));
    } else if (e.target.name === "expiry") {
      let exp = formatExpirationDate(e.target.value);
      setInvalidExp(!Payment.fns.validateCardExpiry(exp));
      setExpiryErr(e.target.value === "");
      setExpiry(formatExpirationDate(exp));
    } else if (e.target.name === "cvv") {
      setCVVErr(e.target.value === "");
      setCVV(formatCVC(e.target.value));
    } else if (e.target.name === "cardholder") {
      setCardHolderErr(e.target.value === "");
      setCardHolder(e.target.value);
    }
  };

  const onSelectCountryDropdown = (data) => {
    setCountryValue(data);
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
    setIssuer(issuer);
    console.log(issuer);
    setValidCard(isValid);
  };
  const onSameCustomer = (e) => {
    setSameAsCust(e.target.checked);
    if (!e.target.checked) {
      setValue("name", "");
      setValue("companyid", "");
      setCompanyValue("");
      setValue("email", "");
      setValue("phoneNumber", "");
      setValue("zipcode", "");
      setValue("cityid", "");
      setCityValue("");
      setValue("stateid", "");
      setValue("countryid", "");
      setCountryValue("");
    }
  };

  const onSubmit = async (formData) => {
    if (
      cardnumber === "" ||
      cvv === "" ||
      expiry === "" ||
      invalidExp ||
      !validCard ||
      cardholder === ""
    ) {
      if (!validCard) {
        showSweetAlert({
          title: "Please enter valid card details.",
          type: "error",
        });
      }
      setCardNumberErr(cardnumber === "");
      setCVVErr(cvv === "");
      setExpiryErr(expiry === "");
      setCardHolderErr(cardholder === "");
      return;
    }
    let cardTypeNumber = 0;

    if (cardType.length > 0) {
      await cardType.map((data) => {
        if (data.name.toLowerCase() === issuer.replaceAll("-", " ")) {
          cardTypeNumber = data.id;
        }
      });
    }

    let payload = {
      billingdetailid: 0,
      customerid: userDetails?.customerid ? userDetails.customerid : id,
      name: formData.name,
      phonenumber: formData.phoneNumber,
      companyid: formData.companyid,
      email: formData.email,
      address: formData.address,
      cityid: formData.cityid,
      stateid: formData.stateid,
      zipcode: formData.zipcode,
      countryid: formData.countryid,
      currencyid: formData.currency,
      creditcardtypeid: cardTypeNumber,
      creditcardnumber: cardnumber,
      expirydate: expiry,
      securitycode: cvv,
      currentUserId: localStorage.getItem("userId")
        ? Number(localStorage.getItem("userId"))
        : 0,
      cardholdername: cardholder,
    };

    let response = await dispatch(
      paymentActions.postPaymentBillingDetails(payload)
    );

    if (!response.payload) {
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    } else {
      setDeletedCard(false);
      if (authUser) {
        dispatch(paymentActions.updateShowBilling(true));
      }
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
    }
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    if (isAdmin && !deletedCard) {
      onClose();
    }
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
  };

  const navigateToLogin = () => {
    if (!isAdmin && !deletedCard) {
      history.navigate("/login");
    } else {
      if (isAdmin && !deletedCard) {
        onClose();
      }
    }
    closeSweetAlert();
  };

  const onDeleteCard = async () => {
    let response = await dispatch(
      paymentActions.deleteBillingDetails(billingDetails.billingdetailid)
    );

    if (!response.payload) {
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    } else {
      setDeletedCard(true);
      dispatch(paymentActions.updateShowBilling(false));
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
      let data = { ...userDetails };
      data.billingdetailstatus = false;
      setCardNumber("");
      setExpiry("");
      setCVV("");
      setCardHolder("");
      setCardHolderErr(false);
      setExpiryErr(false);
      setCVVErr(false);
      setCardNumberErr(false);
      dispatch(paymentActions.updateUserDetails(data));
    }
  };

  return (
    <Row>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* onSubmit={handleSubmit(onSubmit)} */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <h3 className="mt-2 pay-title">Billing Contact</h3>
        </Col>
        {isAdmin ? <hr /> : <></>}
        {!isAdmin ? (
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <Input
                type="checkbox"
                onChange={(e) => onSameCustomer(e)}
              ></Input>
              <Label className="ms-1 same-as-cust">Same as employer</Label>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <span className="sub-text">
                If this box is checked, pre-populate the data from the Employer
                details
              </span>
            </Col>
          </>
        ) : (
          <></>
        )}
        <Row>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={authUser ? 3 : 6}
            xxl={authUser ? 3 : 6}
          >
            <FormGroup>
              <Label for="name" className="input-label">
                Name <span className="text-danger">*</span>
              </Label>
              <InputGroup>
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
              </InputGroup>
            </FormGroup>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={authUser ? 3 : 6}
            xxl={authUser ? 3 : 6}
          >
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
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={authUser ? 3 : 6}
            xxl={authUser ? 3 : 6}
          >
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
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={authUser ? 3 : 6}
            xxl={authUser ? 3 : 6}
          >
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
              <Label for="address" className="input-label">
                Address <span className="text-danger">*</span>
              </Label>

              <InputGroup>
                <input
                  placeholder="Add address"
                  type="textarea"
                  name="address"
                  id="address"
                  {...register("address")}
                  className={`form-control placeholder-name ${
                    errors.address ? "is-invalid" : ""
                  }`}
                  // maxLength={20}
                />

                <FormFeedback>{errors.address?.message}</FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={authUser ? 3 : 6}
            xxl={authUser ? 3 : 6}
          >
            <FormGroup>
              <Label for="city" className="fw-semi-bold">
                City, State <span className="text-danger">* </span>
              </Label>
              <AsyncSelect
                name="city"
                placeholder="Search to Select"
                placeholderText="search"
                loadOptions={loadOptions}
                isMulti={false}
                value={cityValue}
                className={`placeholder-name ${
                  errors.cityid && !cityValue?.value
                    ? "async-border-red"
                    : "async-no-error"
                }`}
                {...register("cityid")}
                onChange={(e) => setAsyncSelectValue(e)}
              />
              <div className="async-error-text">
                {errors.cityid && !cityValue?.value
                  ? "City, State is required"
                  : ""}
              </div>
            </FormGroup>
          </Col>
          <Col
            xs={12}
            sm={12}
            md={12}
            lg={6}
            xl={authUser ? 3 : 6}
            xxl={authUser ? 3 : 6}
          >
            <FormGroup>
              <Label for="zipcode" className="input-label">
                Zip Code <span className="text-danger">*</span>
              </Label>
              <InputGroup>
                <InputMask
                  type="text"
                  mask="99999"
                  name="zipcode"
                  id="zipcode"
                  placeholder="Enter Zip Code"
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
                value={countryValue}
                className={`placeholder-name ${
                  errors.countryid && !countryValue?.value
                    ? "async-border-red"
                    : ""
                }`}
                {...register("countryid")}
                defaultOptions={countryList}
                onChange={(e) => onSelectCountryDropdown(e)}
                onMenuOpen={() => checkCityValid()}
              />
              <div className="async-error-text">
                {errors.countryid && !countryValue?.value
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
        {isAdmin ? <hr /> : <></>}
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <img
            src={paymentIcons.master}
            alt="payment master card"
            className={"me-2"}
            width={32}
            height={22}
          ></img>
          <img
            src={paymentIcons.amex}
            alt="payment amex card"
            className={"me-2"}
            width={32}
            height={22}
          ></img>
          <img
            src={paymentIcons.visa}
            alt="payment visa card"
            className={"me-2"}
            width={32}
            height={22}
          ></img>
          <img
            src={paymentIcons.discover}
            alt="payment discover card"
            className={"me-2"}
            width={32}
            height={22}
          ></img>
        </Col>
        <Row>
          <Col xs={12} sm={12} md={12} lg={6} xl={4} xxl={4}>
            <FormGroup>
              <Label for="cardnumber" className="input-label">
                Card Number <span className="text-danger">*</span>
              </Label>
              <InputGroup>
                <InputGroupText>
                  {issuer === "unknown" ? (
                    <img
                      src={paymentIcons.card}
                      alt="payment card"
                      width={32}
                      height={22}
                    ></img>
                  ) : (
                    <></>
                  )}
                  {issuer === "mastercard" ? (
                    <img
                      src={paymentIcons.master}
                      alt="payment master card"
                      width={32}
                      height={22}
                    ></img>
                  ) : (
                    <></>
                  )}
                  {issuer === "american-express" ? (
                    <img
                      src={paymentIcons.amex}
                      alt="payment amex card"
                      width={32}
                      height={22}
                    ></img>
                  ) : (
                    <></>
                  )}
                  {issuer === "visa" ? (
                    <img
                      src={paymentIcons.visa}
                      alt="payment visa card"
                      width={32}
                      height={22}
                    ></img>
                  ) : (
                    <></>
                  )}
                  {issuer === "discover" ? (
                    <img
                      src={paymentIcons.discover}
                      alt="payment discover card"
                      className={"me-2"}
                      width={32}
                      height={22}
                    ></img>
                  ) : (
                    <></>
                  )}
                </InputGroupText>
                <Input
                  type="tel"
                  name="cardnumber"
                  id={"cardnumber"}
                  className={`form-control placeholder-name ${
                    cardNumberErr || (!validCard && cardnumber !== "")
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Card Number"
                  pattern="[\d| ]{16,22}"
                  value={cardnumber}
                  onChange={(e) => setCardDetails(e)}
                />

                <FormFeedback>
                  {cardNumberErr
                    ? "Card number is required"
                    : !validCard && cardnumber !== ""
                    ? "Invalid card number"
                    : ""}
                </FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={3} xl={2} xxl={2}>
            <FormGroup>
              <Label for="expiry" className="input-label">
                Expiry Date <span className="text-danger">*</span>
              </Label>

              <InputGroup>
                <input
                  type="tel"
                  name="expiry"
                  id="expiry"
                  className={`form-control placeholder-name ${
                    expiryErr || invalidExp ? "is-invalid" : ""
                  }`}
                  placeholder="MM/YY"
                  pattern="\d\d/\d\d"
                  value={expiry}
                  onChange={(e) => setCardDetails(e)}
                />
                <FormFeedback>
                  {expiryErr || invalidExp
                    ? invalidExp
                      ? "Invalid Expiry"
                      : "Expiry is required"
                    : ""}
                </FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={3} xl={2} xxl={2}>
            <FormGroup>
              <Label for="cvv" className="input-label">
                CVV <span className="text-danger">*</span>
              </Label>

              <InputGroup>
                <input
                  type="password"
                  name="cvv"
                  id="cvv"
                  className={`form-control placeholder-name ${
                    cvvErr ? "is-invalid" : ""
                  }`}
                  placeholder="CVV"
                  pattern="\d{3,4}"
                  value={cvv}
                  data-inputmask="****"
                  onChange={(e) => setCardDetails(e)}
                />
                <FormFeedback>{cvvErr ? "CVV is required" : ""}</FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={6} xl={4} xxl={4}>
            <FormGroup>
              <Label for="cardnumber" className="input-label">
                Cardholder Name <span className="text-danger">*</span>
              </Label>
              <InputGroup>
                <Input
                  type="text"
                  name="cardholder"
                  id={"cardholder"}
                  className={`form-control placeholder-name ${
                    cardholderErr ? "is-invalid" : ""
                  }`}
                  placeholder="Enter Cardholder Name"
                  value={cardholder}
                  onChange={(e) => setCardDetails(e)}
                  maxLength={50}
                />

                <FormFeedback>
                  {cardholderErr ? "Cardholder name is required" : ""}
                </FormFeedback>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
            {validCard ? (
              <FormText color="success">Valid Card</FormText>
            ) : (
              <></>
            )}
          </Col>
        </Row>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <span className="sub-text">
            Note: No charges will be made to the payment method until services
            are delivered.
          </span>
        </Col>
        {isAdmin ? <hr /> : <></>}
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          xxl={12}
          style={{ textAlign: "end" }}
        >
          {" "}
          {userDetails?.billingdetailstatus ? (
            <Button
              type="cancel"
              color="danger"
              outline
              className="btn-text me-2"
              onClick={(e) => {
                onDeleteCard();
                e.preventDefault();
              }}
            >
              Delete
            </Button>
          ) : (
            <></>
          )}
          {!isAdmin && !authUser ? (
            <Link
              to="/login"
              className="me-2"
              style={{ borderBottom: "1px solid #545cd8" }}
            >
              Return to Sign In Page
            </Link>
          ) : (
            <>
              {" "}
              <Button
                type="cancel"
                color="primary"
                outline
                className="btn-text"
                onClick={(e) => {
                  onClose();
                  e.preventDefault();
                }}
              >
                Cancel
              </Button>
            </>
          )}
          {!userDetails?.billingdetailstatus ? (
            <Button color="primary" type="submit" className="btn-text ms-2">
              {!isAdmin && !authUser ? "Agreed & Submit" : "Save"}
            </Button>
          ) : (
            <></>
          )}
        </Col>
      </Form>
      <div style={{ display: "none" }}>
        <Cards
          number={cardnumber ? cardnumber.replaceAll(" ", "") : ""}
          expiry={expiry}
          cvc={cvv}
          name={name}
          callback={({ issuer }, isValid) => handleCallback(issuer, isValid)}
        />
      </div>
      <>
        {" "}
        <SweetAlert
          showCancel
          showConfirm={showAlert.type === "success"}
          title={showAlert.title}
          show={showAlert.show}
          confirmBtnText="Ok"
          confirmBtnBsStyle="primary"
          cancelBtnBsStyle="dark"
          type={showAlert.type}
          onConfirm={() => navigateToLogin()}
          onCancel={() => closeSweetAlert()}
          focusCancelBtn
        />
        {showAlert.description}
      </>
    </Row>
  );
};
