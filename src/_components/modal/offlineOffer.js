import React, { useCallback, useEffect, useState, useRef } from "react";
import {
    Modal,
    ModalBody,
    Button,
    ModalFooter,
    ModalHeader,
    ButtonGroup,
    Form,
    Row,
    Col,
    Input,
    FormGroup,
    Label,
    FormText,
    InputGroup,
    InputGroupText
} from "reactstrap";
import Dropzone from "react-dropzone";
import { useDropzone } from "react-dropzone";
import DatePicker from "react-datepicker";
import Loader from "react-loaders";
import { useDispatch, useSelector } from "react-redux";
import { dropdownActions } from "_store";
import { use } from "react";

export const OfflineOffer = (props) => {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState();
    const [offerDate, setOfferDate] = useState();
    const [startDateValidation, setStartDateValidation] = useState(false);
    const [offerDateValidation, setOfferDateValidation] = useState(false);
    const [payType, setPayType] = useState("");
    const [payTypeErr, setPayTypeErr] = useState(false);
    const [pay, setPay] = useState("");
    const [payErr, setPayErr] = useState(false);
    const payPeriodTypeOption = useSelector(
        (state) => state.dropdown.payPeriodType
    );
    const getPayPeriod = async () => {
        await dispatch(dropdownActions.getPayPeriodTypeThunk());
    };
    useEffect(() => {
        getPayPeriod();
    }, []);

    useEffect(() => {
        if (props.data?.jobOfferDtos && props.data.jobOfferDtos.length > 0) {
            setPayType(props.data.jobOfferDtos[0].payperiodtype || "");
            setPay(props.data.jobOfferDtos[0].salary || "");
            setStartDate(props.data.jobOfferDtos[0].startdate ? new Date(props.data.jobOfferDtos[0].startdate) : null);
            setOfferDate(props.data.jobOfferDtos[0].offerdate ? new Date(props.data.jobOfferDtos[0].offerdate) : null);
        }
    }, [props.data]);

    const getFormValidation = (e) => {
        e.preventDefault();
        let validation = false;
        if (payType === "") {
            setPayTypeErr(true);
            validation = true;
        } else {
            setPayTypeErr(false);
        }
        if (pay === "" || pay <= 0) {
            setPayErr(true);
            validation = true;
        } else {
            setPayErr(false);
        }
        if (!startDate) {
            setStartDateValidation(true);
            validation = true;
        } else {
            setStartDateValidation(false);
        }
        // if (!offerDate) {
        //     setOfferDateValidation(true);
        //     validation = true;
        // } else {
        //     setOfferDateValidation(false);
        // }
        if (validation === false) {
            props.onUploadOfferOffline(payType, pay, startDate, offerDate);
            // props.onClose();
        }
    }
    const onPayType = (e) => {
        setPayTypeErr(e.target.value === "" || parseInt(e.target.value) === 0);
        setPayType(e.target.value);
    }

    const onStartDateChange = (date) => {
        setStartDate(date);
    }

    const onOfferDateChange = (date) => {
        setOfferDate(date);
    }

    const onClose = () => {
        props.onClose();
    }
    return (
        <Modal
            size="md"
            toggle={() => props.onClose()}
            isOpen={props.isOpen}
            backdrop={true}
            fade={true}
        >
            <ModalHeader toggle={() => props.onClose()}>Offer Details</ModalHeader>
            <ModalBody
                style={{ maxHeight: "75vh", overflow: "auto" }}
            >
                <Form onSubmit={(e) => getFormValidation(e)}>
                    <Col md={12}>
                        <FormGroup>
                            <Label for="scheduleStartTime" className="fw-semi-bold">
                                Pay period <span className="required-star">* </span>
                            </Label>
                            <Input
                                id={"payPeriodType"}
                                name={"payPeriodType"}
                                type={"select"}
                                 value={payType}
                                onChange={(e) => onPayType(e)}
                            >
                                <option key={0} value={""}>
                                    Select Pay Period
                                </option>
                                {payPeriodTypeOption.length > 0 &&
                                    payPeriodTypeOption.map((options) => (
                                        <option key={options.id} value={options.name}>
                                            {options.name}
                                        </option>
                                    ))}
                            </Input>
                            {payTypeErr && (
                                <FormText color="danger">
                                    Please select pay period type
                                </FormText>
                            )}
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <Label for={"pay"} className="fw-semi-bold">
                                Salary<span style={{ color: "red" }}>* </span>
                            </Label>
                            <InputGroup>
                                <InputGroupText>$</InputGroupText>
                                <Input
                                    id={"pay"}
                                    name={"pay"}
                                    type={"number"}
                                    value={pay}
                                    step={"any"}
                                    min={0}
                                    placeholder={"Enter salary"}
                                    invalid={false}
                                    onChange={(e) => { setPay(e.target.value); setPayErr(false); }}
                                />
                            </InputGroup>
                            {payErr && (
                                <FormText color="danger">
                                    Please enter valid salary amount
                                </FormText>
                            )}
                        </FormGroup>
                    </Col>

                    <Col md="12">
                        <Row>
                            <Col md={12}>
                                <FormGroup>
                                    <Label for="startDate" className="fw-semi-bold">
                                        Start Date<span className="required-star">*</span>
                                    </Label>
                                    <DatePicker
                                        className="form-control"
                                        selected={startDate}
                                        onChange={(date) => {
                                            setStartDate(date);
                                            setStartDateValidation(false);
                                            onStartDateChange(date);
                                        }}
                                        dateFormat="MM/dd/yyyy"
                                        placeholderText="Eg. mm/dd/yyyy"
                                        name={"startDate"}
                                        minDate={new Date()}
                                    />
                                    {startDateValidation === true && (
                                        <FormText color="danger">Please enter start date</FormText>
                                    )}
                                </FormGroup>
                            </Col>
                            {/* <Col md={6}>
                                <FormGroup>
                                    <Label for="offerDate" className="fw-semi-bold">
                                        Offer Date<span className="required-star">*</span>
                                    </Label>
                                    <DatePicker
                                        className="form-control"
                                        selected={offerDate}
                                        onChange={(date) => {
                                            setOfferDate(date);
                                            setOfferDateValidation(false);
                                            onOfferDateChange(date);
                                        }}
                                        dateFormat="MM/dd/yyyy"
                                        placeholderText="Eg. mm/dd/yyyy"
                                        name={"offerDate"}
                                        minDate={new Date()}
                                    />
                                    {offerDateValidation === true && (
                                        <FormText color="danger">Please enter offer date</FormText>
                                    )}
                                </FormGroup>
                            </Col> */}

                        </Row>
                    </Col>
                    <div className="divider" />
                    <div className="d-block text-end">
                        <Button size="lg" color="danger" type="button" onClick={() => onClose()}>
                            Close
                        </Button>{" "}
                        <Button size="lg" color="primary" type="submit">
                            Save
                        </Button>
                    </div>
                </Form>
            </ModalBody>
        </Modal>
    );
}