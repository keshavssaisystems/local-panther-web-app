import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig, servers } from "../firebase/index";

export const CustomerVideoScreen = () => {
  const [inputVal, setInputVal] = useState("");
  const [callBtnDisable, setCallBtnDisable] = useState(true);
  const [webCamBtnDisable, setWebCamBtnDisable] = useState(false);
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  // Global State
  const pc = new RTCPeerConnection(servers);
  let localStream = null;
  let remoteStream = null;

  const onWebCamClick = async () => {
    localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    remoteStream = new MediaStream();

    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        remoteStream.addTrack(track);
      });
    };

    const webcamVideo = document.getElementById("webcamVideo");

    const remoteVideo = document.getElementById("remoteVideo");
    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    setCallBtnDisable(false);
    // answerButton.disabled = false;
    setWebCamBtnDisable(true);
  };

  // 2. Create an offer
  const onCreateCall = async () => {
    // Reference Firestore collections for signaling
    const callDoc = firestore.collection("calls").doc();
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    // callInput.value = callDoc.id;
    setInputVal(callDoc.id);

    // Get candidates for caller, save to db
    pc.onicecandidate = (event) => {
      event.candidate && offerCandidates.add(event.candidate.toJSON());
    };

    // Create offer
    const offerDescription = await pc.createOffer();
    await pc.setLocalDescription(offerDescription);

    const offer = {
      sdp: offerDescription.sdp,
      type: offerDescription.type,
    };

    await callDoc.set({ offer });

    // Listen for remote answer
    callDoc.onSnapshot((snapshot) => {
      const data = snapshot.data();
      if (!pc.currentRemoteDescription && data?.answer) {
        const answerDescription = new RTCSessionDescription(data.answer);
        pc.setRemoteDescription(answerDescription);
      }
    });

    // When answered, add candidate to peer connection
    answerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const candidate = new RTCIceCandidate(change.doc.data());
          pc.addIceCandidate(candidate);
        }
      });
    });

    // hangupButton.disabled = false;
  };

  return (
    <div>
      <h3>Create Call Screen</h3>
      <div class="videos">
        <span>
          <h3>Customer Stream</h3>
          <video id="webcamVideo" playsInline autoPlay></video>
        </span>
        <span>
          <h3>Candidate Stream</h3>
          <video id="remoteVideo" playsInline autoPlay></video>
        </span>
      </div>

      <button
        id="webcamButton"
        disabled={webCamBtnDisable}
        onClick={() => onWebCamClick()}
      >
        Start webcam
      </button>
      <button
        id="callButton"
        disabled={callBtnDisable}
        onClick={() => onCreateCall()}
      >
        Create Call (offer)
      </button>
      <input id="callInput" value={inputVal} />
    </div>
  );
};
