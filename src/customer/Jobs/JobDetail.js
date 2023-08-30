import React, {useState, useEffect} from "react";
import { Card, Row, Col } from "reactstrap";
import "./jobList.css";
import { useDispatch, useSelector } from 'react-redux';
import {HeadingAndDetailWithDiv, HeadingAndDetail, ButtonWithCount, HeadingWithPill, DetailsHeader} from "./JobDetailComponents";
import { jobListActions } from '_store';
import Loader from "react-loaders";
import { useSearchParams } from "react-router-dom";
import moment from "moment/moment";

export function JobDetail() {
    console.log(moment('Thu Oct 25 2018 17:30:03 GMT+0300').fromNow());
    const [searchParams] = useSearchParams();
    let JobId = searchParams.get("JobId")
    const dispatch = useDispatch();
    const [filter, setFilter] = useState({
        "jobId" : JobId,
        "pageNo" : 1
    })
    useEffect(() => {
        getJobList()
    },[]);
    const getJobList = async function (){
        await dispatch(jobListActions.getJobList(filter));
    }
    let jobDetailRaw = useSelector(state => state.jobList);
    let loading = true;
    let jobDetail = {};
    let jobCreatedDate = null;
    let skillArray = [];
    if(jobDetailRaw.jobList.loading === true){
        loading = true;
    }
    if(jobDetailRaw.jobList.length > 0){
        loading = false;
        jobDetail = jobDetailRaw.jobList[0];
        jobCreatedDate = moment(jobDetail.jobcreatedatetime).fromNow()
        jobDetail.jobSkillDtos !== undefined && jobDetail.jobSkillDtos.map((skills)=>(
            skillArray.push(skills.skillname)
        ))
    }
    return (
        <>
            { loading === true && <Loader type="line-scale-pulse-out-rapid" className="d-flex justify-content-center" /> }
            { jobDetailRaw.jobList.length > 0 && loading === false &&
                <Card className="card-shadow-primary profile-responsive card-border mb-3">
                    <DetailsHeader heading={jobDetail.jobtitle} subHeading={jobDetail.jobCompanyDtos.companyname} image={"https://saisystems.com/wp-content/uploads/2021/01/SAI-LOGO_COLOR_INT_horiz-trans.png"}/>
                    <HeadingAndDetailWithDiv heading={"Job Description"} detail={jobDetail.description} />
                    <div className="p-3">
                        <Row>
                            <Col>
                                <HeadingAndDetail heading={"Job Role"} detail={jobDetail.jobrole} />
                            </Col>
                            <Col>
                                <HeadingWithPill  heading={"Skills"} pillData={skillArray}/>
                            </Col>
                            <Col>
                                <HeadingAndDetail heading={"Department"} detail={jobDetail.department} />
                            </Col>
                            <Col>
                                <HeadingAndDetail heading={"Year of Experience"} detail={jobDetail.minexperience + " - " + jobDetail.maxexperience + " Years" } />
                            </Col>
                        </Row>
                    </div>
                    <div className="p-3">
                        <Row>
                            <Col>
                                <HeadingAndDetail heading={"Company Name"} detail={jobDetail.jobCompanyDtos.companyname} />
                            </Col>
                            <Col>
                                <HeadingAndDetail heading={"No of Positions"} detail={jobDetail.noofopenposition} />
                            </Col>
                            <Col>
                                <HeadingAndDetail heading={"Location"} detail={jobDetail.jobLocationDtos[0].location} />
                            </Col>
                            <Col>
                                <HeadingAndDetail heading={"Job Posted On"} detail={"Posted " + jobCreatedDate} />
                            </Col>
                        </Row>
                    </div>
                    <HeadingAndDetailWithDiv heading={"Job Responsibilities"} detail={jobDetail.responsibilities} />
                    <div className="p-3 d-flex justify-content-center">
                        <ButtonWithCount buttonName={"Applied Candidate"} color={"primary"} count={0} action={"/appliedCandidate"} />
                        <ButtonWithCount buttonName={"Recommended Candidate"} color={"primary"} count={0} action={"/recommendedCandidate"} />
                        <ButtonWithCount buttonName={"Liked Candidate"} color={"primary"} count={0} action={"/likedCandidate"} />
                        <ButtonWithCount buttonName={"Accepted Candidate"} color={"success"} count={0} action={"/acceptedCandidate"} />
                        <ButtonWithCount buttonName={"Rejected Candidate"} color={"danger"} count={0} action={"/rejectedCandidate"} />
                    </div>
                </Card>
            }
        </>
    );
}