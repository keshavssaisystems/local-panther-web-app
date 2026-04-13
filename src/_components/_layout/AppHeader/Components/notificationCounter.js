import React, { useEffect, useState } from "react";
import { candidateDashboardActions } from "_store";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { AlertModal } from "_components/modal/alertModal";
import { history } from "_helpers";
import { isInternalUrl } from "_helpers/helper";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";

export const NotificationCounter = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
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

  const [notiCount, setNotiCount] = useState(0);
  const alerts = useSelector((state) => state.candidateDashboard.alertsList);

  useEffect(() => {
    if (alerts.length > 0) {
      setNotiCount(
        alerts.filter((item) => {
          return item.notificationstatusid !== 3;
        }).length
      );
    }
  }, [alerts]);

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
        autoCloseDelay: 2000,
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
        autoCloseDelay: 2000,
        maxWidth: 500,
      }));

    }
  };

  const onReadNotification = async (id, status, item) => {
    if (status !== 3) {
      dispatch(candidateDashboardActions.readNotification({ id }));
    }

    // Prefer routing based on metadata saved by backend when available
    try {
      if (item?.notificationresponse) {
        const meta = JSON.parse(item.notificationresponse);
        if (meta?.groupId) {
          setTimeout(() => history.navigate(`/chat?groupId=${encodeURIComponent(meta.groupId)}`), 0);
          return;
        }
        if (meta?.redirectUrl && isInternalUrl(meta.redirectUrl)) {
          history.navigate(meta.redirectUrl);
          return;
        }
        // ignore external or invalid redirectUrl values
      }
    } catch (e) {
      // ignore and fall back to legacy routing
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
    } else {
      if (item?.notificationmessage?.toLowerCase().includes("job offer accepted")) {
        history.navigate("/customer-candidate-offers");
      } else if (item?.notificationmessage?.toLowerCase().includes("job offer declined")
        || item?.notificationmessage?.toLowerCase().includes("job offer rejected")) {
        history.navigate("/customer-candidate-rejected");
      } else if (item?.notificationmessage?.toLowerCase().includes("reschedule interview request")) {
        history.navigate("/customer-candidate-scheduled");
      } else if (item?.notificationmessage?.toLowerCase().includes("declined interview")
        || item?.notificationmessage?.toLowerCase().includes("accepted interview")) {
        history.navigate("/customer-candidate-scheduled");
      } else if (item?.notificationmessage?.toLowerCase().includes("applied for the")) {
        history.navigate("/customer-candidate-applied");
      } else if (item?.notificationmessage?.toLowerCase().includes("rejected interview")) {
        history.navigate("/customer-candidate-scheduled");
      } else {
        history.navigate("/candidate-list");
      }
    }
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
    <>
      {" "}
      <>
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>
      <>
        <>
          <AlertModal
            notiCount={notiCount}
            data={alerts}
            onDeleteNotification={(id) => showConfAlert(id)}
            onReadNotification={(id, status, item) =>
              onReadNotification(id, status, item)
            }
          ></AlertModal>
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
    </>
  );
};
