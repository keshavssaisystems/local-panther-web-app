import React, { useEffect, useState } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions, scheduleInterviewActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
import { InterviewFeedback } from "_components/scheduleInterview/interviewFeedback";
import { Modal, ModalBody, ModalHeader } from "reactstrap";

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

  const [showFBModal, setShowFBModal] = useState(false);
  let urlParams = rest["*"] ? rest["*"] : "";
  let id = urlParams.length > 0 ? urlParams.split("-").slice(0)[0] : 0;

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
    features: ["video", "audio", "users", "chat", "share", "settings"],
  };

  // let token = generateSignature(ZOOM_APP_KEY, ZOOM_APP_SECRET, id, 1, id, name);
  const sessionContainer = document.getElementById("sessionContainer");
  const keyDownHandler = (event) => {
    if (event.key === "Enter") {
      let sendBtn = document.getElementsByClassName("msger-send-btn");
      if (sendBtn?.length > 0) {
        sendBtn[0].click();
      }
    }
  };
  useEffect(() => {
    if (
      localStorage.getItem("userroleid") &&
      localStorage.getItem("userroleid") === "2"
    ) {
      dispatch(scheduleInterviewActions.getInterviewStatusDropDownThunk());
    }

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

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
    if (
      localStorage.getItem("userroleid") &&
      localStorage.getItem("userroleid") === "2"
    ) {
      setShowFBModal(true);
    } else {
      navigate(`/`);
    }
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
        title: response?.error?.message
          ? response?.error?.message
          : "Something went wrong, please try later!!",
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
    routeToHome();
  };
  const routeToHome = () => {
    if (
      localStorage.getItem("userroleid") &&
      localStorage.getItem("userroleid") === "2"
    ) {
      navigate("/scheduled-interview");
    } else {
      navigate("/");
    }
  };
  const closeModal = () => {
    setShowFBModal(false);
  };

  const postFeedbackData = async (payload) => {
    let res = await dispatch(
      scheduleInterviewActions.interviewFeedbackThunk({
        scheduleinterviewid: payload.scheduleinterviewid,
        payload,
      })
    );
    if (res.payload) {
      setShowFBModal(false);
      navigate("/scheduled-interview");
    } else if (res.error) {
      setShowFBModal(false);
      showSweetAlert({
        title: res?.error?.message
          ? res?.error?.message
          : "Something went wrong, please try later!!",
        type: "error",
      });
    }
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
      {showFBModal && (
        <>
          {" "}
          <Modal
            className="personal-information"
            size="lg"
            isOpen={showFBModal}
          >
            <ModalHeader toggle={() => closeModal()} charCode="Y">
              <strong className="card-title-text">Interview Feedback</strong>
            </ModalHeader>
            <ModalBody>
              <h6>Please provide feedback for the interview.</h6>
              <br />
              <InterviewFeedback
                interviewId={id}
                postFeedbackData={(e) => {
                  postFeedbackData(e);
                }}
                zoomScreen={true}
                onCancel={() => {
                  closeModal();
                  routeToHome();
                }}
              ></InterviewFeedback>
            </ModalBody>
          </Modal>
        </>
      )}
    </>
  );
};
