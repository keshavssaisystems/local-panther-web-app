// store/index.js
import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";
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
export * from "./jobDetail.slice";
export * from "../_containers/candidate/recommendejobList.slice";
export * from "../_components/dropdownComponents/department.slice";
export * from "./dropdownempmode.slice";
export * from "../_containers/customer/candidatelists/customercandidatelists.slice";
export * from "../_containers/candidate/candidateTablist.slice";
export * from "_containers/customer/scheduleInterview/scheduleinterview.slice";
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
export * from "./getResumeTemplate.slice";
export * from "_containers/candidate/list/candidatelist.slice";
export * from "_containers/customer/createJob/dropdown.slice";
export * from "./dropDownStudyField.slice";
export * from "../_containers/customer/createJob/jobtype.slice";
export * from "../_containers/customer/createJob/workschedule.slice";
export * from "../_containers/customer/createJob/shifts.slice";
export * from "../_containers/customer/createJob/experiencelevel.slice";
export * from "_containers/customer/scheduleInterview/graph.slice";
export * from "_containers/customer/dashboard/customerdashboard.slice";
export * from "_containers/common/chats/chat.slice";
// export all admin slice fn
export * from "_containers/admin/_redux/report.slice";
export * from "_containers/admin/_redux/adminDashboard.slice";
export * from "_containers/admin/_redux/adminListing.slice";
export * from "_containers/admin/_redux/addCustomer.slice";
export * from "./dropDownMonth.slice";
export * from "./dropDownYear.slice";
export * from "./dashboard.slice";
export * from "./settings.slice";
export * from "../_containers/payment/payment.slice";
export * from "./snackbar.slice";
export * from "./commonCustFiltersSlice"
// export all customer slice fn
export * from "_containers/customer/reports/customerreport.slice";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [
          "snackbar.actions",
          "snackbar.icon",
        ],
      },
    }),
});
