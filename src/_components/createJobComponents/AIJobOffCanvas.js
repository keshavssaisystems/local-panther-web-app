import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Label,
  Button,
  Offcanvas,
  OffcanvasHeader,
  OffcanvasBody,
  Spinner,
} from "reactstrap";
import { SpeechToTextInput } from "_components/common/speechToTextInput";
import { useDispatch, useSelector } from "react-redux";
import { jobTypeActions } from "_store";
import axios from "axios";
import { notify } from "_helpers/observerService";
import { formatAIJobData } from "./jobData";
import "./createJob.scss";
import "./AIJobCanvas.css";

export default function AIJobOffCanvas({ aiDescriptionData }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [input1, setInput1] = useState("");
  const [loadInput, setLoadInput] = useState(false);
  const [lastJDOP, setLastJDOP] = useState("");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const loadAIJDCanvas = useSelector((state) => state.jobType.loadAIJDCanvas);
  useEffect(() => {
    setIsOpen(loadAIJDCanvas);
  }, [loadAIJDCanvas]);
  const toggleOffcanvas = () => {
    dispatch(jobTypeActions.updateLoadAIJDCanvas(!isOpen));
    setInput1("");
    setGeneratedHtml("");
    setLastJDOP("");
    setLoadInput(false);
  };

  const getGeneratedHtml = async (data) => {
    let text = "";
    text = `<div class="command-div-ext"><div class="command-div" > ${data.command} </div></div>`;
    if (data?.error) {
      let error = `<div
          class="error-div"
        >
          ${data.error}
        </div>`;
      text += error;
    } else if (data?.job_description) {
      let updatedJD = "<b>" + data?.job_description;
      updatedJD = updatedJD.replaceAll("Title:", "Title:</b>");
      updatedJD = updatedJD.replaceAll("\n\n", "<BR><BR><b>");
      updatedJD = updatedJD.replaceAll("\n", "</b><BR>");
      let jd = `<div class="desc-div">${updatedJD}</div>`;
      text += jd;
    }

    return text;
  };

  const handleUpdateData = async () => {
    setLoadInput(true);
    const authData = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${authData}`,
      },
    };

    const baseURI = `${process.env.REACT_APP_AI_JD}`;

    let data = {
      command: input1,
      CurrentUserId: localStorage.getItem("userId")
        ? Number(localStorage.getItem("userId"))
        : 0,
    };
    if (lastJDOP?.job_description) {
      data = {
        command: input1,
        CurrentUserId: localStorage.getItem("userId")
          ? Number(localStorage.getItem("userId"))
          : 0,
        id: lastJDOP.id,
        chatid: lastJDOP.chatid,
        last_output: lastJDOP.job_description,
      };
    }
    await axios
      .post(`${baseURI}/command_to_JD`, data, config)
      .then(async (result) => {
        if (result?.data?.job && result?.data?.job?.length > 0) {
          let html = generatedHtml;
          let newHtml = await getGeneratedHtml(result?.data?.job[0]);
          setLastJDOP(result?.data?.job[0]);
          html += newHtml;
          setGeneratedHtml(html);
          setInput1("");
          setTimeout(() => {
            const element = document.getElementsByClassName(
              "canvas-jd-detail-div"
            );
            if (element?.length > 0) {
              element[0].scrollTop = element[0].scrollHeight;
            }
          });
        }
      })
      .catch((error) => {});
    setLoadInput(false);
  };

  const proceedThisDraft = async () => {
    const authData = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const config = {
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${authData}`,
      },
    };

    const baseURI = `${process.env.REACT_APP_AI_JD}`;
    let data = { jd: lastJDOP.job_description.replaceAll("/n", " ") };
    await axios
      .post(`${baseURI}/jd_to_job`, data, config)
      .then(async (result) => {
        if (result?.data?.job) {
          let aiJD = await formatAIJobData(result?.data?.job);

          // setAIJobDetail(aiJD);
          // setNavState(compState + 1);
          notify({ data: aiJD });
          localStorage.setItem("Aijobeventid", lastJDOP.id);
          dispatch(jobTypeActions.updateLoadAIJDCanvas(false));
          setInput1("");
          setGeneratedHtml("");
          setLastJDOP("");
          setLoadInput(false);
        }
      })
      .catch((error) => {});
  };

  return (
    <>
      <Row className="mt-4">
        <Col md={12} className="ml-15">
          <Offcanvas
            style={{ width: "40%" }}
            isOpen={isOpen}
            // toggle={toggleOffcanvas}
            direction="end"
          >
            <OffcanvasHeader toggle={toggleOffcanvas}>
              Generate Job with OpenWorX Agent
            </OffcanvasHeader>
            <hr style={{ margin: "0px" }}></hr>
            <OffcanvasBody className="jd-covas-body" style={{ padding: "8px" }}>
              <div style={{ padding: "4px" }}>
                <div className="canvas-jd-detail-div">
                  {loadInput ? (
                    <div
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <Spinner
                        color="primary"
                        style={{ height: "3rem", width: "3rem" }}
                        type="grow"
                      >
                        Loading...
                      </Spinner>
                    </div>
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                  )}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    width: "calc(100% - 24px)",
                    textAlign: "center",
                  }}
                >
                  <SpeechToTextInput
                    setInput1={setInput1}
                    input1={input1}
                    handleUpdateData={() => handleUpdateData()}
                    loadInput={loadInput}
                  ></SpeechToTextInput>
                  <Button
                    disabled={!lastJDOP.job_description || lastJDOP.error}
                    onClick={() => proceedThisDraft()}
                    className="mt-2"
                    color="primary"
                  >
                    Use this draft and proceed
                  </Button>
                </div>
              </div>
            </OffcanvasBody>
          </Offcanvas>
        </Col>
      </Row>
    </>
  );
}
