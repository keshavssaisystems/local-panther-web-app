import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../../_components/common/pagetitle";
import Select, { components } from "react-select";
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
import { analytics } from "../../../firebase/index";
import { getTimezoneDateTime } from "_helpers/helper";
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

  const { candidateList = [], candidateListLoading, candidateListHasMore } = useSelector(
    (state) => state.adminReportReducer
  );

  const [candidatePage, setCandidatePage] = useState(1);

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
      startDate: formattedFirstDay,
      endDate: formattedLastDay,
    });
    dispatch(getCandidateDropdownList(1));
    setCandidatePage(1);
    dispatch(getCustomerDropdownList());
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Admin Calendar",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
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
    const startDate = getTimezoneDateTime(
      moment(item.scheduledate).format("MMM D, YYYY") + " " + item.starttime,

      "YYYY-MM-DD HH:mm:ss"
    );

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
          ? "rgb(215 174 255 / 50%)"
          : item?.interviewstatusid !== 0
          ? item?.interviewstatusid === 1
            ? "rgb(143 208 255 / 50%)"
            : "rgb(202 202 202 / 50%)"
          : item.isaccepted === true && item.isrejected === false
          ? "rgb(137 222 178 / 50%)"
          : item.isrejected === true
          ? "rgb(255 143 143 / 50%)"
          : "rgb(250 219 145 / 50%)",
      textcolor:
        item?.isreschedulerequested === true
          ? "#2D0059"
          : item?.interviewstatusid !== 0
          ? item?.interviewstatusid === 1
            ? "#004271"
            : "#2D2D2D"
          : item.isaccepted === true && item.isrejected === false
          ? "#005027"
          : item.isrejected === true
          ? "#520000"
          : "#5C4100",
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
      startDate: formattedFirstDay,
      endDate: formattedLastDay,
      companyId: customerId ? customerId : "",
      candidateId: candidateId ? candidateId : "",
    });
  };

  const onSubmitClear = () => {
    setFilter({});
    setCandidateId("");
    setCustomerId("");
    setCandidatePage(1);
    dispatch(getCandidateDropdownList(1));
    getUpcomingData({
      startDate: firstDate,
      endDate: lastDate,
    });
  };

  const onSubmitHandler = () => {
    getUpcomingData({
      startDate: firstDate,
      endDate: lastDate,
      companyId: customerId ? customerId : "",
      candidateId: candidateId ? candidateId : "",
    });
  };

  const BootstrapArrow = (props) => (
    <components.DropdownIndicator {...props}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="12">
        <path fill="none" stroke="#343a40" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m2 5 6 6 6-6" />
      </svg>
    </components.DropdownIndicator>
  );

  const candidateSelectStyles = {
    container: (base) => ({ ...base, width: "100%" }),
    control: (base, state) => ({
      ...base,
      width: "100%",
      height: 35,
      minHeight: 34,
      backgroundColor: "#fff",
      border: "1px solid #dee2e6",
      borderRadius: "0.375rem",
      boxShadow: "none",
      outline: 0,
      lineHeight: "1.5",
      color: "#54595e",
      cursor: "default",
      flexWrap: "nowrap",
      "&:hover": { borderColor: "#dee2e6" },
    }),
    valueContainer: (base) => ({
      ...base,
      height: 36,
      padding: "0 0 0 0.75rem",
      flexWrap: "nowrap",
      overflow: "hidden",
    }),
    indicatorsContainer: (base) => ({
      ...base,
      height: 36,
      paddingRight: "0.75rem",
    }),
    singleValue: (base) => ({ ...base, color: "#51575e", fontWeight: "400", margin: 0 }),
    placeholder: (base) => ({ ...base, color: "#212529",  margin: 0 }),
    input: (base) => ({
      ...base,
      color: "#212529",
      fontSize: "1rem",
      fontWeight: "400",
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: () => ({ display: "none" }),
    dropdownIndicator: (base) => ({ ...base, padding: "0", color: "#343a40" }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      border: "1px solid #dee2e6",
      borderRadius: "0.375rem",
      boxShadow: "none",
      zIndex: 9999,
      marginTop: "2px",
    }),
    menuList: (base) => ({ ...base, padding: 0, overflowX: "hidden" }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#6e7377" : "#fff",
      color: state.isFocused ? "#fff" : "#51575e",
      padding: "0.375rem 0.75rem",
      cursor: "default",
      whiteSpace: "normal",
      wordBreak: "break-word",
    }),
  };

  const onCandidateMenuScrollToBottom = () => {
    if (!candidateListLoading && candidateListHasMore) {
      const nextPage = candidatePage + 1;
      setCandidatePage(nextPage);
      dispatch(getCandidateDropdownList(nextPage));
    }
  };

  const candidateOptions = [
    { value: "", label: "Select Candidate" },
    ...candidateList.map((data) => ({
      value: data.id ? data.id : data.candidateid,
      label: data.name ? data.name : data.firstname + " " + data.lastname,
    })),
  ];

  const selectedCandidateOption =
    candidateOptions.find((o) => String(o.value) === String(candidateId)) || candidateOptions[0];

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
                <Select
                  options={candidateOptions}
                  value={selectedCandidateOption}
                  isLoading={candidateListLoading}
                  isSearchable={true}
                  isClearable={false}
                  onMenuScrollToBottom={onCandidateMenuScrollToBottom}
                  components={{ DropdownIndicator: BootstrapArrow }}
                  styles={candidateSelectStyles}
                  onChange={(selected) => {
                    const val = selected ? selected.value : "";
                    handleChange("candidateid", val);
                    setCandidateId(val);
                  }}
                />
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
            <span className="legend">
              <div className="mb-3 me-0 badge badge-color-yellow">..</div> No
              response{" "}
            </span>
            <span className="legend">
              <div className="ms-3 mb-3 me-1 badge badge-color-green">..</div>
              Accepted interview{" "}
            </span>
            <span className="legend">
              <div className="ms-3 mb-3 me-0 badge badge-color-red">..</div>{" "}
              Declined interview{" "}
            </span>
            <span className="legend">
              <div className="ms-3 mb-3 me-0 badge badge-color-skyblue">..</div>{" "}
              Interview completed{" "}
            </span>
            <span className="legend">
              <div className="ms-3 mb-3 me-0 badge badge-color-grey">..</div>{" "}
              Not joined{" "}
            </span>
            <span className="legend">
              <div className="ms-3 mb-3 me-0 badge badge-color-darkblue">
                ..
              </div>{" "}
              Requested for reschedule{" "}
            </span>
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
