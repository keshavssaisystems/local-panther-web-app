import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import { UpcomingCard } from "./upcomingCard";
import { UpcomingDetail } from "./upcomingDetail";
export function UpcomingTab() {
  return (
    <>
        <Row>
            <Col lg="4">
                <UpcomingCard />
            </Col>
            <Col lg="8">
                <UpcomingDetail />
            </Col>
        </Row>
    </>
  );
}
