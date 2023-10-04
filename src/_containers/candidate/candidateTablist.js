import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { TabContent, TabPane, ButtonGroup, Button, Row, Col } from "reactstrap";
import classnames from "classnames";
import { JobListing } from "../../_components/job/JobListing";
import { jobListActions, matchedJobActions } from "_store";
import { CandidateListView } from "_components/list/listview";

import { CardPagination } from "_components/common/cardpagination";
import { useSelector, useDispatch } from "react-redux";
import { cardPageSize, listPageSize } from "_helpers/constants";
import { candidateJobListTabActions } from "_store";

import "./candidateTablist.scss";

export const CandidateTablist = (props) => {
    const [activeTab, setActiveTab] = useState("matched");
    const dispatch = useDispatch();
    const [pageNo, setPageNo] = useState(1);
    const [page, setPage] = useState(1);
    const { id } = useParams();
    let JobList = useSelector((state) => state.jobList);

    const candidateListdata = useSelector(
        (state) => state.tabListReducer.candidatejobTabList
    );

    const { matchedJob } = useSelector((state) => state.candidateMatchJob);
    const { totalRecords } = useSelector((state) => state.tabListReducer);
    
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

        let userId = { candidateId: localStorage.getItem("candidateId") };

        dispatch(matchedJobActions.getmatchedJob(userId));
        getJobList(filterObj);
    }, []);
    const getJobList = async function (filterObj) {
        await dispatch(jobListActions.getJobList(filterObj));
    };

    const handlePageChange = (page) => {
        setPageNo(page);
        // onGetPageList(page, props.type, id);
    };

    const toggle = (val) => {

        setActiveTab(val);

        let candidateRecommendedJobStatusId;

        switch (val) {
            case "liked":
                candidateRecommendedJobStatusId = 1;
                break;
            case "maybe":
                candidateRecommendedJobStatusId = 2;
                break;
            case "applied":
                candidateRecommendedJobStatusId = 3;
                break;
            case "accepted":
                candidateRecommendedJobStatusId = 5;
                break;
            case "Interview":
                candidateRecommendedJobStatusId = 4;
                break;
            case "rejected":
                candidateRecommendedJobStatusId = 6;
                break;
            default:

                break;
        }

        let candObj = {
            pageNumber: pageNo,
            pageSize: val === "matched" ? cardPageSize : listPageSize,
            ...(candidateRecommendedJobStatusId && { candidateRecommendedJobStatusId })
        };


        dispatch(candidateJobListTabActions.getRecommendedJobListThunk(candObj));
    };

    useEffect(() => {
        onGetPageList(pageNo, props.type, id);
    }, [props.type, id]);
    const onGetPageList = (pageNo, type, id) => {

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

        dispatch(candidateJobListTabActions.getRecommendedJobListThunk(candObj));
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
                                <p className="mb-1 row-count">{matchedJob.totalRows} jobs</p>

                                {JobList?.jobList?.length ? (
                                    <JobListing
                                        jobData={matchedJob.candidateRecommendedJobDtoList}
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
