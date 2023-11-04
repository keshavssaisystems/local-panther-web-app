import React, { useState, memo } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig, servers } from "../firebase/index";
import { Row, Col } from "reactstrap";
import "./video.scss";
export const CustomerVideoScreen = memo(function CustomerVideoScreen() {
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
    const callButton = document.getElementById("callButton");

    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;

    callButton.disabled = false;
    // answerButton.disabled = false;
    webcamButton.disabled = true;
  };

  // 2. Create an offer
  const onCreateCall = async () => {
    // Reference Firestore collections for signaling
    const callDoc = firestore.collection("calls").doc();
    console.log(callDoc);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");
    const callInput = document.getElementById("callInput");
    callInput.value = callDoc.id;

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
  };

  return (
    <Row className="video-cont">
      <h3>Create Call Screen</h3>
      <div style={{ display: "flex" }}>
        <Col md={6} lg={6} sm={12}>
          <span>
            <h4>Customer Stream</h4>
            <video controls id="webcamVideo" playsInline autoPlay></video>
          </span>
        </Col>
        <Col md={6} lg={6} sm={12}>
          <span>
            <h4>Candidate Stream</h4>
            <video controls id="remoteVideo" playsInline autoPlay></video>
          </span>
        </Col>
      </div>
      <Col md={2} lg={2} sm={12}>
        <button id="webcamButton" onClick={() => onWebCamClick()}>
          Start webcam
        </button>
      </Col>
      <Col md={2} lg={2} sm={12}>
        <button id="callButton" onClick={() => onCreateCall()}>
          Create Call (offer)
        </button>
      </Col>
      <Col md={2} lg={2} sm={12}>
        <input id="callInput" />
      </Col>
    </Row>
  );
});
