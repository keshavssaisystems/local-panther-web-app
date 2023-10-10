import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth.slice";
import { usersReducer } from "./users.slice";
import { jobListReducer } from "./jobList.slice";
import { locationReducer } from "../_components/dropdownComponents/location.slice";
import { candidateReducer } from "./candidate.slice";
import { profileReducer } from "./candidateProfile.slice";
import { createjobReducer } from "../_containers/customer/createJob/createjob.slice";
import { employmentModeReducer } from "../_components/dropdownComponents/employmentMode.slice";
import { skillReducer } from "./dropdownskill.slice";
import { remoteStatusReducer } from "../_components/dropdownComponents/remoteStatus.slice";
import { stateReducer } from "./dropdownstate.slice";
import { cityReducer } from "./dropdowncity.slice";
import { genderReducer } from "./dropdownGender.slice";
import { noticePeriodReducer } from "../_components/dropdownComponents/noticePeriod.slice";
import { applyForJobReducer } from "../_containers/candidate/applyForJob.slice";
import { jobDetailReducer } from "./jobDetail.slice";
import { recommendedjobListReducer } from "../_containers/candidate/recommendejobList.slice";
import { departmentReducer } from "../_components/dropdownComponents/department.slice.js";
import { empmodeReducer } from "./dropdownempmode.slice";
import { customerCandidateListsReducer } from "_containers/customer/candidatelists/customercandidatelists.slice";
import { jobLocationTypeReducer } from "../_containers/customer/createJob/joblocationtype.slice";
import { jobTypeReducer } from "../_containers/customer/createJob/jobtype.slice";
import { workScheduleReducer } from "../_containers/customer/createJob/workschedule.slice";
import { shiftReducer } from "../_containers/customer/createJob/shifts.slice";
import { experienceLevelReducer } from "../_containers/customer/createJob/experiencelevel.slice";
import { hiringTimelineReducer } from "../_containers/customer/createJob/hiringtimeline.slice";
import { payPeriodTypeReducer } from "../_containers/customer/createJob/payperiodtype.slice";
import { preScreenQuestionReducer } from "../_containers/customer/createJob/prescreenquestions.slice";
import { previousJobListReducer } from "../_containers/customer/createJob/previousjoblist.slice";
import { previousJobDetailReducer } from "../_containers/customer/createJob/previousjobdetail.slice";
import { candidateJobListTabReducer } from "_containers/candidate/candidateTablist.slice";
import { scheduleInterviewReducer } from "_containers/customer/scheduleInterview/scheduleinterview.slice";
import { publishJobReducer } from "_containers/customer/createJob/publishjob.slice";
import { ethnicityReducer } from "./dropdownRaceEtnicity.slice";
import { getProfileReducer } from "./getProfile.slice";
import { profileSkillsReducer } from "./profileSkills.slice";
import { qualificationsReducer } from "./qualificationSkills.slice";
import { educationReducer } from "./dropDownEducation.slice";
import { educationDataReducer } from "./education.slice";
import { certificateDataReducer } from "./certications.slice";
import { certificationTypeReducer } from "./dropDownCertification.slice";
import { ProficiencyReducer } from "./dropDownProficiency.slice";
import { additionalInfoDataReducer } from "./additionalInfo.slice";
import { custJobListReducer } from "_containers/customer/newjobs/custjobs.slice";
import { matchedJobReducer } from "_containers/candidate/matchJob.slice";
import { jobTitleReducer } from "./dropDownJobTitle.slice";
import { payPeriodReducer } from "./dropDownPayPeriod.slice";
import { candidateListReducer } from "_containers/candidate/list/candidatelist.slice";

// admin slice
import { adminReportReducer } from "_containers/admin/_redux/report.slice";

export * from "./candidateProfile.slice";
export * from "./auth.slice";
export * from "./users.slice";
export * from "./jobList.slice";
export * from "../_components/dropdownComponents/location.slice";
export * from "./candidate.slice";
export * from "../_containers/customer/createJob/createjob.slice";
export * from "../_components/dropdownComponents/employmentMode.slice";
export * from "./dropdownskill.slice";
export * from "../_components/dropdownComponents/remoteStatus.slice";
export * from "./dropdownstate.slice";
export * from "./dropdowncity.slice";
export * from "../_components/dropdownComponents/noticePeriod.slice";
export * from "../_containers/candidate/applyForJob.slice";
export * from "./jobDetail.slice";
export * from "../_containers/candidate/recommendejobList.slice";
export * from "../_components/dropdownComponents/department.slice";
export * from "./dropdownempmode.slice";
export * from "../_containers/customer/candidatelists/customercandidatelists.slice";
export * from "../_containers/customer/createJob/joblocationtype.slice";
export * from "../_containers/customer/createJob/jobtype.slice";
export * from "../_containers/customer/createJob/workschedule.slice";
export * from "../_containers/customer/createJob/shifts.slice";
export * from "../_containers/customer/createJob/experiencelevel.slice";
export * from "../_containers/customer/createJob/hiringtimeline.slice";
export * from "../_containers/customer/createJob/payperiodtype.slice";
export * from "../_containers/customer/createJob/prescreenquestions.slice";
export * from "../_containers/customer/createJob/previousjoblist.slice";
export * from "../_containers/customer/createJob/previousjobdetail.slice";
export * from "../_containers/candidate/candidateTablist.slice";
export * from "_containers/customer/scheduleInterview/scheduleinterview.slice";
export * from "_containers/customer/createJob/publishjob.slice";
export * from "./candidateProfile.slice";
export * from "./dropdownGender.slice";
export * from "./dropdownRaceEtnicity.slice";
export * from "./getProfile.slice";
export * from "./profileSkills.slice";
export * from "./qualificationSkills.slice";
export * from "./dropDownEducation.slice";
export * from "./education.slice";
export * from "./certications.slice";
export * from "./dropDownCertification.slice";
export * from "./dropDownProficiency.slice";
export * from "./additionalInfo.slice";
export * from "../_containers/customer/newjobs/custjobs.slice";
export * from "_containers/candidate/matchJob.slice";
export * from "./dropDownJobTitle.slice";
export * from "./dropDownPayPeriod.slice";
export * from "./jobPreference.slice";
export * from "_containers/candidate/list/candidatelist.slice";

// export all admin slice fn
export * from "_containers/admin/_redux/report.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    jobList: jobListReducer,
    location: locationReducer,
    candidates: candidateReducer,
    createJob: createjobReducer,
    employmentMode: employmentModeReducer,
    skill: skillReducer,
    remoteStatus: remoteStatusReducer,
    state: stateReducer,
    city: cityReducer,
    gender: genderReducer,
    noticePeriod: noticePeriodReducer,
    applyForJob: applyForJobReducer,
    jobDetail: jobDetailReducer,
    recommendedjobList: recommendedjobListReducer,
    department: departmentReducer,
    empmode: empmodeReducer,
    customerCandidateList: customerCandidateListsReducer,
    jobLocationType: jobLocationTypeReducer,
    jobType: jobTypeReducer,
    workSchedule: workScheduleReducer,
    shifts: shiftReducer,
    experienceLevel: experienceLevelReducer,
    hiringTimeline: hiringTimelineReducer,
    payPeriodType: payPeriodTypeReducer,
    preScreenQuestion: preScreenQuestionReducer,
    previousJobList: previousJobListReducer,
    previousJobDetail: previousJobDetailReducer,

    scheduleInterview: scheduleInterviewReducer,
    publishJob: publishJobReducer,
    profileReducer: profileReducer,
    ethnicity: ethnicityReducer,
    getProfile: getProfileReducer,
    profileSkills: profileSkillsReducer,
    qualifications: qualificationsReducer,
    educationLevelReducer: educationReducer,
    educationDetailsReducer: educationDataReducer,
    certificationReducer: certificateDataReducer,
    certificateType: certificationTypeReducer,
    ProficiencyList: ProficiencyReducer,
    additionalInfoReducer: additionalInfoDataReducer,
    custJobListReducer: custJobListReducer,
    candidateMatchJob: matchedJobReducer,
    tabListReducer: candidateJobListTabReducer,
    getJobTitle: jobTitleReducer,
    getPayPeriod: payPeriodReducer,
    candidateListReducer: candidateListReducer,

    // admin reducer
    adminReportReducer,
  },
});
