import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../../_components/common/pagetitle";

import titlelogo from "../../../assets/utils/images/candidate.svg";

import { ReactBigCalender } from "_widgets";
import { useEffect } from "react";
import { scheduledInterviewListThunk } from "../_redux/report.slice";
import moment from "moment";
import { InterViewDetailModal } from "../../../_components/modal/interviewdetailmodal";
import { Row, Col } from "reactstrap";
import "./admincalendar.scss";
export function AdminCalendar({ title }) {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [popupData, setPopupData] = useState({});
  const { scheduledInterviewList = [] } = useSelector(
    (state) => state.adminReportReducer
  );

  useEffect(() => {
    dispatch(scheduledInterviewListThunk());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const events = scheduledInterviewList.map((item) => {
    const startDate = moment(
      moment(item.scheduledate).format("MMM D, YYYY") + " " + item.starttime
    )
      .tz("America/New_York")
      .format("YYYY-MM-DD HH:mm:ss");

    const [duration] =
      item.duration !== undefined ? item.duration.split(" ") : [];
    const endDate = moment(startDate)
      .add(duration, "m")
      .format("YYYY-MM-DD HH:mm:ss");

    return {
      id: item.scheduleinterviewid,
      data: item,
      format: item.format,
      title: item.jobtitle,
      start: new Date(startDate),
      end: new Date(endDate),
      color:
        item.isaccepted === true && item.isrejected === false
          ? "#14BD66"
          : item.isrejected === true
          ? "#FF406D"
          : "#F7B924",
    };
  });

  const onHandleSelectEvent = useCallback((event) => {
    setPopupData(event.data);
    setOpenModal(true);
  }, []);

  const onCloseIdModal = () => {
    setOpenModal(false);
  };

  return (
    <div className="adm-cal-cont">
      <PageTitle heading={title} icon={titlelogo} />
      <Row>
        <Col sm={12} md={4} lg={4} xl={4}>
          <p>{title}</p>
        </Col>
        <Col sm={12} md={8} lg={8} xl={8} className="right-align">
          <div className="text-end">
            <div className="mb-3 me-0 badge badge-color-yellow">P</div> No
            response
            <div className="ms-3 mb-3 me-1 badge badge-color-green">P</div>
            Accepted interview{" "}
            <div className="ms-3 mb-3 me-0 badge badge-color-red">P</div>{" "}
            Rejected interview
            <div className="ms-3 mb-3 me-0 badge badge-color-skyblue">
              P
            </div>{" "}
            Interview completed
            <div className="ms-3 mb-3 me-0 badge badge-color-grey">P</div> Not
            joined
          </div>
        </Col>
      </Row>
      <ReactBigCalender
        events={events}
        toolbar={true}
        onHandleSelectEvent={(evt) => onHandleSelectEvent(evt)}
      />
      <>
        {openModal ? (
          <>
            <InterViewDetailModal
              data={popupData}
              onClose={() => {
                onCloseIdModal();
              }}
              isOpen={openModal}
              isAdmin={true}
            ></InterViewDetailModal>
          </>
        ) : (
          <></>
        )}
      </>
    </div>
  );
}
