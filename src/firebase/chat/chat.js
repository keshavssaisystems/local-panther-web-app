import firebase from "firebase/app";
import React, { useRef, useState } from "react";
import "firebase/firestore";
import { firebaseConfig } from "../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { CardBody, Card, CardFooter, Input, Form, Col } from "reactstrap";
import "./chat.scss";
import { ChatMessage } from "./chatMessage";
import moment from "moment-timezone";

export function Chat({ scheduledInterviewId = 1 }) {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef
    .where("groupId", "==", Number(scheduledInterviewId))
    .orderBy("createdAt")
    .limit(100);

  const [messages] = useCollectionData(query, { idField: "id" });
  const [formValue, setFormValue] = useState("");
  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sendDate: moment.utc().format("YYYY-MM-DDTHH:mm:ss"),
      groupId: Number(scheduledInterviewId),
      sender: localStorage.getItem("userId"),
    });
    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <Card>
        <CardBody>
          <main>
            {messages &&
              messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
            <span ref={dummy}></span>
          </main>
        </CardBody>
        <CardFooter>
          <Form onSubmit={sendMessage} className="width-full">
            <Col sm={12}>
              <Input
                type="text"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                placeholder="Message"
              />
            </Col>
          </Form>
        </CardFooter>
      </Card>
    </>
  );
}
