import React, { useEffect, useState } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions, scheduleInterviewActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
import { InterviewFeedback } from "_components/scheduleInterview/interviewFeedback";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import { database } from "../firebase/index";
import "firebase/database";
import { HostPreview } from "./component/host-preview";
import { WaitingPreview } from "./component/waiting-screen";
import { GuestPreview } from "./component/guest-preview";
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
  const [showScreen, setShowScreen] = useState("");
  const [participantData, setParticipantData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [fbUsersData, setFBUsersData] = useState([]);
  console.log(participantData);
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

  // useEffect(() => {

  // }, []);

  useEffect(() => {
    if (
      localStorage.getItem("userroleid") &&
      localStorage.getItem("userroleid") === "2"
    ) {
      dispatch(scheduleInterviewActions.getInterviewStatusDropDownThunk());
    }

    document.addEventListener("keydown", keyDownHandler);

    const nameRef = database.ref("users/" + urlParams);
    nameRef.on("value", (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setFBUsersData(data);
        setUsersData(data);
      }
    });

    // Cleanup listener on unmount
    return () => {
      if (localStorage.getItem("userroleid") === "2") {
        database.ref("users/" + urlParams).remove();
      }
      nameRef.off();
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, []);

  useEffect(() => {
    if (sessionData.length === 0) {
      getToken();
    }
  }, [id]);
  useEffect(() => {
    if (id && sessionData.length > 0 && uitoolkit && showScreen === "load") {
      config.videoSDKJWT = sessionData[0].zoomSessionToken;
      config.sessionName = sessionData[0].sessionName;
      config.userName =
        localStorage.getItem("userroleid") === "3" ||
        localStorage.getItem("userroleid") === null
          ? participantData.length > 0
            ? participantData[0]?.name
            : "Guest"
          : sessionData[0].userIdentity;
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
  }, [id, sessionData, uitoolkit, showScreen]);

  useEffect(() => {
    if (
      localStorage.getItem("userroleid") === "3" ||
      (localStorage.getItem("userroleid") === null && fbUsersData?.length > 0)
    ) {
      checkParticipantActivity(fbUsersData);
    }
    if (
      fbUsersData?.length > 0 &&
      participantData?.length > 0 &&
      localStorage.getItem("userroleid") === "3"
    ) {
      if (fbUsersData.length > 0) {
        let users = [...fbUsersData];
        let ind = users.findIndex(
          (d) =>
            d.email === JSON.parse(localStorage.getItem("userDetails")).EmailId
        );
        if (ind > -1) {
          users[ind].status = true;
          database.ref("users/" + urlParams).update(users);
        }
      } else {
        let user = {
          name:
            JSON.parse(localStorage.getItem("userDetails")).FirstName +
            " " +
            JSON.parse(localStorage.getItem("userDetails")).LastName,
          email: JSON.parse(localStorage.getItem("userDetails")).EmailId,
          isMeetingStarted: false,
          status: true,
          isDenied: false,
        };
        database.ref("users/" + urlParams).set([user]);
      }
    }
  }, [fbUsersData, participantData]);

  const checkParticipantActivity = (data) => {
    if (participantData?.length > 0 && participantData[0]?.name) {
      let ind = data.findIndex(
        (d) =>
          d.email === participantData[0].email &&
          d.isMeetingStarted &&
          d.isDenied === false
      );
      if (ind > -1) {
        setShowScreen("load");
      }
      let ind2 = data.findIndex(
        (d) => d.email === participantData[0].email && d.isDenied
      );
      if (ind2 > -1) {
        showSweetAlert({
          title: "Host Denied permission for the meeting!!",
          type: "error",
        });
      }
    }
  };

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
      setShowScreen(
        localStorage.getItem("userroleid") &&
          localStorage.getItem("userroleid") === "2"
          ? "host"
          : localStorage.getItem("userroleid") &&
            localStorage.getItem("userroleid") === "3"
          ? "waiting"
          : "guest"
      );
      if (localStorage.getItem("userroleid") === "3") {
        setParticipantData([
          {
            name:
              JSON.parse(localStorage.getItem("userDetails")).FirstName +
              " " +
              JSON.parse(localStorage.getItem("userDetails")).LastName,
            email: JSON.parse(localStorage.getItem("userDetails")).EmailId,
          },
        ]);
      }
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

  const submitGuestUserData = (data) => {
    setParticipantData([data]);
    let ind = fbUsersData.findIndex(
      (d) => d.email === data.email && d.isMeetingStarted
    );
    if (ind > -1) {
      setShowScreen("load");
    } else {
      setShowScreen("waiting");
    }
  };

  const hostStartMeeting = () => {
    if (fbUsersData.length > 0) {
      let updatedUsersArray = usersData.map((d) => {
        d.isMeetingStarted = true;
        return d;
      });
      const updatedArray = fbUsersData.map((obj) => {
        const update = updatedUsersArray.find((u) => u.email === obj.email);
        return update ? { ...obj, ...update } : obj;
      });
      database.ref("users/" + urlParams).update(updatedArray);
    } else {
      let updatedUsersArray = usersData.map((d) => {
        d.isMeetingStarted = true;
        return d;
      });
      database.ref("users/" + urlParams).set(updatedUsersArray);
    }
    setShowScreen("load");
  };

  return (
    <>
      {/* <div id="previewContainer"></div> */}
      {showScreen === "host" && (
        <HostPreview
          interviewId={id}
          urlParams={urlParams}
          usersData={usersData}
          setUsersData={(data) => setUsersData(data)}
          fbUsersData={fbUsersData}
          hostStartMeeting={() => hostStartMeeting()}
        ></HostPreview>
      )}
      {showScreen === "guest" && (
        <GuestPreview
          submitGuestUserData={(data) => submitGuestUserData(data)}
          interviewId={id}
          urlParams={urlParams}
          fbUsersData={fbUsersData}
          showSweetAlert={(data) => showSweetAlert(data)}
        >
          {" "}
        </GuestPreview>
      )}
      {showScreen === "waiting" && (
        <WaitingPreview interviewId={id} urlParams={urlParams}></WaitingPreview>
      )}

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
