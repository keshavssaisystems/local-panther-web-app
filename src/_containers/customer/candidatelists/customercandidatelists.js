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
import { CandidateListView } from "_components/list/listview";
import { CardPagination } from "_components/common/cardpagination";
import { useParams, useNavigate } from "react-router-dom";
import { cardPageSize, listPageSize } from "_helpers/constants";
import { useSelector, useDispatch } from "react-redux";
import { candidateListsActions } from "./candidatelists.slice";
import Loader from "react-loaders";
import "./customercandidatelist.scss";

export const CustomerCandidateLists = (props) => {
  const [activeTab, setActiveTab] = useState(props.type);

  const [pageNo, setPageNo] = useState(1);
  const { id } = useParams();
  const [selectedJobId, setSelectedJobId] = useState(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.candidateLists.jobLists);

  const rejectDrpDwnList = useSelector(
    (state) => state.candidateLists.rejectDrpDwnList
  );
  const candidateList = useSelector(
    (state) => state.candidateLists.candidateList
  );

  const totalRecords = useSelector(
    (state) => state.candidateLists.totalRecords
  );
  const loading = useSelector((state) => state.candidateLists.loading);

  useEffect(() => {
    dispatch(candidateListsActions.getDrpDwnJobLists());
    dispatch(candidateListsActions.getRejectDropDown());
  }, []);

  useEffect(() => {
    onGetPageList(pageNo, props.type, id);
  }, [props.type, id]);

  const onGetPageList = (pageNo, type, id) => {
    let candObj = {
      pageNumber: pageNo,
      pageSize: type === "matched" ? cardPageSize : listPageSize,
      isCustomerLike: type === "liked",
      isCustomerMaybe: type === "maybe",
      isCustomerAccepted: type === "accepted",
      isCustomerReject: type === "rejected",
      isCustomerScheduled: type === "scheduled",
      isCandidateApply: type === "applied",
      jobId: id,
    };
    dispatch(candidateListsActions.getCandidateLists(candObj));
  };

  const handlePageChange = (page) => {
    setPageNo(page);
    onGetPageList(page, props.type, id);
  };
  const toggle = (activetab) => {
    setPageNo(1);
    setActiveTab(activetab);
    navigate(`/customer-candidate-${activetab}/${id}`);
  };

  const onSelectClick = (evt) => {
    setSelectedJobId(evt.target.value);
    navigate(`/customer-candidate-${activeTab}/${parseInt(evt.target.value)}`);
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
          <ButtonGroup size="lg">
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
              {jobList.map((data) => {
                return (
                  <option value={data.jobid} key={data.jobid}>
                    {data.jobtitle + "," + data?.locationaddress}
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
                    <></>
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
                        <CandidateListView
                          type={props.type}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                        />
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <></>
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
                        <CandidateListView
                          type={props.type}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                        />
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <></>
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
                        <CandidateListView
                          type={props.type}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                        />
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <></>
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
                        <CandidateListView
                          type={props.type}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                        />
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <></>
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
                        <CandidateListView
                          type={props.type}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                        />
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <></>
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
                        <CandidateListView
                          type={props.type}
                          data={candidateList}
                          user="customer"
                          rejectDrpDwnList={rejectDrpDwnList}
                        />
                        <CardPagination
                          totalPages={totalRecords / listPageSize}
                          pageIndex={pageNo}
                          onCallBack={(evt) => handlePageChange(evt)}
                        ></CardPagination>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </p>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
      {/* ) : (
        <Loader
          type="line-scale-pulse-out-rapid"
          className="d-flex justify-content-center"
        />
      )} */}
    </>
  );
};
