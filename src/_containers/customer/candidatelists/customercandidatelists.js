import React, { useState, useEffect } from "react";

import {
  TabContent,
  TabPane,
  ButtonGroup,
  Button,
  Row,
  Col,
  Input,
} from "reactstrap";
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
import { getProfileActions, dropdownActions } from "_store";
import infoIcon from "assets/utils/images/info-circle-fill.svg";
import { PrescreenModal } from "_components/modal/prescreenmodal";

export const CustomerCandidateLists = (props) => {
  const { id } = useParams();
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

  useEffect(() => {
    dispatch(customerCandidateListsActions.getDrpDwnJobLists());
    dispatch(customerCandidateListsActions.getRejectDropDown());
    dispatch(customerCandidateListsActions.getDurationOptions());
    dispatch(dropdownActions.getJobTypeThunk2());
    dispatch(dropdownActions.getWorkScheduleThunk2());
    dispatch(dropdownActions.getShiftThunk2());
    if (window?.location?.pathname?.includes("candidate-list")) {
      onGetPageList(pageNo, props.type || activeTab, "");
    }
  }, []);

  useEffect(() => {
    onGetPageList(pageNo, props.type || activeTab, id);
  }, [props.type, id]);

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

  const onGetPageList = (pageNo, type, id) => {
    let candObj = {
      pageNumber: pageNo,
      pageSize: type === "matched" ? cardPageSize : listPageSize,
      customerRecommendedJobStatusId: returnStatusId(type),
      jobId: id || "",
    };

    dispatch(customerCandidateListsActions.getCandidateLists(candObj));
  };

  const handlePageChange = (page) => {
    setPageNo(page);
    onGetPageList(page, props.type || activeTab, id);
  };
  const toggle = (activetab) => {
    if (id) {
      setPageNo(1);
      setActiveTab(activetab);
      navigate(`/customer-candidate-${activetab}/${id}`);
    } else {
      setPageNo(1);
      setActiveTab(activetab);
      onGetPageList(pageNo, activetab, "");
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
  let successMessage = "Candidate status updated successfully!!!";
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

  return (
    <>
      <Row className="customercandidatelist">
        <Col
          xs={12}
          sm={12}
          md={12}
          lg={8}
          xl={8}
          className="mb-3 tab-selection-text"
        >
          <ButtonGroup size="md" className="cust-btn-tabs">
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
              Scheduled
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
              Rejected
            </Button>
          </ButtonGroup>
        </Col>
        <Col xs={12} sm={12} md={12} lg={4} xl={4} className="mb-3 right-align">
          {jobList?.length > 0 ? (
            <Input
              value={selectedJobId}
              onChange={(evt) => onSelectClick(evt)}
              type="select"
              id="customerJobList"
              name="customerJobList"
            >
              <option selected value="">
                All jobs
              </option>
              {jobList.map((data) => {
                return (
                  <option value={data.jobid} key={data.jobid}>
                    {data?.jobtitle && data?.cityname && data?.statename
                      ? data.jobtitle +
                        " ," +
                        data?.cityname +
                        " ," +
                        data?.statename
                      : data.jobtitle}
                  </option>
                );
              })}
            </Input>
          ) : (
            <></>
          )}
        </Col>

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
                      Rejected candidates are those who have been rejected
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
    </>
  );
};
