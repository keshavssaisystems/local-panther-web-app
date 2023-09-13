import React from "react";
import { Card, Col } from "reactstrap";
import "./job.scss";
import { HeadingAndDetailWithDiv } from "../jobDetailComponents/HeadingAndDetailWithDiv";
import { HeadingAndDetailWithoutIcon } from "../jobDetailComponents/HeadingAndDetailWithoutIcon";
import { ButtonWithCount } from "../jobDetailComponents/ButtonWithCount";
import { DetailsHeader } from "../jobDetailComponents/DetailsHeader";
import Loader from "react-loaders";

export function JobDetail({ jobDetails, type }) {
  let loading = true;
  let jobDetail = {};
  let skillArray = [];
  loading = true;
  if (jobDetails.length > 0) {
    loading = false;
    jobDetail = jobDetails[0];
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
        {loading === false && (
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
            {type === "Open" && (
              <div className="p-3 mt-3 align-left">
                <ButtonWithCount
                  buttonName={"Applied"}
                  color={"primary"}
                  count={0}
                  action={"/candidate-list"}
                />
                <ButtonWithCount
                  buttonName={"Recommended"}
                  color={"primary"}
                  count={0}
                  action={"/recommendedCandidate"}
                />
                <ButtonWithCount
                  buttonName={"Liked"}
                  color={"primary"}
                  count={0}
                  action={"/likedCandidate"}
                />
                <ButtonWithCount
                  buttonName={"Accepted"}
                  color={"success"}
                  count={0}
                  action={"/acceptedCandidate"}
                />
                <ButtonWithCount
                  buttonName={"Rejected"}
                  color={"danger"}
                  count={0}
                  action={"/rejectedCandidate"}
                />
              </div>
            )}
          </Card>
        )}
      </Col>
    </>
  );
}
