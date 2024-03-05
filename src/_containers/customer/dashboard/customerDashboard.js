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
} from "_store";
import { HorizonatalBarGraph } from "_components/dashboard/horizontalBarGraph";
import { CustomerSlider } from "_components/dashboard/customerSlider";
import moment from "moment/moment";
import { BillDetailRemModal } from "_components/modal/billdetailremmodal";
import { Alerts } from "_containers/candidate/dashboard/alerts";
import SweetAlert from "react-bootstrap-sweetalert";
import custDashIcons from "assets/utils/images/customer/dashboard";

export default function CustomerDashboard() {
  const [showRemModal, setShowRemModal] = useState(false);
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
  useEffect(() => {
    getCompanyDetails();
    getDashboardGraphData();
    getDashboardCounts();
    getDashboardJobsDataCount();
    dispatch(scheduleInterviewActions.getUpcomingInterviewListThunk());
    dispatch(scheduleInterviewActions.getAllInterviewThunk());
    dispatch(customerDashboardActions.getSendTimezoneBeckendThunk());
    dispatch(
      dropdownActions.getSubsidiaryListThunk(localStorage.getItem("companyid"))
    );
    dispatch(customerCandidateListsActions.getDurationOptions());
  }, []);
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
  const onReadNotification = (id, status) => {
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

  let cardOptions = [
    {
      title: "Open jobs",
      count: dashboardCounts.openjobcount,
      className: "primary",
      icon: custDashIcons.open,
      path: "/job-list",
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
      path: "customer-candidate-offers/0",
    },
    {
      title: "Liked candidates",
      count: dashboardCounts.newcandidatelikedcount,
      className: "success",
      icon: custDashIcons.liked,
      path: "/customer-candidate-liked/0",
    },
    {
      title: "Matched candidate pending to review",
      count: dashboardCounts.matchedcandidatereviewpendingcount,
      className: "danger",
      icon: custDashIcons.matchedpending,
      path: "/candidate-list",
    },

    {
      title: "Applied candidates",
      count: dashboardCounts.appliedcount,
      className: "danger",
      icon: custDashIcons.applied,
      path: "customer-candidate-applied/0",
    },
  ];

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
              graphData={dashboardGraphData.scheduledInterveiwDtos}
            />
          </Col>
          <Col sm="12" md="6" lg="6">
            <Alerts
              onDeleteNotification={(id) => showConfAlert(id)}
              onReadNotification={(id, status) =>
                onReadNotification(id, status)
              }
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
          ></BillDetailRemModal>
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
