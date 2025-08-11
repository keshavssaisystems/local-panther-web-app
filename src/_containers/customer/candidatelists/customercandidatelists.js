import React, { useState, useEffect } from "react";

import {
  TabContent,
  TabPane,
  ButtonGroup,
  Button,
  Row,
  Col,
  Input,
  InputGroup
} from "reactstrap";

import { BsSearch } from "react-icons/bs";
import classnames from "classnames";
import { CandidateCardView } from "_components/list/cardview";
import { CustCandidateListView } from "_components/list/custlistview";
import { CardPagination } from "_components/common/cardpagination";
import { useParams, useNavigate } from "react-router-dom";
import { cardPageSize, listPageSize } from "_helpers/constants";
import { useSelector, useDispatch } from "react-redux";
import { customerCandidateListsActions } from "./customercandidatelists.slice";
import Loader from "react-loaders";
import SweetAlert from "react-bootstrap-sweetalert";
import "./customercandidatelist.scss";
import { NoDataFound } from "_components/common/nodatafound";
import { BuildCVModal } from "_components/modal/buildcvmodal";
import {
  getProfileActions,
  dropdownActions,
  scheduleInterviewActions,
} from "_store";
import infoIcon from "assets/utils/images/info-circle-fill.svg";
import { PrescreenModal } from "_components/modal/prescreenmodal";
import { OfferHistory } from "_components/modal/offerhistorymoal";
import { NoCandidateAvailable } from "_components/common/noCandidateAvailable";
import { analytics } from "../../../firebase/index";
import cx from "classnames";

import { getHiringMangerList } from "_store";
import { set } from "lodash";

export default function CustomerCandidateLists(props) {
  const { id } = useParams();
  const { jobPostedbyId } = useParams();
  const [activeTab, setActiveTab] = useState(props.type || "matched");
  const [pageNo, setPageNo] = useState(1);

  const [selectedJobId, setSelectedJobId] = useState(id || "");
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPSModal, setShowPSModal] = useState(false);
  const [preScreenType, setPreScreenType] = useState("");
  const [oHModal, setOHModal] = useState(false);
  const [candidateName, setCandidateName] = useState("");
  const [searchText, setSearchText] = useState("");
  const [actionbyId, setActionbyId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.customerCandidateList.jobLists);

  const rejectDrpDwnList = useSelector(
    (state) => state.customerCandidateList.rejectDrpDwnList
  );
  const candidateList = useSelector(
    (state) => state.customerCandidateList.candidateList
  );

  const totalRecords = useSelector(
    (state) => state.customerCandidateList.totalRecords
  );

  const loading = useSelector((state) => state.customerCandidateList.loading);
  const durationOptions = useSelector(
    (state) => state.customerCandidateList.durationOptions
  );

  const prescreenQues = useSelector(
    (state) => state.customerCandidateList.prescreenQues
  );

  const custOfferHistory = useSelector(
    (state) => state.customerCandidateList.custOfferHistory
  );
  const hiringManagerDownList = useSelector((state) => state?.customerReportReducer?.hiringmangers);

  // // Set default actionbyId after hiringManagerDownList is loaded
  useEffect(() => {
    if (hiringManagerDownList && hiringManagerDownList.length > 0) {
      setActionbyId(localStorage.getItem("userId"));
    }
    if (id && jobPostedbyId) {
      setActionbyId(jobPostedbyId);
    }
  }, [hiringManagerDownList]);

  useEffect(() => {
    dispatch(customerCandidateListsActions.getDrpDwnJobLists());
    dispatch(customerCandidateListsActions.getRejectDropDown());
    dispatch(customerCandidateListsActions.getDurationOptions());
    dispatch(scheduleInterviewActions.getDurationThunk());
    dispatch(dropdownActions.getJobTypeThunk2());
    dispatch(dropdownActions.getWorkScheduleThunk2());
    dispatch(dropdownActions.getShiftThunk2());

    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "employer job list",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  useEffect(() => {
    if (window?.location?.pathname?.includes("candidate-list")) {
      console.log("Fetching candidate list for type:", props.type || activeTab);
      onGetPageList(pageNo, props.type || activeTab, "");
    }
  }, [props.type, actionbyId]);

  useEffect(() => {
    console.log("Fetching job's list candidate for type:", id || props.type || activeTab);
    if (id) {
      onGetPageList(pageNo, props.type || activeTab, id);
    }
  }, [props.type, id, actionbyId]);

  useEffect(() => {
    let companyId = Number(localStorage.getItem("companyid"));
    dispatch(getHiringMangerList(companyId));

  }, [dispatch])

  const returnStatusId = (type) => {
    if (type === "liked") {
      return 1;
    } else if (type === "maybe") {
      return 2;
    } else if (type === "applied") {
      return 3;
    } else if (type === "scheduled") {
      return 4;
    } else if (type === "accepted") {
      return 5;
    } else if (type === "rejected") {
      return 6;
    } else if (type === "offers") {
      return 7;
    } else {
      return "";
    }
  };

  const onGetPageList = (pageNo, type, id, clearText = false) => {
    let candObj = {
      pageNumber: pageNo,
      pageSize: type === "matched" ? cardPageSize : listPageSize,
      customerRecommendedJobStatusId: returnStatusId(type),
      jobId: id || "",
      searchText: clearText ? "" : searchText,
      actionbyId: actionbyId
    };

    dispatch(customerCandidateListsActions.getCandidateLists(candObj));
  };

  const handlePageChange = (page) => {
    setPageNo(page);
    onGetPageList(page, props.type || activeTab, id);
  };
  const toggle = (activetab) => {
    if (id) {
      setSearchText("");
      setPageNo(1);
      setActiveTab(activetab);
      navigate(`/customer-candidate-${activetab}/${id}/${jobPostedbyId}`);
    } else {
      setSearchText("");
      setPageNo(1);
      setActiveTab(activetab);
      onGetPageList(pageNo, activetab, "", true);
    }
  };

  const onSelectClick = (evt) => {
    setPageNo(1);
    setSelectedJobId(evt.target.value);
    navigate(
      `/customer-candidate-${activeTab}/${parseInt(
        evt.target.value === "" ? 0 : evt.target.value
      )}`
    );
  };
  let successMessage = "Candidate status updated successfully!";
  const onActionClick = async (evt, type) => {
    if (type === "like") {
      let res = await dispatch(
        customerCandidateListsActions.putLikedCandidate({ id: evt })
      );
      if (res.payload.statusCode === 204) {
        showSweetAlert({ title: successMessage, type: "success" });
        onGetPageList(pageNo, props.type || activeTab, id);
      } else {
        showSweetAlert({
          title: res.payload.message || res.payload.status,
          type: "danger",
        });
      }
    } else if (type === "maybe") {
      let res = await dispatch(
        customerCandidateListsActions.putMayBeCandidate({ id: evt })
      );
      if (res.payload.statusCode === 204) {
        showSweetAlert({ title: successMessage, type: "success" });
        onGetPageList(pageNo, props.type || activeTab, id);
      } else {
        showSweetAlert({
          title: res.payload.message || res.payload.status,
          type: "danger",
        });
      }
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

  const onUpdateList = () => {
    onGetPageList(pageNo, props.type || activeTab, id);
  };

  const onBuildResumeClick = async (candidateId) => {
    let response = await dispatch(getProfileActions.getCandidate(candidateId));
    if (response?.payload) {
      setShowProfileModal(true);
    }
  };

  const onPrescreenActionClick = async (type, row) => {
    await dispatch(
      customerCandidateListsActions.getPrescreenDetails({
        jobId: row.jobid,
        candidateid: row.candidateid,
      })
    );

    setPreScreenType(type);
    setShowPSModal(true);
  };

  const onShowOHModal = async (row) => {
    let res = await dispatch(
      customerCandidateListsActions.getCustOfferHistory(
        row.candidaterecommendedjobid
      )
    );
    if (res?.payload?.statusCode === 204) {
      setOHModal(true);
      setCandidateName(row.firstname + " " + row.lastname);
    } else {
      showSweetAlert({
        title: res.payload.message || res.payload.status,
        type: "danger",
      });
    }
  };

  const onClearSearch = async function () {
    setSearchText("");
    setPageNo(1);
    onGetPageList(pageNo, props.type || activeTab, id ? id : "", true);
  };
  const onSearchJob = async () => {
    setPageNo(1);
    onGetPageList(1, props.type || activeTab, id ? id : "");
  };

  const resetPageURL = () => {
    if (id && jobPostedbyId) {
      navigate(`/candidate-list`);
    }
    else {
      onSearchJob();
    }
  }

  return (
    <>
      <Row className="customercandidatelist">
        <div
          className="candidate-toolbar-flex"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            marginBottom: 24,
          }}
        >
          <Row>
            <Col xs="12" sm="12" md="6" lg={8}>
              <ButtonGroup size="md" className="cust-btn-tabs" style={{ flexWrap: 'wrap', minWidth: 320, maxWidth: '100%' }}>
                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "matched" })
                  }
                  onClick={() => {
                    toggle("matched");
                  }}
                >
                  Matched
                </Button>
                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition " +
                    classnames({ active: activeTab === "maybe" })
                  }
                  onClick={() => {
                    toggle("maybe");
                  }}
                >
                  Maybe
                </Button>
                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "liked" })
                  }
                  onClick={() => {
                    toggle("liked");
                  }}
                >
                  Liked
                </Button>

                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "applied" })
                  }
                  onClick={() => {
                    toggle("applied");
                  }}
                >
                  Applied
                </Button>

                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "scheduled" })
                  }
                  onClick={() => {
                    toggle("scheduled");
                  }}
                >
                  Interviews
                </Button>
                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "offers" })
                  }
                  onClick={() => {
                    toggle("offers");
                  }}
                >
                  Offer
                </Button>
                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "accepted" })
                  }
                  onClick={() => {
                    toggle("accepted");
                  }}
                >
                  Accepted
                </Button>
                <Button
                  color="primary"
                  disabled={loading}
                  className={
                    "border-0 btn-transition  " +
                    classnames({ active: activeTab === "rejected" })
                  }
                  onClick={() => {
                    toggle("rejected");
                  }}
                >
                  Declined
                </Button>

              </ButtonGroup></Col>

            <Col xs="12" sm="12" md="6" lg="2"><Input
              type="select"
              title="Hiring Manger"
              value={actionbyId}
              name="hiringmanagerId"
              id="hiringmanagerId"
              placeholder="Hiring Manger"
              style={{ minWidth: 200, maxWidth: 220, flex: '0 1 160px' }}
              onChange={(e) => {
                setActionbyId(e.target.value);
                resetPageURL();
              }}
            >
              <option value={""}>Select a Hiring Manger</option>
              {hiringManagerDownList?.length > 0 ? (
                hiringManagerDownList.map((data) => (
                  <option value={data.id} key={data.id}>
                    {data.name}
                  </option>
                ))
              ) : null}
            </Input>
            </Col>
            <Col xs="12" sm="12" md="6" lg={2}>
              <InputGroup>

                <Input
                  type="text"
                  id="search-input"
                  value={searchText}
                  onInput={(evt) => setSearchText(evt.target.value)}
                  placeholder="Search by Job Title"
                />
                <Button
                  color={"primary"}
                  className="input-group-text"
                  onClick={(evt) => { resetPageURL(); }}
                >
                  <BsSearch />
                </Button>
              </InputGroup>
              {/* <div
                className={cx(
                  "candidate-search-wrapper search-wrapper candidate-seacrh-mt",
                  { active: true }
                )}
                style={{ minWidth: 90, maxWidth: 100, flex: '0 1 110px' }}
              >
                <input
                  type="text"
                  className="search-input search-placeholder"
                  id="search-input"
                  value={searchText}
                  onInput={(evt) => setSearchText(evt.target.value)}
                  placeholder="Search by Job Title"
                  style={{ width: '100%' }}
                />
                <button
                  className="btn-close"
                  onClick={(evt) => onClearSearch()}
                />
                <button onClick={(evt) => onSearchJob()} className="search-icon">
                  <span />
                </button>

              </div> */}

            </Col>


          </Row>



          <style>{`
        @media (max-width: 1100px) {
          .candidate-toolbar-flex {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
        }
      `}</style>
        </div>

        <Col>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="matched">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Our advanced AI matching system efficiently reviews
                      candidate profiles and job requirements to connect
                      candidates with the best job opportunities. By using this
                      system, we streamline the application process and ensure a
                      fair evaluation for all applicants. However, it's
                      important to note that the AI system may not capture every
                      detail or subtlety of a candidate's profile or job
                      description.
                    </span>
                  </Col>
                </Row>
              </div>
              {loading ? (
                <>
                  <Loader
                    type="line-scale-pulse-out-rapid"
                    className="d-flex justify-content-center"
                  />
                </>
              ) : (
                <>
                  {candidateList?.length > 0 ? (
                    <>
                      <Row xs={1} sm={1} md={2} lg={3} xl={3}>
                        {candidateList.map((data, ind) => {
                          return (
                            <Col
                              key={data.jobapplicationid}
                              className="card-col"
                            >
                              <CandidateCardView
                                data={data}
                                rejectDrpDwnList={rejectDrpDwnList}
                                onActionClick={(e, type) =>
                                  onActionClick(e, type)
                                }
                                showSweetAlert={({ title, type }) =>
                                  showSweetAlert({ title, type })
                                }
                                updateList={() => onUpdateList()}
                                durationOptions={durationOptions}
                                onBuildResume={(candidateId) =>
                                  onBuildResumeClick(candidateId)
                                }
                              ></CandidateCardView>
                            </Col>
                          );
                        })}
                      </Row>
                      {totalRecords > cardPageSize ? (
                        <CardPagination
                          totalPages={totalRecords / cardPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <>
                      {candidateList.length === 0 && !loading ? (
                        <Row
                          style={{ textAlign: "center" }}
                          className="center-middle-align"
                        >
                          <Col>
                            <NoCandidateAvailable
                              message={"NO CANDIDATES AVAILABLE"}
                            ></NoCandidateAvailable>
                          </Col>
                        </Row>
                      ) : (
                        ""
                      )}
                    </>
                  )}
                </>
              )}
            </TabPane>
            <TabPane tabId="liked">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Liked candidates are individuals who have shown interest
                      in a candidate by clicking a button or icon on a matched
                      list. They are saved for later review or comparison and
                      are typically stored in a separate section of the user
                      account, allowing users to easily access them and decide
                      whether to contact them.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId) =>
                            onBuildResumeClick(candidateId)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="maybe">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Candidates are individuals unsure about being invited to
                      apply, often marked with a question or doubt. They may
                      also be saved in a separate section of the user account,
                      allowing users to review and change decisions later. This
                      helps make informed decisions about potential candidates.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId) =>
                            onBuildResumeClick(candidateId)
                          }
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="applied">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Applied candidates are those who have submitted their
                      application for a job through the platform. They are
                      stored in a separate section of the user account, allowing
                      users to track their application status, contact them, or
                      reject them.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId) =>
                            onBuildResumeClick(candidateId)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="scheduled">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Scheduled interview candidates are selected for an
                      interview and have a scheduled date and time. They move to
                      the next stage of the hiring process, where skills are
                      evaluated. These candidates are stored in a separate
                      section of the user account, where users can view their
                      interview details and prepare for the meeting.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId) =>
                            onBuildResumeClick(candidateId)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="offers">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Offer candidates are candidates who have decided to offer
                      a job after interviewing and assessing their
                      qualifications. This means the customer has made a final
                      decision on who to hire and communicated the offer to the
                      candidate, either verbally or in writing. They are
                      typically stored in a separate section of the account,
                      allowing users to track the offer's status, negotiate
                      terms, or withdraw it if needed.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId) =>
                            onBuildResumeClick(candidateId)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="accepted">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Accepted candidates are those who have accepted a job
                      offer, either verbally or in writing, indicating that you
                      have successfully hired them and agreed on their
                      employment terms. They are typically stored in a separate
                      section of the user account, providing information on
                      their start date, contract details, and onboarding tasks.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId) =>
                            onBuildResumeClick(candidateId)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
            <TabPane tabId="rejected">
              <div className="p-3 tab-info">
                <Row>
                  <Col>
                    <img src={infoIcon} alt="" />
                    <span style={{ display: "flex" }}>
                      Declined candidates are those who have been rejected
                      during the hiring process due to non-compliance with
                      requirements, withdrawal of application, or refusal of
                      offer. They are stored in a separate section of the
                      account, where the reason for rejection can be viewed,
                      feedback can be provided, or the candidate may be
                      reconsidered for future opportunities.
                    </span>
                  </Col>
                </Row>
              </div>
              <p>
                {loading ? (
                  <>
                    <Loader
                      type="line-scale-pulse-out-rapid"
                      className="d-flex justify-content-center"
                    />
                  </>
                ) : (
                  <>
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type || activeTab}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                          onActionClick={(e, type) => onActionClick(e, type)}
                          showSweetAlert={({ title, type }) =>
                            showSweetAlert({ title, type })
                          }
                          updateList={() => onUpdateList()}
                          durationOptions={durationOptions}
                          onPrescreenClick={(type, row) =>
                            onPrescreenActionClick(type, row)
                          }
                          onBuildResume={(candidateId) =>
                            onBuildResumeClick(candidateId)
                          }
                          onShowOHModal={(row) => onShowOHModal(row)}
                          showActionInterestColumns={true}
                        />
                        {totalRecords > listPageSize ? (
                          <div className="mt-2">
                            <CardPagination
                              totalPages={totalRecords / listPageSize}
                              pageIndex={pageNo}
                              onCallBack={(evt) => handlePageChange(evt)}
                            ></CardPagination>
                          </div>
                        ) : (
                          <></>
                        )}
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row
                            style={{ textAlign: "center" }}
                            className="center-middle-align"
                          >
                            <Col>
                              {" "}
                              <NoDataFound></NoDataFound>
                            </Col>
                          </Row>
                        ) : (
                          ""
                        )}
                      </>
                    )}
                  </>
                )}
              </p>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
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
        {showProfileModal ? (
          <>
            <BuildCVModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
            />
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {showPSModal ? (
          <>
            <PrescreenModal
              isOpen={showPSModal}
              onClose={() => {
                setShowPSModal(false);
              }}
              data={prescreenQues}
              //sendFormData={(data) => onSendPrescreenData(data)}
              preScreenType={preScreenType}
            ></PrescreenModal>
          </>
        ) : (
          <></>
        )}
      </>
      <>
        {oHModal ? (
          <OfferHistory
            isOpen={oHModal}
            onClose={() => {
              setOHModal(false);
              setCandidateName("");
            }}
            offerHistory={custOfferHistory}
            name={candidateName}
            activeTab={activeTab}
          ></OfferHistory>
        ) : (
          <></>
        )}
      </>
    </>
  );
}
