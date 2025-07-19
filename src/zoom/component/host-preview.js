import React, { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authActions, scheduleInterviewActions } from "_store";
import SweetAlert from "react-bootstrap-sweetalert";

import { database } from "../../firebase/index";
import { customerCandidateListsActions } from "_store";
import "firebase/database";
import { getTimezoneDateTime } from "_helpers/helper";
import moment from "moment-timezone";
import { Button, Row, Badge, Card } from "reactstrap";
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
    let users = usersData.map((item) => ({ ...item }));
    users[index].status = true;
    setUsersData(users);
  };

  const handleDeny = (index) => {
    let users = usersData.map((item) => ({ ...item }));
    users[index].status = false;
    setUsersData(users);
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
      localStorage.getItem("userroleid") === "2"
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
            status: false,
            isMeetingStarted: false,
          };
        });
        cand = [...cand, ...users];
      }
      if (res?.payload?.data?.scheduledInterviewList[0]?.candidateemail) {
        let user = {
          name: res?.payload?.data?.scheduledInterviewList[0]?.candidatename,
          email: res?.payload?.data?.scheduledInterviewList[0]?.candidateemail,
          status: false,
          isMeetingStarted: false,
        };

        cand.push(user);
        setUsersData(cand);
        let userFBData = [...fbUsersData];
        if (userFBData.length > 0) {
          const updatedArray = cand.map((obj) => {
            const update = userFBData.find((u) => u.id === obj.id);
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
          {fbUsersData?.length > 0 &&
          fbUsersData[index]?.status === false &&
          fbUsersData[index]?.isMeetingStarted === false ? (
            <div className="waiting-pill">
              <img src={half} height={14} width={14} alt="waiting img"></img>{" "}
              Waiting
            </div>
          ) : fbUsersData?.length > 0 &&
            fbUsersData[index]?.status === true &&
            fbUsersData[index]?.isMeetingStarted === false ? (
            <div className="joined-pill">
              <img src={check} height={14} width={14} alt="joined img"></img>{" "}
              Joined
            </div>
          ) : (
            <div className="deny-pill">
              <img src={cross} height={14} width={14} alt="deny img"></img>{" "}
              Denied
            </div>
          )}
        </span>
      ),
    },

    {
      name: <span className="table-title">Action</span>,
      cell: (row, index) => (
        <span className="table-cell">
          {row.isMeetingStarted === false && row.status === false ? (
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
          ) : row.status === true && row.isMeetingStarted === false ? (
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
          )}
        </span>
      ),
    },
  ];

  return (
    <div className="host-prev-cont">
      <Card style={{ padding: "32px", borderRadius: "8px" }}>
        <div className="div-title">Interview Call Management</div>
        <div className="cand-details">
          Candidate Interview:{" "}
          {interViewData?.jobtitle ? interViewData?.jobtitle + " | " : ""}
          {interViewData?.scheduledate
            ? getTimezoneDateTime(interViewData.scheduledate, "MMM DD, YYYY") +
              " | "
            : ""}
          {interViewData.starttime
            ? getTimezoneDateTime(
                moment(
                  interViewData.scheduledate.slice(0, 11) +
                    interViewData.starttime
                ).format("YYYY-MM-DD HH:mm:ss"),
                "h:mm A"
              )
            : ""}
        </div>
        <div className="atten-div">Attendies List</div>
        <hr style={{ margin: "0px" }} />
        <div>
          <>
            {usersData.length > 0 ? (
              <DataTable
                columns={columns}
                data={usersData}
                fixedHeader
                className="admin-list-view"
              />
            ) : (
              <Row className="center-align ">
                <NoDataFound></NoDataFound>
              </Row>
            )}
          </>
        </div>
        <div className="btn-div">
          <Button
            className="ps-4  pe-4 pt-2 pb-2"
            style={{ width: "25%" }}
            color="primary"
            onClick={() => hostStartMeeting()}
          >
            <img
              className="me-2"
              src={camera}
              height={20}
              width={12}
              alt="camera img"
            ></img>{" "}
            Start/Join Meeting
          </Button>
        </div>
      </Card>
    </div>
  );
};
