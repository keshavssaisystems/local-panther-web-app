import React, { useCallback, useState } from "react";
import { Card, CardBody, Col, CardText } from "reactstrap";
import { JobCard } from "./JobCard";
import { CardPagination } from "../common/cardpagination";
import { JobDetail } from "../job/JobDetail";

export function JobListing({
  jobData,
  onPageChange,
  type,
  pageSize,
  totalRows,
}) {
  const [selectedClass, setSelectedClass] = useState(
    jobData.length > 0 ? jobData[0].jobid : "2"
  );
  let selectedJobDetails = [];
  let current = Number(totalRows) / pageSize;
  if (current * pageSize !== totalRows) {
    current++;
  }
  const [page, setPage] = useState(1);
  const [selectedJobData, setSelectedJobData] = useState(jobData);
  const handlePageChange = useCallback((page) => {
    setPage(page);
    onPageChange(page);
  }, []);
  const getSelectedJob = (jobId) => {
    selectedJobDetails = jobData.filter((element) => {
      return element.jobid === jobId;
    });
    setSelectedJobData(selectedJobDetails);
    setSelectedClass(jobId);
  };
  return (
    <>
      <Col md="4">
        {jobData.length > 0 &&
          jobData.map((job) => (
            <JobCard
              key={job.jobid}
              name={job.jobtitle}
              customer={
                job.jobCompanyDtos == null
                  ? "No Company Added"
                  : job.jobCompanyDtos.companyname
              }
              minExperience={job.minexperience}
              maxExperience={job.maxexperience}
              location={
                job.jobLocationDtos.length > 0
                  ? job.jobLocationDtos[0].location
                  : "-"
              }
              description={job.description}
              role={job.jobrole}
              jobId={job.jobid}
              createdDate={job.jobcreatedatetime}
              type={type}
              selectedJob={selectedClass}
              getSelectedJobId={(e) => getSelectedJob(e)}
              additionalData={job}
            />
          ))}
        {jobData.length === 0 && (
          <Card>
            <CardBody>
              <CardText className="mb-0 text-center">
                <b>No Record Found...</b>
              </CardText>
            </CardBody>
          </Card>
        )}
        {jobData.length > 0 && (
          <CardPagination
            totalPages={current}
            pageIndex={page}
            onCallBack={handlePageChange}
          ></CardPagination>
        )}
      </Col>
      <JobDetail jobDetails={selectedJobData} type={type} />
    </>
  );
}
