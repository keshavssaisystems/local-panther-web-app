import React, { useEffect, useState, useCallback } from "react";
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
import debounce from "lodash/debounce";
import "./payment.scss";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, CARD_MESSAGES, GENERAL_MESSAGES} from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
// import Squarepayment from "src/_containers/square-payment/squarepayment";
export const PaymentDetails = ({
  isCompanyBilling = false,
  isAdmin = false,
  selectedCustomer = {},
  onClose,
  authUser,
  userId = "",
  companyId = "",
}) => {
  const dispatch = useDispatch();

  let { id } = useParams();
  if (userId) {
    id = userId;
  }
  const [companyValue, setCompanyValue] = useState(0);
  const [currencyValue, setCurrencyValue] = useState(1);
  // const [sameAsCust, setSameAsCust] = useState(
  //   authUser ? authUser : userId ? true : selectedCustomer?.billingdetailstatus
  // );
  const [sameAsCust, setSameAsCust] = useState(
    true
  );

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
  const [disableSAC, setDisableSAC] = useState(false);
  const [zipCode, setZipCode] = useState("");
  const [disableCABillStat, setDisableCABillStat] = useState(false);
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

  const compBillingDetails = useSelector(
    (state) => state.payment.compBillingDetails
  );
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
    setValue("currency", 1);
    setValue("companyid", companyId);
    // setSameAsCust(
    //   selectedCustomer?.billingdetailstatus
    //     ? selectedCustomer?.billingdetailstatus
    //     : false
    // );
    return () => {
      dispatch(paymentActions.clearBillingData());
      dispatch(paymentActions.clearUserData());
    };
  }, []);

  useEffect(() => {
    if ((id || selectedCustomer?.customerid) && sameAsCust) {
      dispatch(
        paymentActions.getCustomerUserDetails(
          id || selectedCustomer?.customerid
        )
      );
    }
  }, [id, sameAsCust]);
  useEffect(() => {
    if (userDetails?.customerid && (!compBillingDetails || compBillingDetails?.length === 0) && (!billingDetails || billingDetails?.length === 0)) {
      setDetails(userDetails);
      setDisableSAC(userDetails?.billingdetailstatus);
      if (!userId && userDetails?.billingdetailstatus && (authUser || isAdmin)
      ) {
        dispatch(paymentActions.getBillingDetails(userDetails?.customerid));
      }
    }
  }, [userDetails]);

  useEffect(() => {
    if (selectedCustomer?.customerid && !userId) {
      setDisableSAC(selectedCustomer?.billingdetailstatus);
      if (selectedCustomer?.billingdetailstatus) {
        dispatch(paymentActions.updateUserDetails(selectedCustomer));
      }
    }
    if (selectedCustomer?.companyid && userId) {
      dispatch(
        paymentActions.getBillingDetailsByCompany(selectedCustomer?.companyid)
      );
    }
  }, [selectedCustomer]);

  useEffect(() => {
    if (billingDetails?.billingdetailid && isCompanyBilling === false) {
      setCardData(billingDetails);
    }
  }, [billingDetails]);

  useEffect(() => {
    if (compBillingDetails?.billingdetailid && isCompanyBilling === true) {
      setDisableCABillStat(compBillingDetails?.billingdetailid);
      setCardData(compBillingDetails);
    }
  }, [compBillingDetails]);

  const setCardData = (billingDetails) => {
    setSameAsCust(billingDetails?.issameashiringmanager ? billingDetails?.issameashiringmanager : false);
    setValue("name", billingDetails.name);
    setValue("companyid", String(billingDetails.companyid));
    setCompanyValue(billingDetails.companyid);
    setValue("email", billingDetails.email);
    setValue("address", billingDetails.address);
    setValue("phoneNumber", billingDetails.phonenumber);
    let cardnumber = "XXXX XXXX XXXX " + billingDetails?.creditcardnumber;
    setCardNumber(cardnumber);
    setCardNumberErr(false);
    setValidCard(true);
    setExpiry(formatExpirationDate(billingDetails?.expirydate));
    // setCVV(formatCVC(billingDetails?.securitycode));
    setCVV(billingDetails?.securitycode ? billingDetails?.securitycode : "***");
    setCardHolder(billingDetails?.cardholdername);
    setValue("address", billingDetails?.address);
    setValue("zipcode", billingDetails?.zipcode);
    setZipCode(billingDetails?.zipcode);

    setValue("cityid", String(billingDetails.cityid));
    setCityValue({
      value: billingDetails.cityid,
      label: `${billingDetails.cityname + ", " + billingDetails.statename}`,
    });
    setValue("stateid", billingDetails.stateid);
    setValue("countryid", String(billingDetails.countryid));
    setCountryValue({
      value: billingDetails.countryid,
      label: `${billingDetails.countryname}`,
    });
  };

  const setDetails = (userDetails) => {
    setValue("name", userDetails.firstname + " " + userDetails.lastname);
    setValue("companyid", String(userDetails.companyid));
    setCompanyValue(userDetails.companyid);
    setValue("email", userDetails.email);
    setValue("address", userDetails.address);
    setValue("phoneNumber", userDetails.phonenumber);
    setValue("zipcode", userDetails.zipcode);
    setZipCode(userDetails.zipcode);
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

  const loadOptionsDeb = useCallback(
    debounce((inputValue, callback) => {
      loadOptions(inputValue).then(callback);
    }, 500),
    [] // Important: memoize once!
  );

  const loadOptions = async function (inputValue) {
    const { data = [] } = await getLocationFilter(inputValue);
    setCityList(data);

    let filter_data = data.map(({ cityid: value, ...rest }) => {
      return {
        value,
        label: `${rest.location + ", " + rest.statename}`,
        zipcode: rest.zipcode,
      };
    });
    // setDefaultCityList(filter_data);
    return filter_data;
  };

  const setAsyncSelectValue = (data) => {
    setValue("cityid", String(data.value));
    setCityValue(data);
    let state = String(cityList?.find((x) => x.cityid === data.value)?.stateid);
    setValue("stateid", state);
    setValue("zipcode", data.zipcode?.[0] ? data.zipcode[0] : "");
    setZipCode(data.zipcode?.[0] ? data.zipcode[0] : "");
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

  const handleCallback = async (issuer, isValid) => {
    setIssuer(issuer);
    if (userDetails?.billingdetailstatus && !userId) {
      setValidCard(true);
    } else {
      let cardTypeNumber = 0;
      if (cardType.length > 0) {
        await cardType.map((data) => {
          if (data.name.toLowerCase() === issuer.replaceAll("-", " ")) {
            cardTypeNumber = data.id;
          }
        });
      }
      if (cardTypeNumber !== 0) {
        setValidCard(isValid);
      }
    }
  };
  const onSameCustomer = (e) => {
    setSameAsCust(e.target.checked);
    if (!e.target.checked) {
      clearFormData();
    }
  };

  const getZipLocationData = async function (inputValue) {
    setValue("zipcode", inputValue);
    setZipCode(inputValue);

    if (inputValue.length === 5) {
      const { data = [] } = await getLocationFilter(inputValue);
      setCityList(data);
      let filter_data = data.map(({ cityid: value, ...rest }) => {
        return {
          value,
          label: `${rest.location + ", " + rest.statename}`,
          zipcode: rest.zipcode,
          stateid: rest.stateid,
          statename: rest.statename,
        };
      });
      if (filter_data?.length > 0) {
        setCountryValue([{ value: 1, label: "USA" }]);
        setCityValue(filter_data[0]);
      } else {
        setCountryValue([]);
        setCityValue([]);

        setValue("cityid", "");

        setValue("stateid", "");
        setValue("countryid", "");
      }
    }
  };

  const clearFormData = () => {
    setValue("name", "");
    if (!userId) {
      // Below code is commented as per the User Story 13174
      // setValue("companyid", "");
      // setCompanyValue("");
      setValue("email", "");
    }

    setValue("phoneNumber", "");
    setValue("zipcode", "");
    setValue("cityid", "");
    setCityValue("");
    setValue("stateid", "");
    setValue("countryid", "");
    setCountryValue("");
    setValue("address", "");
    dispatch(paymentActions.updateUserDetails({}));
    setZipCode("");
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
        // showSweetAlert({
        //   title: "Please enter valid card details.",
        //   type: "error",
        // });

        dispatch(showSnackbar({
          message: CARD_MESSAGES.PLEASE_ENTER_VALID_CARD_DETAILS,
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        }));

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
      customerid: userId
        ? 0
        : userDetails?.customerid
          ? userDetails.customerid
          : id,
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
      Issameashiringmanager: sameAsCust ? sameAsCust : false
    };

    let response = await dispatch(
      paymentActions.postPaymentBillingDetails(payload)
    );

    if (!response.payload) {
      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    } else {
      if (userId) {
        setDisableCABillStat(true);
      }
      else {
        dispatch(paymentActions.getCustomerUserDetails(id || selectedCustomer?.customerid)
        );
      }
      setDeletedCard(false);
      if (authUser) {
        dispatch(paymentActions.updateShowBilling(true));
      }
      dispatch(showSnackbar({
        message: response.payload.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

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
      paymentActions.deleteBillingDetails(
        userId
          ? compBillingDetails.billingdetailid
          : billingDetails.billingdetailid
      )
    );

    if (!response.payload) {
      dispatch(showSnackbar({
        message: response.error.message,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    } else {
      if (userId) {
        setDisableCABillStat(false);
      }
      setDeletedCard(true);
      if (!userId) {
        dispatch(paymentActions.updateShowBilling(false));
      }

      dispatch(showSnackbar({
        message: response.payload.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

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

      setSameAsCust(false);
      clearFormData();
    }
  };

  const cardErr = () => {
    if (
      cardnumber === "" ||
      cvv === "" ||
      expiry === "" ||
      invalidExp ||
      !validCard ||
      cardholder === ""
    ) {
      setCardNumberErr(cardnumber === "");
      setCVVErr(cvv === "");
      setExpiryErr(expiry === "");
      setCardHolderErr(cardholder === "");
    }
  };

  return (
    <Row>
      <Form onSubmit={handleSubmit(onSubmit, cardErr)}>
        {/* onSubmit={handleSubmit(onSubmit)} */}
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <h3 className="mt-2 pay-title">Billing Contact</h3>
        </Col>
        {isAdmin ? <hr /> : <></>}

        {!userId && (
          <>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <FormGroup><Input
                type="checkbox"
                name="sameAsCust"
                {...register("sameAsCust")}
                checked={sameAsCust}
                disabled={userDetails?.billingdetailstatus}
                onChange={(e) => onSameCustomer(e)}

              ></Input>
                <Label disabled={disableSAC} className="ms-1 same-as-cust">
                  Same as hiring manager
                </Label>
              </FormGroup>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
              <span className="sub-text">
                If this box is checked, pre-populate the data from the Employer
                details
              </span>
            </Col>
          </>
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
                  disabled={
                    userId
                      ? disableCABillStat
                      : userDetails?.billingdetailstatus
                  }
                  placeholder="Enter Name"
                  {...register("name")}
                  className={`form-control placeholder-name ${errors.name ? "is-invalid" : ""
                    }`}
                  maxLength={50}
                // onChange={(e) => setCardDetails(e)}
                />
                <FormFeedback>{errors?.name?.message}</FormFeedback>
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
                disabled={true ? true : userDetails?.billingdetailstatus || userId}
                className={`form-control placeholder-name ${errors.companyid && companyValue === 0 ? "is-invalid" : ""
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
                  disabled={userDetails?.billingdetailstatus || userId}
                  {...register("email")}
                  className={`form-control placeholder-name ${errors.email ? "is-invalid" : ""
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
                  disabled={
                    userId
                      ? disableCABillStat
                      : userDetails?.billingdetailstatus
                  }
                  name="phoneNumber"
                  id="phoneNumber"
                  {...register("phoneNumber")}
                  className={`form-control placeholder-name ${errors.phoneNumber ? "is-invalid" : ""
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
                  disabled={
                    userId
                      ? disableCABillStat
                      : userDetails?.billingdetailstatus
                  }
                  id="address"
                  {...register("address")}
                  className={`form-control placeholder-name ${errors.address ? "is-invalid" : ""
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
                cacheOptions
                loadOptions={loadOptionsDeb}
                isMulti={false}
                value={cityValue}
                className={`placeholder-name ${errors.cityid && !cityValue?.value
                  ? "async-border-red"
                  : "async-no-error"
                  } ${userId
                    ? disableCABillStat
                    : userDetails?.billingdetailstatus
                      ? "disable-ip"
                      : ""
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
                <Input
                  type="text"
                  name="zipcode"
                  disabled={
                    userId
                      ? disableCABillStat
                      : userDetails?.billingdetailstatus
                  }
                  id="zipcode"
                  placeholder="Enter Zip Code"
                  {...register("zipcode")}
                  className={`form-control placeholder-name ${errors.zipcode ? "is-invalid" : ""
                    }`}
                  autoComplete="off"
                  onInput={(e) => {
                    getZipLocationData(e.target.value);
                  }}
                  maxLength={5}
                  value={zipCode}
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
                className={`placeholder-name ${errors.countryid && !countryValue?.value
                  ? "async-border-red"
                  : "async-no-error"
                  } ${userId
                    ? disableCABillStat
                    : userDetails?.billingdetailstatus
                      ? "disable-ip"
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
                disabled={
                  userId ? disableCABillStat : userDetails?.billingdetailstatus
                }
                placeholder="Select Currency"
                {...register("currency")}
                className={`form-control placeholder-name ${errors.currency && currencyValue === 0 ? "is-invalid" : ""
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
                  className={`form-control placeholder-name ${cardNumberErr || (!validCard && cardnumber !== "")
                    ? "is-invalid"
                    : ""
                    }`}
                  placeholder="Card Number"
                  pattern="[\d| ]{16,22}"
                  disabled={
                    userId
                      ? disableCABillStat
                      : userDetails?.billingdetailstatus
                  }
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
                  className={`form-control placeholder-name ${expiryErr || invalidExp ? "is-invalid" : ""
                    }`}
                  placeholder="MM/YY"
                  pattern="\d\d/\d\d"
                  value={expiry}
                  disabled={
                    userId
                      ? disableCABillStat
                      : userDetails?.billingdetailstatus
                  }
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
                  disabled={
                    userId
                      ? disableCABillStat
                      : userDetails?.billingdetailstatus
                  }
                  id="cvv"
                  className={`form-control placeholder-name ${cvvErr ? "is-invalid" : ""
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
                  className={`form-control placeholder-name ${cardholderErr ? "is-invalid" : ""
                    }`}
                  disabled={
                    userId
                      ? disableCABillStat
                      : userDetails?.billingdetailstatus
                  }
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
          {(userId ? disableCABillStat : userDetails?.billingdetailstatus) ? (
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
              className="me-2 pb-text"
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
          {(userId ? !disableCABillStat : !userDetails?.billingdetailstatus) ? (
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
