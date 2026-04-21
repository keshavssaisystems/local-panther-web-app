import firebase from "firebase/app";
import React, { useRef, useState, useEffect } from "react";
import "firebase/firestore";
import { firebaseConfig } from "firebase/index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  CardBody,
  CardFooter,
  Input,
  Form,
  Col,
  Button,
  Row,
} from "reactstrap";
import "./chat.scss";
import { ChatMessage } from "./chatMessage";
import { BsFillSendFill } from "react-icons/bs";
import moment from "moment-timezone";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useSelector, useDispatch } from "react-redux";
import { chatActions } from "_store";

export function Chat({ groupId, details }) {
  const dispatch = useDispatch();
  const completedInterviewCustomerList = useSelector(
    (state) => state.chat.completedCustomerList
  );
  let customerArray = [];
  if (completedInterviewCustomerList?.length > 0) {
    completedInterviewCustomerList?.map((candidateDetails) => {
      customerArray.push(candidateDetails.id);
    });
  }

  let userRole = Number(localStorage.getItem("userroleid"));
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  let candidateId =
    (userRole === 2 || userRole === 4) ? details.id : Number(localStorage.getItem("userId"));
  let candidateName =
    (userRole === 2 || userRole === 4)
      ? details.name
      : userDetails.FirstName + " " + userDetails.LastName;
  let customerId =
    userRole === 3 ? details.id : Number(localStorage.getItem("userId"));
  let customerName =
    userRole === 3
      ? details.name
      : userDetails.FirstName + " " + userDetails.LastName;
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  const firebaseEnv = `${process.env.REACT_APP_FIREBASE_ENVIRONMENT}`;
  const psContainerRef = useRef(null);
  const initialScrollDone = useRef(false);
  const prevMessageCount = useRef(0);

  const messagesRef = firestore.collection("messages"  + (firebaseEnv ? `-${firebaseEnv}` : ""));
  const chatUserRef = firestore.collection("chatUsers" + (firebaseEnv ? `-${firebaseEnv}` : ""));
  const query = messagesRef
    .where("groupId", "==", groupId)
    .orderBy("createdAt")
    .limit(100);
  const chatUserList = chatUserRef.where("groupId", "==", groupId);
  const [messages] = useCollectionData(query, { idField: "id" });
  const [chatList] = useCollectionData(chatUserList, { idField: "id" });
  const [formValue, setFormValue] = useState("");

  // Reset scroll state when switching to a different chat
  useEffect(() => {
    initialScrollDone.current = false;
    prevMessageCount.current = 0;
  }, [groupId]);

  useEffect(() => {
    if (!messages || !psContainerRef.current) return;
    const container = psContainerRef.current;
    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    if (!initialScrollDone.current) {
      // Chat opened: instantly at bottom, no animation
      container.scrollTop = container.scrollHeight;
      initialScrollDone.current = true;
    } else if (messages.length > prevMessageCount.current && isNearBottom) {
      // New message arrived and user is already near bottom: scroll down
      container.scrollTop = container.scrollHeight;
    }
    // If user scrolled up to read history, don't force them down
    prevMessageCount.current = messages.length;
  }, [messages]);
  const sendMessage = async (e) => {
    e.preventDefault();
    let formData = formValue;
    if (formData.trim() !== "") {
      await messagesRef.add({
        text: formData,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        sendDate: moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
        groupId: groupId,
        sender: localStorage.getItem("userId"),
      });
      // Always scroll to bottom when the current user sends a message
      if (psContainerRef.current) {
        psContainerRef.current.scrollTop = psContainerRef.current.scrollHeight;
      }
      setFormValue("");
      const messagesCount = Array.isArray(messages) ? messages.length : 0;
      if (messagesCount < 1) {
        await chatUserRef.add({
          customerId: customerId,
          customerName: customerName,
          candidateId: candidateId,
          candidateName: candidateName,
          lastMessage: formData,
          lastMessageBy: Number(localStorage.getItem("userId")),
          lastMessageDateTime: firebase.firestore.FieldValue.serverTimestamp(),
          groupId: groupId,
          seen: false,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          sendDate: moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
        });
      } else if (messagesCount > 0 && chatList?.[0]?.id) {
        await chatUserRef.doc(chatList[0].id).update({
          lastMessage: formData,
          lastMessageBy: Number(localStorage.getItem("userId")),
          lastMessageDateTime: firebase.firestore.FieldValue.serverTimestamp(),
          seen: false,
          sendDate: moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
        });
      }

      // Send server-side chat notification so receiver gets dashboard + push notification
      try {
        const currentUserId = Number(localStorage.getItem("userId"));
        // Determine receiver id: prefer details.id (selected chat participant), fallback to chatList doc
        let receiverId = details?.id;
        if (!receiverId && chatList && chatList.length > 0) {
          const doc = chatList[0];
          receiverId = doc.candidateId === currentUserId ? doc.customerId : doc.candidateId;
        }
        if (receiverId) {
          const payload = {
            receiverId: Number(receiverId),
            groupId: groupId,
            messagePreview: (formData || "").slice(0, 100),
            redirectUrl: `/chat?groupId=${encodeURIComponent(groupId)}`,
          };
          // Dispatch a Redux thunk and await result so we can observe failures (dev-only logging)
          await dispatch(chatActions.sendChatNotification(payload));
        }
      } catch (err) {
        // intentionally swallow notification errors to avoid breaking UI
      }
    }
  };
  return (
    <>
      <CardBody className="overflow-auto chat-box-area">
        <main className="scroll-area-lg">
          <PerfectScrollbar containerRef={(c) => { psContainerRef.current = c; }}>
            {messages &&
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            {messages?.length === 0 && (
              <div className="text-center">Start a new chat with {details.name}</div>
            )}
          </PerfectScrollbar>
        </main>
      </CardBody>
      <CardFooter>
        <Form onSubmit={sendMessage} className="width-full">
          <Row>
            {userRole === 3 && customerArray.includes(customerId) ? (
              <>
                <Col style={{ color: "red" }}>
                  Your interview process is completed. You can no longer send
                  messages to the hiring manager.
                </Col>
              </>
            ) : (
              <>
                <Col sm={11} md={11} lg={11}>
                  <Input
                    type="text"
                    readOnly={
                      userRole === 3 && customerArray.includes(customerId)
                    }
                    value={formValue}
                    onChange={(e) => setFormValue(e.target.value)}
                    placeholder="Type your message here"
                    required
                  />
                </Col>
                <Col sm={1} md={1} lg={1} className="custom-padding-button-col">
                  <Button
                    type={"submit"}
                    title="Send"
                    disabled={
                      userRole === 3 && customerArray.includes(customerId)
                    }
                  >
                    <BsFillSendFill />
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </CardFooter>
    </>
  );
}
