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
import { setHiringManagerId as setSharedHMId } from "_store/commonCustFiltersSlice";
import { createAuthLink } from "_components/unifiedApp/unifiedApp";

export default function CustomerDashboard() {
  const [showRemModal, setShowRemModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [jobListPage, setJobListPage] = useState(1);
  // Intentionally no lazy-init from Redux here — pipelineFilters drives the UI
  // search/type inputs. The HM filter is read directly from Redux in loadJobListPage.
  const [pipelineFilters, setPipelineFilters] = useState({
    searchText: "",
    searchType: "JobTitle",
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
  const sharedHiringManagerId = useSelector((state) => state.commonCustFilters.hiringManagerId);
  const sharedSeeAllHM = useSelector((state) => state.commonCustFilters.seeAllHiringManagerJobs);
  const selectedHiringManagerId = useSelector((state) => state.auth.selectedHiringManagerId);

  const reloadDashboardData = (explicitFilters) => {
    getDashboardCounts();
    getDashboardJobsDataCount();
    getDashboardGraphData();
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(scheduleInterviewActions.getAllInterviewThunk({ userList: localStorage.getItem("userId"), viewAllCompanyJobs: false }));
    const dashUserId = localStorage.getItem("userId");
    if (dashUserId) {
      loadJobListPage(1, explicitFilters);
    }
  };

  // Reload dashboard counts/graph when "View as" user changes from any page
  // (e.g. switched via the global ViewAsBar in the header).
  // Skips the initial mount since the [] effect already covers it.
  // The job list is handled separately by [sharedHiringManagerId, sharedSeeAllHM]
  // to avoid a duplicate fetch.
  const dashboardViewAsRef = useRef(true);
  useEffect(() => {
    if (dashboardViewAsRef.current) { dashboardViewAsRef.current = false; return; }
    getDashboardCounts();
    getDashboardJobsDataCount();
    getDashboardGraphData();
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
  }, [selectedHiringManagerId]);

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
    // When an explicit HM/toggle is provided via filters use it directly.
    // Otherwise fall back to the current shared Redux filter state so that
    // a re-mount (navigating back to Dashboard) picks up changes made on
    // other screens without needing a second API call.
    const resolvedHM = activeFilters.hiringManagerId !== undefined
      ? activeFilters.hiringManagerId
      : sharedHiringManagerId;
    const resolvedViewAll = activeFilters.viewAllCompanyJobs !== undefined
      ? activeFilters.viewAllCompanyJobs
      : sharedSeeAllHM;
    // Always fall back to dashUserId when no HM is explicitly selected.
    const effectiveHM = resolvedHM || dashUserId;
    if (dashUserId) {
      dispatch(
        custJobListActions.getJobs({
          pageSize: 15,
          pageNumber: pageNumber,
          companyId: dashCompanyId,
          searchText: activeFilters.searchText || "",
          searchType: activeFilters.searchType || "JobTitle",
          hiringManagerId: effectiveHM,
          viewAllCompanyJobs: resolvedViewAll,
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
    setPipelineFilters({
      searchText: filters.searchText || "",
      searchType: filters.searchType || "JobTitle",
    });
    setSelectedJobId(null);
    loadJobListPage(1, filters);
  };

  useEffect(() => {
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

  // Reload Active Pipelines whenever the shared HM filter changes (including on mount).
  // This covers: navigating back from another screen, external sync, and view-as changes.
  // Two API calls may fire when AP also calls onFilterChange — both have correct params.
  useEffect(() => {
    const dashUserId = localStorage.getItem("userId");
    const dashCompanyId = localStorage.getItem("companyid");
    if (!dashUserId) return;
    const effectiveHM = sharedHiringManagerId || dashUserId;
    dispatch(
      custJobListActions.getJobs({
        pageSize: 15,
        pageNumber: 1,
        companyId: dashCompanyId,
        searchText: "",
        searchType: "JobTitle",
        hiringManagerId: effectiveHM,
        viewAllCompanyJobs: sharedSeeAllHM,
      })
    );
    setJobListPage(1);
  }, [sharedHiringManagerId, sharedSeeAllHM, dispatch]);

  // Auto-select the first job whenever the pipeline job list loads
  useEffect(() => {
    if (pipelineJobList?.length > 0 && !selectedJobId) {
      setSelectedJobId(pipelineJobList[0].jobid);
    }
  }, [pipelineJobList]);

  // Reset selection whenever the HM filter changes so the stale auto-select
  // (which fires with old Redux data on mount) is overridden. This effect is
  // defined AFTER auto-select so React runs it last in the same commit — ensuring
  // it always wins. The next pipelineJobList arrival (from getJobs.fulfilled) then
  // triggers auto-select with !selectedJobId=true and picks the correct fresh job.
  useEffect(() => {
    setSelectedJobId(null);
  }, [sharedHiringManagerId, sharedSeeAllHM]);

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
    } else if (item?.notificationmessage?.toLowerCase().includes("counter offer")) {
      history.navigate("/customer-candidate-offers");
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
              key={`pipeline-${sharedHiringManagerId || "default"}-${sharedSeeAllHM}`}
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
