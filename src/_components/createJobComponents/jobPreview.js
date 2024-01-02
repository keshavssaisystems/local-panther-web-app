import React, { useEffect } from "react";
import { Row, Col } from "reactstrap";
import "./createJob.scss";

export default function JobPreview({ previewData, editdata }) {
  useEffect(() => {
    editdata(previewData);
  }, [previewData]);
  let jobLocationData = "-";
  let jobTypeData = "-";
  let workScheduleData = "-";
  let shiftData = "-";
  let hiringTimelineData = "-";
  let experinceLevelData = "-";
  let payPeriodTypeData = "-";
  if (
    previewData.basicInformation.jobLocation !== "" &&
    previewData.basicInformation.jobLoactionOptions !== undefined
  ) {
    previewData.basicInformation.jobLoactionOptions.forEach((element) => {
      if (Number(previewData.basicInformation.jobLocation) === element.id) {
        jobLocationData = element.name;
      }
    });
  }
  let jobTypeString = [];
  if (previewData.experienceSchedule.jobType !== "") {
    previewData.experienceSchedule.jobTypeOption?.forEach((element) => {
      if (previewData.experienceSchedule.jobType.includes(element.id)) {
        jobTypeString.push(element.name);
      }
    });
    jobTypeData = jobTypeString.toString();
  }
  let workScheduleString = [];
  if (previewData.experienceSchedule.workSchedule !== "") {
    previewData.experienceSchedule.workScheduleOptions?.forEach((element) => {
      if (previewData.experienceSchedule.workSchedule?.includes(element.id)) {
        workScheduleString.push(element.name);
      }
    });
    workScheduleData = workScheduleString.toString();
  }
  let shiftString = [];
  if (previewData.experienceSchedule.shift !== "") {
    previewData.experienceSchedule.shiftsOption?.forEach((element) => {
      if (previewData.experienceSchedule.shift.includes(element.id)) {
        shiftString.push(element.name);
      }
    });
    shiftData = shiftString.toString();
  }
  if (previewData.experienceSchedule.hiringTimeline !== "") {
    previewData.experienceSchedule.hiringTimelineOption?.forEach((element) => {
      if (
        element.id === Number(previewData.experienceSchedule.hiringTimeline)
      ) {
        hiringTimelineData = element.name;
      }
    });
  }
  if (previewData.experienceSchedule.experienceLevel !== "") {
    previewData.experienceSchedule.experienceLevelOption?.forEach((element) => {
      if (
        Number(previewData.experienceSchedule.experienceLevel) === element.id
      ) {
        experinceLevelData = element.name;
      }
    });
  }
  if (
    previewData.paymentBenifits.payPeriodType !== undefined &&
    previewData.paymentBenifits.payPeriodType !== ""
  ) {
    previewData.paymentBenifits.payPeriodTypeOption.forEach((element) => {
      if (Number(previewData.paymentBenifits.payPeriodType) === element.id) {
        payPeriodTypeData = element.name;
      }
    });
  }
  let levelOfEducationString = [];
  if (previewData.basicInformation.levelofeducationids !== "") {
    previewData.basicInformation.levelofeducationOption?.forEach((element) => {
      if (
        previewData.basicInformation.levelofeducationids?.includes(element.id)
      ) {
        levelOfEducationString.push(element.name);
      }
    });
    levelOfEducationString = levelOfEducationString.toString();
  }
  let studyFieldString = [];
  if (previewData.basicInformation.fieldofstudiesids !== "") {
    previewData.basicInformation.fieldofstudiesOption?.forEach((element) => {
      if (
        previewData.basicInformation.fieldofstudiesids?.includes(element.id)
      ) {
        studyFieldString.push(element.name);
      }
    });
    studyFieldString = studyFieldString.toString();
  }
  let mustHaveArray = [];
  let niceToHaveArray = [];
  if (previewData.keyQualification?.length > 0) {
    let keyQualificationOption = previewData?.keyQualification;
    keyQualificationOption.forEach((element) => {
      if (element.isrequired === true) {
        mustHaveArray.push(element.skillname);
      }
      if (element.isrequired === false) {
        niceToHaveArray.push(element.skillname);
      }
    });
  }
  let customAnswerType =
    previewData.preCustomScreen === undefined
      ? previewData.basicInformation.customquestionanswertype
      : previewData.preCustomScreen;
  let subsidiaryData = "";
  if (
    previewData.basicInformation.subsidiaryid !== "" &&
    previewData.basicInformation.subsidiaryOption !== undefined
  ) {
    previewData.basicInformation.subsidiaryOption.forEach((element) => {
      if (
        Number(previewData.basicInformation.subsidiaryid) ===
        element.subsidiaryid
      ) {
        subsidiaryData = element.subsidiaryname;
      }
    });
  }
  return (
    <>
      <Row className="mt-4">
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3 mb-2">
            Basic information
          </p>
          <div className="information-section">
            <Row>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Company name</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.companyId === undefined
                      ? "-"
                      : previewData.basicInformation.companyId}
                  </p>
                </div>
              </Col>
              {previewData?.basicInformation?.subsidiaryOption?.length > 0 && (
                <Col md={6} lg={3}>
                  <div className="detail-padding">
                    <h6 className="mb-0 job-heading-custom">Subsidiary name</h6>
                    <p className="mb-0 mt-1 mr-1">
                      {previewData.basicInformation === undefined ||
                      previewData.basicInformation.subsidiaryid === undefined
                        ? "-"
                        : subsidiaryData}
                    </p>
                  </div>
                </Col>
              )}

              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Job title</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.jobTitle === undefined
                      ? "-"
                      : previewData.basicInformation.jobTitle}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Number of positions
                  </h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.noOfPostions === undefined
                      ? "-"
                      : previewData.basicInformation.noOfPostions}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Job location</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.jobLocation === undefined
                      ? "-"
                      : jobLocationData}
                  </p>
                </div>
              </Col>

              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Address</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.address === undefined
                      ? "-"
                      : previewData.basicInformation.address}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">City</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.cityName === undefined
                      ? "-"
                      : previewData.basicInformation.cityName}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">State</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.stateName === undefined
                      ? "-"
                      : previewData.basicInformation.stateName}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Country</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.stateName === undefined
                      ? "US"
                      : "US"}
                  </p>
                </div>
              </Col>

              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Zip code</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.zipcode === undefined
                      ? "-"
                      : previewData.basicInformation.zipcode}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Authorized to work in United States
                  </h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.authorizedtoworkinus ===
                      undefined
                      ? "-"
                      : previewData.basicInformation.authorizedtoworkinus ===
                        true
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Sponsorship is required
                  </h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.sponsorshiprequiured ===
                      undefined
                      ? "-"
                      : previewData.basicInformation.sponsorshiprequiured ===
                        true
                      ? "Yes"
                      : "No"}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Level of education
                  </h6>
                  <p className="mb-0 mt-1 mr-1">
                    {levelOfEducationString === undefined
                      ? "-"
                      : levelOfEducationString}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Field of study</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {studyFieldString === undefined ? "-" : studyFieldString}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Certifications</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.certifications === undefined
                      ? "-"
                      : previewData.basicInformation.certifications}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12} lg={6}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Description</h6>
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        previewData.basicInformation === undefined ||
                        previewData.basicInformation.description === undefined
                          ? "-"
                          : previewData.basicInformation.description,
                    }}
                    className="mb-2 mt-1 mr-1"
                  />
                </div>
              </Col>
              <Col md={12} lg={6}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Company details</h6>
                  <p className="mb-2 mt-1 mr-1">
                    {previewData.basicInformation === undefined ||
                    previewData.basicInformation.companyDetail === undefined
                      ? "-"
                      : previewData.basicInformation.companyDetail}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3">
            Experience & schedules
          </p>
          <div className="information-section">
            <Row>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Job Type</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.experienceSchedule === undefined ||
                    previewData.experienceSchedule.jobType === undefined
                      ? "-"
                      : jobTypeData}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Work schedules</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.experienceSchedule === undefined ||
                    previewData.experienceSchedule.workSchedule === undefined
                      ? "-"
                      : workScheduleData}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Experience level</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.experienceSchedule === undefined ||
                    previewData.experienceSchedule.experienceLevel === undefined
                      ? "-"
                      : experinceLevelData}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Shifts</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.experienceSchedule === undefined ||
                    previewData.experienceSchedule.shift === undefined
                      ? "-"
                      : shiftData}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Hiring timeline</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.experienceSchedule === undefined ||
                    previewData.experienceSchedule.hiringTimeline === undefined
                      ? "-"
                      : hiringTimelineData}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}></Col>
            </Row>
          </div>
        </Col>
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3">
            Payments & benefits
          </p>
          <div className="information-section">
            <Row>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Pay period type</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.paymentBenifits === undefined ||
                    previewData.paymentBenifits.payPeriodType === undefined
                      ? "-"
                      : payPeriodTypeData}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Minimum amount</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.paymentBenifits === undefined ||
                    previewData.paymentBenifits.minimumAmount === undefined
                      ? "-"
                      : "$" +
                        new Intl.NumberFormat("en-US").format(
                          previewData.paymentBenifits.minimumAmount
                        )}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Maximum amount</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.paymentBenifits === undefined ||
                    previewData.paymentBenifits.maximumAmount === undefined
                      ? "-"
                      : "$" +
                        new Intl.NumberFormat("en-US").format(
                          previewData.paymentBenifits.maximumAmount
                        )}
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Compensation package
                  </h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.paymentBenifits === undefined ||
                    previewData.paymentBenifits.compensationPackage ===
                      undefined
                      ? "-"
                      : previewData.paymentBenifits.compensationPackage}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Benefits</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.paymentBenifits === undefined ||
                    previewData.paymentBenifits.benefits === undefined
                      ? "-"
                      : previewData.paymentBenifits.benefits}
                  </p>
                </div>
              </Col>
              <Col></Col>
            </Row>
          </div>
        </Col>
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3">
            Key qualifications
          </p>
          <div className="information-section">
            <Row>
              <Col>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Additional qualification for the role
                  </h6>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Must have</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.keyQualification?.length > 0
                      ? mustHaveArray.length > 0
                        ? mustHaveArray.toString()
                        : "-"
                      : "-"}
                  </p>
                </div>
              </Col>
              <Col md={6} lg={3}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">Nice to have</h6>
                  <p className="mb-0 mt-1 mr-1">
                    {previewData.keyQualification?.length > 0
                      ? niceToHaveArray.length > 0
                        ? niceToHaveArray.toString()
                        : "-"
                      : "-"}
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
        <Col md={11}>
          <p className="fw-bold block-heading-wizard mt-3">
            Pre-screen applicants
          </p>
          <div className="information-section">
            <Row>
              <Col md={10} lg={8}>
                <div className="detail-padding">
                  <h6 className="mb-0 job-heading-custom">
                    Pre-screen questions
                  </h6>
                  <ul>
                    {previewData.preScreen?.length > 0 &&
                      previewData.preScreen?.map((options) => (
                        <li className="mb-0 mt-2 mr-1">
                          <b>
                            {options.iscustomquestion === true
                              ? "Custom question :"
                              : ""}
                          </b>{" "}
                          {options.prescreenquestion}
                          {options.iscustomquestion === true
                            ? " (" + customAnswerType + ")"
                            : ""}
                        </li>
                      ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </>
  );
}
