import React, { useState } from "react";

import { TabContent, TabPane, ButtonGroup, Button, Row, Col } from "reactstrap";
import classnames from "classnames";
import { CandidateCardView } from "_components/list/cardview";
import { IoIosGrid, IoIosListBox } from "react-icons/io";
import { CandidateListView } from "_components/list/listview";
import { candidateList } from "./data";
import { CardPagination } from "_components/common/cardpagination";
export const CustomerCandidateLists = (props) => {
  const [activeTab, setActiveTab] = useState(props.type);
  const [view, setView] = useState("grid");
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 9;
  const handlePageChange = (page) => {
    setPageNo(page);
  };
  const toggle = (activetab) => {
    setActiveTab(activetab);
  };

  const toggleView = () => {
    view === "grid" ? setView("list") : setView("grid");
  };
  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={8} lg={8} xl={8} className="mb-3">
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
              color="primary"
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
          {view === "grid" ? (
            <IoIosGrid fontSize="32px" onClick={() => toggleView()} />
          ) : (
            <IoIosListBox fontSize="32px" onClick={() => toggleView()} />
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
                <CandidateListView data={candidateList} />
              </p>
            </TabPane>
            <TabPane tabId="maybe">
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
            <TabPane tabId="applied">
              <p>
                <CandidateListView data={candidateList} />
              </p>
            </TabPane>
            <TabPane tabId="scheduled">
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
            <TabPane tabId="accepted">
              <p>
                <CandidateListView data={candidateList} />
              </p>
            </TabPane>
            <TabPane tabId="rejected">
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
          </TabContent>
        </Col>
      </Row>
    </>
  );
};
