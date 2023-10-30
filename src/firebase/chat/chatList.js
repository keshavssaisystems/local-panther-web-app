import React, { useState } from "react";
import "firebase/firestore";
import "./chat.scss";
import { Card, Nav, NavItem } from "reactstrap";
import { ChatUsers } from "firebase/chat/chatUsers";
import { Chat } from "./chat";
import avatar1 from "assets/utils/images/avatars/1.jpg";

export function ChatList({ list }) {
  let loginUserDetails = JSON.parse(localStorage.getItem("userDetails"));
  let userRole = Number(localStorage.getItem("userroleid"));
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedChat, setSelectedChat] = useState({});
  const currentUserId = localStorage.getItem("userId");
  const getSelectedChatGroup = (event) => {
    setSelectedGroupId(
      userRole === 2
        ? currentUserId + "-" + event.id
        : event.id + "-" + currentUserId
    );
    setSelectedChat(event);
  };
  return (
    <>
      <Card className="app-inner-layout__sidebar">
        <div className="app-inner-layout__sidebar-header">
          <Nav vertical>
            <NavItem className="pt-4 ps-3 pe-3 pb-3">
              <h4 className="mb-0 text-nowrap">
                {loginUserDetails.FirstName + " " + loginUserDetails.LastName}
              </h4>
            </NavItem>
          </Nav>
        </div>
        <div className="overflow-auto">
          <ChatUsers
            list={list}
            getSelectedChatGroup={(e) => getSelectedChatGroup(e)}
          />
        </div>
      </Card>
      <Card className="app-inner-layout__content">
        <div className="table-responsive">
          {selectedGroupId !== "" && (
            <Card>
              <div className="app-inner-layout__top-pane chat-heading">
                <div className="pane-left">
                  <div className="mobile-app-menu-btn"></div>
                  <div className="avatar-icon-wrapper me-2">
                    <div className="avatar-icon avatar-icon-xl rounded">
                      <img width={82} src={avatar1} alt="" />
                    </div>
                  </div>
                  <h4 className="mb-0 text-nowrap">{selectedChat.name}</h4>
                </div>
              </div>
              <Chat groupId={selectedGroupId} details={selectedChat} />
            </Card>
          )}
          {selectedGroupId === "" && (
            <Card>
              <table>
                <tbody style={{ height: "70vh" }}>
                  <tr>
                    <td className="text-center align-middle">
                      Start a chat with{" "}
                      {userRole === 2 ? "candidates" : "customers"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </Card>
          )}
        </div>
      </Card>
    </>
  );
}
