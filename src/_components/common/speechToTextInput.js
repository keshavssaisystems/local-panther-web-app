import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Label } from "reactstrap";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { IoMicOutline } from "react-icons/io5";
import MicroPhone from "../../assets/utils/images/job-detail-icons/microphone.svg";
import MicroPhoneStart from "../../assets/utils/images/job-detail-icons/microphone-start.svg";
import Upload from "../../assets/utils/images/job-detail-icons/upload-icon.svg";
import UploadStart from "../../assets/utils/images/job-detail-icons/upload-icon-start.svg";
import "./speechToTextInput.css";

export const SpeechToTextInput = (props) => {
  // const [input1, setInput1] = useState("");

  const [activeInput, setActiveInput] = useState(null); // 'input1', 'input2', 'input3', or null

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const input1Ref = useRef(null);
  const currentInputContentRef = useRef("");

  // Effect to update the active input box with the transcript
  useEffect(() => {
    if (listening && activeInput) {
      const currentContent = currentInputContentRef.current;
      const newText = currentContent + transcript;

      switch (activeInput) {
        case "input1":
          props.setInput1(newText);
          break;

        default:
          break;
      }
    }
  }, [transcript, listening, activeInput]);

  // Function to handle mic icon click for an input
  const handleMicClick = async (inputName, inputRef) => {
    // let mAccess = await checkMicAccess();
    // if (mAccess) {
    if (listening && activeInput === inputName) {
      SpeechRecognition.stopListening();
      resetTranscript();
      setActiveInput(null);
      currentInputContentRef.current = "";
    } else {
      SpeechRecognition.stopListening();
      resetTranscript();
      setActiveInput(inputName);

      let initialContent = "";
      switch (inputName) {
        case "input1":
          initialContent = props.input1;
          break;

        default:
          initialContent = "";
      }
      currentInputContentRef.current = initialContent;

      SpeechRecognition.startListening({
        continuous: true,
        language: "en-IN",
      });
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
    // }
  };
  const checkMicAccess = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Microphone access is not supported in this browser.");
      return;
    }

    try {
      // Request mic access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // alert("Microphone access granted ✅");
      // stream.getTracks().forEach((track) => track.stop()); // Stop after checking
    } catch (error) {
      if (error.name === "NotAllowedError") {
        alert(
          "Microphone access denied ❌. Please enable it in your browser settings."
        );
      } else if (error.name === "NotFoundError") {
        alert("No microphone found on this device.");
      } else {
        alert("Mic access error: " + error.message);
      }
    }
  };
  //   if (!browserSupportsSpeechRecognition) {
  //     return (
  //       <div className="sptcontainer">
  //         <p>
  //           Your browser doesn't support speech recognition. Try Chrome or Edge.
  //         </p>
  //       </div>
  //     );
  //   }
  return (
    <div className="sptcontainer">
      <div className="input-group">
        <textarea
          value={props.input1}
          onChange={(e) => props.setInput1(e.target.value)}
          placeholder="Type your prompt here ..."
          ref={input1Ref}
          className={
            activeInput === "input1" && listening ? "listening-active" : ""
          }
          rows="4"
        />
        {browserSupportsSpeechRecognition && (
          <button
            className={`mic-button ${
              activeInput === "input1" && listening ? "active-listening" : ""
            }`}
            onClick={() => handleMicClick("input1", input1Ref)}
            title={
              activeInput === "input1" && listening
                ? "Stop dictate"
                : "Start dictate"
            }
          >
            {/* Use IoMicOutline for outline icon */}
            {activeInput === "input1" && listening ? (
              <img
                src={MicroPhoneStart}
                alt="microphone-icon"
                height={28}
                width={28}
              />
            ) : (
              <img
                src={MicroPhone}
                alt="microphone-icon"
                height={28}
                width={28}
              />
            )}
          </button>
        )}
        <button
          className={`mic-button1 mic-button ${
            activeInput === "input1" && listening ? "active-listening" : ""
          } ${!props.input1 ? "disabled-col" : ""}`}
          onClick={() => props.handleUpdateData()}
          // title={
          //   activeInput === "input1" && listening
          //     ? "Stop Listening"
          //     : "Start Listening"
          // }
        >
          {/* Use IoMicOutline for outline icon */}
          {props.loadInput ? (
            <img
              src={UploadStart}
              alt="upload-icon"
              height={28}
              width={28}
              title="Submit to prompt"
            />
          ) : (
            <img
              src={Upload}
              alt="upload-icon"
              height={28}
              width={28}
              title="Submit to prompt"
            />
          )}
        </button>
      </div>
    </div>
  );
};
