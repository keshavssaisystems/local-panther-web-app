import React from "react";
import "firebase/firestore";
import "./chat.scss";
import moment from "moment-timezone";

export function ChatMessage(props) {
  var offset = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const { text, sender, sendDate } = props.message;
  let today = moment.utc().tz(offset).format("YYYY-MM-DD");
  let displayDate = moment.utc(sendDate).tz(offset).format("YYYY-MM-DD");
  let displayTime = moment.utc(sendDate).tz(offset).format("hh:mm A");
  let displayDateTime =
    displayDate === today
      ? displayTime + " | Today"
      : displayTime +
        " | " +
        moment.utc(sendDate).tz(offset).format("MM/DD/YYYY");
  const messageClass =
    sender === localStorage.getItem("userId") ? "sent" : "received";
  return (
    <>
      <div className="chat-wrapper">
        {messageClass === "received" && (
          <div className="chat-box-wrapper">
            <div>
              <div className="chat-box">{text}</div>
              <small className="timing">{displayDateTime}</small>
            </div>
          </div>
        )}
        {messageClass === "sent" && (
          <div className="chat-box-wrapper chat-box-wrapper-right float-end">
            <div>
              <div className="chat-box-send">{text}</div>
              <small className="timing"> {displayDateTime}</small>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
