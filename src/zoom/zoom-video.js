import React, { useEffect, useState } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
import "../_containers/sharejob/sharejob.scss";
export const ZoomVideoScreen = (props) => {
  const { ...rest } = useParams();
  const [sessionData, setSessionData] = useState([]);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  let urlParams = rest["*"] ? rest["*"] : "";
  let id = urlParams.split("-").slice(0)[0];
  const dispatch = useDispatch();
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  let name = userDetails
    ? userDetails.FirstName + " " + userDetails.LastName
    : "Guest";
  const navigate = useNavigate();
  let config = {
    videoSDKJWT: "",
    sessionName: "",
    userName: "",
    sessionPasscode: "",
    role: "",
    features: ["video", "audio", "users", "chat"],
  };

  // let token = generateSignature(ZOOM_APP_KEY, ZOOM_APP_SECRET, id, 1, id, name);
  const sessionContainer = document.getElementById("sessionContainer");
  useEffect(() => {
    if (sessionData.length === 0) {
      getToken();
    }

    if (id && sessionData.length > 0 && uitoolkit) {
      config.videoSDKJWT = sessionData[0].zoomSessionToken;
      config.sessionName = sessionData[0].sessionName;
      config.userName = sessionData[0].userIdentity;
      config.sessionPasscode = sessionData[0].sessionPassword;
      config.role = sessionData[0].roleType;
      config.sessionIdleTimeoutMins = sessionData[0].sessionIdleTimeoutMins;

      uitoolkit.joinSession(sessionContainer, config);
      uitoolkit.onSessionJoined(sessionJoined);
      uitoolkit.onSessionClosed(sessionClosed);
    }

    return () => {
      if (sessionContainer) {
        uitoolkit.closeSession(sessionContainer);
        uitoolkit.offSessionJoined(sessionJoined);
        uitoolkit.offSessionClosed(sessionClosed);
      }
    };
  }, [id, sessionData, uitoolkit]);

  const sessionJoined = () => {
    console.log("session joined");
  };

  const sessionClosed = () => {
    navigate(`/`);
  };

  const getToken = async () => {
    let response = await dispatch(
      authActions.generateToken({
        scheduleInterviewId: id,
        userIdentity: name,
      })
    );
    if (response?.payload?.statusCode === 201) {
      let data = [];
      data.push(response.payload.data);
      setSessionData(data);
    } else {
      showSweetAlert({
        title: "Something went wrong, please try later!!",
        type: "error",
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
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
    navigate("/");
  };

  return (
    <>
      {/* <div id="previewContainer"></div> */}
      <div className={!props.authUser ? "share-job-cont" : ""}>
        <div id="sessionContainer"></div>
      </div>

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
    </>
  );
};
