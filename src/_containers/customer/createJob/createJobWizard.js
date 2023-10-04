import React, { useState, useEffect } from "react";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { Row, Col, Card, CardBody, Button } from "reactstrap";
import SelectJobType from "../../../_components/createJobComponents/selectJobType";
import CreateJob from "../../../_components/createJobComponents/createJobForm";
import JobPreview from "../../../_components/createJobComponents/jobPreview";
import PublishJobStep from "../../../_components/createJobComponents/publishJobStep";
import { useDispatch, useSelector } from "react-redux";
import {
  createjobActions,
  jobLocationTypeActions,
  jobTypeActions,
  workScheduleActions,
  shiftActions,
  experienceLevelActions,
  hiringTimelineActions,
  payPeriodTypeActions,
  preScreenQuestionActions,
  previousJobListActions,
  previousJobDetailActions,
  publishJobActions,
} from "_store";
import { PopupWithNextStep } from "_components/common/PopupWithNextStep";

export function CreateJobWizard() {
  const [page, setPage] = useState(1);
  const [searchData, setSearchData] = useState("");
  const [buttonDisable, setButtonDisable] = useState(true);
  const [previousStep, setPreviousStep] = useState(1);
  const [jobType, setJobType] = useState("new_template");
  const [jobData, setJobData] = useState({});
  const [jobPreviewData, setJobPreviewData] = useState({});
  const [showPopupWithNextStep, setShowPopupWithNextStep] = useState(false);
  useEffect(() => {
    getOptions();
    getPreviousJobData({
      pageNo: page,
      searchText: searchData,
    });
  }, []);
  const getOptionsData = (event) => {
    if (
      event.type === "previous_template" ||
      event.type === "recommendation_template"
    ) {
      getJobDetail(event.jobId);
    }
    setJobType(event.type);
  };
  const getJobDetail = async function (jobId) {
    await dispatch(previousJobDetailActions.getPreviousJobDetailThunk(jobId));
  };
  const getPreviousJobData = async function (searchArr) {
    await dispatch(previousJobListActions.getPreviousJobListThunk(searchArr));
  };
  const getDataForPreview = (event) => {
    setJobPreviewData(event);
  };
  const editJob = (jobData) => {
    setJobData(jobData);
    setPreviousStep(3);
  };
  const requiredData = (data) => {
    createJob(data);
  };
  const getSearchValue = (data) => {
    setSearchData(data);
    getPreviousJobData({
      pageNo: 1,
      searchText: data,
    });
  };
  const dispatch = useDispatch();
  const createJob = async function (formElement) {
    await dispatch(createjobActions.getCreatejobThunk(formElement));
  };
  const getOptions = async function () {
    await dispatch(jobLocationTypeActions.getJobLocationTypeThunk());
    await dispatch(jobTypeActions.getJobTypeThunk());
    await dispatch(workScheduleActions.getWorkScheduleThunk());
    await dispatch(shiftActions.getShiftThunk());
    await dispatch(experienceLevelActions.getExperienceLevelThunk());
    await dispatch(hiringTimelineActions.getHiringTimelineThunk());
    await dispatch(payPeriodTypeActions.getPayPeriodTypeThunk());
    await dispatch(preScreenQuestionActions.getPreScreenQuestionThunk());
  };
  const jobLocationOptions = useSelector(
    (state) => state.jobLocationType.jobLocationType
  );
  const shiftsOption = useSelector((state) => state.shifts.shift);
  const workScheduleOptions = useSelector(
    (state) => state.workSchedule.workSchedule
  );
  const jobTypeOption = useSelector((state) => state.jobType.jobType);
  const experienceLevelOption = useSelector(
    (state) => state.experienceLevel.experienceLevel
  );
  const hiringTimelineOption = useSelector(
    (state) => state.hiringTimeline.hiringTimeline
  );
  const payPeriodTypeOption = useSelector(
    (state) => state.payPeriodType.payPeriodType
  );
  const preScreenQuestionsOption = useSelector(
    (state) => state.preScreenQuestion.preScreenQuestion
  );
  const jobList = useSelector((state) => state.previousJobList.previousJobList);
  const jobDetail = useSelector(
    (state) => state.previousJobDetail.previousJobDetail
  );
  const newJobDetails = useSelector((state) => state.createJob.createjob);
  const publishNewJob = async function () {
    let jobId = newJobDetails.jobid;
    let payload = {
      currentUserId: 81,
    };
    await dispatch(publishJobActions.getPublishJobThunk({ jobId, payload }));
    setShowPopupWithNextStep(!showPopupWithNextStep);
  };
  const onPageChange = (page) => {
    getPreviousJobData({
      pageNo: page,
      searchText: searchData,
    });
  };
  const [BIStatus, setBIStatus] = useState(false);
  const [ESStatus, setESStatus] = useState(false);
  const getBIStatus = (event) => {
    console.log(event);
    setBIStatus(event);
  };
  const getESStatus = (event) => {
    console.log(event);
    setESStatus(event);
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
        />
      ),
    },
    {
      name: "Create/update job",
      component: (
        <CreateJob
          shiftsOption={shiftsOption}
          workScheduleOptions={workScheduleOptions}
          jobTypeOption={jobTypeOption}
          experienceLevelOption={experienceLevelOption}
          hiringTimelineOption={hiringTimelineOption}
          jobLocationOptions={jobLocationOptions}
          payPeriodTypeOption={payPeriodTypeOption}
          preScreenQuestionsOption={preScreenQuestionsOption}
          type={jobType}
          previousStep={previousStep}
          jobData={jobData}
          previousData={jobDetail}
          JobDataForPreview={(e) => getDataForPreview(e)}
          bIFormSubmitted={(e) => getBIStatus(e)}
          esFormSubmitted={(e) => getESStatus(e)}
        />
      ),
    },
    {
      name: "Preview job",
      component: (
        <JobPreview previewData={jobPreviewData} editdata={(e) => editJob(e)} />
      ),
    },
    {
      name: "Create job",
      component: (
        <PublishJobStep
          reqData={jobPreviewData}
          responseData={(e) => requiredData(e)}
          publishJob={(e) => publishNewJob(e)}
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
  const [previousBtn, setPreviousButton] = useState(false);
  const [nextBtn, setNextButton] = useState(true);
  const [compState, setCompState] = useState(0);
  const [navigationState, setNavigationState] = useState(
    getNavStates(0, steps.length)
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
      this.next();
    }
  };
  const next = () => {
    setNavState(compState + 1);
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
      <PageTitle heading="Create New Job" icon={titlelogo} />
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
                    <div className="divider" />
                    <div className="clearfix">
                      <div style={true ? {} : { display: "none" }}>
                        <Button
                          color="secondary"
                          className="btn-shadow float-start btn-wide btn-pill"
                          outline
                          style={previousBtn ? {} : { display: "none" }}
                          onClick={previous}
                        >
                          Previous
                        </Button>
                        {(compState !== 1 || jobType !== "new_template") && (
                          <Button
                            color="primary"
                            className="btn-shadow btn-wide float-end btn-pill btn-hover-shine"
                            style={nextBtn ? {} : { display: "none" }}
                            onClick={next}
                            disabled={buttonDisable}
                          >
                            Continue
                          </Button>
                        )}
                        {compState === 1 && jobType === "new_template" && (
                          <Button
                            color="primary"
                            className="btn-shadow btn-wide float-end btn-pill btn-hover-shine"
                            style={nextBtn ? {} : { display: "none" }}
                            onClick={next}
                            disabled={BIStatus === false || ESStatus === false}
                          >
                            Continue
                          </Button>
                        )}
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
