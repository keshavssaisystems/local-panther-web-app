import React, { useState } from "react";
import { Row, Col, Card, CardBody, CardTitle, InputGroup } from "reactstrap";

import InputMask from "react-input-mask";

import { faCalendarAlt, faPhone } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Dashboard() {
    
    const [state, setState] = useState({
        value: "",
        mask: "9999-9999-9999-9999",
      });
    return (
        <>
          <Row>
            <Col md="6">
              <Card className="main-card mb-3">
                <CardBody>
                  <CardTitle>Phone Numbers</CardTitle>
                  <InputGroup className="mb-3">
                    <div className="input-group-addon" addonType="prepend">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faPhone} />
                      </div>
                    </div>
                    <InputMask className="form-control" mask="+4\9 99 999 99" maskChar={null}/>
                  </InputGroup>
                  <InputGroup>
                    <div className="input-group-addon" addonType="prepend">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faPhone} />
                      </div>
                    </div>
                    <InputMask className="form-control" mask="+7 (999) 999-99-99"/>
                  </InputGroup>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="main-card mb-3">
                <CardBody>
                  <CardTitle>Dates</CardTitle>
                  <InputGroup className="mb-3">
                    <div className="input-group-addon" addonType="prepend">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </div>
                    <InputMask className="form-control" mask="99-99-9999" defaultValue="27-10-2018"/>
                  </InputGroup>
                  <InputGroup>
                    <div className="input-group-addon" addonType="prepend">
                      <div className="input-group-text">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                      </div>
                    </div>
                    <InputMask className="form-control" mask="99/99/9999" placeholder="Enter birthdate"/>
                  </InputGroup>
                </CardBody>
              </Card>
            </Col>
            <Col md="6">
              <Card className="main-card mb-3">
                <CardBody>
                  <CardTitle>Credit Card</CardTitle>
                  <InputGroup>
                    <div className="input-group-addon" addonType="prepend">
                      <div className="input-group-text">@</div>
                    </div>
                    <InputMask className="form-control" {...state}/>
                  </InputGroup>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </>
    );
}
