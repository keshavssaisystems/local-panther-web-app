import React from "react";
import PageTitle from "../../../_components/Common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import { Row, Col, Card, CardBody } from "reactstrap";
import SelectJobType from "../../../_components/createJobComponents/selectJobType";
import CreateJob from "../../../_components/createJobComponents/createJobForm";
import JobPreview from "../../../_components/createJobComponents/jobPreview";
import PublishJobStep from "../../../_components/createJobComponents/publishJobStep";
import MultiStep from "../../../_components/createJobComponents/multiStep";
import {
  shiftsOption,
  workScheduleOptions,
  jobTypeOption,
  experienceLevelOption,
  hiringTimelineOption,
  jobLocationOptions,
  payPeriodTypeOption,
} from "./dummyData";

export function CreateJobWizard() {
  const steps = [
    { name: "Select option", component: <SelectJobType /> },
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
        />
      ),
    },
    { name: "Preview job", component: <JobPreview /> },
    { name: "Create job", component: <PublishJobStep /> },
  ];
  return (
    <>
      <PageTitle heading="Create New Job" icon={titlelogo} />
      <Row>
        <Col>
          <Card className="main-card mb-3">
            <CardBody>
              <MultiStep showNavigation={true} steps={steps} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
