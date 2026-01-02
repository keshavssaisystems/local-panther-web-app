import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions, scheduleInterviewActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";

// import { database } from "../../firebase/index";
import { customerCandidateListsActions } from "_store";
import "firebase/database";
import { getTimezoneDateTime } from "_helpers/helper";
import moment from "moment-timezone";
import {
  Button,
  Row,
  Badge,
  Card,
  List,
  ListInlineItem,
  Col,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { NoDataFound } from "_components/common/nodatafound";
import half from "../../assets/utils/images/zoom/hourglass-half.svg";
import check from "../../assets/utils/images/zoom/check-circle-fill.svg";
import cross from "../../assets/utils/images/zoom/x-circle-fill.svg";
import camera from "../../assets/utils/images/zoom/camera-video-fill.svg";
import "./host-preview.css";

export const HostPreview = ({
  interviewId,
  fbUsersData,
  setUsersData,
  urlParams,
  usersData,
  hostStartMeeting,
  database,
}) => {
  const [interViewData, setInterViewData] = useState([]);

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const dispatch = useDispatch();

  const navigate = useNavigate();

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails(interviewId);
    }
  }, [interviewId]);

  const handleAllow = (index) => {
    let users = fbUsersData.map((item) => {
      return { ...item };
    });
    users[index].isAllowed = true;
    users[index].isDenied = false;
    database.ref("users/" + urlParams).update(users);
  };

  const handleDeny = (index) => {
    let users = fbUsersData.map((item) => {
      return { ...item };
    });
    users[index].isAllowed = false;
    users[index].isDenied = true;
    // users[index].isJoined = false;
    database.ref("users/" + urlParams).update(users);
  };

  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
    routeToHome();
  };
  const routeToHome = () => {
    if (
      localStorage.getItem("userroleid") &&
      (localStorage.getItem("userroleid") === "2" || localStorage.getItem("userroleid") === "4")
    ) {
      navigate("/scheduled-interview");
    } else {
      navigate("/");
    }
  };

  const getInterviewDetails = async (interviewId) => {
    let res = await dispatch(
      customerCandidateListsActions.getScheduleIVList(interviewId)
    );
    if (res.payload.statusCode === 200) {
      setInterViewData(res?.payload?.data?.scheduledInterviewList[0]);
      let cand = [];
      if (
        res?.payload?.data?.scheduledInterviewList[0]?.intervieweremailids &&
        res?.payload?.data?.scheduledInterviewList[0]?.intervieweremailids !==
        ""
      ) {
        let ids =
          res?.payload?.data?.scheduledInterviewList[0]?.intervieweremailids.split(
            ","
          );
        let users = ids.map((d) => {
          return {
            name: d,
            email: d,
            isAllowed: false,
            isJoined: false,
            isDenied: false,
          };
        });
        cand = [...cand, ...users];
      }
      if (res?.payload?.data?.scheduledInterviewList[0]?.candidateemail) {
        let user = {
          name: res?.payload?.data?.scheduledInterviewList[0]?.candidatename,
          email: res?.payload?.data?.scheduledInterviewList[0]?.candidateemail,
          isAllowed: false,
          isJoined: false,
          isDenied: false,
        };

        cand.push(user);
        setUsersData(cand);
        let userFBData =
          localStorage.getItem("zoomusersList" + urlParams) &&
            localStorage.getItem("zoomusersList" + urlParams).length > 5
            ? JSON.parse(localStorage.getItem("zoomusersList" + urlParams))
            : [...fbUsersData];
        if (
          localStorage.getItem("zoomusersList" + urlParams) &&
          localStorage.getItem("zoomusersList" + urlParams).length > 5
        ) {
          localStorage.removeItem("zoomusersList" + urlParams);
        }
        if (userFBData.length > 0) {
          const updatedArray = cand.map((obj) => {
            const update = userFBData.find((u) => u.email === obj.email);
            return update ? { ...obj, ...update } : obj;
          });
          database.ref("users/" + urlParams).update(updatedArray);
        } else {
          database.ref("users/" + urlParams).set(cand);
        }
      }
    } else {
      showSweetAlert({
        title: res?.error?.message
          ? res?.error?.message
          : "Something went wrong, please try later!!",
        type: "error",
      });
    }
  };

  const columns = [
    {
      name: <span>Name</span>,
      cell: (row) => (
        <span className="table-cell" title={row.name}>
          {row.name}
        </span>
      ),
    },
    {
      name: <span>Email</span>,
      cell: (row) => (
        <span className="table-cell" title={row.email}>
          {row.email}
        </span>
      ),
    },
    {
      name: <span className="table-title">Status</span>,
      cell: (row, index) => (
        <span className="table-cell" title={row.status}>
          {/* {fbUsersData?.length > 0 &&
          fbUsersData[index]?.status === false &&
          fbUsersData[index]?.isMeetingStarted === false &&
          row.isDenied === false ? (
            <div className="waiting-pill">
              <img src={half} height={14} width={14} alt="waiting img"></img>{" "}
              Waiting
            </div>
          ) : fbUsersData?.length > 0 &&
            fbUsersData[index]?.status === true &&
            fbUsersData[index]?.isMeetingStarted === false &&
            row.isDenied === false ? (
            <div className="joined-pill">
              <img src={check} height={14} width={14} alt="joined img"></img>{" "}
              Joined
            </div>
          ) : (
            <div className="deny-pill">
              <img src={cross} height={14} width={14} alt="deny img"></img>{" "}
              Denied
            </div>
          )} */}
        </span>
      ),
    },

    {
      name: <span className="table-title">Action</span>,
      cell: (row, index) => <span className="table-cell"></span>,
    },
  ];

  return (
    <div className="host-prev-cont">
      <div className="atten-div">In Meeting</div>

      <div>
        <>
          {fbUsersData.length > 0 ? (
            <List className="att-list">
              {fbUsersData.map((row, index) => (
                <>
                  {row.isJoined && (
                    <ListInlineItem
                      className="att-list-li"
                      style={{ width: "100%" }}
                    >
                      <Row>
                        <Col md={5}>
                          <div className="part-name">{row.name}</div>
                          <div className="part-mail">{row.email}</div>
                        </Col>
                        <Col style={{ position: "relative" }} md={3}>
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            <>
                              {row.isJoined &&
                                !row.isAllowed &&
                                !row.isDenied && (
                                  <div className="waiting-pill">
                                    <img
                                      src={half}
                                      height={14}
                                      width={14}
                                      alt="waiting img"
                                    ></img>{" "}
                                    Waiting
                                  </div>
                                )}
                            </>
                            <>
                              {row.isJoined && row.isAllowed && (
                                <div className="joined-pill">
                                  <img
                                    src={check}
                                    height={14}
                                    width={14}
                                    alt="joined img"
                                  ></img>{" "}
                                  Joined
                                </div>
                              )}
                            </>
                            <>
                              {row.isJoined && row.isDenied && (
                                <div className="deny-pill">
                                  <img
                                    src={cross}
                                    height={14}
                                    width={14}
                                    alt="deny img"
                                  ></img>{" "}
                                  Denied
                                </div>
                              )}
                            </>
                          </div>
                        </Col>
                        <Col md={4} style={{ position: "relative" }}>
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              width: "max-content",
                            }}
                          >
                            {row.isDenied === false &&
                              row.isAllowed === false ? (
                              <>
                                <Badge
                                  onClick={() => {
                                    handleDeny(index);
                                  }}
                                  className="badge"
                                  color="danger"
                                >
                                  Deny
                                </Badge>
                                <Badge
                                  onClick={() => {
                                    handleAllow(index);
                                  }}
                                  className="badge"
                                  color="success"
                                >
                                  Allow
                                </Badge>
                              </>
                            ) : row.isAllowed === true &&
                              row.isDenied === false ? (
                              <>
                                <Badge
                                  onClick={() => {
                                    handleDeny(index);
                                  }}
                                  className="badge"
                                  color="danger"
                                >
                                  Deny
                                </Badge>
                              </>
                            ) : (
                              <>
                                {row.isDenied === false && (
                                  <Badge
                                    onClick={() => {
                                      handleAllow(index);
                                    }}
                                    className="badge"
                                    color="success"
                                  >
                                    Allow
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </ListInlineItem>
                  )}
                </>
              ))}
            </List>
          ) : (
            <Row className="center-align ">
              <NoDataFound></NoDataFound>
            </Row>
          )}
        </>
      </div>
      <div className="atten-div mt-4">Not Joined</div>
      <div>
        <>
          {fbUsersData.length > 0 ? (
            <List className="att-list">
              {fbUsersData.map((row, index) => (
                <>
                  {!row.isJoined && (
                    <ListInlineItem
                      className="att-list-li"
                      style={{ width: "100%" }}
                    >
                      <Row>
                        <Col md={5}>
                          <div className="part-name">{row.name}</div>
                          <div className="part-mail">{row.email}</div>
                        </Col>
                        <Col style={{ position: "relative" }} md={3}></Col>
                        <Col md={4} style={{ position: "relative" }}></Col>
                      </Row>
                    </ListInlineItem>
                  )}
                </>
              ))}
            </List>
          ) : (
            <Row className="center-align ">
              <NoDataFound></NoDataFound>
            </Row>
          )}
        </>
      </div>
    </div>
  );
};
