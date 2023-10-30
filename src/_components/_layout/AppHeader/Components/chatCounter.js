import firebase from "firebase/app";
import React from "react";
import "firebase/firestore";
import { firebaseConfig } from "firebase/index";
import { useCollectionData } from "react-firebase-hooks/firestore";
export function ChatCounter() {
  let userRole = Number(localStorage.getItem("userroleid"));
  let userId = Number(localStorage.getItem("userId"));
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  const chatUserRef = firestore.collection("chatUsers");
  const chatUserList = chatUserRef
    .where(userRole === 2 ? "customerId" : "candidateId", "==", userId)
    .where("seen", "==", false);
  const [chatUsers] = useCollectionData(chatUserList);
  //   console.log(chatUsers);
  return (
    <>
      <button className="mb-0 me-2 btn-icon btn-icon-only btn btn-link btn-sm">
        <i className="lnr-bubble btn-icon-wrapper font-size-xlg"> </i>
        <span className="badge rounded-pill bg-primary">
          {chatUsers?.length ?? 0}
        </span>
      </button>
    </>
  );
}
