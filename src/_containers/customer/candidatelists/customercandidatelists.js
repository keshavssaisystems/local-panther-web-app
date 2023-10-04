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
import { candidateList, totalRecords } from "./data";

export const CustomerCandidateLists = (props) => {
  const [activeTab, setActiveTab] = useState(
    props.type ? props.type : "matched"
  );

  const [pageNo, setPageNo] = useState(1);
  const { id } = useParams();
  const [selectedJobId, setSelectedJobId] = useState(id);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.customerCandidateList.jobLists);

  const rejectDrpDwnList = useSelector(
    (state) => state.customerCandidateList.rejectDrpDwnList
  );
  // const candidateList = useSelector(
  //   (state) => state.customerCandidateList.candidateList
  // );

  // const totalRecords = useSelector(
  //   (state) => state.customerCandidateList.totalRecords
  // );

  const loading = useSelector((state) => state.customerCandidateList.loading);
  const durationOptions = useSelector(
    (state) => state.customerCandidateList.durationOptions
  );
  useEffect(() => {
    dispatch(customerCandidateListsActions.getDrpDwnJobLists());
    dispatch(customerCandidateListsActions.getRejectDropDown());
    dispatch(customerCandidateListsActions.getDurationOptions());
  }, []);

  useEffect(() => {
    onGetPageList(pageNo, props.type, id);
  }, [props.type, id]);

  const returnStatusId = () => {
    if (props.type === "liked") {
      return 1;
    } else if (props.type === "maybe") {
      return 2;
    } else if (props.type === "applied") {
      return 3;
    } else if (props.type === "scheduled") {
      return 4;
    } else if (props.type === "accepted") {
      return 5;
    } else if (props.type === "rejected") {
      return 6;
    } else {
      return "";
    }
  };

  const onGetPageList = (pageNo, type, id) => {
    let candObj = {
      pageNumber: pageNo,
      pageSize: type === "matched" ? cardPageSize : listPageSize,
      // isCustomerLike: type === "liked",
      // isCustomerMaybe: type === "maybe",
      // isCustomerAccepted: type === "accepted",
      // isCustomerReject: type === "rejected",
      // isCustomerScheduled: type === "scheduled",
      // isCandidateApply: type === "applied,
      customerRecommendedJobStatusId: returnStatusId(),
      jobId: id,
    };
    dispatch(customerCandidateListsActions.getCandidateLists(candObj));
  };

  const handlePageChange = (page) => {
    setPageNo(page);
    onGetPageList(page, props.type, id);
  };
  const toggle = (activetab) => {
    if (id) {
      setPageNo(1);
      setActiveTab(activetab);
      navigate(`/customer-candidate-${activetab}/${id}`);
    } else {
      showSweetAlert({
        title: "Please select a job from job list.",
        type: "danger",
      });
    }
  };

  const onSelectClick = (evt) => {
    setSelectedJobId(evt.target.value);
    navigate(`/customer-candidate-${activeTab}/${parseInt(evt.target.value)}`);
  };

  const onActionClick = async (evt, type) => {
    if (type === "like") {
      let res = await dispatch(
        customerCandidateListsActions.putLikedCandidate({ id: evt })
      );
      if (res.payload.statusCode === 204) {
        showSweetAlert({ title: res.payload.message, type: "success" });
        onGetPageList(pageNo, props.type, id);
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
        showSweetAlert({ title: res.payload.message, type: "success" });
        onGetPageList(pageNo, props.type, id);
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
    onGetPageList(pageNo, props.type, id);
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
          <ButtonGroup size="lg" className="cust-btn-tabs">
            <Button
              outline
              color="primary"
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
              outline
              color="primary"
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
              outline
              color="primary"
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
              outline
              color="primary"
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
              outline
              color="primary"
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
              outline
              color="primary"
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
              outline
              color="primary"
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
              <option value={""}></option>
              {jobList.map((data) => {
                return (
                  <option value={data.jobid} key={data.jobid}>
                    {data?.jobtitle && data?.locationaddress
                      ? data.jobtitle + "," + data?.locationaddress
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
                  {candidateList?.length > 0 ? (
                    <>
                      <Row xs={1} sm={1} md={2} lg={3} xl={3}>
                        {candidateList.map((data, ind) => {
                          return (
                            <Col key={data.jobapplicationid}>
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
                              ></CandidateCardView>
                            </Col>
                          );
                        })}
                      </Row>
                      <CardPagination
                        totalPages={totalRecords / cardPageSize}
                        pageIndex={pageNo}
                        onCallBack={(evt) => handlePageChange(evt)}
                      ></CardPagination>
                    </>
                  ) : (
                    <>
                      {candidateList.length === 0 && !loading ? (
                        <Row style={{ textAlign: "center" }}>
                          <Col>No Records found!</Col>
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
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type}
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
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row style={{ textAlign: "center" }}>
                            <Col>No Records found!</Col>
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
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type}
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
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row style={{ textAlign: "center" }}>
                            <Col>No Records found!</Col>
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
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type}
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
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row style={{ textAlign: "center" }}>
                            <Col>No Records found!</Col>
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
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type}
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
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row style={{ textAlign: "center" }}>
                            <Col>No Records found!</Col>
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
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type}
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
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row style={{ textAlign: "center" }}>
                            <Col>No Records found!</Col>
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
                    {candidateList?.length > 0 ? (
                      <>
                        <CustCandidateListView
                          type={props.type}
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
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <>
                        {candidateList.length === 0 && !loading ? (
                          <Row style={{ textAlign: "center" }}>
                            <Col>No Records found!</Col>
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
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>
    </>
  );
};
