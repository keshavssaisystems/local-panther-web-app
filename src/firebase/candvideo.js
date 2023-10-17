import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig, servers } from "../firebase/index";

export const CandVideoScreen = () => {
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
    const webcamButton = document.getElementById("webcamButton");
    const answerButton = document.getElementById("answerButton");

    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;
    answerButton.disabled = false;
    webcamButton.disabled = true;
  };

  const onAnswerClick = async () => {
    const callInput = document.getElementById("callInput");
    const callId = callInput.value;
    const callDoc = firestore.collection("calls").doc(callId);
    const answerCandidates = callDoc.collection("answerCandidates");
    const offerCandidates = callDoc.collection("offerCandidates");

    pc.onicecandidate = (event) => {
      event.candidate && answerCandidates.add(event.candidate.toJSON());
    };

    const callData = (await callDoc.get()).data();

    const offerDescription = callData.offer;
    await pc.setRemoteDescription(new RTCSessionDescription(offerDescription));

    const answerDescription = await pc.createAnswer();
    await pc.setLocalDescription(answerDescription);

    const answer = {
      type: answerDescription.type,
      sdp: answerDescription.sdp,
    };

    await callDoc.update({ answer });

    offerCandidates.onSnapshot((snapshot) => {
      snapshot.docChanges().forEach((change) => {
        console.log(change);
        if (change.type === "added") {
          let data = change.doc.data();
          pc.addIceCandidate(new RTCIceCandidate(data));
        }
      });
    });
  };

  return (
    <div>
      <h3>Accept Call Screen</h3>
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

      <button id="webcamButton" onClick={() => onWebCamClick()}>
        Start webcam
      </button>

      <input id="callInput" />
      <button id="answerButton" disabled onClick={() => onAnswerClick()}>
        Answer
      </button>
    </div>
  );
};
