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

  const [notiCount, setNotiCount] = useState(0);
  const alerts = useSelector((state) => state.candidateDashboard.alertsList);
  useEffect(() => {
    dispatch(candidateDashboardActions.getAlerts({ candidateId: userId }));
  }, []);

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

  const onReadNotification = (id) => {
    dispatch(candidateDashboardActions.readNotification({ id }));
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
            onDeleteNotification={(id) => onDeleteNotification(id)}
            onReadNotification={(id) => onReadNotification(id)}
          ></AlertModal>
        </>
      </>
    </>
  );
};
