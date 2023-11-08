import React, { useEffect } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import { generateSignature } from "./jwt";
import { ZOOM_APP_KEY, ZOOM_APP_SECRET } from "./config";
import { useParams, useNavigate } from "react-router-dom";

export const ZoomVideoScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  let config = {
    videoSDKJWT: "",
    sessionName: "panther-12345",
    userName: Math.random().toString(),
    sessionPasscode: "",
    features: ["video", "audio", "settings", "users", "chat", "share"],
  };
  let token = generateSignature(
    ZOOM_APP_KEY,
    ZOOM_APP_SECRET,
    config.sessionName,
    1,
    id,
    config.userName
  );

  useEffect(() => {
    var sessionContainer = document.getElementById("sessionContainer");
    // let previewContainer = document.getElementById("previewContainer");

    // uitoolkit.openPreview(previewContainer);
    if (id && token) {
      config.videoSDKJWT = token;
      let res = uitoolkit.joinSession(sessionContainer, config);
    }

    uitoolkit.onSessionJoined(sessionJoined);
    uitoolkit.onSessionClosed(sessionClosed);

    return () => {
      // uitoolkit.closePreview(previewContainer);
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
