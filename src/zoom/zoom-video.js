import React, { useEffect } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";
import { generateSignature } from "./jwt";
import { ZOOM_APP_KEY, ZOOM_APP_SECRET } from "./config";
import { useParams } from "react-router-dom";

export const ZoomVideoScreen = () => {
  const { id } = useParams();
  let config = {
    videoSDKJWT: "",
    sessionName: "SessionA",
    userName: Math.random().toString(),
    sessionPasscode: "",
    features: ["video", "audio", "settings", "users", "chat"],
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
      uitoolkit.joinSession(sessionContainer, config);
    }

    return () => {
      // uitoolkit.closePreview(previewContainer);
      uitoolkit.closeSession(sessionContainer);
    };
  }, [id, token]);

  const sessionJoined = () => {
    console.log("session joined");
  };

  const sessionClosed = () => {
    console.log("session closed");
  };

  return (
    <div>
      {/* <div id="previewContainer"></div> */}
      <div id="sessionContainer"></div>
    </div>
  );
};
