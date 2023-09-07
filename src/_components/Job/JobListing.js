import React, { useCallback, useState } from "react";
import { Card, CardBody, Col, CardText } from "reactstrap";
import { JobCard } from "./JobCard";
import { CustomPagination } from "Candidate";


export function JobListing({jobData, onPageChange, type}) {
  console.log(jobData);
  let current = Number(jobData.totalRows) / pageSize
  if (current * pageSize !== jobData.totalRows) {
    current++
  }
  const[page, setPage] = useState(1);
  const handlePageChange =useCallback((page)=> {
    setPage(page);
    onPageChange(page);
  },[]);
  
  return (
      <>
        <Col md="9">
          { jobData.jobList.length > 0 && jobData.jobList.map((job) => (
            <JobCard key={job.jobid} name={job.jobtitle} customer={job.jobCompanyDtos == null ? "No Company Added" : job.jobCompanyDtos.companyname} minExperience={job.minexperience} maxExperience={job.maxexperience} location={job.jobLocationDtos.length > 0 ? job.jobLocationDtos[0].location : "-"} description={job.description} role={job.jobrole} jobId={job.jobid} typeId={type === "Open" ? 0 : 1}/>
          ))}
          { jobData.jobList.length === 0 &&
            <Card>
              <CardBody>
                <CardText className="mb-0 text-center"><b>No Record Found...</b></CardText>
              </CardBody>
            </Card>
          }
          { jobData.jobList.length > 0 &&
            <CustomPagination totalPages={current} pageIndex={page} onCallBack={handlePageChange}></CustomPagination>
          }
        </Col>
      </>
  ); 
}