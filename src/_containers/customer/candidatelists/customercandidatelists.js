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

  return (
    <>
      <Row className="customercandidatelist">
        <Col
          xs={12}
          sm={12}
          md={8}
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
              Offers
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
        <Col xs={12} sm={12} md={4} lg={4} xl={4} className="mb-3 right-align">
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
              {loading ? (
                <>
                  <Loader
                    type="line-scale-pulse-out-rapid"
                    className="d-flex justify-content-center"
                  />
                </>
              ) : (
                <>
                  <div className="p-3 tab-info">
                    <div className="row">
                      <div className="col-8">
                        <img src={infoIcon} alt="" />
                        Our advanced AI matching system efficiently reviews
                        candidate profiles and job requirements to connect
                        candidates with the best job opportunities. By using
                        this system, we streamline the application process and
                        ensure a fair evaluation for all applicants. However,
                        it's important to note that the AI system may not
                        capture every detail or subtlety of a candidate's
                        profile or job description.
                      </div>
                    </div>
                  </div>
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
                    <div className="p-3 tab-info">
                      <div className="row">
                        <div className="col-8">
                          <img src={infoIcon} alt="" />
                          Liked jobs are jobs saved for later review or
                          comparison by clicking a button or icon on a job
                          record. They will be stored in a separate section of
                          the profile, allowing users to easily access them and
                          decide whether to apply or not.
                        </div>
                      </div>
                    </div>
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
                        />
                        {totalRecords > listPageSize ? (
                          <CardPagination
                            totalPages={totalRecords / listPageSize}
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
                    <div className="p-3 tab-info">
                      <div className="row">
                        <div className="col-8">
                          <img src={infoIcon} alt="" />A job record may be
                          marked with questions or doubts, indicating uncertain
                          applications due to a lack of information,
                          qualifications, and locations. These jobs may also be
                          saved in a separate section of the user profile,
                          allowing the user to review and change their decisions
                          later.
                        </div>
                      </div>
                    </div>
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
                        />
                        {totalRecords > listPageSize ? (
                          <CardPagination
                            totalPages={totalRecords / listPageSize}
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
                    <div className="p-3 tab-info">
                      <div className="row">
                        <div className="col-8">
                          <img src={infoIcon} alt="" />
                          Applied jobs are those that users submit applications
                          for through the platform. They are marked as applied
                          and are stored in a separate section of the profile.
                          The user can track the status and withdraw the
                          application.
                        </div>
                      </div>
                    </div>
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
                        />
                        {totalRecords > listPageSize ? (
                          <CardPagination
                            totalPages={totalRecords / listPageSize}
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
                    <div className="p-3 tab-info">
                      <div className="row">
                        <div className="col-8">
                          <img src={infoIcon} alt="" />A scheduled interview is
                          an appointment with a customer to discuss
                          qualifications for a job, typically in person, by
                          phone, or video, after the initial screening process.
                        </div>
                      </div>
                    </div>
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
                        />
                        {totalRecords > listPageSize ? (
                          <CardPagination
                            totalPages={totalRecords / listPageSize}
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
                    <div className="p-3 tab-info">
                      <div className="row">
                        <div className="col-8">
                          <img src={infoIcon} alt="" />
                          An offer is a formal proposal from a customer,
                          detailing job details, salary, benefits, start date,
                          and work hours, indicating successful completion of
                          the interview process.
                        </div>
                      </div>
                    </div>
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
                        />
                        {totalRecords > listPageSize ? (
                          <CardPagination
                            totalPages={totalRecords / listPageSize}
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
                    <div className="p-3 tab-info">
                      <div className="row">
                        <div className="col-8">
                          <img src={infoIcon} alt="" />
                          An accepted job is when candidates agree to the terms
                          of the offer and confirm their intention to work for
                          the customer, securing the job and preparing to start
                          working.
                        </div>
                      </div>
                    </div>
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
                        />
                        {totalRecords > listPageSize ? (
                          <CardPagination
                            totalPages={totalRecords / listPageSize}
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
                    <div className="p-3 tab-info">
                      <div className="row">
                        <div className="col-8">
                          <img src={infoIcon} alt="" />A rejected job refers to
                          a decision to decline an offer or a customer
                          rescinding it, indicating that the individual has
                          decided not to work for the customer or has changed
                          their hiring decision.
                        </div>
                      </div>
                    </div>
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
                        />
                        {totalRecords > listPageSize ? (
                          <CardPagination
                            totalPages={totalRecords / listPageSize}
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
    </>
  );
};
