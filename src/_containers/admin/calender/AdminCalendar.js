import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../../_components/common/pagetitle";

import titlelogo from "../../../assets/utils/images/candidate.svg";

import { ReactBigCalender } from "_widgets";
import { useEffect } from "react";
import {
  scheduledInterviewListThunk,
  getCandidateDropdownList,
  getCustomerDropdownList,
} from "../_redux/report.slice";
import moment from "moment";
import { InterViewDetailModal } from "../../../_components/modal/interviewdetailmodal";
import { Row, Col, FormGroup, Button, Input } from "reactstrap";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./admincalendar.scss";
export function AdminCalendar({ title }) {
  let userDetails = JSON.parse(localStorage.getItem("userDetails"));
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [popupData, setPopupData] = useState({});
  const { scheduledInterviewList = [] } = useSelector(
    (state) => state.adminReportReducer
  );

  const { customerList = [] } = useSelector(
    (state) => state.adminReportReducer
  );

  const { candidateList = [] } = useSelector(
    (state) => state.adminReportReducer
  );

  const [filter, setFilter] = useState({});
  const [customerId, setCustomerId] = useState();
  const [candidateId, setCandidateId] = useState();

  const [firstDate, setFirstDate] = useState("");
  const [lastDate, setLastDate] = useState("");

  useEffect(() => {
    // Get the current date
    const currentDate = new Date();

    // Get the first day of the current month
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Get the last day of the current month
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    const formattedFirstDay = formatDate(firstDayOfMonth);
    const formattedLastDay = formatDate(lastDayOfMonth);
    setFirstDate(formattedFirstDay);
    setLastDate(formattedLastDay);
    getUpcomingData({
      candidateId: userDetails.InternalUserId,
      start: formattedFirstDay,
      end: formattedLastDay,
    });
    dispatch(getCandidateDropdownList());
    dispatch(getCustomerDropdownList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUpcomingData = async function (filterdata) {
    await dispatch(scheduledInterviewListThunk(filterdata));
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-based
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

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
        item?.isreschedulerequested === true
          ? "#2f479b"
          : item?.interviewstatusid !== 0
          ? item?.interviewstatusid === 1
            ? "#30b1ff"
            : "#6c757d"
          : item.isaccepted === true && item.isrejected === false
          ? "green"
          : item.isrejected === true
          ? "red"
          : "#f7b924",
    };
  });

  const onHandleSelectEvent = useCallback((event) => {
    setPopupData(event.data);
    setOpenModal(true);
  }, []);

  const onCloseIdModal = () => {
    setOpenModal(false);
  };

  const onHandleNavigate = (data) => {
    let firstDayOfMonth;

    let lastDayOfMonth;
    let formattedFirstDay;
    let formattedLastDay;

    if (data.start) {
      firstDayOfMonth = new Date(data.start);

      lastDayOfMonth = new Date(data.end);
      formattedFirstDay = formatDate(firstDayOfMonth);
      formattedLastDay = formatDate(lastDayOfMonth);
    } else {
      firstDayOfMonth = new Date(data[0]);

      lastDayOfMonth = new Date(data[data.length - 1]);
      formattedFirstDay = formatDate(firstDayOfMonth);
      formattedLastDay = formatDate(lastDayOfMonth);
    }
    setFirstDate(formattedFirstDay);
    setLastDate(formattedLastDay);
    getUpcomingData({
      candidateId: userDetails.InternalUserId,
      start: formattedFirstDay,
      end: formattedLastDay,
    });
  };

  const onSubmitClear = () => {
    setFilter({});

    setCandidateId("");
    setCustomerId("");
    getUpcomingData({
      candidateId: userDetails.InternalUserId,
      start: firstDate,
      end: lastDate,
    });
  };

  const onSubmitHandler = () => {
    getUpcomingData({
      candidateId: userDetails.InternalUserId,
      start: firstDate,
      end: lastDate,
      companyId: customerId ? customerId : "",
      candidateId: candidateId ? candidateId : "",
    });
  };

  const handleChange = (name, value) => {
    setFilter({
      ...filter,
      [name]: value,
    });
  };

  return (
    <div className="adm-cal-cont">
      <PageTitle heading={title} icon={titlelogo} />
      <Row>
        <Col sm={12} md={12} lg={12} xl={12}>
          <Row>
            <Col xl="5" lg="5" md="3" sm="12"></Col>
            <Col xl="2" lg="2" md="3" sm="12">
              <FormGroup>
                <Input
                  type="select"
                  value={candidateId}
                  name="candidateid"
                  id="candidateid"
                  placeholder="Candidate Id"
                  onChange={(e) => {
                    handleChange("candidateid", e.target.value);
                    setCandidateId(e.target.value);
                  }}
                >
                  <option value={""}>Select Candidate</option>
                  {candidateList?.length > 0 ? (
                    candidateList.map((data) => (
                      <option
                        value={data.id ? data.id : data.candidateid}
                        key={data.id ? data.id : data.candidateid}
                      >
                        {data.name
                          ? data.name
                          : data.firstname + " " + data.lastname}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </Input>
              </FormGroup>
            </Col>
            <Col xl="2" lg="2" md="3" sm="12" sx="12">
              <FormGroup>
                <Input
                  type="select"
                  value={customerId}
                  name="customerid"
                  id="customerid"
                  placeholder="Customer ID"
                  onChange={(e) => {
                    handleChange("customerid", e.target.value);
                    setCustomerId(e.target.value);
                  }}
                >
                  <option value={""}>Select Company</option>
                  {customerList?.length > 0 ? (
                    customerList.map((data) => (
                      <option value={data.companyid} key={data.companyid}>
                        {data.companyname}
                      </option>
                    ))
                  ) : (
                    <></>
                  )}
                </Input>
              </FormGroup>
            </Col>

            <Col xl="3" lg="3" md="3" sm="12" sx="12" className="right-align">
              <Button
                style={{ background: "rgb(47 71 155)" }}
                color="primary"
                type="button"
                onClick={() => onSubmitHandler()}
              >
                <FontAwesomeIcon icon={faSearch} /> Search
              </Button>
              <Button
                color="link"
                type="button"
                onClick={() => onSubmitClear()}
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Col>
        <Col sm={12} md={12} lg={12} xl={12} className="right-align">
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
            <div className="ms-3 mb-3 me-0 badge badge-color-darkblue">
              P
            </div>{" "}
            Requested for reschedule
          </div>
        </Col>
      </Row>
      <ReactBigCalender
        events={events}
        toolbar={true}
        onHandleSelectEvent={(evt) => onHandleSelectEvent(evt)}
        onHandleNavigate={(evt) => onHandleNavigate(evt)}
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
