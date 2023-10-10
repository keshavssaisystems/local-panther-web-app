import React from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import "./underConstruction.scss";
import { Providers } from "@microsoft/mgt-element";
import { Msal2Provider } from "@microsoft/mgt-msal2-provider";
import { Login } from "@microsoft/mgt-react";

export function Calendar({ title }) {
  Providers.globalProvider = new Msal2Provider({
    clientId: "11ea805b-fe5f-4085-b06b-f032023dc069",
    scopes: [
      "calendars.read",
      "user.read",
      "openid",
      "profile",
      "people.read",
      "user.readbasic.all",
    ],
  });
  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading={title} icon={titlelogo} />
        </Col>
        <Col md="12">
          <Card>
            <CardBody>
              <Login />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
