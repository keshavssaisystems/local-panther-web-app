import React, { useState, useEffect } from "react";
import { Card, Col } from "reactstrap";
import "./job.scss";
import { useDispatch, useSelector } from "react-redux";
import { HeadingAndDetailWithDiv } from "../jobDetailComponents/HeadingAndDetailWithDiv";
import { HeadingAndDetailWithoutIcon } from "../jobDetailComponents/HeadingAndDetailWithoutIcon";
// import { ButtonWithCount } from "../jobDetailComponents/ButtonWithCount";
import { DetailsHeader } from "../jobDetailComponents/DetailsHeader";

import { jobListActions } from "_store";
import Loader from "react-loaders";
import { ApplyJobModal } from "Candidate/ApplyJobModal";

export function JobDetail({ jobId, type }) {
  const dispatch = useDispatch();
  const [filter, setFilter] = useState({
    jobId: jobId,
    pageNo: 1,
    searchText: "",
    minExperience: "",
    employentModeId: "",
    pageSize: "5",
  });
  useEffect(() => {
    setFilter({
      jobId: jobId,
      pageNo: 1,
      searchText: "",
      minExperience: "",
      employentModeId: "",
      pageSize: "5",
    });
    getJobList();
  }, []);
  const getJobList = async function () {
    await dispatch(jobListActions.getJobList(filter));
  };
  let jobDetailRaw = useSelector((state) => state.jobList);
  let loading = true;
  let jobDetail = {};
  let skillArray = [];
  if (jobDetailRaw.jobList.loading === true) {
    loading = true;
  }
  if (jobDetailRaw.jobList.length > 0) {
    loading = false;
    jobDetail = jobDetailRaw.jobList[0];
    jobDetail.jobSkillDtos !== undefined &&
      jobDetail.jobSkillDtos.map((skills) => skillArray.push(skills.skillname));
  }
  return (
    <>
      <Col md="8">
        {loading === true && (
          <Loader
            type="line-scale-pulse-out-rapid"
            className="d-flex justify-content-center"
          />
        )}
        {jobDetailRaw.jobList.length > 0 && loading === false && (
          <Card className="card-shadow-primary profile-responsive card-border mb-3">
            <DetailsHeader
              heading={jobDetail.jobtitle}
              subHeading={"Saisystems Technology"}
              location={
                jobDetail.jobLocationDtos.length > 0
                  ? jobDetail.jobLocationDtos[0].location
                  : "-"
              }
              ApplyButton={type === "Open" ? false : true}
            />
            <div className="heading-title">
              <h6 className="job-main-heading mb-0">Job details</h6>
            </div>
            <HeadingAndDetailWithDiv
              heading={"Job Role:"}
              detail={jobDetail.jobrole}
              iconId={1}
            />
            <HeadingAndDetailWithDiv
              heading={"Department:"}
              detail={"IT, Software"}
              iconId={2}
            />
            <HeadingAndDetailWithDiv
              heading={"Remote Status:"}
              detail={"Full time"}
              iconId={3}
            />
            <HeadingAndDetailWithDiv
              heading={"Skills:"}
              detail={
                "Core Java, Spring Boot, Microservice, Java Programming, Version Control, RESTful APIs,  Database Management"
              }
              iconId={4}
            />
            <HeadingAndDetailWithDiv
              heading={"Experience:"}
              detail={
                jobDetail.minexperience +
                " - " +
                jobDetail.maxexperience +
                " years"
              }
              iconId={5}
            />
            <HeadingAndDetailWithDiv
              heading={"No of Openings:"}
              detail={
                "Hiring " + jobDetail.noofopenposition + " more candidates"
              }
              iconId={6}
            />
            <HeadingAndDetailWithoutIcon
              heading={"Job Description:"}
              detail={jobDetail.description}
            />
            <HeadingAndDetailWithoutIcon
              heading={"About Company:"}
              detail={jobDetail.responsibilities}
            />
            <HeadingAndDetailWithoutIcon
              heading={"Roles and Responsibility:"}
              detail={jobDetail.responsibilities}
            />
            {/* {typeId === "0" && (
              <div className="p-3 d-flex justify-content-center">
                <ButtonWithCount
                  buttonName={"Applied Candidate"}
                  color={"primary"}
                  count={0}
                  action={"/candidate-list"}
                />
                <ButtonWithCount
                  buttonName={"Recommended Candidate"}
                  color={"primary"}
                  count={0}
                  action={"/recommendedCandidate"}
                />
                <ButtonWithCount
                  buttonName={"Liked Candidate"}
                  color={"primary"}
                  count={0}
                  action={"/likedCandidate"}
                />
                <ButtonWithCount
                  buttonName={"Accepted Candidate"}
                  color={"success"}
                  count={0}
                  action={"/acceptedCandidate"}
                />
                <ButtonWithCount
                  buttonName={"Rejected Candidate"}
                  color={"danger"}
                  count={0}
                  action={"/rejectedCandidate"}
                />
              </div>
            )}
            {typeId === "1" && (
              <div className="p-3 float-end">
                <ApplyJobModal jobId={JobId} />
              </div>
            )} */}
          </Card>
        )}
      </Col>
    </>
  );
}
