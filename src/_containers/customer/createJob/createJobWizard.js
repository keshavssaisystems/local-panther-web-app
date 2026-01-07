import React, { useState, useEffect, useRef } from "react";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import SelectJobType from "../../../_components/createJobComponents/selectJobType";
import { CreateJob } from "../../../_components/createJobComponents/createJobForm";
import JobPreview from "../../../_components/createJobComponents/jobPreview";
import PublishJobStep from "../../../_components/createJobComponents/publishJobStep";
import { useDispatch, useSelector } from "react-redux";
import {
  createjobActions,
  dropdownActions,
  certificationTypeActions,
} from "_store";
import { PopupWithNextStep } from "_components/common/PopupWithNextStep";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ai_response } from "./sampleData";
import { formatAIJobData, aiJD } from "_components/createJobComponents/jobData";
import { subscribe } from "_helpers/observerService";
import "./CreateJob.scss";

export function CreateJobWizard({ type }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [buttonDisable, setButtonDisable] = useState(false);
  const [previousStep, setPreviousStep] = useState(1);
  const [jobType, setJobType] = useState("new_template");
  const [jobData, setJobData] = useState({});
  const [jobPreviewData, setJobPreviewData] = useState({});
  const [showPopupWithNextStep, setShowPopupWithNextStep] = useState(false);
  const [aiDescriptionData, setAIDescriptionData] = useState("");
  const [aiJobDetails, setAIJobDetail] = useState([]);
  const childRef = useRef(null);
  const getJobDetailForEdit = async function () {
    await dispatch(createjobActions.getJobDetailForUpdateThunk(id));
  };

  const customerDetails = useSelector(
    (state) => state.createJob.customerDetails
  );
  useEffect(() => {
    getOptions();
    getCompanyDetails();
    if (type === "edit") {
      getJobDetailForEdit();
    }
    getRecommendedJobData({
      pageNo: page,
      searchText: searchData,
      searchType: "JobTitle",
    });
    getPreviousJobData({
      pageNo: page,
      searchText: searchData,
      companyId: localStorage.getItem("companyid"),
      searchType: "JobTitle",
    });

    const unsubscribe = subscribe((data) => {
      if (data && data?.data) {
        updateAIJDtoNextStep(data);
      }
    });
    return () => unsubscribe();
  }, []);
  const selectedJobDetailsForEdit = useSelector(
    (state) => state.custJobListReducer.jobDetail
  );

  const getOptionsData = (event) => {
    if (
      (event.type === "previous_template" ||
        event.type === "recommendation_template") &&
      event?.jobId
    ) {
      getJobDetail(event.jobId);
    }
    setJobType(event?.type);
  };
  const getCompanyDetails = async function () {
    await dispatch(
      createjobActions.getCustomerDetailsThunk(
        JSON.parse(localStorage.getItem("userDetails"))?.InternalUserId
      )
    );
  };
  const getJobDetail = async function (jobId) {
    await dispatch(createjobActions.getPreviousJobDetailThunk(jobId));
  };
  const getRecommendedJobData = async function (searchArr) {
    await dispatch(createjobActions.getRecommendedListThunk(searchArr));
  };
  const getPreviousJobData = async function (searchArr) {
    await dispatch(createjobActions.getPreviousJobListThunk(searchArr));
  };
  const getDataForPreview = (event) => {
    setJobPreviewData(event);
  };
  const editJob = (jobData) => {
    setJobData(jobData);
    setPreviousStep(3);
  };
  const requiredData = (data) => {
    type === "add" ? createJob(data) : updateJob(data);
  };
  const getSearchValue = (data) => {
    setSearchData(data);
    getRecommendedJobData({
      pageNo: 1,
      searchText: data,
      searchType: "JobTitle",
    });
    getPreviousJobData({
      pageNo: page,
      searchText: data,
      companyId: localStorage.getItem("companyid"),
      searchType: "JobTitle",
    });
  };

  const createJob = async function (formElement) {
    if (localStorage.getItem("Aijobeventid")) {
      formElement.Aijobeventid = Number(localStorage.getItem("Aijobeventid"));
      localStorage.removeItem("Aijobeventid");
    }
    await dispatch(createjobActions.getCreatejobThunk(formElement));
  };
  const updateJob = async function (formElement) {
    await dispatch(
      createjobActions.getUpdatejobThunk({ jobData: formElement, jobId: id })
    );
  };
  const getOptions = async function () {
    await dispatch(dropdownActions?.getJobLocationTypeThunk());
    await dispatch(dropdownActions.getJobTypeThunk2());
    await dispatch(dropdownActions.getWorkScheduleThunk2());
    await dispatch(dropdownActions.getShiftThunk2());
    await dispatch(dropdownActions.getExperienceLevelThunk2());
    await dispatch(dropdownActions.getHiringTimelineThunk());
    await dispatch(dropdownActions.getPayPeriodTypeThunk());
    await dispatch(dropdownActions.getPreScreenQuestionThunk());
    await dispatch(dropdownActions?.getFieldOfStudyThunk());
    await dispatch(dropdownActions?.getLevelOFEducationThunk());
    await dispatch(dropdownActions?.getFlaggedWordsListThunk());
    await dispatch(dropdownActions?.getSecurityClearanceListThunk());
    await dispatch(
      dropdownActions.getSubsidiaryListThunk(localStorage.getItem("companyid"))
    );
    await dispatch(certificationTypeActions.certificationType());
  };

  const jobLocationOptions = useSelector(
    (state) => state.dropdown.jobLocationType
  );
  const shiftsOption = useSelector((state) => state.dropdown.shift);
  const certificationDetails = useSelector(
    (state) => state.certificateType.user.data
  );

  const workScheduleOptions = useSelector(
    (state) => state.dropdown.workSchedule
  );
  const jobTypeOption = useSelector((state) => state.dropdown.jobType);
  const experienceLevelOption = useSelector(
    (state) => state.dropdown.experienceLevel
  );
  const hiringTimelineOption = useSelector(
    (state) => state.dropdown.hiringTimeline
  );
  const payPeriodTypeOption = useSelector(
    (state) => state.dropdown.payPeriodType
  );
  const preScreenQuestionsOption = useSelector(
    (state) => state.dropdown.preScreenQuestion
  );
  const jobList = useSelector((state) => state.createJob.previousJobList);
  const recommendedJobList = useSelector(
    (state) => state.createJob.recommendedList
  );
  const jobDetail = useSelector((state) => state.createJob.previousJobDetail);

  const newJobDetails = useSelector((state) => state.createJob.createjob);
  const publishNewJob = async function () {
    let jobId = newJobDetails.jobid
      ? newJobDetails.jobid
      : selectedJobDetailsForEdit[0]?.jobid;
    let payload = {
      currentUserId: Number(localStorage.getItem("userId")),
    };
    await dispatch(createjobActions.getPublishJobThunk({ jobId, payload }));
    setShowPopupWithNextStep(!showPopupWithNextStep);
  };
  const [BIStatus, setBIStatus] = useState(type === "edit" ? true : false);
  const [ESStatus, setESStatus] = useState(type === "edit" ? true : false);
  const getBIStatus = (event) => {
    setBIStatus(event);
  };
  const getESStatus = (event) => {
    setESStatus(event);
  };

  const onAIDescriptionData = (e) => {
    setAIDescriptionData(e);
    setButtonDisable(e === "");
  };
  const steps = [
    {
      name: "Select option",
      component: (
        <SelectJobType
          getJobTypeData={(e) => getOptionsData(e)}
          jobList={jobList}
          postSearch={(e) => getSearchValue(e)}
          readyForNextStep={(e) => setButtonDisable(e)}
          recommendedJobList={recommendedJobList}
          aiDescriptionData={(e) => onAIDescriptionData(e)}
        />
      ),
    },
    {
      name: "Create/update job",
      component: (
        <CreateJob
          certificationList={certificationDetails}
          shiftsOption={shiftsOption}
          workScheduleOptions={workScheduleOptions}
          jobTypeOption={jobTypeOption}
          experienceLevelOption={experienceLevelOption}
          hiringTimelineOption={hiringTimelineOption}
          jobLocationOptions={jobLocationOptions}
          payPeriodTypeOption={payPeriodTypeOption}
          preScreenQuestionsOption={preScreenQuestionsOption}
          type={type === "edit" ? "previous_template" : jobType}
          previousStep={previousStep}
          jobData={jobData}
          previousData={
            type === "edit"
              ? selectedJobDetailsForEdit[0]
              : jobType === "ai_template"
              ? aiJobDetails
              : jobDetail
          }
          JobDataForPreview={(e) => getDataForPreview(e)}
          nextPage={(e) => nextPage(e)}
          customerDetails={customerDetails}
          ref={childRef}
        />
      ),
    },
    {
      name: "Preview job",
      component: (
        <JobPreview previewData={jobPreviewData} editdata={(e) => editJob(e)}  customerDetails={customerDetails}/>
      ),
    },
    {
      name: "Create job",
      component: (
        <PublishJobStep
          companyId={customerDetails?.companyid}
          reqData={jobPreviewData}
          responseData={(e) => requiredData(e)}
          publishJob={() => publishNewJob()}
          jobId={type === "edit" ? selectedJobDetailsForEdit[0]?.jobid : 0}
          type={type}
        />
      ),
    },
  ];
  const getNavStates = (indx, length) => {
    let styles = [];
    for (let i = 0; i < length; i++) {
      if (i < indx) {
        styles.push("done");
      } else if (i === indx) {
        styles.push("doing");
      } else {
        styles.push("todo");
      }
    }
    return { current: indx, styles: styles };
  };
  const checkNavState = (currentStep, stepsLength) => {
    if (currentStep > 0 && currentStep < stepsLength - 1) {
      setPreviousButton(true);
      setNextButton(true);
      return {
        previousBtn: true,
        nextBtn: true,
      };
    } else if (currentStep === 0) {
      setPreviousButton(false);
      setNextButton(true);
      return {
        previousBtn: false,
        nextBtn: true,
      };
    } else {
      setPreviousButton(true);
      setNextButton(false);
      return {
        previousBtn: true,
        nextBtn: false,
      };
    }
  };
  const nextPage = () => {
    next();
  };
  const [previousBtn, setPreviousButton] = useState(false);
  const [nextBtn, setNextButton] = useState(true);
  const [compState, setCompState] = useState(type === "add" ? 0 : 1);
  const [navigationState, setNavigationState] = useState(
    getNavStates(type === "add" ? 0 : 1, steps.length)
  );
  const setNavState = (next) => {
    setNavigationState(getNavStates(next, steps.length));
    if (next < steps.length) {
      setCompState(next);
    }
    checkNavState(next, steps.length);
  };
  const handleKeyDown = (evt) => {
    if (evt.which === 13) {
      if (compState === 1) {
        childRef.current.submit();
      } else {
        if (evt.key === "Enter") {
          evt.preventDefault(); // Prevent form submission
        } else {
          next();
        }
      }
    }
  };
  const next = () => {
    if (jobType === "ai_template" && aiDescriptionData) {
      getAIGeneratedJobData();
    } else {
      setNavState(compState + 1);
    }
  };

  const getAIGeneratedJobData = async () => {
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
    let data = { jd: aiDescriptionData };
    await axios
      .post(`${baseURI}/jd_to_job`, data, config)
      .then(async (result) => {
        if (result?.data?.job) {
          let aiJD = await formatAIJobData(result?.data?.job);

          setAIJobDetail(aiJD);
          setNavState(compState + 1);
        }
      })
      .catch((error) => {});
  };

  const updateAIJDtoNextStep = (data) => {
    setAIJobDetail(data.data);
    setNavState(compState + 1);
    setButtonDisable(false);
  };

  const previous = () => {
    if (compState > 0) {
      setNavState(compState - 1);
    }
    if (compState === 0) {
      setButtonDisable(true);
    }
  };
  const getClassName = (className, i) => {
    return className + "-" + navigationState.styles[i];
  };
  const renderSteps = () => {
    return steps.map((s, i) => (
      <li className={getClassName("form-wizard-step", i)} key={i} value={i}>
        <em>{i + 1}</em>
        <span className="steps-lable-custom">{steps[i].name}</span>
      </li>
    ));
  };
  return (
    <>
      <PageTitle
        heading={type === "edit" ? "Edit job" : "Create New Job"}
        icon={titlelogo}
      />
      <Row>
        <Col>
          <Card className="main-card mb-3">
            <CardBody>
              <div
                onKeyDown={handleKeyDown}
                className="main-heading main-wizard-container"
              >
                <ol className="forms-wizard">{renderSteps()}</ol>
                {steps[compState].component}
                {compState !== 3 && (
                  <>
                    {compState !== 1 && <div className="divider" />}
                    <div className="clearfix">
                      <div style={true ? {} : { display: "none" }}>
                        {compState !== 1 && (
                          <Button
                            color="secondary"
                            className="btn-shadow float-start btn-wide btn-pill"
                            outline
                            style={previousBtn ? {} : { display: "none" }}
                            onClick={() => previous()}
                          >
                            Previous
                          </Button>
                        )}
                        {compState !== 1 && (
                          <Button
                            color="primary"
                            className="btn-shadow btn-wide float-end btn-pill btn-hover-shine"
                            style={nextBtn ? {} : { display: "none" }}
                            onClick={() => next()}
                            disabled={buttonDisable}
                          >
                            {compState === 2
                              ? type === "edit"
                                ? "Confirm & update"
                                : "Confirm & Save as a Draft"
                              : jobType === "ai_template"
                              ? "Generate Job Posting"
                              : "Continue"}
                          </Button>
                        )}
                        {/* {compState === 1 &&
                          jobType === "new_template" &&
                          (BIStatus === false || ESStatus === false) && (
                            <>
                              <Button
                                color="primary"
                                className="btn-shadow btn-wide float-end btn-pill btn-hover-shine btn-mute"
                                id="Tooltip-1"
                                style={nextBtn ? {} : { display: "none" }}
                              >
                                Continue & Save
                              </Button>
                              <UncontrolledTooltip
                                placement="top"
                                target={"Tooltip-1"}
                              >
                                Please fill and save{" "}
                                {BIStatus === false ? "Basic information " : ""}
                                {BIStatus === false && ESStatus === false
                                  ? "&"
                                  : ""}{" "}
                                {ESStatus === false
                                  ? "Experience & schedules "
                                  : ""}
                                Section
                              </UncontrolledTooltip>
                            </>
                          )} */}
                        {/* {compState === 1 &&
                          jobType === "new_template" &&
                          BIStatus === true &&
                          ESStatus === true && (
                            <>
                              <Button
                                color="primary"
                                className="btn-shadow btn-wide float-end btn-pill btn-hover-shine"
                                style={nextBtn ? {} : { display: "none" }}
                                onClick={() => next()}
                              >
                                Continue
                              </Button>
                            </>
                          )} */}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
      {showPopupWithNextStep === true && (
        <PopupWithNextStep
          type={"success"}
          message={"The job has been posted"}
          action={true}
          nextStepMessage={"Do you want to create a new job?"}
          noAction={"/job-list"}
          yesAction={"/create-job"}
        />
      )}
    </>
  );
}
