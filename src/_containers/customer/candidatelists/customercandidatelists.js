import React, { useState } from "react";

import { TabContent, TabPane, ButtonGroup, Button, Row, Col } from "reactstrap";
import classnames from "classnames";
import { CandidateCardView } from "_components/list/cardview";
import { IoIosGrid, IoIosListBox } from "react-icons/io";
import { CandidateListView } from "_components/list/listview";
import { candidateList } from "./data";
export const CustomerCandidateLists = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [view, setView] = useState("grid");

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
                "btn-shadow " + classnames({ active: activeTab === "1" })
              }
              onClick={() => {
                toggle("1");
              }}
            >
              Matched
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "2" })
              }
              onClick={() => {
                toggle("2");
              }}
            >
              Liked
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "3" })
              }
              onClick={() => {
                toggle("3");
              }}
            >
              Maybe
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "4" })
              }
              onClick={() => {
                toggle("4");
              }}
            >
              Applied
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "5" })
              }
              onClick={() => {
                toggle("5");
              }}
            >
              Scheduled
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "6" })
              }
              onClick={() => {
                toggle("6");
              }}
            >
              Accepted
            </Button>
            <Button
              color="primary"
              className={
                "btn-shadow " + classnames({ active: activeTab === "7" })
              }
              onClick={() => {
                toggle("7");
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
            <TabPane tabId="1">
              <Row xs={12} sm={12} md={6} lg={4} xl={4}>
                {candidateList ? (
                  <>
                    {view === "grid" ? (
                      candidateList.map((data, ind) => {
                        return (
                          <Col key={data.jobapplicationid}>
                            <CandidateCardView data={data}></CandidateCardView>
                          </Col>
                        );
                      })
                    ) : (
                      <CandidateListView data={candidateList} />
                    )}
                  </>
                ) : (
                  <></>
                )}
              </Row>
            </TabPane>
            <TabPane tabId="2">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.{" "}
              </p>
            </TabPane>
            <TabPane tabId="3">
              <p>
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.{" "}
              </p>
            </TabPane>
            <TabPane tabId="4">
              <p>
                It was popularised in the 1960s with the release of Letraset
                sheets containing Lorem Ipsum passages, and more recently with
                desktop publishing software like Aldus PageMaker including
                versions of Lorem Ipsum.
              </p>
            </TabPane>
            <TabPane tabId="5">
              <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting
                industry. Lorem Ipsum has been the industry's standard dummy
                text ever since the 1500s, when an unknown printer took a galley
                of type and scrambled it to make a type specimen book. It has
                survived not only five centuries, but also the leap into
                electronic typesetting, remaining essentially unchanged.{" "}
              </p>
            </TabPane>
            <TabPane tabId="6">
              <p>
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.{" "}
              </p>
            </TabPane>
            <TabPane tabId="7">
              <p>
                Lorem Ipsum has been the industry's standard dummy text ever
                since the 1500s, when an unknown printer took a galley of type
                and scrambled it to make a type specimen book. It has survived
                not only five centuries, but also the leap into electronic
                typesetting, remaining essentially unchanged.{" "}
              </p>
            </TabPane>
          </TabContent>
        </Col>
      </Row>
    </>
  );
};
