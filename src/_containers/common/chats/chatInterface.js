import React, { useEffect } from "react";
import cx from "classnames";
import { ChatList } from "firebase/chat/chatList";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "_store";
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
  }, []);
  const getCandidateList = async function () {
    await dispatch(chatActions.getCandidateListThunk());
  };
  const getCustomerList = async function () {
    await dispatch(chatActions.getCustomerListThunk());
  };
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
