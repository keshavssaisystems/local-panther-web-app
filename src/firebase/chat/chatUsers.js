import firebase from "firebase/app";
import React, { useState } from "react";
import "firebase/firestore";
import { firebaseConfig } from "firebase/index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Nav, NavItem } from "reactstrap";
import "./chat.scss";
import { ChatNameCard } from "./chatNameCard";

export function ChatUsers({ list, getSelectedChatGroup }) {
  let userRole = Number(localStorage.getItem("userroleid"));
  let userId = Number(localStorage.getItem("userId"));
  const [selectedUserId, setSelectedUserId] = useState(0);
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  const chatUsersRef = firestore.collection("chatUsers");
  const query = chatUsersRef
    .where(userRole === 2 ? "customerId" : "candidateId", "==", userId)
    .orderBy("lastMessageDateTime", "desc");
  const [chatUsers] = useCollectionData(query, { idField: "id" });
  let recentCustomerArray = [];
  let recentCandidateArray = [];
  if (chatUsers?.length > 0) {
    chatUsers.forEach((element) => {
      recentCustomerArray.push(element.customerId);
      recentCandidateArray.push(element.candidateId);
    });
  }
  const filteredArray =
    userRole === 2
      ? list.filter((value) => !recentCandidateArray.includes(value.id))
      : list.filter((value) => !recentCustomerArray.includes(value.id));
  const getSelectedChat = (event) => {
    setSelectedUserId(event.id);
    getSelectedChatGroup(event);
  };
  return (
    <>
      {chatUsers?.length > 0 && (
        <>
          <div className="app-inner-layout__sidebar-header">
            <Nav vertical>
              <NavItem className="mt-2 ms-3 mb-2">Recent Chats</NavItem>
            </Nav>
          </div>
          <Nav vertical>
            {chatUsers &&
              chatUsers?.map((msg, index) => (
                <ChatNameCard
                  type={"recent"}
                  chatUsers={msg}
                  selected={selectedUserId}
                  getSelectedChat={(e) => getSelectedChat(e)}
                  keyItem={"recent_" + index}
                />
              ))}
          </Nav>
        </>
      )}
      {filteredArray?.length > 0 && (
        <>
          <div className="app-inner-layout__sidebar-header">
            <Nav vertical>
              <NavItem className="mt-2 ms-3 mb-2">Start a new chat</NavItem>
            </Nav>
          </div>
          <Nav vertical>
            {filteredArray &&
              filteredArray?.map((msg, index) => (
                <ChatNameCard
                  type={"new"}
                  chatUsers={msg}
                  selected={selectedUserId}
                  getSelectedChat={(e) => getSelectedChat(e)}
                  keyItem={"new_" + index}
                />
              ))}
          </Nav>
        </>
      )}
      {filteredArray?.length === 0 && chatUsers?.length === 0 && (
        <>
          <div className="app-inner-layout__sidebar-header">
            <Nav vertical>
              <NavItem className="mt-2 ms-3 mb-2 text-center">
                No chats to display
              </NavItem>
            </Nav>
          </div>
        </>
      )}
    </>
  );
}
