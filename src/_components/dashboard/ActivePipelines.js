import React, { useRef, useState } from "react";
import { Card, CardBody, Button } from "reactstrap";
import { Loader } from "react-loaders";
import { JobPipelineTimeline } from "_components/dashboard/JobPipelineTimeline";
import customerIcons from "assets/utils/images/customer";

export const ActivePipelines = ({
  pipelineJobList = [],
  pipelineJobDetail = [],
  pipelineJdLoading = false,
  selectedJobId = null,
  onSelectJob = () => {},
  userId = "",
}) => {
  const tabScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const handleScroll = (e) => {
    const el = e.currentTarget;
    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const handleTabRef = (el) => {
    tabScrollRef.current = el;
    if (el) setShowRightArrow(el.scrollWidth > el.clientWidth);
  };

  return (
    <Card className="mb-3 shadow-sm">
      <CardBody>
        <h6 className="fw-semibold mb-2 main-title" style={{ color: "#2f2e2e", fontSize: "64px" }}>
          <img src={customerIcons.anticlockFrame} alt="Pipeline Icon" /> Active Pipelines
        </h6>

        {/* Job title tabs with horizontal scroll arrows */}
        {pipelineJobList?.length > 0 && (
          <div className="d-flex align-items-center gap-1 mb-3">
            {/* Left arrow */}
            <Button
              color="light"
              size="sm"
              className="rounded-circle p-0 border flex-shrink-0"
              style={{ width: "40px", height: "40px", opacity: showLeftArrow ? 1 : 0.25 }}
              disabled={!showLeftArrow}
              onClick={() => tabScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
              aria-label="Scroll left"
            >
              <span style={{ fontWeight: 700, color: "#2f479b", fontSize: "24px" }}>
                &#8249;
              </span>
            </Button>

            {/* Scrollable tab strip */}
            <div
              ref={handleTabRef}
              onScroll={handleScroll}
              className="d-flex gap-2 flex-grow-1"
              style={{ overflowX: "hidden", scrollBehavior: "smooth" }}
            >
              {pipelineJobList.map((job) => (
                <Button
                  key={job.jobid}
                  size="sm"
                  color={selectedJobId === job.jobid ? "primary" : "light"}
                  className="rounded-pill border flex-shrink-0"
                  style={{
                    whiteSpace: "nowrap",
                    borderColor: selectedJobId === job.jobid ? "#2f479b" : "#e0e0e0",
                    fontWeight: selectedJobId === job.jobid ? 600 : 400,
                  }}
                  onClick={() => onSelectJob(job.jobid)}
                >
                  {job.jobtitle}
                </Button>
              ))}
            </div>

            {/* Right arrow */}
            <Button
              color="light"
              size="sm"
              className="rounded-circle p-0 border flex-shrink-0"
              style={{ width: "40px", height: "40px", opacity: showRightArrow ? 1 : 0.25 }}
              disabled={!showRightArrow}
              onClick={() => tabScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
              aria-label="Scroll right"
            >
              <span style={{ fontWeight: 700, color: "#2f479b", fontSize: "24px" }}>
                &#8250;
              </span>
            </Button>
          </div>
        )}

        {/* Pipeline timeline */}
        {pipelineJobList?.length === 0 && !pipelineJdLoading && (
          <p className="text-muted small mb-0">No active jobs found.</p>
        )}

        {pipelineJdLoading ? (
          <Loader
            type="line-scale-pulse-out-rapid"
            className="d-flex justify-content-center"
          />
        ) : pipelineJobDetail?.length > 0 ? (
          <JobPipelineTimeline
            job={pipelineJobDetail[0]}
            hiringManagerId={userId}
          />
        ) : null}
      </CardBody>
    </Card>
  );
};
