import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Label } from "reactstrap";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { IoMicOutline } from "react-icons/io5";
import "./speechToTextInput.css";

export const SpeechToTextInput = () => {
  const [input1, setInput1] = useState("");

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
          setInput1(newText);
          break;

        default:
          break;
      }
    }
  }, [transcript, listening, activeInput]);

  // Function to handle mic icon click for an input
  const handleMicClick = (inputName, inputRef) => {
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
          initialContent = input1;
          break;

        default:
          initialContent = "";
      }
      currentInputContentRef.current = initialContent;

      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
      if (inputRef.current) {
        inputRef.current.focus();
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
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
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
                ? "Stop Listening"
                : "Start Listening"
            }
          >
            {/* Use IoMicOutline for outline icon */}
            <IoMicOutline className="mic-icon" />
          </button>
        )}
        <button
          className={`mic-button1 mic-button ${
            activeInput === "input1" && listening ? "active-listening" : ""
          }`}
          onClick={() => handleMicClick("input1", input1Ref)}
          title={
            activeInput === "input1" && listening
              ? "Stop Listening"
              : "Start Listening"
          }
        >
          {/* Use IoMicOutline for outline icon */}
          <IoMicOutline className="mic-icon" />
        </button>
      </div>
    </div>
  );
};
