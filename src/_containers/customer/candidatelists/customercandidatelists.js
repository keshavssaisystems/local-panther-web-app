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
import { candidateList } from "./data";
import { CardPagination } from "_components/common/cardpagination";
import { useParams, useNavigate } from "react-router-dom";
import { pageSize } from "_helpers/constants";
import { useSelector, useDispatch } from "react-redux";
import { candidateListsActions } from "./candidatelists.slice";
import "./customercandidatelist.scss";

export const CustomerCandidateLists = (props) => {
  const [activeTab, setActiveTab] = useState(props.type);

  const [pageNo, setPageNo] = useState(1);
  const { id } = useParams();
  const [selectedJobId, setSelectedJobId] = useState(id);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const jobList = useSelector((state) => state.candidateLists.jobLists);

  useEffect(() => {
    let filterObj = {
      jobId: "",
      pageNo: 1,
      searchText: "",
      minExperience: "",
      employentModeId: "",
      pageSize: "100",
      skillId: "",
      locationId: "",
    };
    dispatch(candidateListsActions.getCandidateJobLists(filterObj));
  }, []);

  const handlePageChange = (page) => {
    setPageNo(page);
  };
  const toggle = (activetab) => {
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
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "matched" })
              }
              onClick={() => {
                toggle("matched");
              }}
            >
              Matched
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "liked" })
              }
              onClick={() => {
                toggle("liked");
              }}
            >
              Liked
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "maybe" })
              }
              onClick={() => {
                toggle("maybe");
              }}
            >
              Maybe
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "applied" })
              }
              onClick={() => {
                toggle("applied");
              }}
            >
              Applied
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " +
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
              className={
                "btn-shadow " + classnames({ active: activeTab === "accepted" })
              }
              onClick={() => {
                toggle("accepted");
              }}
            >
              Accepted
            </Button>
            <Button
              className={
                "btn-shadow " + classnames({ active: activeTab === "rejected" })
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
                    {data.jobtitle + "," + data?.jobLocationDtos[0]?.location}
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
              <Row xs={1} sm={1} md={2} lg={3} xl={3}>
                {candidateList ? (
                  <>
                    {candidateList
                      .slice((pageNo - 1) * pageSize, pageNo * pageSize)
                      .map((data, ind) => {
                        return (
                          <Col key={data.jobapplicationid}>
                            <CandidateCardView data={data}></CandidateCardView>
                          </Col>
                        );
                      })}
                    <CardPagination
                      totalPages={candidateList.length / pageSize}
                      pageIndex={pageNo}
                      onCallBack={(evt) => handlePageChange(evt)}
                    ></CardPagination>
                  </>
                ) : (
                  <></>
                )}
              </Row>
            </TabPane>
            <TabPane tabId="liked">
              <p>
                <CandidateListView
                  type={props.type}
                  data={candidateList}
                  user="customer"
                />
              </p>
            </TabPane>
            <TabPane tabId="maybe">
              <p>
                <CandidateListView
                  type={props.type}
                  data={candidateList}
                  user="customer"
                />
              </p>
            </TabPane>
            <TabPane tabId="applied">
              <p>
                <CandidateListView
                  type={props.type}
                  data={candidateList}
                  user="customer"
                />
              </p>
            </TabPane>
            <TabPane tabId="scheduled">
              <p>
                <CandidateListView
                  type={props.type}
                  data={candidateList}
                  user="customer"
                />
              </p>
            </TabPane>
            <TabPane tabId="accepted">
              <p>
                <CandidateListView
                  type={props.type}
                  data={candidateList}
                  user="customer"
                />
              </p>
            </TabPane>
            <TabPane tabId="rejected">
              <p>
                <CandidateListView
                  type={props.type}
                  data={candidateList}
                  user="customer"
                />
              </p>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </>
  );
};
