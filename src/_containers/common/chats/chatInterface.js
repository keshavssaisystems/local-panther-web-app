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

  // Re-fetch chat list whenever "View as" user changes so the list reflects
  // the newly selected hiring manager rather than showing stale data.
  const selectedHiringManagerId = useSelector((state) => state.auth.selectedHiringManagerId);

  useEffect(() => {
    if (userRole === 2 || userRole === 4) {
      getCandidateList();
    }
    if (userRole === 3) {
      getCustomerList();
      //  use DisabledChatCustomerList so chat stays active during Offer/Accepted stages
      dispatch(chatActions.getDisabledChatCustomerListThunk());
    }
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "chat page",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  // Refetch when View As hiring manager changes
  useEffect(() => {
    if (userRole === 2 || userRole === 4) {
      getCandidateList();
    }
  }, [selectedHiringManagerId]);
  const getCandidateList = async function () {
    await dispatch(chatActions.getCandidateListThunk());
  };
  const getCustomerList = async function () {
    await dispatch(chatActions.getCustomerListThunk());
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (userRole !== 2 && userRole !== 4) {
        getCustomerList();
        // re-fetch disabled list so chat re-enables when HM reschedules
        dispatch(chatActions.getDisabledChatCustomerListThunk());
      }
    }, 30000); // 30000 ms = 30 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const newChatUserList = useSelector((state) => state.chat.candidateList);
  const newChatUserCustomerList = useSelector(
    (state) => state.chat.customerList
  );
  let chatList = (userRole === 2 || userRole === 4) ? newChatUserList : newChatUserCustomerList;
  return (
    <>
      <div>
        <div className={cx("app-inner-layout chat-layout")}>
          <div className="app-inner-layout__wrapper chat-Interface">
            <ChatList key={selectedHiringManagerId ?? "default"} list={chatList} />
          </div>
        </div>
      </div>
    </>
  );
}
