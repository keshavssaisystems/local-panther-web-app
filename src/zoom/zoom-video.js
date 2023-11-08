import React, { useEffect } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import { generateSignature } from "./jwt";
import { ZOOM_APP_KEY, ZOOM_APP_SECRET } from "./config";
import { useParams, useNavigate } from "react-router-dom";

export const ZoomVideoScreen = () => {
  const { ...rest } = useParams();
  let id = rest["*"] ? rest["*"] : "";
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  let name = userDetails
    ? userDetails.FirstName + " " + userDetails.LastName
    : "";
  const navigate = useNavigate();
  let config = {
    videoSDKJWT: "",
    sessionName: id,
    userName: name,
    sessionPasscode: "",
    features: ["video", "audio", "settings", "users", "chat", "share"],
  };
  let token = generateSignature(
    ZOOM_APP_KEY,
    ZOOM_APP_SECRET,
    id,
    1,
    id,
    config.userName
  );

  useEffect(() => {
    var sessionContainer = document.getElementById("sessionContainer");

    if (id && token) {
      config.videoSDKJWT = token;
      uitoolkit.joinSession(sessionContainer, config);
    }

    uitoolkit.onSessionJoined(sessionJoined);
    uitoolkit.onSessionClosed(sessionClosed);

    return () => {
      uitoolkit.closeSession(sessionContainer);
      uitoolkit.offSessionJoined(sessionJoined);
      uitoolkit.offSessionClosed(sessionClosed);
    };
  }, [id, token]);

  const sessionJoined = () => {
    console.log("session joined");
  };

  const sessionClosed = () => {
    navigate(`/`);
  };

  return (
    <div>
      {/* <div id="previewContainer"></div> */}
      <div id="sessionContainer"></div>
    </div>
  );
};
