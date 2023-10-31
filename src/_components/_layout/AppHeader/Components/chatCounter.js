import firebase from "firebase/app";
import React from "react";
import "firebase/firestore";
import { firebaseConfig } from "firebase/index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { UncontrolledTooltip } from "reactstrap";
import { useNavigate } from "react-router-dom";
export function ChatCounter() {
  let userRole = Number(localStorage.getItem("userroleid"));
  const navigate = useNavigate();
  let userId = Number(localStorage.getItem("userId"));
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  const chatUserRef = firestore.collection("chatUsers");
  let field = userRole === 2 ? "customerId" : "candidateId";
  const chatUserList = chatUserRef
    .where(field, "==", userId)
    .where("seen", "==", false);
  const [chatUsers] = useCollectionData(chatUserList);
  let chatList =
    chatUsers?.length > 0
      ? chatUsers.filter((value) => value.lastMessageBy !== userId)
      : [];
  return (
    <>
      <button className="mb-0 me-0 btn-icon btn-icon-only btn btn-link btn-sm">
        <i
          className="lnr-bubble btn-icon-wrapper font-size-xlg"
          id="Tooltip-1"
          onClick={(e) => navigate(`/chat`)}
        >
          {" "}
        </i>
        {chatList && chatList?.length !== 0 ? (
          <>
            <span className="badge rounded-pill bg-primary">
              {chatList?.length ?? 0}
            </span>
            <UncontrolledTooltip placement="bottom" target={"Tooltip-1"}>
              There are {chatList?.length ?? 0} unseen messages! Click to open
              chat
            </UncontrolledTooltip>
          </>
        ) : (
          <>
            <UncontrolledTooltip placement="bottom" target={"Tooltip-1"}>
              There are no unseen messages! Click to open chat
            </UncontrolledTooltip>
          </>
        )}
      </button>
    </>
  );
}
