import React, { useEffect, useState } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
export const ZoomVideoScreen = () => {
  const { ...rest } = useParams();
  const [token, setToken] = useState("");
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  let id = rest["*"] ? rest["*"] : "";
  const dispatch = useDispatch();
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  let name = userDetails
    ? userDetails.FirstName + " " + userDetails.LastName
    : "";
  const navigate = useNavigate();
  let config = {
    videoSDKJWT: "",
    sessionName: id,
    userName: name.replace(/-+/g, " "),
    sessionPasscode: "",
    features: ["video", "audio", "users", "chat"],
  };

  // let token = generateSignature(ZOOM_APP_KEY, ZOOM_APP_SECRET, id, 1, id, name);
  const sessionContainer = document.getElementById("sessionContainer");
  useEffect(() => {
    if (token === "") {
      getToken();
    }

    if (id && token && uitoolkit) {
      config.videoSDKJWT = token;
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
  }, [id, token, uitoolkit]);

  const sessionJoined = () => {
    console.log("session joined");
  };

  const sessionClosed = () => {
    navigate(`/`);
  };

  const getToken = async () => {
    let response = await dispatch(
      authActions.generateToken({
        sessionName: id,
        role: parseInt(localStorage.getItem("userroleid")) === 2 ? 1 : 0,
        sessionKey: id,
        userIdentity: name,
      })
    );
    if (response?.payload?.statusCode === 201) {
      setToken(response.payload.data);
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
      <div id="sessionContainer"></div>

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
