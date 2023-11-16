import React, { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { firebaseConfig, servers } from "../firebase/index";
import { Row, Col } from "reactstrap";
import { useParams, useNavigate } from "react-router-dom";
import "./video.scss";

export const VideoScreen = () => {
  const { ...rest } = useParams();
  let id = rest["*"] ? rest["*"] : "";
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  let name = userDetails
    ? userDetails.FirstName + " " + userDetails.LastName
    : "";
  const navigate = useNavigate();
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const firestore = firebase.firestore();
  // Global State

  const pc = new RTCPeerConnection(servers);

  let localStream = null;
  let remoteStream = null;
  useEffect(() => {
    onWebCamClick();
  }, []);
  const onWebCamClick = async () => {
    localStream = await navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((data) => {
        return data;
      })
      .catch((err) => {
        console.log(err);
      });

    remoteStream = new MediaStream();
    // Push tracks from local stream to peer connection
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });

    // Pull tracks from remote stream, add to video stream
    pc.ontrack = (event) => {
      event.streams[0].getTracks().forEach((track) => {
        console.log(track);

        remoteStream.addTrack(track);
      });
    };

    const webcamVideo = document.getElementById("webcamVideo");
    const remoteVideo = document.getElementById("remoteVideo");
    // const webcamButton = document.getElementById("webcamButton");
    // const answerButton = document.getElementById("answerButton");

    webcamVideo.srcObject = localStream;
    remoteVideo.srcObject = remoteStream;
    // answerButton.disabled = false;
    // webcamButton.disabled = true;
    JoinCall();
  };

  // 2. Create an offer
  const onCreateCall = async () => {
    // Reference Firestore collections for signaling
    const callDoc = firestore.collection("channels").doc(id);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

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

  const onAnswerClick = async () => {
    const callDoc = firestore.collection("channels").doc(id);
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

  const JoinCall = async () => {
    // Reference Firestore collections for signaling
    const callDoc = firestore.collection("channels").doc(id);
    const offerCandidates = callDoc.collection("offerCandidates");
    const answerCandidates = callDoc.collection("answerCandidates");

    const callData = (await callDoc.get()).data();
    if (!callData) {
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
    } else {
      pc.onicecandidate = (event) => {
        event.candidate && answerCandidates.add(event.candidate.toJSON());
      };

      const offerDescription = callData.offer;
      await pc.setRemoteDescription(
        new RTCSessionDescription(offerDescription)
      );

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
    }
  };

  const onLeaveCall = async () => {
    const tracks = document.querySelector("#webcamVideo").srcObject.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => track.stop());
    }

    if (pc) {
      pc.close();
    }
    const roomRef = firestore.collection("channels").doc(id);
    const calleeCandidates = await roomRef.collection("answerCandidates").get();
    calleeCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });
    const callerCandidates = await roomRef.collection("offerCandidates").get();
    callerCandidates.forEach(async (candidate) => {
      await candidate.ref.delete();
    });
    await roomRef.delete();
    navigate("/");
  };

  return (
    <Row className="video-cont">
      <h3>Video Call Screen</h3>
      <div style={{ display: "flex" }}>
        <Col md={6} lg={6} sm={12}>
          <span>
            <h4>User Stream</h4>
            <video controls id="webcamVideo" playsInline autoPlay></video>
          </span>
        </Col>
        <Col md={6} lg={6} sm={12}>
          <span>
            <h4>Remote Stream</h4>
            <video controls id="remoteVideo" playsInline autoPlay></video>
          </span>
        </Col>
      </div>

      <Col md={2} lg={2} sm={12}></Col>
      <Col md={2} lg={2} sm={12}>
        {" "}
        <button id="callButton" onClick={() => onLeaveCall()}>
          Leave Call
        </button>
      </Col>
      <Col md={2} lg={2} sm={12}></Col>
    </Row>
  );
};
