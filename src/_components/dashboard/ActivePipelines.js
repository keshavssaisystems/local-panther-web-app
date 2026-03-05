import React, { useRef, useState, useEffect } from "react";
import { Card, CardBody, Button } from "reactstrap";
import Loader from "react-loaders";
import { JobPipelineTimeline } from "_components/dashboard/JobPipelineTimeline";
import customerIcons from "assets/utils/images/customer";

export const ActivePipelines = ({
  pipelineJobList = [],
  pipelineJobDetail = [],
  pipelineJdLoading = false,
  selectedJobId = null,
  onSelectJob = () => {},
  userId = "",
  totalRows = 0,
  currentPage = 1,
  pageSize = 10,
  onLoadNextPage = () => {},
}) => {
  const tabScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const prevPageRef = useRef(0);
  const isLoadingMoreRef = useRef(false);

  // Accumulate pages — append new records instead of replacing
  useEffect(() => {
    if (pipelineJobList?.length > 0) {
      if (currentPage === 1 || currentPage <= prevPageRef.current) {
        // Fresh load or reset: replace
        setAllJobs(pipelineJobList);
      } else {
        // Next page loaded: append, avoid duplicates
        setAllJobs((prev) => {
          const existingIds = new Set(prev.map((j) => j.jobid));
          const newJobs = pipelineJobList.filter((j) => !existingIds.has(j.jobid));
          return [...prev, ...newJobs];
        });
      }
      prevPageRef.current = currentPage;
      isLoadingMoreRef.current = false;
    }
  }, [pipelineJobList, currentPage]);

  // Recalculate arrow visibility whenever the accumulated list changes
  useEffect(() => {
    const el = tabScrollRef.current;
    if (el) {
      setShowRightArrow(el.scrollWidth > el.clientWidth);
    }
  }, [allJobs]);

  const totalLoaded = allJobs.length;
  const hasMoreRecords = totalLoaded < totalRows;

  const handleScroll = (e) => {
    const el = e.currentTarget;
    setShowLeftArrow(el.scrollLeft > 0);

    const isNearEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 80;
    setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);

    // Auto-load next page when scrolled near the right end
    if (isNearEnd && hasMoreRecords && !pipelineJdLoading && !isLoadingMoreRef.current) {
      isLoadingMoreRef.current = true;
      onLoadNextPage();
    }
  };

  const handleTabRef = (el) => {
    tabScrollRef.current = el;
    if (el) setShowRightArrow(el.scrollWidth > el.clientWidth);
  };

  const handleRightArrowClick = () => {
    const el = tabScrollRef.current;
    if (!el) return;

    const isAtEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 10;

    if (isAtEnd && hasMoreRecords && !pipelineJdLoading && !isLoadingMoreRef.current) {
      // At the end of current records — load more from API
      isLoadingMoreRef.current = true;
      onLoadNextPage();
    } else {
      // Still content to scroll — just scroll right
      el.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <Card className="mb-3 shadow-sm">
      <CardBody>
        <h6 className="fw-semibold mb-2 main-title" style={{ color: "#2f2e2e", fontSize: "64px" }}>
          <img src={customerIcons.anticlockFrame} alt="Pipeline Icon" /> Active Pipelines
        </h6>

        {/* Job title tabs with horizontal scroll arrows */}
        {allJobs.length > 0 && (
          <div className="d-flex align-items-center gap-1 mb-3">
            {/* Left arrow — scroll left through accumulated records */}
            <Button
              color="light"
              size="sm"
              className="rounded-circle p-0 border flex-shrink-0"
              style={{ width: "36px", height: "36px", opacity: showLeftArrow ? 1 : 0.25 }}
              disabled={!showLeftArrow}
              onClick={() => tabScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
            >
              <span style={{ fontSize: "32px", fontWeight: 400, color: "#2f479b", lineHeight: 1 }}>&#8249;</span>
            </Button>

            {/* Scrollable Tabs */}
            <div
              ref={handleTabRef}
              onScroll={handleScroll}
              className="d-flex flex-grow-1"
              style={{
                overflowX: "hidden",
                borderBottom: "1px solid #dee2e6",
                scrollBehavior: "smooth",
              }}
            >
              {allJobs.map((job) => {
                const isActive = selectedJobId === job.jobid;
                return (
                  <div
                    key={job.jobid}
                    onClick={() => onSelectJob(job.jobid)}
                    className="px-3 py-2 flex-shrink-0"
                    style={{
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? "#0d6efd" : "#6c757d",
                      borderBottom: isActive ? "3px solid #0d6efd" : "3px solid transparent",
                    }}
                  >
                    {job.jobtitle} {job.totalcount != null ? `(${job.totalcount})` : ""}
                  </div>
                );
              })}
              {/* Inline loading indicator while fetching next page */}
              {pipelineJdLoading && hasMoreRecords && (
                <div className="px-3 py-2 d-flex align-items-center text-muted small flex-shrink-0">
                  Loading...
                </div>
              )}
            </div>

            {/* Right arrow — scroll right or load next page */}
            <Button
              color="light"
              size="sm"
              className="rounded-circle p-0 border flex-shrink-0"
              style={{ width: "36px", height: "36px", opacity: (showRightArrow || hasMoreRecords) ? 1 : 0.25 }}
              disabled={!showRightArrow && !hasMoreRecords}
              onClick={handleRightArrowClick}
            >
              <span style={{ fontSize: "32px", fontWeight: 400, color: "#2f479b", lineHeight: 1 }}>&#8250;</span>
            </Button>
          </div>
        )}

        {/* Pipeline timeline */}
        {allJobs.length === 0 && !pipelineJdLoading && (
          <p className="text-muted small mb-0">No active jobs found.</p>
        )}

        {pipelineJdLoading && allJobs.length === 0 ? (
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
