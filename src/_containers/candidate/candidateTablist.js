import React, { useState } from "react";

import {
    TabContent,
    TabPane,
    ButtonGroup,
    Button,
    Row,
    Col,

} from "reactstrap";
import classnames from "classnames";
import { CandidateCardView } from "_components/list/cardview";
import { CandidateListView } from "_components/list/listview";
import { candidateList } from "./data";
import { CardPagination } from "_components/Common/cardpagination";
import { useNavigate } from "react-router-dom";
import { pageSize } from "_helpers/constants";
import "./candidateTablist.scss"



export const CandidateTablist = (props) => {
    const [activeTab, setActiveTab] = useState("matched");

    const [pageNo, setPageNo] = useState(1);

    const navigate = useNavigate();


    const handlePageChange = (page) => {
        setPageNo(page);
    };
    const toggle = (activetab) => {
        setActiveTab(activetab);
        navigate(`/candidate-${activetab}`);
    };



    return (
        <>
            <Row className="customercandidatelist">
                <Col xs={12} sm={12} md={8} lg={8} xl={12} className="mb-3 customercandidatelist-tab-text">
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
                <Col xs={12} sm={12} md={4} lg={4} xl={12} className="mb-3">





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
                                                        <CandidateCardView data={data} type="Candidate" ></CandidateCardView>
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
                                <CandidateListView data={candidateList} type="Candidate" />
                            </p>
                        </TabPane>
                        <TabPane tabId="maybe">
                            <p>
                                <CandidateListView data={candidateList} type="Candidate" />
                            </p>
                        </TabPane>
                        <TabPane tabId="applied">
                            <p>
                                <CandidateListView data={candidateList} type="Candidate" />
                            </p>
                        </TabPane>
                        <TabPane tabId="scheduled">
                            <p>
                                <CandidateListView data={candidateList} type="Candidate" />
                            </p>
                        </TabPane>
                        <TabPane tabId="accepted">
                            <p>
                                <CandidateListView data={candidateList} type="Candidate" />
                            </p>
                        </TabPane>
                        <TabPane tabId="rejected">
                            <p>
                                <CandidateListView data={candidateList} type="Candidate" />
                            </p>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </>
    );
};
