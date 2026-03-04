import React, { useEffect, useState, useRef } from "react";
import { Row, Col, Card, CardBody, Button, Badge } from "reactstrap";
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
import { PaymentModal } from "_components/modal/paymentmodal";
import Loader from "react-loaders";
import { JobPipelineTimeline } from "_components/dashboard/JobPipelineTimeline";
import { createAuthLink } from "_components/unifiedApp/unifiedApp";

export default function CustomerDashboard() {
  const [showRemModal, setShowRemModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const tabScrollRef = useRef(null);
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

  // ── Job Pipeline Timeline selectors ──────────────────────────────────────
  const pipelineJobList = useSelector((state) => state.custJobListReducer.jobList);
  const pipelineJobDetail = useSelector((state) => state.custJobListReducer.jobDetail);
  const pipelineJdLoading = useSelector((state) => state.custJobListReducer.jdLoading);

  const handleBillDetailUpdate = () => {
    setShowRemModal(false);
    setShowPaymentModal(true);
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
    dispatch(scheduleInterviewActions.getAllInterviewThunk(localStorage.getItem("userId")));
    dispatch(customerDashboardActions.getSendTimezoneBeckendThunk());
    dispatch(
      dropdownActions.getSubsidiaryListThunk(localStorage.getItem("companyid"))
    );
    dispatch(customerCandidateListsActions.getDurationOptions());
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Employer dashboard",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }

    // Load job list for the Active Pipelines section
    const dashUserId = localStorage.getItem("userId");
    const dashCompanyId = localStorage.getItem("companyid");
    if (dashUserId && dashCompanyId) {
      dispatch(
        custJobListActions.getJobList({
          pageSize: 50,
          pageNumber: 1,
          searchText: "",
          companyId: dashCompanyId,
          searchType: "JobTitle",
          jobStatus: "",
          hiringManagerId: dashUserId,
        })
      );
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
            {/* ── Active Pipelines ─────────────────────────────────────────── */}
            <Card className="mb-3 shadow-sm">
              <CardBody>
                <h6 className="fw-semibold mb-3" style={{ color: "#2f2e2e", fontSize: "15px" }}>
                  Active Pipelines
                </h6>

                {/* Job title tabs with horizontal scroll arrows */}
                {pipelineJobList?.length > 0 && (
                  <div className="d-flex align-items-center gap-1 mb-3">
                    {/* Left arrow */}
                    <Button
                      color="light"
                      size="sm"
                      className="rounded-circle p-0 border flex-shrink-0"
                      style={{ width: "28px", height: "28px", opacity: showLeftArrow ? 1 : 0.25 }}
                      disabled={!showLeftArrow}
                      onClick={() => tabScrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                      aria-label="Scroll left"
                    >
                      <span style={{ fontWeight: 700, color: "#2f479b" }}>&#8249;</span>
                    </Button>

                    {/* Scrollable tab strip */}
                    <div
                      ref={(el) => {
                        tabScrollRef.current = el;
                        if (el) setShowRightArrow(el.scrollWidth > el.clientWidth);
                      }}
                      onScroll={(e) => {
                        const el = e.currentTarget;
                        setShowLeftArrow(el.scrollLeft > 0);
                        setShowRightArrow(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
                      }}
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
                          onClick={() => setSelectedJobId(job.jobid)}
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
                      style={{ width: "28px", height: "28px", opacity: showRightArrow ? 1 : 0.25 }}
                      disabled={!showRightArrow}
                      onClick={() => tabScrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                      aria-label="Scroll right"
                    >
                      <span style={{ fontWeight: 700, color: "#2f479b" }}>&#8250;</span>
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
                ) : (
                  pipelineJobDetail?.length > 0 && (
                    <JobPipelineTimeline
                      job={pipelineJobDetail[0]}
                      hiringManagerId={userId}
                    />
                  )
                )}
              </CardBody>
            </Card>
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
