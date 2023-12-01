import React from "react";
import { Card, Col } from "reactstrap";
import "./job.scss";
import { HeadingAndDetailWithDiv } from "../jobDetailComponents/HeadingAndDetailWithDiv";
import { HeadingAndDetailWithoutIcon } from "../jobDetailComponents/HeadingAndDetailWithoutIcon";
import { ButtonWithCount } from "../jobDetailComponents/ButtonWithCount";
import { DetailsHeader } from "../jobDetailComponents/DetailsHeader";

export function JobDetail({ jobDetails, type }) {
  let loading = true;
  let jobDetail = {};
  let skillArray = [];
  let skillsData = "-";
  if (jobDetails.length > 0) {
    loading = false;
    jobDetail = jobDetails[0];
    jobDetail.jobSkillDtos !== undefined &&
      jobDetail?.jobSkillDtos?.map((skills) =>
        skillArray.push(skills.skillname)
      );
    if (jobDetail?.jobSkillDtos?.length > 0) {
      let skillsList = [];
      jobDetail?.jobSkillDtos.forEach((element) => {
        let skillName = element.skillname == null ? "-" : element.skillname;
        skillsList.push(skillName);
      });
      skillsData = skillsList.toString().replace(/,/g, ", ");
    }
  }

  return (
    <>
      <Col md="8" className="job-detail-cont">
        {loading === false && (
          <Card className="card-shadow-primary profile-responsive card-border mb-3">
            <DetailsHeader
              heading={jobDetail.jobtitle}
              subHeading={
                jobDetail.jobCompanyDtos == null
                  ? "-"
                  : jobDetail.jobCompanyDtos.companyname
              }
              location={
                jobDetail?.jobLocationDtos?.length > 0
                  ? jobDetail.jobLocationDtos[0].location
                  : "-"
              }
              ApplyButton={type !== "Open"}
              jobId={jobDetail.jobid}
              department={jobDetail.departmentid ?? 1}
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
              detail={skillsData}
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
              <div className="p-3 mt-3 align-left custom-footer-section">
                <ButtonWithCount
                  buttonName={"Applied"}
                  color={"primary"}
                  count={
                    jobDetail.totalAppliedCandidates === null
                      ? 0
                      : jobDetail.totalAppliedCandidates
                  }
                  action={`/customer-candidate-applied/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Recommended"}
                  color={"primary"}
                  count={
                    jobDetail.totalRecommendedCandidates === null
                      ? 0
                      : jobDetail.totalRecommendedCandidates
                  }
                  action={`/customer-candidate-maybe/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Liked"}
                  color={"primary"}
                  count={
                    jobDetail.totalLikedCandidates === null
                      ? 0
                      : jobDetail.totalLikedCandidates
                  }
                  action={`/customer-candidate-liked/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Accepted"}
                  color={"success"}
                  count={
                    jobDetail.totalAcceptedCandidates === null
                      ? 0
                      : jobDetail.totalAcceptedCandidates
                  }
                  action={`/customer-candidate-accepted/${jobDetails[0]?.jobid}`}
                />
                <ButtonWithCount
                  buttonName={"Rejected"}
                  color={"danger"}
                  count={
                    jobDetail.totalRejectedCandidates === null
                      ? 0
                      : jobDetail.totalRejectedCandidates
                  }
                  action={`/customer-candidate-rejected/${jobDetails[0]?.jobid}`}
                />
              </div>
            )}
          </Card>
        )}
      </Col>
    </>
  );
}
