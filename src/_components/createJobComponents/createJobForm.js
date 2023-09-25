import React, { useState } from "react";
import { Card, CardHeader, Button, Collapse, CardBody } from "reactstrap";
import { BasicInformation } from "./basicInformation";
import { ExperienceAndSchedules } from "./experienceAndSchedules";
import { PaymentAndBenefits } from "./paymentAndBenefits";
import { KeyQualification } from "./keyQualification";
import { PreScreenApplicant } from "./preScreenApplicant";
import DuplicateJob from "./duplicateJob";

export default function CreateJob({
  shiftsOption,
  workScheduleOptions,
  jobTypeOption,
  experienceLevelOption,
  hiringTimelineOption,
  jobLocationOptions,
  payPeriodTypeOption,
}) {
  let type = "0";
  const [accordion, setAccordion] = useState([
    true,
    false,
    false,
    false,
    false,
  ]);
  const toggleAccordion = (tab) => {
    const prevState = accordion;
    const state = prevState.map((x, index) => (tab === index ? !x : false));
    setAccordion(state);
  };
  return (
    <>
      <div className="form-wizard-content">
        {type === "1" && (
          <DuplicateJob
            shiftsOption={shiftsOption}
            workScheduleOptions={workScheduleOptions}
            jobTypeOption={jobTypeOption}
            experienceLevelOption={experienceLevelOption}
            hiringTimelineOption={hiringTimelineOption}
            jobLocationOptions={jobLocationOptions}
            payPeriodTypeOption={payPeriodTypeOption}
          />
        )}
        {type === "0" && (
          <div id="accordion" className="accordion-wrapper mb-3">
            <Card>
              <CardHeader id="headingOne">
                <Button
                  block
                  color="link"
                  className="text-start m-0 p-0"
                  onClick={() => toggleAccordion(0)}
                  aria-expanded={accordion[0]}
                  aria-controls="collapseOne"
                >
                  <h5 className="m-0 p-0 fw-semi-bold">Basic information</h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[0]}
                data-parent="#accordion"
                id="collapseOne"
                aria-labelledby="headingOne"
              >
                <CardBody>
                  <BasicInformation
                    data={[]}
                    jobLocationOptions={jobLocationOptions}
                  />
                </CardBody>
              </Collapse>
            </Card>
            <Card>
              <CardHeader className="b-radius-0" id="headingTwo">
                <Button
                  block
                  color="link"
                  className="text-start m-0 p-0"
                  onClick={() => toggleAccordion(1)}
                  aria-expanded={accordion[1]}
                  aria-controls="collapseTwo"
                >
                  <h5 className="m-0 p-0 fw-semi-bold">
                    Experience & schedules
                  </h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[1]}
                data-parent="#accordion"
                id="collapseTwo"
              >
                <CardBody>
                  <ExperienceAndSchedules
                    data={[]}
                    shiftsOption={shiftsOption}
                    workScheduleOptions={workScheduleOptions}
                    jobTypeOption={jobTypeOption}
                    experienceLevelOption={experienceLevelOption}
                    hiringTimelineOption={hiringTimelineOption}
                  />
                </CardBody>
              </Collapse>
            </Card>
            <Card>
              <CardHeader id="headingThree">
                <Button
                  block
                  color="link"
                  className="text-start m-0 p-0"
                  onClick={() => toggleAccordion(2)}
                  aria-expanded={accordion[2]}
                  aria-controls="collapseThree"
                >
                  <h5 className="m-0 p-0 fw-semi-bold">Payments & benefits</h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[2]}
                data-parent="#accordion"
                id="collapseThree"
              >
                <CardBody>
                  <PaymentAndBenefits
                    data={[]}
                    payPeriodTypeOption={payPeriodTypeOption}
                  />
                </CardBody>
              </Collapse>
            </Card>
            <Card>
              <CardHeader id="headingThree">
                <Button
                  block
                  color="link"
                  className="text-start m-0 p-0"
                  onClick={() => toggleAccordion(3)}
                  aria-expanded={accordion[3]}
                  aria-controls="collapseFour"
                >
                  <h5 className="m-0 p-0 fw-semi-bold">Key qualification</h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[3]}
                data-parent="#accordion"
                id="collapseFour"
              >
                <CardBody>
                  <KeyQualification data={[]} />
                </CardBody>
              </Collapse>
            </Card>
            <Card>
              <CardHeader id="headingThree">
                <Button
                  block
                  color="link"
                  className="text-start m-0 p-0"
                  onClick={() => toggleAccordion(4)}
                  aria-expanded={accordion[4]}
                  aria-controls="collapseFive"
                >
                  <h5 className="m-0 p-0 fw-semi-bold">
                    Pre-screen applicants
                  </h5>
                </Button>
              </CardHeader>
              <Collapse
                isOpen={accordion[4]}
                data-parent="#accordion"
                id="collapseFive"
              >
                <CardBody>
                  <PreScreenApplicant data={[]} />
                </CardBody>
              </Collapse>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}
