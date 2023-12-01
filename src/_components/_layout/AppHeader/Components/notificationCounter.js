import React, { useEffect, useState } from "react";
import { candidateDashboardActions } from "_store";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import { AlertModal } from "_components/modal/alertModal";

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
            onReadNotification={(id, status) => onReadNotification(id, status)}
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
