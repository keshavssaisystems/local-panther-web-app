import React from "react";
import cx from "classnames";
import {
  Card,
  Nav,
  NavItem,
  DropdownItem,
  InputGroup,
  Input,
} from "reactstrap";
import avatar1 from "assets/utils/images/avatars/1.jpg";
import { Chat } from "firebase/chat/chat";
import { ChatUsers } from "firebase/chat/chatUsers";

export function ChatInterface() {
  return (
    <>
      <div>
        <div className={cx("app-inner-layout chat-layout")}>
          <div
            className="app-inner-layout__wrapper"
            style={{ minHeight: "75vh" }}
          >
            <Card className="app-inner-layout__sidebar">
              <div className="app-inner-layout__sidebar-header">
                <Nav vertical>
                  <NavItem className="pt-4 ps-3 pe-3 pb-3">
                    <InputGroup>
                      <Input placeholder="Search..." />
                    </InputGroup>
                  </NavItem>
                  <NavItem className="mt-2 ms-3 mb-2">Recent Chats</NavItem>
                </Nav>
              </div>
              <Nav vertical>
                <ChatUsers />
              </Nav>
            </Card>
            <Card className="app-inner-layout__content">
              <div className="table-responsive">
                <div className="app-inner-layout__top-pane">
                  <div className="pane-left">
                    <div className="mobile-app-menu-btn"></div>
                    <div className="avatar-icon-wrapper me-2">
                      <div className="avatar-icon avatar-icon-xl rounded">
                        <img width={82} src={avatar1} alt="" />
                      </div>
                    </div>
                    <h4 className="mb-0 text-nowrap">Tirupati Rao</h4>
                  </div>
                </div>
                <Chat />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
