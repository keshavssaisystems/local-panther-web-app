import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { TabContent, TabPane, ButtonGroup, Button, Row, Col } from "reactstrap";
import classnames from "classnames";
import { CandidateCardView } from "_components/list/cardview";
import { JobListing } from "../../_components/job/JobListing";
import { jobListActions } from "_store";
import { CandidateListView } from "_components/list/listview";

import { CardPagination } from "_components/common/cardpagination";
import { pageSize } from "_helpers/constants";
import { useSelector, useDispatch } from "react-redux";
import { cardPageSize, listPageSize } from "_helpers/constants";
import { candidatejobListTabActions } from "./candidateTablist.slice";

import "./candidateTablist.scss";

export const CandidateTablist = (props) => {
    const [activeTab, setActiveTab] = useState("matched");
    const dispatch = useDispatch();
    const [pageNo, setPageNo] = useState(1);
    const [page, setPage] = useState(1);
    const { id } = useParams();
    const onPageChange = (page) => {
        let filterOnPageChange = {
            jobId: "",
            pageNo: page,
        };
        getJobList(filterOnPageChange);
    };
    let filterObj = {
        jobId: "",
        pageNo: 1,
        searchText: "",
        minExperience: "",
        employentModeId: "",
        pageSize: "5",
        skillId: "",
        locationId: "",
    };
    useEffect(() => {
        getJobList(filterObj);
    }, []);
    const getJobList = async function (filterObj) {
        await dispatch(jobListActions.getJobList(filterObj));
    };
    let JobList = useSelector((state) => state.jobList);
    const candidateList = useSelector((state) => state.tabListReducer.jobTabList);
    const candidateListdata = useSelector((state) => state.tabListReducer.candidatejobTabList);

    const totalRecords = useSelector(
        (state) => state.tabListReducer.totalRecords
    );
    const loading = useSelector((state) => state.tabListReducer.loading);
    const handlePageChange = (page) => {
        setPageNo(page);
        onGetPageList(page, props.type, id);
    };
    const toggle = (val) => {
        setActiveTab(val);


        let candObj = {

            pageNumber: pageNo,
            pageSize: val === "matched" ? cardPageSize : listPageSize,
            isCandidateLike: val === "liked" ? true : false,
            isCandidateMaybe: val === "maybe" ? true : false,
            isCandidateAccepted: val === "accepted" ? true : false,
            isCandidateReject: val === "rejected" ? true : false,
            isCandidateApply: val === "applied" ? true : false,
            jobId: "",


        };

        dispatch(candidatejobListTabActions.getcandidateJobList(candObj));



    };
    useEffect(() => {
        onGetPageList(pageNo, props.type, id);
    }, [props.type, id]);
    const onGetPageList = (pageNo, type, id) => {
        console.log("demo");
        let candObj = {
            pageNumber: pageNo,
            pageSize: type === "matched" ? cardPageSize : listPageSize,
            isCandidateLike: type === "liked",
            isCandidateMaybe: type === "maybe",
            isCandidateAccepted: type === "accepted",
            isCandidateReject: type === "rejected",
            isCandidateApply: type === "applied",
            jobId: "",

        };

        dispatch(candidatejobListTabActions.getcandidateJobList(candObj));
    };

    return (
        <>
            <Row className="candidatelistcontainer">
                <Col
                    xs={12}
                    sm={12}
                    md={8}
                    lg={8}
                    xl={8}
                    className="mb-3 candidatelistcontainer-tab-text"
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
                                toggle("Interview");
                            }}
                        >
                            Interview
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
                <Col xs={12} sm={12} md={4} lg={4} xl={12} className="mb-3">
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="matched">
                            <Row>
                                <p className="mb-1 row-count">{JobList.totalRows} jobs</p>
                                {JobList?.jobList?.length ? (
                                    <JobListing
                                        jobData={JobList.jobList}
                                        onPageChange={onPageChange}
                                        pageSize={5}
                                        type="Candidate"
                                        totalRows={JobList.totalRows}
                                        page={page}
                                        setPage={setPage}
                                    />
                                ) : (
                                    <></>
                                )}
                            </Row>
                        </TabPane>
                        <TabPane tabId="liked">
                            <p>
                                <CandidateListView
                                    data={candidateListdata.candidateRecommendedJobDtoList}
                                    user="Candidate"
                                    type="liked"
                                />
                                <CardPagination
                                    totalPages={totalRecords / listPageSize}
                                    pageIndex={pageNo}

                                    onCallBack={(evt) => handlePageChange(evt)}
                                ></CardPagination>
                            </p>
                        </TabPane>
                        <TabPane tabId="maybe">
                            <p>
                                <CandidateListView
                                    data={candidateListdata.candidateRecommendedJobDtoList}
                                    user="Candidate"
                                    type="maybe"
                                />
                                <CardPagination
                                    totalPages={totalRecords / listPageSize}
                                    pageIndex={pageNo}
                                    onCallBack={(evt) => handlePageChange(evt)}
                                ></CardPagination>
                            </p>
                        </TabPane>
                        <TabPane tabId="applied">
                            <p>
                                <CandidateListView
                                    data={candidateListdata.candidateRecommendedJobDtoList}
                                    user="Candidate"
                                    type="applied"
                                />
                                <CardPagination
                                    totalPages={totalRecords / listPageSize}
                                    pageIndex={pageNo}
                                    onCallBack={(evt) => handlePageChange(evt)}
                                ></CardPagination>
                            </p>
                        </TabPane>
                        <TabPane tabId="Interview">
                            <p>
                                <CandidateListView
                                    data={candidateListdata.candidateRecommendedJobDtoList}
                                    user="Candidate"
                                    type="Interview"
                                />
                                <CardPagination
                                    totalPages={totalRecords / listPageSize}
                                    pageIndex={pageNo}
                                    onCallBack={(evt) => handlePageChange(evt)}
                                ></CardPagination>
                            </p>
                        </TabPane>
                        <TabPane tabId="accepted">
                            <p>
                                <CandidateListView
                                    data={candidateListdata.candidateRecommendedJobDtoList}
                                    user="Candidate"
                                    type="accepted"
                                />
                                <CardPagination
                                    totalPages={totalRecords / listPageSize}
                                    pageIndex={pageNo}
                                    onCallBack={(evt) => handlePageChange(evt)}
                                ></CardPagination>
                            </p>
                        </TabPane>
                        <TabPane tabId="rejected">
                            <p>
                                <CandidateListView
                                    data={candidateListdata.candidateRecommendedJobDtoList}
                                    user="Candidate"
                                    type="rejected"
                                />
                                <CardPagination
                                    totalPages={totalRecords / listPageSize}
                                    pageIndex={pageNo}
                                    onCallBack={(evt) => handlePageChange(evt)}
                                ></CardPagination>
                            </p>
                        </TabPane>
                    </TabContent>
                </Col>
            </Row>
        </>
    );
};
