import React, { useRef, useState, useEffect } from "react";
import { Card, CardBody, Button, Form, Input, InputGroup, Row, Col } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-loaders";
import { JobPipelineTimeline } from "_components/dashboard/JobPipelineTimeline";
import customerIcons from "assets/utils/images/customer";
import { getHiringMangersList, dropdownActions } from "_store";
import { setHiringManagerId, setSeeAllHiringManagerJobs } from "_store/commonCustFiltersSlice";
import SafeUncontrolledTooltip from "_components/common/SafeUncontrolledTooltip";

export const ActivePipelines = ({
  pipelineJobList = [],
  pipelineJobDetail = [],
  pipelineJdLoading = false,
  JobListloader = false,
  selectedJobId = null,
  onSelectJob = () => {},
  userId = "",
  totalRows = 0,
  currentPage = 1,
  pageSize = 10,
  onLoadNextPage = () => {},
  onFilterChange = () => {},
  isCompanyAdmin = false,
}) => {
  const dispatch = useDispatch();

  // Read userDetails safely from localStorage and derive an effective admin flag
  const userDetails = (() => {
    try {
      return JSON.parse(localStorage.getItem("userDetails") || "{}");
    } catch (e) {
      return {};
    }
  })();

  const isCompanyAdminEffective =
    isCompanyAdmin ||
    localStorage.getItem("isCompanyAdmin") === "true" ||
    String(userDetails?.isCompanyAdmin) === "true" ||
    Number(localStorage.getItem("userroleid")) === 4;

  // ── Pipeline-local filter state ──────────────────────────────────────────
  const [filterSearchType, setFilterSearchType] = useState("JobTitle");
  const [filterSearchText, setFilterSearchText] = useState("");
  // Shared across screens via Redux — syncs with Job List and Schedule Interview
  const filterHiringManagerId = useSelector((state) => state.commonCustFilters.hiringManagerId);
  const filterSeeAllHM = useSelector((state) => state.commonCustFilters.seeAllHiringManagerJobs);

  // Single guard: set to true before ANY AP-initiated Redux dispatch so the
  // external-sync useEffect knows to skip that render cycle.
  const apSelfChangeRef = useRef(false);
  // Previous filter values — null on first render, enabling a first-run skip
  // without a separate boolean ref.
  const prevFiltersRef = useRef(null);
  // Callback ref — always holds the latest onFilterChange so stale closures
  // inside effects that have narrow dependency arrays can still call the
  // current version without needing to re-run the effect.
  const onFilterChangeRef = useRef(onFilterChange);
  useEffect(() => { onFilterChangeRef.current = onFilterChange; }); // no deps — runs after every render

  // Hiring manager lists from Redux (same store slices used by CommonFilters)
  const assignedHiringManagers = useSelector(
    (state) => state?.customerReportReducer?.assignHiringManagers || []
  );
  const allCompanyHiringManagers = useSelector(
    (state) => state?.customerReportReducer?.companyHiringManagers || []
  );
  const activeHiringManagerList = filterSeeAllHM
    ? allCompanyHiringManagers
    : assignedHiringManagers;

  // Load hiring managers once on mount
  useEffect(() => {
    const companyId = Number(localStorage.getItem("companyid"));
    dispatch(getHiringMangersList({ companyId, endpoint: "assignUserListByCompany" }));
  }, [dispatch]);

  // Auto-sync when admin switches "View data for" context on the dashboard
  const selectedHiringManagerId = useSelector((state) => state.auth.selectedHiringManagerId);
  const selectedHMSyncedRef = useRef(false);
  useEffect(() => {
    if (selectedHiringManagerId) {
      selectedHMSyncedRef.current = true;
      const companyId = Number(localStorage.getItem("companyid"));
      apSelfChangeRef.current = true;
      dispatch(setSeeAllHiringManagerJobs(true));
      dispatch(setHiringManagerId(String(selectedHiringManagerId)));
      dispatch(getHiringMangersList({ companyId, endpoint: "allUserListByCompany" }));
      onFilterChange({
        searchText: filterSearchText,
        searchType: filterSearchType,
        hiringManagerId: String(selectedHiringManagerId),
        viewAllCompanyJobs: true,
      });
    } else if (selectedHMSyncedRef.current) {
      // Switched back to "Select a Hiring Manager" — reset toggle and HM filter
      selectedHMSyncedRef.current = false;
      apSelfChangeRef.current = true;
      dispatch(setSeeAllHiringManagerJobs(false));
      dispatch(setHiringManagerId(""));
      onFilterChange({
        searchText: filterSearchText,
        searchType: filterSearchType,
        hiringManagerId: "",
        viewAllCompanyJobs: false,
      });
    }
  }, [selectedHiringManagerId, dispatch]);

  // Immediately reload when HM changes
  const handleHMChange = (value) => {
    apSelfChangeRef.current = true;
    dispatch(setHiringManagerId(value));
    onFilterChange({
      searchText: filterSearchText,
      searchType: filterSearchType,
      hiringManagerId: value,
      viewAllCompanyJobs: filterSeeAllHM,
    });
  };

  const handleSeeAllToggle = (e) => {
    const isOn = e.target.checked;
    apSelfChangeRef.current = true;
    dispatch(setSeeAllHiringManagerJobs(isOn));
    dispatch(setHiringManagerId(""));
    if (isOn) {
      const companyId = Number(localStorage.getItem("companyid"));
      dispatch(getHiringMangersList({ companyId, endpoint: "allUserListByCompany" }));
    }
    onFilterChange({
      searchText: filterSearchText,
      searchType: filterSearchType,
      hiringManagerId: "",
      viewAllCompanyJobs: isOn,
    });
  };

  const handlePipelineSearch = (e) => {
    e.preventDefault();
    // Only treat this as a fresh search (clear cached pages) when the
    // user explicitly provided non-empty search text and clicked Search.
    if ((filterSearchText || "").trim() !== "") {
      pagesRef.current = {};
      setAllJobs([]);
      prevPageRef.current = 0;
      isLoadingMoreRef.current = false;
      filtersSignatureRef.current = JSON.stringify({ filterHiringManagerId, filterSeeAllHM });
    }

    onFilterChange({
      searchText: filterSearchText,
      searchType: filterSearchType,
      hiringManagerId: filterHiringManagerId,
      viewAllCompanyJobs: filterSeeAllHM,
    });
  };

  const handlePipelineClear = () => {
    setFilterSearchType("JobTitle");
    setFilterSearchText("");
    apSelfChangeRef.current = true;
    dispatch(setHiringManagerId(""));
    dispatch(setSeeAllHiringManagerJobs(false));
    setFilteredItems([]);
    // Clear cached pages because filters were reset
    pagesRef.current = {};
    setAllJobs([]);
    prevPageRef.current = 0;
    isLoadingMoreRef.current = false;
    filtersSignatureRef.current = JSON.stringify({ filterHiringManagerId: "", filterSeeAllHM: false });

    onFilterChange({
      searchText: "",
      searchType: "JobTitle",
      hiringManagerId: "",
      viewAllCompanyJobs: false,
    });
  };

  // Autocomplete suggestions — mirrors commonFilters.js searchOptionDropdown
  const [filteredItems, setFilteredItems] = useState([]);

  const searchOptionDropdown = async (option) => {
    if (filterSearchType !== "JobTitle" && filterSearchType !== "ClientCompany") {
      setFilteredItems([]);
      return;
    }
    if (option?.length >= 2) {
      if (filterSearchType === "JobTitle") {
        const companyId = Number(localStorage.getItem("companyid"));
        const filter = {
          companyId,
          isClose: 0,
          searchText: option.replaceAll(" ", "_"),
        };
        const response = await dispatch(dropdownActions.getJobsListThunk(filter));
        setFilteredItems(response?.payload || []);
      } else if (filterSearchType === "ClientCompany") {
        const companyId = Number(JSON.parse(localStorage.getItem("userDetails"))?.CompanyId) || 0;
        const response = await dispatch(
          dropdownActions.getDropdownListThunk({
            searchText: "ClientCompany",
            commonId: companyId,
            searchBy: option,
          })
        );
        const companies = response?.payload?.data || response?.payload || [];
        setFilteredItems(companies.map((c) => ({ id: c.id, name: c.name })));
      }
    } else {
      setFilteredItems([]);
    }
  };

  const handleSelectSearch = (value) => {
    const text = filterSearchType === "ClientCompany" ? value.name : value.jobtitle;
    setFilterSearchText(text);
    setFilteredItems([]);
  };
  const tabScrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [allJobs, setAllJobs] = useState([]);
  const prevPageRef = useRef(0);
  const isLoadingMoreRef = useRef(false);
  // Persist per-page results so we can show previously-loaded pages
  // (prevents losing page-1 when the parent temporarily provides an empty list)
  const pagesRef = useRef({});
  const filtersSignatureRef = useRef(null);

  // When hiring-manager or see-all toggle changes, reset stored pages so
  // results from a different view are not reused. We deliberately DO NOT
  // reset when the search input or search type change — the user must
  // click Search to apply a new text search.
  useEffect(() => {
    const sig = JSON.stringify({ filterHiringManagerId, filterSeeAllHM });
    if (filtersSignatureRef.current !== sig) {
      filtersSignatureRef.current = sig;
      pagesRef.current = {};
      setAllJobs([]);
      prevPageRef.current = 0;
      isLoadingMoreRef.current = false;
    }
  }, [filterHiringManagerId, filterSeeAllHM]);

  // Unified external-sync effect: fires when either filter changes from any source.
  // - Skips first render via null-initialized prevFiltersRef (no separate boolean needed).
  // - Skips AP-initiated changes via apSelfChangeRef (one ref, all handlers).
  // - React 18 batches simultaneous dispatches, so both values arrive in one effect run.
  useEffect(() => {
    const curr = { hm: filterHiringManagerId, toggle: filterSeeAllHM };
    const prev = prevFiltersRef.current;
    prevFiltersRef.current = curr; // always update so next run has correct baseline

    if (prev === null) {
      // First render after mount — load the HM dropdown options if needed so the
      // dropdown has entries, and ensure toggle is on when an HM was pre-selected.
      // The job list fetch itself is handled by customerDashboard's
      // useEffect([sharedHiringManagerId, sharedSeeAllHM]) — no onFilterChange needed here.
      if (curr.hm || curr.toggle) {
        const companyId = Number(localStorage.getItem("companyid"));
        dispatch(getHiringMangersList({ companyId, endpoint: "allUserListByCompany" }));
        if (curr.hm && !curr.toggle) {
          // HM set but toggle off — turn toggle on so the HM is visible in dropdown.
          apSelfChangeRef.current = true;
          dispatch(setSeeAllHiringManagerJobs(true));
        }
      }
      return;
    }
    if (apSelfChangeRef.current) { apSelfChangeRef.current = false; return; } // own change
    if (selectedHiringManagerId) return; // view-as manages this separately

    // External change from another screen
    const companyId = Number(localStorage.getItem("companyid"));
    if (curr.hm && !curr.toggle) {
      // HM was set externally but toggle is still off — enable toggle so the
      // HM option is visible in the dropdown, then guard the resulting re-run.
      apSelfChangeRef.current = true;
      dispatch(setSeeAllHiringManagerJobs(true));
      dispatch(getHiringMangersList({ companyId, endpoint: "allUserListByCompany" }));
    } else if (curr.toggle && !prev.toggle) {
      // Toggle just turned on externally — ensure all-HM list is loaded.
      dispatch(getHiringMangersList({ companyId, endpoint: "allUserListByCompany" }));
    }

    onFilterChangeRef.current({
      searchText: filterSearchText,
      searchType: filterSearchType,
      hiringManagerId: curr.hm,
      viewAllCompanyJobs: curr.toggle || !!curr.hm,
    });
  }, [filterHiringManagerId, filterSeeAllHM]);

  // Store incoming page results and rebuild the accumulated list from stored
  // pages so temporary empty `pipelineJobList` states don't remove already-
  // loaded pages.
  useEffect(() => {
    if (pipelineJobList && pipelineJobList.length > 0) {
      pagesRef.current[currentPage] = pipelineJobList;

      // Merge pages in ascending page order while avoiding duplicate jobids
      const pageNumbers = Object.keys(pagesRef.current).map(Number).sort((a, b) => a - b);
      const combined = [];
      const seen = new Set();
      for (const p of pageNumbers) {
        const items = pagesRef.current[p] || [];
        for (const it of items) {
          if (!seen.has(it.jobid)) {
            seen.add(it.jobid);
            combined.push(it);
          }
        }
      }

      setAllJobs(combined);
      prevPageRef.current = Math.max(prevPageRef.current, currentPage);
      isLoadingMoreRef.current = false;
    }
    // Intentionally do nothing when pipelineJobList is empty — keep previously
    // stored pages until new results arrive (prevents UI from clearing on
    // transient empty states during loading).
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
    // if (el) setShowRightArrow(el.scrollWidth > el.clientWidth);
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

        {/* Pipeline Filters — layout mirrors CommonFilters used in custjobs.js */}
        <div className="main-card card-filter filter-toolbar mb-3" style={{ padding: "10px 12px", border: "1px solid #e9ecef", borderRadius: "6px", background: "#f9f9f9" }}>
          <div className="filter-toolbar-inner">
            <div className="filter-label" style={{ display: "flex", alignItems: "center", gap: "9px", marginBottom: "8px" }}>
              Filters:
              {/* See-all-HM toggle — company admins only, mirrors CommonFilters showSeeAllHMToggle */}
              {isCompanyAdminEffective && (() => {
                const viewAsActive = !!selectedHiringManagerId;
                return (
                  <span id="apSeeAllToggleWrapper" style={{ display: "inline-flex", cursor: viewAsActive ? "not-allowed" : "default" }}>
                    <div
                      className="form-check form-switch mb-0 form-switch-lg"
                      style={viewAsActive ? { pointerEvents: "none", opacity: 0.5 } : {}}
                    >
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="pipelineSeeAllHMToggle"
                        checked={filterSeeAllHM}
                        onChange={handleSeeAllToggle}
                        disabled={viewAsActive}
                      />
                    </div>
                    <SafeUncontrolledTooltip placement="top" target="apSeeAllToggleWrapper">
                      {viewAsActive
                        ? 'Not available while "View as" is active'
                        : 'See all hiring managers jobs'}
                    </SafeUncontrolledTooltip>
                  </span>
                );
              })()}
            </div>
            <div className="filter-controls">
              <Row className="gx-2 gy-2 align-items-center filter-row">
                {/* Hiring Manager — change triggers immediate reload like custjobs useEffect([hiringManagerId]) */}
                <Col xs={12} sm={6} md={4} lg={3}>
                  {(() => {
                    const viewAsActive = !!selectedHiringManagerId;
                    return (
                      <span id="apHMSelectWrapper" style={{ display: "block", cursor: viewAsActive ? "not-allowed" : "default" }}>
                        <Input
                          type="select"
                          value={filterHiringManagerId}
                          onChange={(e) => handleHMChange(e.target.value)}
                          className="filter-select"
                          disabled={viewAsActive}
                          style={viewAsActive ? { pointerEvents: "none", opacity: 0.6 } : {}}
                        >
                          <option value="">Select Hiring Manager</option>
                          {activeHiringManagerList.map((hm) => (
                            <option key={hm.id} value={hm.id}>{hm.name}</option>
                          ))}
                        </Input>
                        {viewAsActive && (
                          <SafeUncontrolledTooltip placement="top" target="apHMSelectWrapper">
                            Controlled by &quot;View as&quot;
                          </SafeUncontrolledTooltip>
                        )}
                      </span>
                    );
                  })()}
                </Col>
                {/* Search — type dropdown + text input + Search/Clear buttons */}
                <Col xs={12} sm={12} md={8} lg={9}>
                  <Form onSubmit={handlePipelineSearch}>
                    <InputGroup className="filter-search-group1" style={{ position: "relative" }}>
                      <Input
                        type="select"
                        className="fw-bold search-dropdown"
                        value={filterSearchType}
                        onChange={(e) => { setFilterSearchType(e.target.value); setFilterSearchText(""); setFilteredItems([]); }}
                      >
                        <option value="JobTitle">Job Title</option>
                        <option value="ClientCompany">Client Company</option>
                      </Input>
                      <Input
                        type="search"
                        placeholder={filterSearchType === "JobTitle" ? "Search job title" : "Search client company"}
                        value={filterSearchText}
                        onChange={(e) => {
                          setFilterSearchText(e.target.value);
                          searchOptionDropdown(e.target.value);
                        }}
                        className="filter-search-input"
                      />
                      {filteredItems.length > 0 && (
                        <ul
                          style={{
                            listStyle: "none",
                            margin: 0,
                            padding: "4px",
                            border: "1px solid #ccc",
                            borderTop: "none",
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            right: 0,
                            background: "#fff",
                            zIndex: 1000,
                            maxHeight: "150px",
                            overflowY: "auto",
                          }}
                        >
                          {filteredItems.map((item, index) => (
                            <li
                              key={index}
                              style={{ padding: "6px", cursor: "pointer" }}
                              onClick={() => handleSelectSearch(item)}
                            >
                              {filterSearchType === "ClientCompany" ? item.name : item.jobtitle}
                            </li>
                          ))}
                        </ul>
                      )}
                      <Button
                        style={{ background: "rgb(47 71 155)" }}
                        className="input-group-text search-icon"
                        color="primary"
                        type="submit"
                      >
                        Search
                      </Button>
                      <Button
                        color="link"
                        type="button"
                        className="input-group-text filter-search-btn"
                        onClick={handlePipelineClear}
                      >
                        Clear
                      </Button>
                    </InputGroup>
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </div>

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
              {JobListloader && hasMoreRecords && (
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
        {allJobs.length === 0 &&  (
          <p className="text-muted small mb-0">No active jobs found.</p>
        )}

        {pipelineJdLoading && allJobs.length === 0 ? (
          <Loader
            type="line-scale-pulse-out-rapid"
            className="d-flex justify-content-center"
          />
        ) : allJobs.length > 0 && pipelineJobDetail?.length > 0 ? (
          <JobPipelineTimeline
            job={pipelineJobDetail[0]}
            hiringManagerId={filterHiringManagerId || userId}
            viewAllCompanyJobs={filterSeeAllHM}
          />
        ) : null}
      </CardBody>
    </Card>
  );
};
