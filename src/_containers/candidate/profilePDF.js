import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import { useSelector } from "react-redux";

import { getDate, getEducText } from "_helpers/helper";
import html2pdf from "html2pdf.js";

export const ProfilePDF = forwardRef((props, ref) => {
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

  
  return (
    <div>
      <Card>
        <CardBody>
          <div
            className="profile-pdf"
            style={{ fontFamily: "capitana, sans-serif" }}
            ref={componentRef}
          >
            <div>
              <Row>
                <Col className="col-8">
                  {(userRoleId === 3 || isStaffingFirm === true) && (
                    <h1>
                      <strong>
                        {" "}
                        {personalInfo_temp?.firstname}{" "}
                        {personalInfo_temp?.lastname}{" "}
                        {personalInfo_temp?.pronounname !== "" && (
                          <span
                            style={{
                              color: "#979797",
                              fontWeight: "400",
                              fontSize: "16px",
                            }}
                          >
                            ( {personalInfo_temp?.pronounname} )
                          </span>
                        )}
                      </strong>
                    </h1>
                  )}
                  <p>
                    {personalInfo_temp?.city}
                    {", "}
                    {personalInfo_temp?.state}
                  </p>
                  {(userRoleId === 3 || isStaffingFirm === true) && (
                    <p>
                      <span style={{ fontWeight: "600" }}>
                        {personalInfo_temp?.email}
                      </span>
                    </p>
                  )}
                  {getData?.length > 0 ? (
                    <p>
                      <span style={{ fontWeight: "600" }}>
                        Availability to work:{" "}
                        {personalInfo_temp?.availabilitytowork}
                      </span>
                    </p>
                  ) : (
                    ""
                  )}
                </Col>
                {/* {profile_img !== "" ? (
                  <Col>
                    <div className="float-end rounded-circle profile-img me-3">
                      <img
                        width={100}
                        className="rounded-circle"
                        src={profile_img}
                        alt="profile-icon"
                      />
                    </div>
                  </Col>
                ) : (
                  <></>
                )} */}
              </Row>
            </div>
            {qualificationInfo?.length > 0 ? (
              <div className="mb-4 mt-3">
                <h2 style={{ color: "#979797" }}>
                  <strong>Work Experience</strong>
                </h2>
                <hr />
                {qualificationInfo?.map((item) => (
                  <div className="mb-3">
                    <h3>{item.jobtitle}</h3>
                    {item.company !== ""
                      // && item.cityname !== "" && item.statename !== "" && item.countryname
                      ? (
                        <p style={{ color: "#979797" }}>
                          {getLocationText(item)}
                        </p>
                      ) : (
                        ""
                      )}
                    {item.startdate && item.enddate ? (
                      <p style={{ color: "#979797" }}> {getDate(item)}</p>
                    ) : (
                      ""
                    )}

                    {item.jobdescription !== "" ? (
                      <>
                        <p style={{ fontWeight: "500",color: "#979797" }}>Job Responsibilities:</p>
                        <p className="" style={{ fontWeight: "500", whiteSpace: "pre-wrap" }}>
                          {item.jobdescription}{" "}
                        </p>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}
            {educationInfo?.length > 0 ? (
              <div className="mb-4">
                <h2 style={{ color: "#979797" }}>
                  <strong>Education</strong>
                </h2>
                <hr />
                {educationInfo?.map((item) => (
                  <div className="mb-3">
                    <h3>{item.levelofeducation}</h3>
                    <p style={{ color: "#979797" }}>{getEducText(item)}</p>
                    <p style={{ color: "#979797" }}>{getDate(item)}</p>
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}

            {skillsInfo?.length > 0 ? (
              <div className="mb-4">
                <h2 style={{ color: "#979797" }}>
                  <strong>Skills</strong>
                </h2>
                <hr />
                <ul>
                  {skillsInfo?.map((item) => (
                    <li>{item.skillname}</li>
                  ))}
                </ul>
              </div>
            ) : (
              ""
            )}

            {certificationInfo?.length > 0 ? (
              <div className="mb-4">
                <h2 style={{ color: "#979797" }}>
                  <strong>Certification and Licenses</strong>
                </h2>
                <hr />
                {certificationInfo?.map((item) => (
                  <div className="mb-2">
                    <p style={{ fontWeight: "500" }}>
                      {item.certificationtype} - {item.certificationname}
                    </p>
                    {item.description !== "" ? (
                      <p style={{ fontWeight: "500" }}>
                        <strong>Description - </strong>
                        {item.description}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}

            {additionalInfo?.length > 0 ? (
              <div className="mb-4">
                <h2 style={{ color: "#979797" }}>
                  <strong>Additional information</strong>
                </h2>
                <hr />
                {additionalInfo?.map((item) => (
                  <div>
                    <ul>
                      {item.candidateLanguageDetailsDtos?.map((lang) => (
                        <li>
                          {lang.language} {" - "}{" "}
                          {lang.proficiency !== "" ? lang.proficiency : ""}
                        </li>
                      ))}
                    </ul>
                    {personalInfo_temp?.summary !== "" ? (
                      <p>
                        <strong>Summary - </strong> {personalInfo_temp?.summary}
                      </p>
                    ) : (
                      ""
                    )}
                    {personalInfo_temp?.additionalinformation !== "" ? (
                      <p>
                        <strong>Additional Information - </strong>{" "}
                        {personalInfo_temp?.additionalinformation}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            ) : (
              ""
            )}

            {getData?.length > 0 ? (
              <div>
                <h2 style={{ color: "#979797" }}>
                  <strong>Job Preferences</strong>
                </h2>
                <hr />
                {getData?.map((item) => (
                  <div>
                    {item.desiredJobTitle !== "" && item.desiredJobTitle ? (
                      <p>
                        <p>
                          <strong>Desired job title : </strong>
                          {item.desiredJobTitle}
                        </p>
                      </p>
                    ) : (
                      ""
                    )}

                    {item.specificJobTitle !== "" && item.specificJobTitle ? (
                      <p>
                        <strong>Specific job title : </strong>
                        {item.specificJobTitle}
                      </p>
                    ) : (
                      ""
                    )}

                    {item.desiredJobTypes !== "" && item.desiredJobTypes ? (
                      <p>
                        <strong>Desired job types : </strong>
                        {item.desiredJobTypes}
                      </p>
                    ) : (
                      ""
                    )}

                    {item.workSchedules !== "" && item.workSchedules ? (
                      <p>
                        <strong>Work schedules : </strong>
                        {item.workSchedules}
                      </p>
                    ) : (
                      ""
                    )}

                    {item.shifts !== "" && item.shifts ? (
                      <p>
                        <strong>Shifts : </strong>
                        {item.shifts}
                      </p>
                    ) : (
                      ""
                    )}

                    {item.pay !== "" && item.pay ? (
                      <p>
                        <strong>Desired minimum pay : </strong>
                        {"$"}
                        {item.pay}
                      </p>
                    ) : (
                      ""
                    )}

                    {item.desiredWorkTypes !== "" && item.desiredWorkTypes ? (
                      <p>
                        <strong>Work type : </strong>
                        {item.desiredWorkTypes}
                      </p>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </CardBody>
        <Col>
          {!props?.hideDownLoad ? (
            <Button
              className="float-end me-2 mb-2"
              onClick={(evt) => generatePDF(false)}
            >
              download
            </Button>
          ) : (
            <></>
          )}
        </Col>
      </Card>
      {isGenerating && (
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
      )}
    </div>
  );
});

ProfilePDF.displayName = "ProfilePDF";
