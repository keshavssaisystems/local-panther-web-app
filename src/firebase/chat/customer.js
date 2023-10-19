import firebase from "firebase/app";
import React, { useRef, useState } from "react";
import "firebase/firestore";
import { firebaseConfig } from "../index";
import { useCollectionData } from "react-firebase-hooks/firestore";
import "./chat.scss";
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
      <main>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          placeholder="say something nice"
        />

        <button type="submit" disabled={!formValue}>
          {">"}
        </button>
      </form>
    </>
  );
}

function ChatMessage(props) {
  //   console.log(props);
  const { text, sender } = props.message;
  const messageClass = sender === userId ? "sent" : "received";
  return (
    <>
      <div className={`message ${messageClass}`}>
        <p>{text}</p>
      </div>
    </>
  );
}
