import React, { useCallback, useEffect, useState } from "react";
import { Card, CardBody, Col, CardText } from "reactstrap";
import { JobCard } from "./JobCard";
import { CardPagination } from "../common/cardpagination";
import { JobDetail } from "./JobDetail";

export function JobListing({
  jobData = [],
  onPageChange,
  type,
  pageSize,
  totalRows,
  page,
  setPage,
}) {
  const [ job = {}] = jobData;
  const [selectedClass, setSelectedClass] = useState(
    job?.candidateid > 0 ? job?.candidateid : "2"
  );
  let selectedJobDetails = jobData?.length > 0 ? [jobData[0]] : [];
  let current = Number(totalRows) / pageSize;
  if (current * pageSize !== totalRows) {
    current++;
  }
  
  useEffect(() => {
    setSelectedJobData([job])
  }, jobData)

  const [selectedJobData, setSelectedJobData] = useState([]);
  
  const handlePageChange = useCallback((page) => {
    setPage(page);
    onPageChange(page);
  }, []);

  const getSelectedJob = (candidateid) => {
    selectedJobDetails = jobData.filter((element) => {
      return element.candidateid === candidateid;
    });
    
    setSelectedJobData(selectedJobDetails);
    setSelectedClass(candidateid);
  };
  
  return (
    <>
      <Col md="4">
        {jobData?.length > 0 &&
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
                job.jobLocationDtos?.length > 0
                  ? job.jobLocationDtos[0].location
                  : "-"
              }
              description={job.description}
              role={job.jobrole}
              jobId={job.jobid}
              candidateid={job.candidateid}
              createdDate={job.jobcreatedatetime}
              type={type}
              selectedJob={selectedClass}
              getSelectedJobId={() => getSelectedJob(job.candidateid)}
              additionalData={job}
            />
          ))}
        {jobData?.length === 0 && (
          <Card>
            <CardBody>
              <CardText className="mb-0 text-center">
                <b>No Record Found...</b>
              </CardText>
            </CardBody>
          </Card>
        )}
        {jobData?.length > 0 && (
          <CardPagination
            totalPages={current}
            pageIndex={page}
            onCallBack={(evt) => handlePageChange(evt)}
          ></CardPagination>
        )}
      </Col>
      {selectedJobData ? (
        <JobDetail jobDetails={selectedJobData} type={type} />
      ) : (
        <></>
      )}
    </>
  );
}
