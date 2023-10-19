import firebase from "firebase/app";
import React, { useRef, useState } from "react";
import "firebase/firestore";
import { firebaseConfig } from "../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import {
  CardBody,
  Card,
  CardFooter,
  FormGroup,
  Col,
  Input,
  Button,
  Form,
} from "reactstrap";
import "./chat.scss";
import avatar1 from "../../assets/utils/images/avatars/1.jpg";

const userId = localStorage.getItem("userId");

export function CustomerChat() {
  const UserName =
    JSON.parse(localStorage.getItem("userDetails")).FirstName +
    " " +
    JSON.parse(localStorage.getItem("userDetails")).LastName;
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  const dummy = useRef();
  const messagesRef = firestore.collection("messages");
  const query = messagesRef.orderBy("createdAt").limit(25);

  const [messages] = useCollectionData(query, { idField: "id" });

  const [formValue, setFormValue] = useState("");

  const sendMessage = async (e) => {
    e.preventDefault();

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      sender: userId,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
      <>
        <Card>
          <CardBody>
            <main>
              {messages &&
                messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
              <span ref={dummy}></span>
            </main>
          </CardBody>
          <CardFooter>
            <Form onSubmit={sendMessage}>
              <FormGroup className=" ms-2 mb-0" row>
                <Input
                  type="text"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  placeholder="Write here and hit enter to send..."
                />
              </FormGroup>
            </Form>
          </CardFooter>
        </Card>
      </>
    </>
  );
}

function ChatMessage(props) {
  //   console.log(props);
  const { text, sender } = props.message;
  const messageClass = sender === userId ? "sent" : "received";
  return (
    <>
      <div className="chat-wrapper">
        {messageClass === "received" && (
          <div className="chat-box-wrapper">
            <div>
              <div className="avatar-icon-wrapper me-1">
                <div className="badge badge-bottom btn-shine bg-success badge-dot badge-dot-lg" />
                <div className="avatar-icon avatar-icon-lg rounded">
                  <img src={avatar1} alt="" />
                </div>
              </div>
            </div>
            <div>
              <div className="chat-box">{text}</div>
              <small className="opacity-6">11:01 AM</small>
            </div>
          </div>
        )}
        {messageClass === "sent" && (
          <div className="float-end">
            <div className="chat-box-wrapper chat-box-wrapper-right">
              <div>
                <div className="chat-box">{text}</div>
                <small className="opacity-6">11:01 AM </small>
              </div>
              <div>
                <div className="avatar-icon-wrapper ms-1">
                  <div className="badge badge-bottom btn-shine bg-success badge-dot badge-dot-lg" />
                  <div className="avatar-icon avatar-icon-lg rounded">
                    <img src={avatar1} alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
