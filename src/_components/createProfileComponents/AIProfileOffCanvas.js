import React, { useState, useRef, useEffect } from "react";
import { Row, Col, Button, Offcanvas, OffcanvasHeader, OffcanvasBody, } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { use } from "react";
import { getProfileActions } from "_store";
import { SpeechToTextInput } from "_components/common/speechToTextInput";
import { set, update } from "lodash";
import Spinner from "reactstrap/lib/Spinner";
import axios from "axios";
import { EducationAIProfile } from "./educationAIProfile";
import { convertDateToYYYMMDD, extractDatePart, checkDateValidation, } from "_helpers/helper";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
import { QualificationAIProfile } from "./qualificationAIProfile";
import SkillAIProfile from "./skillAIProfile";
import "./AIProfileCanvas.scss";

export default function AIProfileOffCanvas({ aiDescriptionData }) {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(true);
    const [input1, setInput1] = useState("");
    const [loadInput, setLoadInput] = useState(false);
    const [generatedHtml, setGeneratedHtml] = useState("");
    const bottomRef = useRef(null);
    const [bottomHeight, setBottomHeight] = useState(156);
    const loadAIProfileCanvas = useSelector((state) => state.getProfile?.loadAIProfileCanvas);
    const [aiResponse, setAIResponse] = useState({ EducationList: [] });
    const [educationData, setEducationData] = useState([]);
    const [qualifactionData, setQualifactionData] = useState([]);
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
                let profileData = result?.data?.Profile_data;

                if (profileData) {

                    if (profileData?.EducationList?.length > 0) {
                        let Educations = profileData?.EducationList?.map((edu) => ({
                            ...edu,
                            iscurrentlystudying: false,
                            startdate: "",
                            enddate: "",
                            fromDateSelect: {
                                month: '',
                                year: '',
                            },
                            toDateSelect: {
                                month: '',
                                year: '',
                            },
                            error: '',
                            fromDateValid: false,
                            fromMonthReq: false,
                            fromYearReq: false,
                            toMonthReq: false,
                            toYearReq: false
                        }))

                        profileData.EducationList = Educations;
                    }
                    if (profileData?.QualificationList?.length > 0) {
                        let qualifications = profileData?.QualificationList?.map((q) => ({
                            ...q,
                            iscurrentlyworking: false,
                            startdate: "",
                            enddate: "",
                            fromDateSelect: {
                                month: '',
                                year: '',
                            },
                            toDateSelect: {
                                month: '',
                                year: '',
                            },
                            error: '',
                            fromDateValid: false,
                            fromMonthReq: false,
                            fromYearReq: false,
                            toMonthReq: false,
                            toYearReq: false
                        }))
                        profileData.QualificationList = qualifications;
                    }


                    let html = generatedHtml;
                    //let newHtml = await getGeneratedHtml(result?.data?.Profile_data[0]);
                    let newHtml = await getGeneratedHtml(result?.data?.Profile_data);
                    //setAIResponse(profileData[0]);
                    setAIResponse(profileData);
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

        }
        return text;
    };

    const isValidQualification = () => {
        let new_data = { ...aiResponse };
        let valid = true;
        for (let i = 0; i < new_data.QualificationList.length; i++) {
            if (new_data.QualificationList[0].operation != "delete") {
                if (new_data.QualificationList[i].jobtitle == "") {
                    new_data.QualificationList[i].error = true;
                    valid = false;
                }
                if (
                    new_data.QualificationList[i].fromDateSelect.month == "" ||
                    !new_data.QualificationList[i].fromDateSelect.month
                ) {
                    new_data.QualificationList[i].fromDateReq = true;
                    valid = false;
                }
                if (
                    new_data.QualificationList[i].fromDateSelect.year == "" ||
                    !new_data.QualificationList[i].fromDateSelect.year
                ) {
                    new_data.QualificationList[i].fromYearReq = true;
                    valid = false;
                }

                if (
                    new_data.QualificationList[i].toDateSelect.month == "" ||
                    !new_data.QualificationList[i].toDateSelect.month
                ) {
                    new_data.QualificationList[i].toDateReq = true;
                    valid = false;
                }

                if (
                    new_data.QualificationList[i].toDateSelect.year == "" ||
                    !new_data.QualificationList[i].toDateSelect.year
                ) {
                    new_data.QualificationList[i].toYearReq = true;
                    valid = false;
                }
                if (new_data.QualificationList[i].fromDateValid) {
                    valid = false;
                }
                setAIResponse(new_data);
            }
        }
        return valid;
    }
    const submitProfileData = async () => {
        let updatedData = { ...aiResponse };
        console.log("submitted data", updatedData);
        if (updatedData?.EducationList?.length === 0 && updatedData?.QualificationList?.length === 0 && updatedData?.SkillsList?.length === 0) {
            return;
        }
        const authData = localStorage.getItem("token") ? localStorage.getItem("token") : "";
        const config = {
            headers: {
                "content-type": "application/json",
                Authorization: `Bearer ${authData}`,
            },
        };

        const baseURI = `${process.env.REACT_APP_NEW_API_URL}`;
        let educations = [];
        let qualifactions = [];
        // let error_data = [...updatedData];
        for (let i = 0; i < updatedData.EducationList.length; i++) {
            if (updatedData.EducationList[i].operation != "delete") {
                if (updatedData.EducationList[i].levelofeducation === "") {
                    updatedData.EducationList[i].error = true;
                    setAIResponse(updatedData);
                    return;
                }
                if (updatedData.EducationList[i].fromMonthReq || updatedData.EducationList[i].fromYearReq || updatedData.EducationList[i].toMonthReq || updatedData.EducationList[i].toYearReq) {
                    return;
                }
            }
        }

        if (!isValidQualification(updatedData?.QualificationList)) {
             dispatch(showSnackbar({
                        message: "Qaulification data is not valid",
                        type: SNACKBAR_TYPES.WARNING,
                        position: SNACKBAR_POSITION.TOP_CENTER,
                        autoClose: true,
                        autoCloseDelay: 2000,
                        maxWidth: 500,
                    }));
            return;
        }

        updatedData.EducationList.map((value, key) => {
            var education = {
                candidateeducationid: value.candidateeducationid,
                startdate: value.operation === "delete" ? null : value.fromDateSelect ? convertDateToYYYMMDD(value.fromDateSelect) : null,
                enddate: value.operation === "delete" ? null : value.toDateSelect ? convertDateToYYYMMDD(value.toDateSelect) : null,
                fieldofstudy: value.fieldofstudy,
                fieldofstudyid: value.fieldofstudyid,
                levelofeducation: value.levelofeducation,
                levelofeducationid: value.levelofeducationid,
                operation: value.operation,
                school: value.school,
                countryid: value.countryid,
                cityid: value.cityid,
                stateid: value.stateid
            }
            educations.push(education);
        })

        updatedData.QualificationList.map((value, key) => {
            var qualifaction = {
                candidatequalificationid: value.candidatequalificationid,
                startdate: value.operation === "delete" ? null : convertDateToYYYMMDD(value.fromDateSelect),
                enddate: value.operation === "delete" || value.iscurrentlyworking ? null : convertDateToYYYMMDD(value.toDateSelect),
                company: value.company,
                iscurrentlyworking: value.iscurrentlyworking,
                jobtitle: value.jobtitle,
                jobdescription: value.jobdescription,
                operation: value.operation,
                countryid: value.countryid,
                cityid: value.cityid,
                stateid: value.stateid
            }
            qualifactions.push(qualifaction);
        })

        var data = {
            profile_data: {
                educationList: educations,
                qualificationList: qualifactions,
                skillsList: updatedData?.SkillsList || []
            }
        }

        await axios
            .post(`${baseURI}/Candidate/UpdateCandidateProfile`, data, config)
            .then(async (response) => {
                if (response.data) {
                    dispatch(showSnackbar({
                        message: response.data.message,
                        type: SNACKBAR_TYPES.SUCCESS,
                        position: SNACKBAR_POSITION.TOP_CENTER,
                        autoClose: true,
                        autoCloseDelay: 2000,
                        maxWidth: 500,
                    }));
                    setAIResponse([]);
                    setEducationData([]);
                    setIsOpen(false)
                }               
            }).catch((error) => {
                 dispatch(showSnackbar({
                        message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
                        type: SNACKBAR_TYPES.ERROR,
                        position: SNACKBAR_POSITION.TOP_CENTER,
                        autoClose: true,
                        autoCloseDelay: 2000,
                        maxWidth: 500,
                    }));
             });
    };

    const closeAIProfile = () => {
        setAIResponse([]);
        setEducationData([]);
        setIsOpen(false)
    }
    return (
        <div>
            <Offcanvas direction="end" isOpen={isOpen} toggle={() => closeAIProfile()}>
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
                                {aiResponse && aiResponse?.EducationList?.length > 0 && (
                                    <EducationAIProfile educationData={aiResponse?.EducationList} //setEducationData={setAIResponse}
                                        setEducationData={(newList) => {
                                            console.log("newList", newList)
                                            setAIResponse((prev) => ({ ...prev, EducationList: newList }))
                                        }
                                        }
                                    >
                                    </EducationAIProfile>)}
                                <br />
                                {aiResponse && aiResponse?.QualificationList?.length > 0 && (
                                    <QualificationAIProfile qualificationData={aiResponse?.QualificationList}
                                        setQualificationData={(newList) => {
                                            console.log("newList", newList)
                                            setAIResponse((prev) => ({ ...prev, QualificationList: newList }))
                                        }
                                        }
                                    >
                                    </QualificationAIProfile>
                                )}
                                <br />
                                {aiResponse && aiResponse?.SkillsList?.length > 0 && (
                                    <SkillAIProfile skillData={aiResponse?.SkillsList}
                                        setSkillData={(newList) => {
                                            console.log("newSkillList", newList)
                                            setAIResponse((prev) => ({ ...prev, SkillsList: newList }))
                                        }
                                        }
                                    >    </SkillAIProfile>
                                )}
                            </>
                            )}
                        </div>
                        <div ref={bottomRef} style={{ width: "calc(100% - 24px)", textAlign: "center", }}>
                            <SpeechToTextInput setInput1={setInput1} input1={input1} handleUpdateData={() => handleUpdateData()} loadInput={loadInput} />
                            <Button className="mt-2" color="primary" onClick={() => submitProfileData()}>
                                Use this draft and proceed
                            </Button>
                        </div>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </div>
    );
}