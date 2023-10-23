import React, { useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig, servers } from "../firebase/index";
import { Row, Col } from "reactstrap";
import "./video.scss";
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
    <Row className="video-cont">
      <h3>Accept Call Screen</h3>
      <div style={{ display: "flex" }}>
        <Col md={6} lg={6} sm={12}>
          <span>
            <h4>Candidate Stream</h4>
            <video controls id="webcamVideo" playsInline autoPlay></video>
          </span>
        </Col>
        <Col md={6} lg={6} sm={12}>
          <span>
            <h4>Customer Stream</h4>
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
        <input id="callInput" />
      </Col>
      <Col md={2} lg={2} sm={12}>
        <button id="answerButton" onClick={() => onAnswerClick()}>
          Answer
        </button>
      </Col>
    </Row>
  );
};
