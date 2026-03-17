import React, { useEffect, useState, useRef } from "react";
import uitoolkit from "@zoom/videosdk-ui-toolkit";
import "@zoom/videosdk-ui-toolkit/dist/videosdk-ui-toolkit.css";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { authActions, scheduleInterviewActions, dropdownActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
import { InterviewFeedback } from "_components/scheduleInterview/interviewFeedback";
import {
  Modal,
  ModalBody,
  ModalHeader,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Button,
  Row,
  Col,
} from "reactstrap";
import { database } from "../firebase/index";
import "firebase/database";
import { HostPreview } from "./component/host-preview";
import { WaitingPreview } from "./component/waiting-screen";
import { GuestPreview } from "./component/guest-preview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";

import "../_containers/sharejob/sharejob.scss";
import "./zoom-video.css";

export default function ZoomVideoScreen(props) {
  const userRoleId = localStorage.getItem("userroleid");
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
  const fbUserRef = useRef(fbUsersData);

  const [isOpen, setIsOpen] = useState(
    userRoleId === "2" || userRoleId === "4"
  );

  const [isLoaded, setIsLoaded] = useState(false);
  const [hostLeave, setIsHostLeave] = useState(false);
  const sessionInterviewAccessData = useSelector(state => state.auth?.interviewSessionAccess);
  console.log(participantData);
  let urlParams = rest["*"] ? rest["*"] : "";
  let id = urlParams.length > 0 ? urlParams.split("-").slice(0)[0] : 0;
  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const [interviewDetails, setInterviewDetails] = useState({});
  const dispatch = useDispatch();

  let name = userDetails ? userDetails.FirstName + " " + userDetails.LastName : "Guest";
  const host = userRoleId === "2" || userRoleId === "4";
  const navigate = useNavigate();
  let config = {
    videoSDKJWT: "",
    sessionName: "",
    userName: "",
    sessionPasscode: "",
    role: "",
    features: ["video", "audio", "users", "chat", "share", "settings"],
    featuresOptions: {
      feedback: { enable: false },
    },
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
    const observer = new MutationObserver(() => {
      const endScreen = document.querySelector(
        "button[id='leave-meeting-button']"
      ); // or other DOM clues
      if (endScreen) {
        if (userRoleId === "2" || userRoleId === "4") {
          endScreen.addEventListener("click", () => {
            updateLocatSorageUsersData();
          });
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
    if (
      userRoleId &&
      (userRoleId === "2" || userRoleId === "4")
    ) {
      dispatch(scheduleInterviewActions.getInterviewStatusDropDownThunk());
      dispatch(dropdownActions.getInterviewRoundListThunk({
        searchText: "interviewRound",
        commonId: 0,
        searchBy: ""
      }));
    }

    document.addEventListener("keydown", keyDownHandler);
    window.addEventListener("beforeunload", handleBeforeUnload);
    const nameRef = database.ref("users/" + urlParams);
    nameRef.on("value", (snapshot) => {
      const data = snapshot.val();
      setIsLoaded(true);

      if (userRoleId === "2" || userRoleId === "4") {
        checkUserJoinedEvent(data, usersData);
      }
      setFBUsersData(data ? data : []);
      setUsersData(data ? data : []);
    });

    // Cleanup listener on unmount
    return () => {
      if ((userRoleId === "2" || userRoleId === "4") && !hostLeave) {
        database.ref("users/" + urlParams).remove();
      }
      nameRef.off();
      document.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", () => updateLocatSorageUsersData());
      observer.disconnect();
    };
  }, []);

  const handleClick = () => {
    console.log("Observed external button clicked!");
  };

  const handleBeforeUnload = async (event) => {
    // Optional: Show confirmation dialog
    event.preventDefault();
    event.returnValue = ""; // Required for Chrome to show confirmation dialog
    await UserLeftSession();
    // Add your cleanup or API call logic here
    if (userRoleId === "2" && !hostLeave) {
      database.ref("users/" + urlParams).remove();
    }

    if (
      sessionContainer &&
      uitoolkit &&
      (userRoleId === "2" || userRoleId === "4")
    ) {
      // uitoolkit?.closeSession(sessionContainer);
      uitoolkit?.offSessionJoined(sessionJoined);
      uitoolkit?.offSessionClosed(sessionClosed);
    }
  };
  useEffect(() => {
    if (id) {
      if (sessionData.length === 0 && userDetails) {
        getToken();
      }
      else {
        setShowScreen("guest");
      }
    }

  }, [id]);
  useEffect(() => {
    if (
      id &&
      sessionData.length > 0 &&
      uitoolkit &&
      (showScreen === "load" || showScreen === "host")
    ) {
      config.videoSDKJWT = sessionData[0].zoomSessionToken;
      config.sessionName = sessionData[0].sessionName;
      config.userName =
        userRoleId === "3" ||
          userRoleId === null
          ? participantData.length > 0
            ? participantData[0]?.name
            : "Guest"
          : sessionData[0].userIdentity;
      config.sessionPasscode = sessionData[0].sessionPassword;
      config.role = sessionData[0].roleType;
      config.sessionIdleTimeoutMins = sessionData[0].sessionIdleTimeoutMins;
      config.feedback = false;
      console.log(config);
      uitoolkit?.joinSession(sessionContainer, config);
      uitoolkit?.onSessionDestroyed(sessionDestroyed);
      uitoolkit?.onSessionJoined(sessionJoined);
      uitoolkit?.onSessionClosed(sessionClosed);
    }

    return () => {
      if (
        sessionContainer &&
        uitoolkit &&
        sessionData.length > 0 &&
        (showScreen === "load" || showScreen === "host")
      ) {
        // uitoolkit?.closeSession(sessionContainer);
        uitoolkit?.offSessionJoined(sessionJoined);
        uitoolkit?.offSessionClosed(sessionClosed);
        uitoolkit.destroy();
      }
    };
  }, [id, sessionData, uitoolkit, showScreen]);

  useEffect(() => {
    fbUserRef.current = fbUsersData;
    if (
      userRoleId === "3" ||
      (userRoleId === null && fbUsersData?.length > 0)
    ) {
      checkParticipantActivity(fbUsersData);
    }
  }, [fbUsersData]);

  useEffect(() => {
    if (
      participantData?.length > 0 &&
      userRoleId === "3"
    ) {
      if (fbUsersData.length > 0) {
        let users = [...fbUsersData];
        let ind = users.findIndex(
          (d) =>
            d.email === userDetails?.EmailId && !d.isDenied
        );
        if (ind > -1) {
          users[ind].isJoined = true;
          database.ref("users/" + urlParams).update(users);
        }
      } else {
        let user = {
          name:
            userDetails?.FirstName + " " + userDetails?.LastName,
          email: userDetails?.EmailId,
          isJoined: true,
          isAllowed: false,
          isDenied: false,
        };
        database.ref("users/" + urlParams).set([user]);
      }
    }
  }, [participantData]);

  const toggle = () => setIsOpen(!isOpen);

  const checkParticipantActivity = (data) => {
    if (participantData?.length > 0 && participantData[0]?.name) {
      let ind = data.findIndex(
        (d) =>
          d.email === participantData[0].email &&
          d.isJoined &&
          !d.isDenied &&
          d.isAllowed
      );
      if (ind > -1) {
        setShowScreen("load");
      }
      let ind2 = data.findIndex(
        (d) => d.email === participantData[0].email && d.isDenied
      );
      if (ind2 > -1) {
        showSweetAlert({
          title: "Access denied. The host did not grant permission.",
          type: "error",
        });
      }
    }
  };

  const checkUserJoinedEvent = (data, usersData) => {
    const changed = usersData.filter((obj1) => {
      const obj2 = data.find(
        (o) => o.isJoined === obj1.isJoined && o.isJoined && !o.isDenied
      );
      return obj2 && JSON.stringify(obj1) !== JSON.stringify(obj2);
    });
    if (changed) {
      setIsOpen(true);
    }
  };
  const sessionJoined = () => {
    console.log("session joined");
  };

  const sessionDestroyed = () => {
    if (uitoolkit) {
      uitoolkit?.destroy();
    }
  };
  const onBtnClicked = (evt) => { };

  const UserLeftSession = () => {
    if (
      fbUsersData.length > 0 &&
      participantData.length > 0 &&
      (userRoleId === "3" ||
        userRoleId === null)
    ) {
      let ind = fbUsersData.findIndex(
        (d) => d.email === participantData[0].email
      );
      if (ind > -1) {
        let users = [...fbUsersData];
        users[ind].isJoined = false;
        users[ind].isAllowed = false;
        users[ind].isDenied = false;
        database.ref("users/" + urlParams).update(users);
      }
    }
  };

  const sessionClosed = async (evt) => {
    await UserLeftSession();
    if (
      userRoleId &&
      (userRoleId === "2" || userRoleId === "4")
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
        userRoleId &&
          (userRoleId === "2" || userRoleId === "4")
          ? "host"
          : userRoleId &&
            userRoleId === "3"
            ? "waiting"
            : "guest"
      );

      setSessionData(data);
      if (userRoleId === "3") {
        setTimeout(() => {
          setParticipantData([
            {
              name: userDetails?.FirstName + " " + userDetails?.LastName,
              email: userDetails?.EmailId,
            },
          ]);
        }, 2000);
      }
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
  const routeToHome = async () => {
    await UserLeftSession();

    if (
      userRoleId &&
      (userRoleId === "2" || userRoleId === "4")
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

  const onInterviewDetailsLoaded = (res) => {
    setInterviewDetails(res?.payload?.data?.scheduledInterviewList[0]);
    console.log("getScheduleIVList response in parent", res);
  };

  const submitGuestUserData = (data) => {
    setParticipantData([data]);
    let ind = fbUsersData.findIndex(
      (d) => d.email === data.email && d.isJoined && d.isAllowed && !d.isDenied
    );
    getGuestToken(data, ind);
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

  const updateLocatSorageUsersData = () => {
    let data = fbUserRef.current;
    localStorage.setItem("zoomusersList" + urlParams, JSON.stringify(data));
    setIsHostLeave(true);
  };
  const checkSessionAccess = async (payload) => {
    let response = await dispatch(
      authActions.postInterviewSessionAccess({
        email: payload.email,
        sessionid: urlParams,
      })
    );
  };


  const getGuestToken = async (data, ind) => {
    let response = await dispatch(
      authActions.generateToken({
        scheduleInterviewId: id,
        userIdentity: data?.name,
      })
    );
    if (response?.payload?.statusCode === 201) {
      let data = [];
      data.push(response.payload.data);
      setSessionData(data);
      if (ind > -1) {
        setShowScreen("load");
      } else {
        setShowScreen("waiting");
      }

    } else {
      showSweetAlert({
        title: response?.error?.message
          ? response?.error?.message
          : "Something went wrong, please try later!!",
        type: "error",
      });
    }
  };
  return (
    <>
      {/* <div id="previewContainer"></div> */}
      {host && (
        <Row className="justify-content-end">
          <Col style={{ textAlign: "end" }}>
            <Button onClick={toggle} color="primary">
              {/* <FontAwesomeIcon
              className="me-1"
              icon={isOpen ? faArrowDown : faArrowUp}
            ></FontAwesomeIcon> */}
              Waiting Room
            </Button>
          </Col>
        </Row>
      )}
      {showScreen === "guest" && isLoaded && (
        <GuestPreview
          submitGuestUserData={(data) => submitGuestUserData(data)}
          interviewId={id}
          urlParams={urlParams}
          fbUsersData={fbUsersData}
          database={database}
          showSweetAlert={(data) => showSweetAlert(data)}
          checkSessionAccess={(data) => checkSessionAccess(data)}
          interviewSessionAccessData={sessionInterviewAccessData}
        >
          {" "}
        </GuestPreview>
      )}
      {showScreen === "waiting" && isLoaded && (
        <WaitingPreview
          fbUsersData={fbUsersData}
          setParticipantData={setParticipantData}
          database={database}
          interviewId={id}
          urlParams={urlParams}
        ></WaitingPreview>
      )}
      <div>
        {/* <div style={{ padding: !props.authUser ? "5% 20%" : "15px 20%" }}> */}
        <div>
          <div style={{ height: "75vh" }} id="sessionContainer"></div>
          {host && (
            <div
              style={{
                minHeight: "80vh",
              }}
            >
              <Offcanvas isOpen={isOpen} direction="end" backdrop={false}>
                <OffcanvasHeader toggle={() => toggle()}>
                  <b>Attendee</b>
                </OffcanvasHeader>
                <OffcanvasBody>
                  <Button
                    onClick={toggle}
                    className="toggle-btn"
                    color="primary"
                  >
                    <FontAwesomeIcon
                      className="me-1"
                      icon={isOpen ? faArrowDown : faArrowUp}
                    ></FontAwesomeIcon>
                    Waiting Room
                  </Button>
                  {showScreen === "host" && (
                    <HostPreview
                      interviewId={id}
                      urlParams={urlParams}
                      usersData={usersData}
                      setUsersData={(data) => setUsersData(data)}
                      fbUsersData={fbUsersData}
                      hostStartMeeting={() => hostStartMeeting()}
                      database={database}
                      onInterviewDetailsLoaded={onInterviewDetailsLoaded}
                    ></HostPreview>
                  )}
                </OffcanvasBody>
              </Offcanvas>
            </div>
          )}
        </div>
      </div>

      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        >
          {showAlert.description}
        </SweetAlert>
      </>
      {showFBModal && (
        <>
          {" "}
          <Modal
            className="personal-information"
            size="lg"
            isOpen={showFBModal}
          >
            <ModalHeader
              toggle={() => {
                closeModal();
                routeToHome();
              }}
              charCode="Y"
            >
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
                interviewDetails={interviewDetails}
              ></InterviewFeedback>
            </ModalBody>
          </Modal>
        </>
      )}
    </>
  );
}
