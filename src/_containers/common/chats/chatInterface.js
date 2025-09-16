import React, { useEffect } from "react";
import cx from "classnames";
import { ChatList } from "firebase/chat/chatList";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "_store";
import { analytics } from "../../../firebase/index";
import "./chat.scss";

export function ChatInterface() {
  let userRole = Number(localStorage.getItem("userroleid"));
  const dispatch = useDispatch();
  useEffect(() => {
    if (userRole === 2) {
      getCandidateList();
    }
    if (userRole === 3) {
      getCustomerList();
      dispatch(chatActions.getCompletedCustomerListThunk());
    }
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "chat page",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);
  const getCandidateList = async function () {
    await dispatch(chatActions.getCandidateListThunk());
  };
  const getCustomerList = async function () {
    await dispatch(chatActions.getCustomerListThunk());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (userRole !== 2) getCustomerList();
    }, 30000); // 30000 ms = 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const newChatUserList = useSelector((state) => state.chat.candidateList);
  const newChatUserCustomerList = useSelector(
    (state) => state.chat.customerList
  );
  let chatList = userRole === 2 ? newChatUserList : newChatUserCustomerList;
  return (
    <>
      <div>
        <div className={cx("app-inner-layout chat-layout")}>
          <div className="app-inner-layout__wrapper chat-Interface">
            <ChatList list={chatList} />
          </div>
        </div>
      </div>
    </>
  );
}
