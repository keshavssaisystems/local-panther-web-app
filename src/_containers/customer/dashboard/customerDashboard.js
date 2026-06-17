import React, { useEffect, useState } from "react";
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
  const [isCompanyAdmin, setIsCompanyAdmin] = useState(
    JSON.parse(localStorage.getItem("userDetails"))?.isCompanyAdmin || JSON.parse(localStorage.getItem("userDetails"))?.UserroleId === "4" || false
  );
  const [confAlert, SetConfAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
    id: "",
  });
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
    dispatch(
      dropdownActions.getSubsidiaryListThunk(localStorage.getItem("companyid") || 0)
    );
    dispatch(customerCandidateListsActions.getDurationOptions());
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
