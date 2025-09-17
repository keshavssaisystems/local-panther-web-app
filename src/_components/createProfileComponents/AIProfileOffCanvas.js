import React, { useState, useRef, useEffect } from "react";
import {
    Row,
    Col,
    Button,
    Offcanvas,
    OffcanvasHeader,
    OffcanvasBody,
} from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { use } from "react";
import { getProfileActions } from "_store";
import { SpeechToTextInput } from "_components/common/speechToTextInput";
import { set, update } from "lodash";
import Spinner from "reactstrap/lib/Spinner";
import axios from "axios";
import { EducationAIProfile } from "./educationAIProfile";
import { EducationModal } from "_containers/candidate/educationModal";
export default function AIProfileOffCanvas({ aiDescriptionData }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const [input1, setInput1] = useState("");
    const [loadInput, setLoadInput] = useState(false);
    const [lastJDOP, setLastJDOP] = useState("");
    const [generatedHtml, setGeneratedHtml] = useState("");
    const bottomRef = useRef(null);
    const [bottomHeight, setBottomHeight] = useState(156);
    const loadAIProfileCanvas = useSelector((state) => state.getProfile?.loadAIProfileCanvas);
    const [aiResponse, setAIResponse] = useState([]);
    useEffect(() => {
        setIsOpen(loadAIProfileCanvas);
    }, [loadAIProfileCanvas]);

    const toggleOffcanvas = () => {
        dispatch(getProfileActions.updateLoadAIProfileCanvas(!isOpen));
        setIsOpen(!isOpen);
        setInput1("");
    };


    const handleUpdateData = async () => {
        setLoadInput(true);
        const authData = localStorage.getItem("token") ? localStorage.getItem("token") : "";
        const config = {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${authData}`,
            },
        };

        const baseURI = `${process.env.REACT_APP_AI_JD}`;

        let data = {
            command: input1,
            CurrentUserId: localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : 0
        };
        if (input1.trim() !== "") {
            data = {
                command: input1,
                CurrentUserId: localStorage.getItem("userId") ? Number(localStorage.getItem("userId")) : 0
            };
        }
        await axios
            .post(`${baseURI}/candidate_profile_update`, data, config)
            .then(async (result) => {
                console.log("result", result);
                if (result?.data?.job && result?.data?.job?.length > 0) {
                    let html = generatedHtml;
                    let newHtml = await getGeneratedHtml(result?.data?.job[0]);
                    //     setLastJDOP(result?.data?.job[0]);
                    html += newHtml;
                    setGeneratedHtml(html);
                    setInput1("");
                    setTimeout(() => {
                        const element = document.getElementsByClassName(
                            "canvas-detail-div"
                        );
                        if (element?.length > 0) {
                            element[0].scrollTop = element[0].scrollHeight;
                        }
                    });
                }
            })
            .catch((error) => { });
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
        }
        else if (data) {
            let updatedData = "<b>"
            setAIResponse(data);
            // if (data?.certifications) {
            //     //+ data?.certifications;
            //     updatedData += getCertifictateHTML(data);
            // }
            // // let updatedData = "<b> Certifications</b>";
            // // console.log("data?.certifications", data?.certifications);
            // updatedData = updatedData.replaceAll("Certifications:", "Certifications:</b>");
            // updatedData = updatedData.replaceAll("\n\n", "<BR><BR><b>");
            // //   let updatedJD = "<b>" + data?.job_description;
            // //   updatedJD = updatedJD.replaceAll("Title:", "Title:</b>");
            // //   updatedJD = updatedJD.replaceAll("\n\n", "<BR><BR><b>");
            // //   updatedJD = updatedJD.replaceAll("\n", "</b><BR>");
            // let htmlData = `<div class="desc-div">${updatedData}</div>`;
            // text += htmlData;
        }
        return text;
    };
    const getCertifictateHTML = (data) => {
        let updatedData = "<b>"
        // if (data?.certifications) {
        //     return (
        //         ` <div>
        //             <h5>Education</h5>

        //             {/* Updated Card */}
        //             <div
        //                 style={{
        //                     border: "2px solid #facc15",
        //                     borderRadius: "8px",
        //                     padding: "16px",
        //                     backgroundColor: "#fefce8",
        //                     marginBottom: "20px",
        //                     position: "relative",
        //                 }}
        //             >
        //                 <span
        //                     style={{
        //                         position: "absolute",
        //                         top: "-10px",
        //                         right: "10px",
        //                         background: "#f59e0b",
        //                         color: "white",
        //                         padding: "2px 8px",
        //                         borderRadius: "6px",
        //                         fontSize: "12px",
        //                     }}
        //                 >
        //                     Updated
        //                 </span>

        //                 <div className="row mb-2">
        //                     <div className="col-md-6">
        //                         <label>Level of education</label>
        //                         <select className="form-control" defaultValue="Master">
        //                             <option>Master's Degree</option>
        //                         </select>
        //                     </div>
        //                     <div className="col-md-6">
        //                         <label>Field of study</label>
        //                         <select className="form-control" defaultValue="CS">
        //                             <option>Computer Science</option>
        //                         </select>
        //                     </div>
        //                 </div>

        //                 <div className="mb-2">
        //                     <label>School</label>
        //                     <input
        //                         type="text"
        //                         className="form-control"
        //                         defaultValue="International College of Arts and Science (UG)"
        //                     />
        //                 </div>

        //                 <div className="row mb-2">
        //                     <div className="col-md-6">
        //                         <label>City, State</label>
        //                         <select className="form-control" defaultValue="LA">
        //                             <option>Los Angeles, California</option>
        //                         </select>
        //                     </div>
        //                     <div className="col-md-6">
        //                         <label>Country</label>
        //                         <select className="form-control" defaultValue="USA">
        //                             <option>USA</option>
        //                         </select>
        //                     </div>
        //                 </div>

        //                 <div className="row mb-2">
        //                     <div className="col-md-6">
        //                         <label>From</label>
        //                         <div className="d-flex gap-2">
        //                             <select className="form-control" defaultValue="Jan">
        //                                 <option>Jan</option>
        //                             </select>
        //                             <select className="form-control" defaultValue="2020">
        //                                 <option>2020</option>
        //                             </select>
        //                         </div>
        //                     </div>
        //                     <div className="col-md-6">
        //                         <label>To</label>
        //                         <div className="d-flex gap-2">
        //                             <select className="form-control" defaultValue="Aug">
        //                                 <option>Aug</option>
        //                             </select>
        //                             <select className="form-control" defaultValue="2025">
        //                                 <option>2025</option>
        //                             </select>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>

        //             {/* Deleted Card */}
        //             <div
        //                 style={{
        //                     border: "2px dashed red",
        //                     borderRadius: "8px",
        //                     padding: "16px",
        //                     backgroundColor: "#fef2f2",
        //                     position: "relative",
        //                 }}
        //             >
        //                 <span
        //                     style={{
        //                         position: "absolute",
        //                         top: "-10px",
        //                         right: "10px",
        //                         background: "red",
        //                         color: "white",
        //                         padding: "2px 8px",
        //                         borderRadius: "6px",
        //                         fontSize: "12px",
        //                     }}
        //                 >
        //                     Deleted
        //                 </span>

        //                 <div style={{ opacity: 0.6, pointerEvents: "none" }}>
        //                     <div className="row mb-2">
        //                         <div className="col-md-6">
        //                             <label>Level of education</label>
        //                             <select className="form-control" disabled defaultValue="HSC">
        //                                 <option>Higher Secondary Certificate (HSC)</option>
        //                             </select>
        //                         </div>
        //                         <div className="col-md-6">
        //                             <label>Field of study</label>
        //                             <select className="form-control" disabled defaultValue="Science">
        //                                 <option>Science</option>
        //                             </select>
        //                         </div>
        //                     </div>

        //                     <div className="mb-2">
        //                         <label>School</label>
        //                         <input
        //                             type="text"
        //                             className="form-control"
        //                             disabled
        //                             defaultValue="John Higher Secondary School"
        //                         />
        //                     </div>

        //                     <div className="row mb-2">
        //                         <div className="col-md-6">
        //                             <label>City, State</label>
        //                             <select className="form-control" disabled>
        //                                 <option>Los Angeles, California</option>
        //                             </select>
        //                         </div>
        //                         <div className="col-md-6">
        //                             <label>Country</label>
        //                             <select className="form-control" disabled>
        //                                 <option>USA</option>
        //                             </select>
        //                         </div>
        //                     </div>

        //                     <div className="row mb-2">
        //                         <div className="col-md-6">
        //                             <label>From</label>
        //                             <div className="d-flex gap-2">
        //                                 <select className="form-control" disabled>
        //                                     <option>Jan</option>
        //                                 </select>
        //                                 <select className="form-control" disabled>
        //                                     <option>2014</option>
        //                                 </select>
        //                             </div>
        //                         </div>
        //                         <div className="col-md-6">
        //                             <label>To</label>
        //                             <div className="d-flex gap-2">
        //                                 <select className="form-control" disabled>
        //                                     <option>Mar</option>
        //                                 </select>
        //                                 <select className="form-control" disabled>
        //                                     <option>2016</option>
        //                                 </select>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>

        //                 <h6
        //                     style={{
        //                         textAlign: "center",
        //                         marginTop: "10px",
        //                         color: "red",
        //                         fontWeight: "bold",
        //                         transform: "rotate(-10deg)",
        //                     }}
        //                 >
        //                     DELETED
        //                 </h6>
        //             </div>
        //         </div>`
        //     );
        // }
    }
    const [selectedData, setSelectedData] = useState({});
    const handlePageChange = () => {

    };

    return (
        <div>
            <Offcanvas direction="end" isOpen={isOpen} toggle={() => setIsOpen(!isOpen)}>
                <OffcanvasHeader toggle={() => toggleOffcanvas()}>Update Profile with OpenWorx Agent</OffcanvasHeader>
                <hr style={{ margin: "0px" }}></hr>
                <OffcanvasBody
                    className="jd-covas-body"
                    style={{
                        padding: "8px",
                        height: "calc(100vh - 60px)",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <div style={{ padding: "4px" }}>
                        <div
                            style={{
                                height: `calc(100vh - 84px - ${bottomHeight}px)`,
                                overflowY: "auto",
                                marginBottom: "4px",
                            }}
                            className="canvas-detail-div"
                        >
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
                            ) : (<>
                                <div dangerouslySetInnerHTML={{ __html: generatedHtml }} />
                                {aiResponse && aiResponse?.EducationList && (<EducationAIProfile aiResponse={aiResponse?.EducationList}></EducationAIProfile>)}
                                {/* <EducationModal
                                    onCallEducation={() => handlePageChange()}
                                    selected={selectedData}
                                    check={"add"}
                                /> */}

                            </>
                            )}
                        </div>
                        <div ref={bottomRef} style={{ width: "calc(100% - 24px)", textAlign: "center", }}>
                            <SpeechToTextInput setInput1={setInput1} input1={input1} handleUpdateData={() => handleUpdateData()} loadInput={loadInput} />
                            <Button className="mt-2" color="primary">
                                Use this draft and proceed
                            </Button>
                        </div>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </div>
    );
}