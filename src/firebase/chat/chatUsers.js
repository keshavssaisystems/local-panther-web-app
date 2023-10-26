import firebase from "firebase/app";
import React, { useRef, useState } from "react";
import "firebase/firestore";
import { firebaseConfig } from "../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./chat.scss";
import { ChatNameCard } from "./chatNameCard";

export function ChatUsers() {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  const chatUsersRef = firestore.collection("chatUsers");
  const query = chatUsersRef.orderBy("createdAt").limit(100);
  const [chatUsers] = useCollectionData(query, { idField: "id" });
  return (
    <>
      {chatUsers &&
        chatUsers.map((msg) => (
          <ChatNameCard chatUsers={msg} selected={"14060"} />
        ))}
    </>
  );
}
