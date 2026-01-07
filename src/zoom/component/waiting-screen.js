import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions, scheduleInterviewActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";

import { database } from "../../firebase/index";
import { Card } from "reactstrap";
import "firebase/database";
import lightbulb from "../../assets/utils/images/zoom/lightbulb.svg";
import check from "../../assets/utils/images/zoom/check-circle-fill.svg";
import "./waiting-screen.css";

export const WaitingPreview = (props) => {
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

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
    routeToHome();
  };
  const routeToHome = () => {
    if (
      localStorage.getItem("userroleid") &&
      (localStorage.getItem("userroleid") === "2" || localStorage.getItem("userroleid") === "4")
    ) {
      navigate("/scheduled-interview");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="waiting-cont">
      <Card className="card-div">
        <div className="div-title mt-3">Welcome to your Interview!</div>
        <div className="div-subt mt-3">
          The host hasn't started the meeting yet. We know you are here and will
          be with you shortly.
        </div>
        <div className="content-cont mt-3">
          <div className="first-line mt-3">
            <img
              className="me-2"
              src={lightbulb}
              height={24}
              width={24}
              alt="light img"
            ></img>
            While you're waiting, make sure:
          </div>
          <div className="next-line mt-3">
            <img
              className="me-2"
              src={check}
              height={20}
              width={20}
              alt="check img"
            ></img>
            You are in a private place.
          </div>
          <div className="next-line mt-3">
            <img
              className="me-2"
              src={check}
              height={20}
              width={20}
              alt="check img"
            ></img>
            There is no excessive background noise.
          </div>
          <div className="next-line mt-3">
            <img
              className="me-2"
              src={check}
              height={20}
              width={20}
              alt="check img"
            ></img>
            You are comfortable.
          </div>
          <div className="next-line mt-3">
            <img
              className="me-2"
              src={check}
              height={20}
              width={20}
              alt="check img"
            ></img>
            You are not in a moving vehicle.
          </div>
          <div className="next-line mt-3">
            <img
              className="me-2"
              src={check}
              height={20}
              width={20}
              alt="check img"
            ></img>
            Your microphone and camera are ready.
          </div>
        </div>
        <div className="mt-3 end-title">Thank you for your patience!</div>
        <div className="mt-3 end-subt">We're so glad you're here.</div>
      </Card>
    </div>
  );
};
