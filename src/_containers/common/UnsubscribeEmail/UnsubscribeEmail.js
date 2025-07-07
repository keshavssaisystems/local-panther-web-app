
import React, { Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { unsubscribeActions } from "_store/unsubscribeemail.slice";
import logo from "../../../assets/utils/images/panther-logo-2.png";
import { useDispatch } from "react-redux";
import footerImg from "../../../assets/utils/images/panther-logo.png";
import './unsubscribeemail.scss';

export function UnsubscribeEmail() {

    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");
    const { token } = useParams();
    const [isUnsubscribed, setIsUnsubscribed] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [otherReasonText, setOtherReasonText] = useState("");
    const [sliderSettings] = useState({
        dots: true,
        infinite: true,
        speed: 500,
        arrows: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        fade: true,
        initialSlide: 0,
        autoplay: true,
        adaptiveHeight: true,
    });

    const [reasons, setReasons] = useState(["Job roles don’t match my skills", "Locations are irrelevant to me", "I get too many job emails", "Job recommendations feel repetitive", "I already found a job", "Other"]);
    // get functions to build form with useForm() hook
    const { submit, handleSubmit, formState } = useForm();


    async function onSubmit({ email }) {

        const validationErrors = {};

        if (!selectedReason) {
            validationErrors.reason = "Please select a reason.";
        }

        if (selectedReason === "Other" && otherReasonText.trim() === "") {
            validationErrors.other = "Please provide more details for 'Other'.";
        }

        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
            const finalReason =
                selectedReason === "Other" ? otherReasonText : selectedReason;

            let obj = {
                Token: token,
                Emailunsubscribereason: finalReason
            }
            let response = await dispatch(
                unsubscribeActions.postUnsubscribeEmail(obj)
            );
            if (response?.payload) {
                setIsUnsubscribed(response?.payload?.statusCode == 200 ? true : false);
                if (response?.payload?.statusCode != 200) {
                    validationErrors.response = response.payload.message;
                    setErrors({
                        response: response?.payload?.message || "Something went wrong.",
                    });
                    console.log('response:',validationErrors.response)
                }
            }
            else if (response?.error) {
                // setErrors(true);
                setMessage(response?.error?.message);
            }
        }
    }

    const handleChange = (event) => {
        setSelectedReason(event.target.value);
        setErrors({ ...errors, reason: "" });

        if (event.target.value !== "Other") {
            setOtherReasonText("");
            setErrors({ ...errors, reason: "", other: "" });
        }
    };

    const handleTextareaChange = (e) => {
        setOtherReasonText(e.target.value);
        setErrors({ ...errors, other: "" });
    };


    return (
        <Fragment>
            <table width="100%" height="100%" bgcolor="#DDE7F1" cellPadding="10" cellSpacing="0" className="my-text">
                <tbody>
                    <tr>
                        <td align="center" valign="top">
                            <table className="email-container" width="600" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        {isUnsubscribed ? <td className="header" style={{ textAlign: "center" }}>
                                            <img src={
                                                localStorage.getItem("logo")
                                                    ? localStorage.getItem("logo")
                                                    : logo
                                            } alt="OpenWorX Logo" width="180" />

                                            <p style={{ fontSize: "24px", margin: "0", marginTop: "30px" }}>
                                                <strong>You’ve opted out of emails</strong>
                                            </p>
                                            <p style={{ fontSize: "16px", margin: "0", marginTop: "15px" }}>
                                                You’ve successfully opted out of our email notifications. <br />
                                                We're sorry to see you go! You won’t receive any further updates unless you opt back in.
                                            </p>
                                            <a href="/login" type="submit" className="cta-button">Login</a>
                                            <p style={{ fontSize: "13px", margin: "0", marginTop: "15px", color: "#979797" }}>
                                                If this was a mistake, you can opt back in anytime from your <a href="/login" style={{ color: "#038FFE", textDecoration: "underline" }}>account settings</a>.
                                            </p>
                                        </td>
                                            : <td className="header">
                                                <img src={
                                                    localStorage.getItem("logo")
                                                        ? localStorage.getItem("logo")
                                                        : logo
                                                } alt="OpenWorX Logo" width="180" />

                                                <p style={{ fontSize: "20px", margin: "0", marginTop: "15px" }}>
                                                    <strong>We’re sad to see you leave.</strong>
                                                </p>
                                                <p style={{ fontSize: "16px", margin: "0", marginTop: "15px" }}>
                                                    Can you share your reason, so we can improve the alerts you receive?
                                                </p>
                                            </td>}
                                    </tr>
                                    {isUnsubscribed == false ? <tr>
                                        <td className="pref-block">
                                            <form >
                                                {reasons.map((reason, index) => (
                                                    <div className="radio-group" key={reason}>
                                                        <label><input type="radio" name="reason" value={reason} required onChange={handleChange} /> {reason}</label>
                                                    </div>
                                                ))}
                                                {errors.reason && (
                                                    <div style={{ color: "red", marginTop: "4px" }}>{errors.reason}</div>
                                                )}
                                                <div><textarea placeholder="If Other, please let us know..." disabled={selectedReason !== "Other"} value={otherReasonText}
                                                    onChange={handleTextareaChange}></textarea></div>
                                                {errors.other && (
                                                    <div style={{ color: "red", marginTop: "4px" }}>{errors.other}</div>
                                                )}
                                                <button type="button" className="cta-button" onClick={handleSubmit(onSubmit)} >Submit</button>
                                                {errors.response && (
                                                    <div style={{ color: "red", marginTop: "4px" }}>{errors.response}</div>
                                                )}
                                            </form>
                                        </td>
                                    </tr> : <></>}
                                </tbody>
                            </table>
                            <table width="512" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <td className="footer">
                                            © 2025 OpenWorX
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Fragment >
    );
}