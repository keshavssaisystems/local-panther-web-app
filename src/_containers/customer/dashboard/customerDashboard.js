import React, { useEffect, useState, useRef } from "react";
import { Row, Col } from "reactstrap";
import { StackBarChart } from "_components/dashboard/stackBarChart";
import { WidgetCard } from "_components/dashboard/widgetCard";
import { useSelector, useDispatch } from "react-redux";
import {
  customerDashboardActions,
  createjobActions,
  scheduleInterviewActions,
  dropdownActions,
  customerCandidateListsActions,
  candidateDashboardActions,
  custJobListActions,
  authActions,
  getHiringMangersList,
} from "_store";
import { HorizonatalBarGraph } from "_components/dashboard/horizontalBarGraph";
import { CustomerSlider } from "_components/dashboard/customerSlider";
import moment from "moment/moment";
import { BillDetailRemModal } from "_components/modal/billdetailremmodal";
import { Alerts } from "_containers/candidate/dashboard/alerts";
import SweetAlert from "react-bootstrap-sweetalert";
import custDashIcons from "assets/utils/images/customer/dashboard";
import { analytics } from "../../../firebase/index";
import { history } from "_helpers";
import { isInternalUrl } from "_helpers/helper";
import { PaymentModal } from "_components/modal/paymentmodal";
import { ActivePipelines } from "_components/dashboard/ActivePipelines";
import { createAuthLink } from "_components/unifiedApp/unifiedApp";

export default function CustomerDashboard() {
  const [showRemModal, setShowRemModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobListPage, setJobListPage] = useState(1);
  const [pipelineFilters, setPipelineFilters] = useState({
    searchText: "",
    searchType: "JobTitle",
    hiringManagerId: "",
    viewAllCompanyJobs: false,
  });
  const dispatch = useDispatch();
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [confAlert, SetConfAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
    id: "",
  });

  // Read from Redux — correctly set on login and preserved during HM context switches
  const isCompanyAdmin = useSelector((state) => state.auth.isCompanyAdmin);
  const selectedHiringManagerId = useSelector((state) => state.auth.selectedHiringManagerId);
  const isSwitching = useSelector((state) => state.auth.isSwitching);
  const hiringManagers = useSelector((state) => state.customerReportReducer?.companyHiringManagers || []);

  // Local state for the dropdown — updated immediately on selection to avoid
  // the controlled-component "stuck" issue where React won't fire onChange
  // if value hasn't changed in state yet.
  const [dropdownValue, setDropdownValue] = useState(
    localStorage.getItem("selectedHiringManagerId") || "all"
  );

  // Track whether this is the initial mount. On reload, dropdownValue is already
  // correctly seeded from localStorage — we must not let the useEffect override it
  // with "all" in case Redux selectedHiringManagerId is momentarily null.
  const isFirstRender = useRef(true);

  // Keep local dropdown value in sync when Redux state changes AFTER initial mount
  // (e.g. after a switch completes or a switch-back completes).
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    if (selectedHiringManagerId) {
      setDropdownValue(String(selectedHiringManagerId));
    } else {
      setDropdownValue("all");
    }
  }, [selectedHiringManagerId]);

  const reloadDashboardData = () => {
    getDashboardCounts();
    getDashboardJobsDataCount();
    getDashboardGraphData();
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: localStorage.getItem("userId"), viewAllCompanyJobs: false }));
    const dashUserId = localStorage.getItem("userId");
    if (dashUserId) {
      loadJobListPage(1);
    }
  };

  const handleHiringManagerChange = async (e) => {
    const value = e.target.value;

    // No-op: user re-selected the already active option
    if (value === dropdownValue) return;

    // Snapshot previous value before any state changes — used to revert on failure
    const previousValue = dropdownValue;

    // Persist selected HM name so the dropdown has a matching option on next reload
    if (value === "all") {
      localStorage.removeItem("selectedHiringManagerName");
    } else {
      const selectedHM = hiringManagers.find(hm => String(hm.id) === value);
      if (selectedHM) localStorage.setItem("selectedHiringManagerName", selectedHM.name);
    }

    // Update local state immediately so the dropdown never appears frozen
    setDropdownValue(value);

    const originalAdminUserId = localStorage.getItem("adminOriginalUserId");

    if (!value || value === "all") {
      // "All Users" — restore original admin context
      if (originalAdminUserId) {
        const result = await dispatch(authActions.switchBackToAdminThunk());
        if (result?.error) {
          setDropdownValue(previousValue);
          return;
        }
      }
    } else {
      // Switch to the selected user (including admin's own entry)
      const result = await dispatch(authActions.switchToHiringManagerThunk(parseInt(value)));
      if (result?.error) {
        setDropdownValue(previousValue);
        return;
      }
    }
    reloadDashboardData();
  };
  const getDashboardCounts = async function () {
    await dispatch(customerDashboardActions.getCustomerDashboardThunk());
  };
  const getCompanyDetails = async function () {
    let res = await dispatch(
      createjobActions.getCustomerDetailsThunk(
        JSON.parse(localStorage.getItem("userDetails")).InternalUserId
      )
    );
    if (res?.payload?.statusCode === 200) {
      if (
        res?.payload?.data?.billingdetailstatus !== undefined &&
        !res?.payload?.data?.billingdetailstatus
        && res?.payload?.data?.companyBillingdetailstatus !== undefined
        && !res?.payload?.data?.companyBillingdetailstatus
      ) {
        setShowRemModal(true);
      }
    }
    // Return the resolved companyId so callers don't have to re-read localStorage
    return res?.payload?.data?.companyid || Number(localStorage.getItem("companyid") || 0);
  };
  const getDashboardJobsDataCount = async function () {
    await dispatch(
      customerDashboardActions.getCustomerDashboardJobsDataCountThunk()
    );
  };
  const getDashboardGraphData = async function () {
    await dispatch(
      customerDashboardActions.getCustomerDashboardGraphDataThunk(
        moment.utc().format("YYYY-MM-DDTHH:mm:ss")
      )
    );
  };

  
  const handleBillDetailUpdate = () => {
    setShowRemModal(false);
    setShowPaymentModal(true);
  };

  const loadJobListPage = (pageNumber, filters) => {
    const dashUserId = localStorage.getItem("userId");
    const dashCompanyId = localStorage.getItem("companyid");
    const activeFilters = filters || pipelineFilters;
    if (dashUserId) {
      dispatch(
        custJobListActions.getJobs({
          pageSize: 15,
          pageNumber: pageNumber,
          companyId: dashCompanyId,
          searchText: activeFilters.searchText || "",
          searchType: activeFilters.searchType || "JobTitle",
          hiringManagerId: activeFilters.hiringManagerId || dashUserId,
          viewAllCompanyJobs: activeFilters.viewAllCompanyJobs || false,
        })
      );
      setJobListPage(pageNumber);
    }
  };
  
   const pipelineJobList = useSelector(
    (state) => state.custJobListReducer.jobs
  );

  const JobListloader = useSelector(
    (state) => state.custJobListReducer.dbloading
  );

  const totalRows = useSelector(
    (state) => state.custJobListReducer.totalRow
  );
  const handleLoadNextPage = () => {
    loadJobListPage(jobListPage + 1);
  };

  const handlePipelineFilterChange = (filters) => {
    setPipelineFilters(filters);
    setSelectedJobId(null);
    loadJobListPage(1, filters);
  };

  useEffect(() => {
    // Load job list for the Active Pipelines section
    const dashUserId = localStorage.getItem("userId");
    if (dashUserId) {
      loadJobListPage(1);
    }
    if (
      localStorage.getItem("companyreferrallogid") &&
      localStorage.getItem("companyreferrallogname")
    ) {
      localStorage.removeItem("companyreferrallogname");
      localStorage.removeItem("companyreferrallogid");
      history.navigate("/candidate-list");
    }
    getCompanyDetails();
    getDashboardGraphData();
    getDashboardCounts();
    getDashboardJobsDataCount();
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: localStorage.getItem("userId"), viewAllCompanyJobs: false }));
    dispatch(customerDashboardActions.getSendTimezoneBeckendThunk());
    dispatch(customerCandidateListsActions.getDurationOptions());
    // Wait for getCompanyDetails to resolve so localStorage.companyid is populated
    // before dispatching APIs that depend on it.
    getCompanyDetails().then((resolvedCompanyId) => {
      dispatch(dropdownActions.getSubsidiaryListThunk(resolvedCompanyId || 0));
      dispatch(getHiringMangersList({ companyId: resolvedCompanyId || 0, endpoint: 'allUserListByCompany' }));
    });
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Employer dashboard",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }

   
  }, []);

  // Auto-select the first job whenever the pipeline job list loads
  useEffect(() => {
    if (pipelineJobList?.length > 0 && !selectedJobId) {
      setSelectedJobId(pipelineJobList[0].jobid);
    }
  }, [pipelineJobList]);

  // Fetch full job detail whenever the selected tab changes
  useEffect(() => {
    if (selectedJobId) {
      dispatch(custJobListActions.getJobDetail({ jobId: selectedJobId }));
    }
  }, [selectedJobId]);
  
   

  const pipelineJobDetail = useSelector(
    (state) => state.custJobListReducer.jobDetail
  );

  const pipelineJdLoading = useSelector(
    (state) => state.custJobListReducer.jdLoading
  );

  const dashboardCounts = useSelector(
    (state) => state.customerDashboard.dashboardCounts
  );
  const dashboardGraphData = useSelector(
    (state) => state.customerDashboard.dashboardGraphData
  );
  const dashboardJobsDataCount = useSelector(
    (state) => state.customerDashboard.dashboardJobsDataCount
  );

  const onDeleteNotification = async (id) => {
    let res = await dispatch(
      candidateDashboardActions.deleteNotifications({ id })
    );
    if (res?.payload?.statusCode === 200) {
      showSweetAlert({
        title: "Deleted notification successfully.",
        type: "success",
      });
    } else {
      showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
  };
  const onReadNotification = (id, status, item) => {
    if (status !== 3) {
      dispatch(candidateDashboardActions.readNotification({ id }));
    }
    // Prefer routing based on metadata saved by backend when available
    try {
      if (item?.notificationresponse) {
        const meta = JSON.parse(item.notificationresponse);
        if (meta?.groupId) {
          history.navigate(`/chat?groupId=${encodeURIComponent(meta.groupId)}`);
          return;
        }
        if (meta?.redirectUrl && isInternalUrl(meta.redirectUrl)) {
          history.navigate(meta.redirectUrl);
          return;
        }
      }
    } catch (e) {
    }

    if (item?.notificationmessage?.toLowerCase().includes("job offer accepted")) {
      history.navigate("/customer-candidate-accepted");
    } else if (
      item?.notificationmessage?.toLowerCase().includes("job offer declined") ||
      item?.notificationmessage?.toLowerCase().includes("job offer rejected")
    ) {
      history.navigate("/customer-candidate-rejected");
    } else if (item?.notificationmessage?.toLowerCase().includes("reschedule interview request")) {
      history.navigate("/customer-candidate-scheduled");
    } else if (
      item?.notificationmessage?.toLowerCase().includes("declined interview") ||
      item?.notificationmessage?.toLowerCase().includes("accepted interview")
    ) {
      history.navigate("/customer-candidate-scheduled");
    } else if (
      item?.notificationmessage?.toLowerCase().includes("interview scheduled") ||
      item?.notificationmessage?.toLowerCase().includes("interview rescheduled") ||
      item?.notificationmessage?.toLowerCase().includes("interview cancelled")
    ) {
      history.navigate("/customer-candidate-scheduled");
    } else if (item?.notificationmessage?.toLowerCase().includes("applied for the")) {
      history.navigate("/customer-candidate-applied");
    } else if (item?.notificationmessage?.toLowerCase().includes("rejected interview")) {
      history.navigate("/customer-candidate-scheduled");
    } else {
      history.navigate("/candidate-list");
    }
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
  };

  const onConfAlert = (id) => {
    let data = { ...confAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    data.id = "";
    data.description = "";
    SetConfAlert(data);
    onDeleteNotification(id);
  };

  const onCloseConfAlert = () => {
    let data = { ...confAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    data.id = "";
    data.description = "";
    SetConfAlert(data);
  };

  const showConfAlert = (id) => {
    let data = { ...confAlert };
    data.title = "Delete Notification";
    data.type = "warning";
    data.show = true;
    data.id = id;
    data.description = "Are you sure want to delete this notification?";
    SetConfAlert(data);
  };
  let userId = localStorage.getItem("userId");
  let cardOptions = [
    {
      title: "Open jobs",
      count: dashboardCounts.openjobcount,
      className: "primary",
      icon: custDashIcons.open,
      path: "/job-list",
    },
    {
      title: "Matched candidates",
      count: dashboardCounts.matchedcandidatereviewpendingcount,
      className: "danger",
      icon: custDashIcons.matchedpending,
      path: "/candidate-list",
    },
    {
      title: "Liked candidates",
      count: dashboardCounts.newcandidatelikedcount,
      className: "success",
      icon: custDashIcons.liked,
      path: `/customer-candidate-liked/0/${userId}`,
    },
    {
      title: "Applied candidates",
      count: dashboardCounts.appliedcount,
      className: "danger",
      icon: custDashIcons.applied,
      path: `customer-candidate-applied/0/${userId}`,
    },
    {
      title: "Upcoming interview",
      count: dashboardCounts.upcominginterviewcount,
      className: "info",
      icon: custDashIcons.pending,
      path: "/scheduled-interview#upcoming",
    },
    {
      title: "Offer candidates",
      count: dashboardCounts.offerscount,
      className: "danger",
      icon: custDashIcons.offer,
      path: `customer-candidate-offers/0/${userId}`,
    }
  ];

  const callUnifiedApp = () => {
    const authUrl = createAuthLink('bullhorn');
    window.location.href = authUrl; // 
  }

  return (
    <>
      <div>
        {isCompanyAdmin && <Row className="mb-3">
          <Col sm="12" md="4" lg="3">
            <div className="d-flex align-items-center">
              <label className="me-2 mb-0 text-nowrap" style={{ fontWeight: 500 }}>
                View data for:
              </label>
              <select
                className="form-select form-control"
                value={dropdownValue}
                onChange={handleHiringManagerChange}
                disabled={isSwitching}
                style={{ minWidth: 200 }}
              >
                <option value="all">Select a Hiring Manager</option>
                {/* Pre-populate the selected option while the full list is loading on reload,
                    so the controlled <select> always has a matching <option> and never
                    visually falls back to "All Users" during the async load. */}
                {dropdownValue !== "all" && !hiringManagers.some(hm => String(hm.id) === dropdownValue) && (
                  <option value={dropdownValue}>
                    {localStorage.getItem("selectedHiringManagerName") || dropdownValue}
                  </option>
                )}
                {hiringManagers.map((hm) => (
                  <option key={hm.id} value={hm.id}>
                    {hm.name}
                  </option>
                ))}
              </select>
              {isSwitching && (
                <span className="ms-2 spinner-border spinner-border-sm text-primary" role="status" aria-hidden="true" />
              )}
            </div>
          </Col>
        </Row>}
        <Row>
          <Col sm="12" md="12" lg="12">
            <WidgetCard
              cardOptions={cardOptions}
              threeCols={true}
              showIcons={true}
            />
          </Col>
          <Col sm="12" md="6" lg="6">
            <HorizonatalBarGraph
              graphData={dashboardGraphData?.scheduledInterveiwDtos ? dashboardGraphData?.scheduledInterveiwDtos : []}
            />
          </Col>
          <Col sm="12" md="6" lg="6">
            <Alerts
              onDeleteNotification={(id) => showConfAlert(id)}
              onReadNotification={(id, status, item) =>
                onReadNotification(id, status, item)
              }
            />
          </Col>
        </Row>
        <Row>
          <Col sm="12">
            <ActivePipelines
              pipelineJobList={pipelineJobList}
              pipelineJobDetail={pipelineJobDetail}
              pipelineJdLoading={pipelineJdLoading}
              JobListloader={JobListloader}
              selectedJobId={selectedJobId}
              onSelectJob={setSelectedJobId}
              userId={userId}
              totalRows={totalRows}
              currentPage={jobListPage}
              pageSize={10}
              onLoadNextPage={handleLoadNextPage}
              onFilterChange={handlePipelineFilterChange}
              isCompanyAdmin={isCompanyAdmin}
            />
          </Col>
        </Row>
        <Row>
          <Col>
            <CustomerSlider data={dashboardGraphData.upcomingInterveiwDtos} />
          </Col>
        </Row>
        <StackBarChart
          graphData={dashboardJobsDataCount.customerDashboardJobDataCountList}
        />
      </div>
      <>
        {showRemModal ? (
          <BillDetailRemModal
            isOpen={showRemModal}
            onClose={() => setShowRemModal(false)}
            onUpdate={handleBillDetailUpdate}
          ></BillDetailRemModal>
        ) : (
          <></>
        )}
      </>
      <> {showPaymentModal ? (
        <PaymentModal
          isOpen={showPaymentModal}
          //selectedCustomer={}
          // onClose={() => onCloseBDModal()}
          isAdmin={true}
          userId={JSON.parse(localStorage.getItem("userDetails")).InternalUserId}
          companyid={JSON.parse(localStorage.getItem("userDetails"))?.companyid}
          onClose={() => setShowPaymentModal(false)}
        />
      ) : (
        <></>
      )}

      </>
      <>
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        >
          {showAlert.description}
        </SweetAlert>
      </>

      <>
        <SweetAlert
          title={confAlert.title}
          show={confAlert.show}
          type={confAlert.type}
          onConfirm={() => onConfAlert(confAlert.id)}
          onCancel={() => onCloseConfAlert()}
          showCancel
        >
          {confAlert.description}
        </SweetAlert>
      </>
    </>
  );
}
