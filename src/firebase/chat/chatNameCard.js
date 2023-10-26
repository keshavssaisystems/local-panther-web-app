import React from "react";
import "firebase/firestore";
import "./chat.scss";
import { NavItem, DropdownItem } from "reactstrap";
import avatar1 from "assets/utils/images/avatars/1.jpg";

export function ChatNameCard(props) {
  const { user2Name, user2 } = props.chatUsers;
  return (
    <>
      <NavItem>
        <DropdownItem active={user2 === props.selected}>
          <div className="widget-content p-0">
            <div className="widget-content-wrapper">
              <div className="widget-content-left me-3">
                <div className="avatar-icon-wrapper">
                  <div className="avatar-icon">
                    <img src={avatar1} alt="" />
                  </div>
                </div>
              </div>
              <div className="widget-content-left">
                <div className="widget-heading">{user2Name}</div>
              </div>
            </div>
          </div>
        </DropdownItem>
      </NavItem>
    </>
  );
}
