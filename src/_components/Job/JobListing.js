import React, { useCallback, useState } from "react";
import { Card, CardBody, Col, CardText } from "reactstrap";
import { JobCard } from "./JobCard";
import { JobListPagination } from "./JobListPagination";

export function JobListing({ jobData, onPageChange, type, totalPage }) {
  const [page, setPage] = useState(1);
  const handlePageChange = useCallback((page) => {
    setPage(page);
  }, []);
  onPageChange(page);
  return (
    <>
      <Col md={"9"}>
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
              typeId={type === "Open" ? 0 : 1}
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
          <JobListPagination
            total={totalPage}
            current={page}
            onChangePage={handlePageChange}
            maxCount={5}
          />
        )}
      </Col>
    </>
  );
}
