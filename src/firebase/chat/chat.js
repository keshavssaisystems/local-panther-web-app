import firebase from "firebase/app";
import React, { useRef, useState } from "react";
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
  const dummy = useRef();
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
      dummy.current.scrollIntoView({ behavior: "smooth" });
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
          // Dispatch a Redux thunk instead of calling fetch directly — keeps API calls in slices
          dispatch(chatActions.sendChatNotification(payload));
        }
      } catch (err) {
        console.warn("Failed to trigger server chat notification", err);
      }
    }
  };
  return (
    <>
      <CardBody className="overflow-auto chat-box-area">
        <main className="scroll-area-lg">
          <PerfectScrollbar>
            {messages &&
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            {messages?.length === 0 && (
              <>
                <div className="text-center">
                  Start a new chat with {details.name}
                </div>
              </>
            )}
          </PerfectScrollbar>
          <span ref={dummy}></span>
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
