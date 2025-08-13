import React, { useState } from "react";
import PageTitle from "../../_components/common/pagetitle";
import titlelogo from "../../assets/utils/images/candidate.svg";
import { Alerts } from "_containers/candidate/dashboard/alerts";
import { useDispatch } from "react-redux";
import { candidateDashboardActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";
import { history } from "_helpers";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

export const Notifications = () => {
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
  const onReadNotification = (id, status, item) => {
    if (status !== 3) {
      dispatch(candidateDashboardActions.readNotification({ id }));
    }

    if (localStorage.getItem("userroleid") === "3") {
      if (item?.notificationmessage?.toLowerCase() === "interview scheduled") {
        history.navigate("/job-list-interview");
      } else if (
        item?.notificationmessage?.toLowerCase() === "interview rescheduled"
      ) {
        history.navigate("/job-list-interview");
      } else if (
        item?.notificationmessage?.toLowerCase() === "offer received" ||
        item?.notificationmessage?.toLowerCase() === "job offer"
      ) {
        history.navigate("/job-list-offers");
      } else if (item?.notificationmessage?.toLowerCase() === "match job") {
        history.navigate("/job-list-matched");
      } else if (
        item?.notificationmessage?.toLowerCase() === "incomplete profile" ||
        item?.notificationmessage?.toLowerCase() === "resume parsed"
      ) {
        history.navigate("/profile");
      }
    }
  };

  const onDeleteNotification = async (id) => {
    let res = await dispatch(
      candidateDashboardActions.deleteNotifications({ id })
    );
    if (res?.payload?.statusCode === 200) {
      // showSweetAlert({
      //   title: "Deleted notification successfully.",
      //   type: "success",
      // });
      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.DELETED_NOTIFICATION_SUCCESS,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

    } else {
      // showSweetAlert({
      //   title: res.payload.message || res.payload.status,
      //   type: "danger",
      // });

      dispatch(showSnackbar({
        message: res.payload.message || res.payload.status,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
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
  return (
    <div>
      <PageTitle heading="Alerts & Notifications" icon={titlelogo} />

      <div>
        <Alerts
          type="view"
          onDeleteNotification={(id) => showConfAlert(id)}
          onReadNotification={(id, status, item) =>
            onReadNotification(id, status, item)
          }
        ></Alerts>
      </div>
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
    </div>
  );
};
