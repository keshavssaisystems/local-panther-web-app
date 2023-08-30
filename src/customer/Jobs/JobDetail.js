import React from "react";
import { Card, Row, Col } from "reactstrap";
import "./jobList.css";
import {HeadingAndDetailWithDiv, HeadingAndDetail, ButtonWithCount, HeadingWithPill, DetailsHeader} from "./JobDetailComponents";

export function JobDetail() {
    return (
        <>
            <Card className="card-shadow-primary profile-responsive card-border mb-3">
                <DetailsHeader heading={'Software Developer (.Net) -immediate jointers (0-5 yrs)'} subHeading={"Saisystems Technology Pvt. Ltd."} image={"https://saisystems.com/wp-content/uploads/2021/01/SAI-LOGO_COLOR_INT_horiz-trans.png"}/>
                <HeadingAndDetailWithDiv heading={"Job Description"} detail={"We are looking for a React Native developer interested in building performant mobile apps on both the iOS and Android platforms. You will be responsible for architecting and building these applications, as well as coordinating with the teams responsible for other layers of the product infrastructure."} />
                <div className="p-3">
                    <Row>
                        <Col>
                            <HeadingAndDetail heading={"Job Role"} detail={"Software Developer (.Net)"} />
                        </Col>
                        <Col>
                            <HeadingWithPill  heading={"Skills"} pillData={['C','C++','Java','.Net']}/>
                        </Col>
                        <Col>
                            <HeadingAndDetail heading={"Department"} detail={"Pune, Maharashtra, 400104"} />
                        </Col>
                        <Col>
                            <HeadingAndDetail heading={"Year of Experience"} detail={"0-5 Years"} />
                        </Col>
                    </Row>
                </div>
                <div className="p-3">
                    <Row>
                        <Col>
                            <HeadingAndDetail heading={"Company Name"} detail={"Saisystems International Pvt. Ltd."} />
                        </Col>
                        <Col>
                            <HeadingAndDetail heading={"No of Positions"} detail={"-"} />
                        </Col>
                        <Col>
                            <HeadingAndDetail heading={"Location"} detail={"Pune"} />
                        </Col>
                        <Col>
                            <HeadingAndDetail heading={"Job Posted On"} detail={"-"} />
                        </Col>
                    </Row>
                </div>
                <HeadingAndDetailWithDiv heading={"Job Responsibilities"} detail={"Build pixel-perfect, buttery smooth UIs across both mobile platforms. Leverage native APIs for deep integrations with both platforms. Diagnose and fix bugs and performance bottlenecks for performance that feels native."} />
                <div className="p-3 d-flex justify-content-center">
                    <ButtonWithCount buttonName={"Applied Candidate"} color={"primary"} count={6} />
                    <ButtonWithCount buttonName={"Recommended Candidate"} color={"primary"} count={6} />
                    <ButtonWithCount buttonName={"Liked Candidate"} color={"primary"} count={6} />
                    <ButtonWithCount buttonName={"Accepted Candidate"} color={"success"} count={6} />
                    <ButtonWithCount buttonName={"Rejected Candidate"} color={"danger"} count={6} />
                </div>
            </Card>
        </>
    );
}