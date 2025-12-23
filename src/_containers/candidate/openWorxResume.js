import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import {
    Container,
    Row,
    Col,
    Card,
    Button
} from "react-bootstrap";
import {
    BsGeoAltFill,
    BsEnvelopeFill,
    BsGlobe,
    BsBriefcaseFill,
    BsListCheck,
    BsMortarboardFill,
    BsSliders,
    BsPatchCheckFill,
    BsInfoCircleFill
} from "react-icons/bs";
import logo from "../../assets/utils/images/openworx-blue-logo_w200.svg";
import "./openWorxResume.scss"; // optional if styles moved here
import { useSelector } from "react-redux";

import { getDate, getEducText } from "_helpers/helper";
import html2pdf from "html2pdf.js";
export const OpenWorXResume = forwardRef((props, ref) => {

    let userRoleId = localStorage.getItem("userroleid");
    const componentRef = useRef();
    const [isGenerating, setIsGenerating] = useState(false);
    const personalInfo_temp = useSelector(
        (state) => state.getProfile.profileData.personalInfo
    );
    const skillsInfo = useSelector(
        (state) => state.getProfile.profileData.skillsInfo
    );

    const qualificationInfo = useSelector(
        (state) => state.getProfile.profileData.qualificationsInfo
    );

    const educationInfo = useSelector(
        (state) => state.getProfile.profileData.educationInfo
    );
    const certificationInfo = useSelector(
        (state) => state.getProfile.profileData.certificationsInfo
    );
    const additionalInfo = useSelector(
        (state) => state.getProfile.profileData.additionalInfo
    );
    const [getData, setGetResponse] = useState([]);
    const [desiredJobType, setDesiredJobType] = useState([
        {
            id: 1,
            name: "Flexible",
        },
        {
            id: 2,
            name: "Specific Job Title",
        },
    ]);
    const get_response = useSelector(
        (state) => state.getProfile?.profileData?.jobPreferenceInfo
    );

    let companyList = localStorage.getItem("companyList") ? JSON.parse(localStorage.getItem("companyList")) : [];
    const [isStaffingFirm, setIsStaffingFirm] = useState(companyList?.some(company => company.isstaffingfirm === true));

    useEffect(() => {
        let filtered_data = get_response?.map((rest) => {
            return {
                candidatejobpreferenceid: rest.candidatejobpreferenceid,
                desiredJobTitle: desiredJobType?.find(
                    (x) => x.id == rest.desiredjobtitleid
                )?.name,
                specificJobTitle: rest.candidateJobtitlesDtos
                    ?.filter((item) => item.ischecked)
                    .map((item) => item.desiredjobtitlename)
                    .join(", "),
                desiredJobTypes: rest.candidateDesiredWorkTypeDtos
                    ?.filter((item) => item.ischecked)
                    .map((item) => item.desiredworktypename)
                    .join(", "),
                desiredWorkTypes: rest.candidateDesiredJobTypesDtos
                    ?.filter((item) => item.ischecked)
                    .map((item) => item.joblocationtype)
                    .join(", "),
                workSchedules: rest.candidateWorkSchedulesDtos
                    ?.filter((item) => item.ischecked)
                    .map((item) => item.workschedules)
                    .join(", "),

                shifts: rest.candidateShiftsDtos
                    ?.filter((item) => item.ischecked)
                    .map((item) => item.shifts)
                    .join(", "),
                pay:
                    (rest.minimumbasepay && rest.payperiodtype) ||
                        (rest.minimumbasepay !== "" && rest.payperiodtype !== "")
                        ? rest.minimumbasepay + " " + rest.payperiodtype
                        : rest.minimumbasepay
                            ? rest.minimumbasepay
                            : rest.payperiodtype
                                ? rest.payperiodtype
                                : "",
                relocate: rest.willingtorelocate ? true : false,
                availabilitytowork: rest.availabilitytowork,
                workType: "",
            };
        });

        setGetResponse(filtered_data);
    }, [get_response]);

    const generatePDF = async function () {
        const content = componentRef.current;

        if (!content) return;

        setIsGenerating(true);

        try {
            // use setTimeout to allow UI to update with loading state
            await new Promise((resolve) => setTimeout(resolve, 100));

            const pdfOptions = {
                margin: 10,
                filename:
                    personalInfo_temp?.firstname + " " + personalInfo_temp?.lastname + ".pdf",
                image: { type: "jpeg", quality: 0.98 },
                html2canvas: { scale: 2, logging: false }, // reduce scale for faster processing
                jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            };

            // Generate PDF asynchronously
            await html2pdf().set(pdfOptions).from(content).save();
        } catch (error) {
            console.error("PDF generation error:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Expose generatePDF to parent via ref
    useImperativeHandle(ref, () => ({
        generatePDF: generatePDF,
    }));

    const profile_img = localStorage.getItem("profileImage");

    const getLocationText = function (data) {
        let text = "";
        if (data.company !== "") {
            text = data.company;
            if (data.cityname && data.cityname !== "") {
                text += " - " + data.cityname;
            }
            if (data.statename && data.statename !== "") {
                text += ", " + data.statename;
            }
            if (data.countryname && data.countryname !== "") {
                text += ", " + data.countryname;
            }
        } else if (data.cityname && data.cityname !== "") {
            text = data.cityname;
            if (data.statename && data.statename !== "") {
                text += ", " + data.statename;
            }
            if (data.countryname && data.countryname !== "") {
                text += ", " + data.countryname;
            }
        } else if (data.statename && data.statename !== "") {
            text = data.statename;
            if (data.countryname && data.countryname !== "") {
                text += ", " + data.countryname;
            }
        } else if (data.countryname && data.countryname !== "") {
            text += data.countryname;
        }
        return text;
    };

    const getCandidateJobRole = () => {
        return qualificationInfo && qualificationInfo.length > 0 ? qualificationInfo[0]?.jobtitle : "";

    }

    return (
        <Container fluid className="py-4" style={{ backgroundColor: "#e5e7eb" }}>
            <Container className="resume-container shadow px-0" ref={componentRef}>

                {/* HEADER */}
                <header
                    className="position-relative border-bottom p-4 p-sm-5"
                    style={{ borderColor: "#2F479B" }}
                >
                    <div className="position-absolute top-0 end-0 p-3 text-end">
                        <p className="small text-secondary m-0">Generated by</p>
                        <img src={logo} width={150} alt="logo" />
                    </div>

                    {(userRoleId === 3 || isStaffingFirm === true) && (<h1 className="h2 fw-bolder text-dark mb-1">
                        {personalInfo_temp?.firstname}{" "}
                        {personalInfo_temp?.lastname}{" "}
                        {personalInfo_temp?.pronounname !== "" && (
                            <span
                                style={{
                                    color: "#979797",
                                    fontWeight: "400",
                                    fontSize: "18px",
                                }}
                            >
                                ( {personalInfo_temp?.pronounname} )
                            </span>
                        )}
                    </h1>)}
                    <p className="h5 text-secondary mb-3">
                        {getCandidateJobRole()}
                    </p>

                    <Row className="gx-4 gy-2 text-secondary text-sm">
                        <Col xs="auto" className="d-flex align-items-center gap-2">
                            <BsGeoAltFill className="accent-color" size={18} />
                            {personalInfo_temp?.city + ", " + personalInfo_temp?.state}
                        </Col>

                        {(userRoleId === 3 || isStaffingFirm === true) && (<Col xs="auto" className="d-flex align-items-center gap-2">
                            <BsEnvelopeFill className="accent-color" size={18} />
                            {personalInfo_temp?.email}
                        </Col>)}

                        <Col xs="auto" className="d-flex align-items-center gap-2">
                            <BsGlobe className="accent-color" size={18} />
                            Remote Availability
                        </Col>
                    </Row>
                </header>

                {/* WORK EXPERIENCE */}
                {qualificationInfo?.length > 0 ? (
                    <section className="p-4 p-sm-5 work-experience-section border-start-0 border-end-0 border-bottom">
                        <h2 className="section-title d-flex align-items-center gap-2">
                            <BsBriefcaseFill className="accent-color" size={22} />
                            Work Experience
                        </h2>
                        {qualificationInfo?.map((item, index) => (
                            <div className={`pb-3 m-1 mt-3 ${index !== qualificationInfo.length - 1 ? "border-bottom" : ""
                                }`} key={item.candidatequalificationid}>
                                <p className="small fw-semibold accent-color m-0 mt-6">
                                    {item.startdate && item.enddate ? (
                                        <p> {getDate(item)}</p>
                                    ) : (
                                        ""
                                    )}
                                </p>
                                <h3 className="h5 fw-bold text-dark">{item.jobtitle}</h3>
                                <p className="h6 text-secondary mb-3">
                                    {item.company !== "" ? (
                                        <p style={{ color: "#979797" }}>
                                            {getLocationText(item)}
                                        </p>
                                    ) : (
                                        ""
                                    )}
                                </p>
                                {item.jobdescription !== "" ? (
                                    <p className="" style={{ whiteSpace: "pre-wrap" }}>
                                        {item.jobdescription}{" "}
                                    </p>

                                ) : ("")}
                            </div>
                        ))}
                    </section>)
                    : <>  </>}

                {/* SKILLS */}
                {skillsInfo?.length > 0 ? (<section className="p-4 p-sm-5">
                    <h2 className="section-title d-flex align-items-center gap-2">
                        <BsListCheck className="accent-color" size={22} />
                        Skills
                    </h2>

                    <Row>
                        <Col className="d-flex flex-wrap gap-2">
                            {skillsInfo?.map((item) => (
                                <span className="skill-badge">{item.skillname}</span>
                            ))}
                        </Col>
                    </Row>
                </section>) : <> </>}

                {/* EDUCATION */}
                {educationInfo?.length > 0 ? (<section className="p-4 p-sm-5">
                    <h2 className="section-title d-flex align-items-center gap-2">
                        <BsMortarboardFill className="accent-color" size={22} />
                        Education
                    </h2>
                    {educationInfo?.map((item) => (
                        <div className="pb-3">
                            <h5 className="fw-bold">{item.levelofeducation}</h5>
                            <p className="mb-1 fw-medium text-dark">
                                {getEducText(item)}
                            </p>
                            <p className="text-secondary m-0">
                                {getDate(item)}
                            </p>
                        </div>
                    ))}
                </section>) : <> </>}

                {/* CERTIFICATIONS */}
                {certificationInfo?.length > 0 ? (
                    <section className="p-4 p-sm-5">
                        <h2 className="section-title d-flex align-items-center gap-2">
                            <BsPatchCheckFill className="accent-color" size={22} />
                            Certification and Licenses
                        </h2>
                        {certificationInfo?.map((item) => (
                            <div className="pb-3">
                                <h5 className="fw-bold text-dark"> {item.certificationtype} </h5>
                                <h6 className="fw-medium text-dark mb-1">
                                    {item.certificationname}
                                </h6>
                                <p className="small text-secondary mb-1">
                                    {getDate(item)} {item.isexpired ? "(Expired)" : ""}
                                </p>
                                {item.description !== "" ? (
                                    <><h6 className="small fw-medium text-dark mb-1">
                                        Description
                                    </h6>
                                        <p className="small text-secondary m-0" style={{ whiteSpace: "pre-wrap" }}>
                                            {item.description}
                                        </p></>
                                ) : (
                                    ""
                                )}
                            </div>
                        ))}
                    </section>) : <> </>}

                {/* Additional Information */}
                {additionalInfo?.length > 0 ? (
                    <section className="p-4 p-sm-5">
                        <h2 className="section-title d-flex align-items-center gap-2">
                            <BsInfoCircleFill className="accent-color" size={22} />
                            Additional Information
                        </h2>
                        {additionalInfo?.map((item) => (
                            <>
                                <div className="mb-4">
                                    {item.candidateLanguageDetailsDtos?.length > 0 && (
                                        <>
                                            <h5 className="fw-bold text-dark">Languages</h5>
                                            <h6 className="fw-medium text-dark mb-1">
                                                {item.candidateLanguageDetailsDtos?.map((lang, ind) => (
                                                    <>{lang.language} < span className="small text-secondary" > {lang.proficiency ? "(" + lang.proficiency + ")" : " "}{ind === item.candidateLanguageDetailsDtos?.length - 1 ? "" : ", "}</span></>
                                                ))}
                                            </h6 >
                                        </>
                                    )}
                                </div>
                                {personalInfo_temp?.summary !== "" ? (<div className="mb-4">
                                    <h5 className="fw-bold text-dark"> Summary </h5>
                                    <p className="small text-secondary m-0">
                                        {personalInfo_temp?.summary}
                                    </p>
                                </div>
                                ) : (<> </>)}
                                {personalInfo_temp?.additionalinformation !== "" ? (<div className="mb-4">
                                    <h5 className="fw-bold text-dark"> Additional Information </h5>
                                    <p className="small text-secondary m-0">
                                        {personalInfo_temp?.additionalinformation}
                                    </p>
                                </div>
                                ) : (<> </>)}

                            </>
                        ))}
                    </section>) : <> </>}

                {/* JOB PREFERENCES */}
                {getData?.length > 0 ? (
                    <section className="p-4 p-sm-5">
                        <h2 className="section-title flex items-center gap-2">
                            <BsSliders className="accent-color" size={24} />
                            Job Preferences
                        </h2>
                        {getData?.map((item) => (


                            <div className="preferences-wrapper">
                                {item.desiredJobTypes !== "" && item.desiredJobTypes ? (
                                    <div className="pb-1">
                                        <span className="preference-label">Job Types:</span>
                                        <span className="preference-badge"> {item.desiredJobTypes}</span>

                                    </div>
                                ) : (<> </>)}
                                {item.workSchedules !== "" && item.workSchedules ? (
                                    <div className="pb-1">
                                        <span className="preference-label">Work Schedule:</span>
                                        <span className="preference-badge"> {item.workSchedules}</span>
                                    </div>
                                ) : (<> </>)}
                                {item.shifts !== "" && item.shifts ? (
                                    <div className="pb-1">
                                        <span className="preference-label">Shifts:</span>
                                        <span className="preference-badge"> {item.shifts}</span>
                                    </div>
                                ) : (<> </>)}
                                {item.pay !== "" && item.pay ? (
                                    <div className="pb-1">
                                        <span className="preference-label">Min. Pay:</span>
                                        <span className="preference-badge">{"$"}{item.pay}</span>
                                    </div>
                                ) : (<> </>)}
                                {item.desiredWorkTypes !== "" && item.desiredWorkTypes ? (
                                    <div className="pb-1">
                                        <span className="preference-label">Work Types:</span>
                                        <span className="preference-badge"> {item.desiredWorkTypes}</span>
                                    </div>
                                ) : (<> </>)}
                            </div>
                        ))}
                    </section>
                ) : (<> </>)}

                {/* FOOTER */}
                <footer className="text-center border-top p-3 text-muted">
                    <p className="small fst-italic m-0">
                        This resume was professionally generated and optimized using the advanced capabilities of the OpenWorX AI Agent for enhanced presentation and readability.
                    </p>
                </footer>

            </Container>
            {
                isGenerating && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0,0,0,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 9999
                    }}>
                        <div style={{
                            background: "#fff",
                            padding: "20px",
                            borderRadius: "8px",
                            textAlign: "center"
                        }}>
                            <p>Generating PDF...</p>
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    </div>
                )
            }
        </Container >
    );
});
