import React from "react";
import "firebase/firestore";
import firebase from "firebase/app";
import { firebaseConfig } from "firebase/index";
import "./chat.scss";
import { NavItem, DropdownItem } from "reactstrap";
import avatar1 from "assets/utils/images/avatars/1.jpg";

export function ChatNameCard({
  type,
  chatUsers,
  selected,
  getSelectedChat,
  keyItem,
}) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  let userRole = Number(localStorage.getItem("userroleid"));
  let userId = null;
  let userName = null;
  let lastMessage = null;
  let lastMessageSender = null;
  let id = null;
  let seen = null;
  if (type === "new") {
    userId = chatUsers.id;
    userName = chatUsers.name;
  } else {
    userId = userRole === 2 ? chatUsers.candidateId : chatUsers.customerId;
    userName =
      userRole === 2 ? chatUsers.candidateName : chatUsers.customerName;
    lastMessage = chatUsers.lastMessage;
    seen = chatUsers.seen;
    lastMessageSender = chatUsers.lastMessageBy;
    id = chatUsers.id;
  }
  const chatUserRef = firestore.collection("chatUsers");
  const getChatData = (event) => {
    getSelectedChat(event);
    if (id !== null) {
      chatUserRef.doc(id).update({
        seen:
          lastMessageSender !== Number(localStorage.getItem("userId"))
            ? true
            : false,
      });
    }
  };

  return (
    <>
      <NavItem key={keyItem} className="chat-main-room">
        <DropdownItem
          active={userId === selected}
          onClick={(e) =>
            getChatData({
              id: userId,
              name: userName,
            })
          }
          toggle={false}
        >
          <div className="widget-content p-0 chat">
            {seen === false &&
              lastMessageSender !== Number(localStorage.getItem("userId")) && (
                <span className="badge rounded-pill bg-info float-end badge-custom mb-2">
                  new
                </span>
              )}
            <div className="widget-content-wrapper">
              <div className="widget-content-left me-3">
                <div className="avatar-icon-wrapper">
                  <div className="avatar-icon">
                    <img src={avatar1} alt="" />
                  </div>
                </div>
              </div>
              <div className="widget-content-left">
                <div className="widget-heading">
                  {userName?.length > 25
                    ? userName.slice(0, 25 - 1) + "…"
                    : userName}{" "}
                </div>
                <div className="widget-subheading">
                  {lastMessage?.length > 30
                    ? lastMessage.slice(0, 30 - 1) + "…"
                    : lastMessage}
                </div>
              </div>
            </div>
          </div>
        </DropdownItem>
      </NavItem>
    </>
  );
}
