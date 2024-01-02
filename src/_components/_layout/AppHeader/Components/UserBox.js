import React, { useEffect, useState, Fragment } from "react";

import PerfectScrollbar from "react-perfect-scrollbar";

import {
  DropdownToggle,
  DropdownMenu,
  Nav,
  Col,
  Row,
  Button,
  NavItem,
  NavLink,
  UncontrolledButtonDropdown,
  Modal,
  Card,
  CardBody,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";

import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import city3 from "../../../../assets/utils/images/dropdown-header/city3.jpg";
import avatar1 from "../../../../assets/utils/images/avatars/1.jpg";
import "react-toastify/dist/ReactToastify.css";
import errorIcon from "../../../../assets/utils/images/error_icon.png";
import { authActions } from "_store";
import { ChangePassword } from "../../../common/changePassword";
import { SuccessPopUp } from "_components/common/successPopUp";
import { settingsActions } from "_store";
import cx from "classnames";
import Switch from "react-switch";
import { RejectReasonModal } from "_components/modal/rejectReasonPopup";
import SweetAlert from "react-bootstrap-sweetalert";

export function UserBox() {
  const authUser = useSelector((x) => x?.auth?.token);
  const [userDetail, setUserDetail] = useState({});
  const [deactivateConfirm, setDeactivateConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isToggleOn, setIsToggleOn] = useState(
    localStorage.getItem("pushnotification")
      ? JSON.parse(localStorage.getItem("pushnotification"))
      : false
  );
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [rejectReasonModal, setRejectReasonModal] = useState(false);
  const personalInfo_temp = localStorage.getItem("profileImage");
  const [profileImg, setProfileImg] = useState("");
  const dispatch = useDispatch();
  const logout = () => {
    let userLoginInfoId = localStorage.getItem("userLoginInfoId");
    if (userLoginInfoId) {
      dispatch(authActions.logoutThunk(userLoginInfoId));
    } else {
      dispatch(authActions.logout());
    }
  };
  useEffect(() => {
    const detail = JSON.parse(localStorage.getItem("userDetails")) || {};
    setUserDetail({ ...detail });
  }, []);
  const [changePwd, setChangePwd] = useState(false);

  useEffect(() => {
    setProfileImg(personalInfo_temp);
  }, [personalInfo_temp]);
  // only show nav when logged in
  if (!authUser) return null;

  const deactivate = async function (reason) {
    if (reason === "") {
      return;
    }
    let id = JSON.parse(localStorage.getItem("userDetails"))?.UserId;
    let data = {
      userId: id,
      deactivateduserlogid: 0,
      deactivationdate: new Date().toISOString(),
      isactive: false,
      deactivationreason: reason,
    };

    let response = await dispatch(settingsActions.deactivateUser({ id, data }));
    if (response.payload) {
      setDeactivateConfirm(false);
      setRejectReasonModal(false);
      showSweetAlert({
        title: `${response.payload.message}`,
        type: "success",
      });
    } else {
      setError(true);
    }
  };
  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };
  const close = function () {
    setChangePwd(false);
    setSuccess(false);
  };

  const closeChangePassword = function () {
    setChangePwd(false);
    setSuccess(false);
    logout();
  };

  const closeModal = function () {
    setRejectReasonModal(false);
    setSuccess(false);
    setChangePwd(false);
  };

  const toggleNotification = async function (value) {
    setIsToggleOn(value);
    let id = JSON.parse(localStorage.getItem("userDetails"))?.UserId;
    let data = {
      userId: id,
      pushnotification: value,
    };

    let response = await dispatch(settingsActions.notifications({ id, data }));
    if (response.payload) {
      setSuccess(true);
      localStorage.setItem("pushnotification", value);
    } else {
      setError(true);
    }
  };

  const rejectReason = () => {
    setRejectReasonModal(true);
  };

  return (
    <>
      <Fragment>
        <div className="header-btn-lg pe-0">
          <div className="widget-content p-0">
            <div className="widget-content-wrapper">
              <div className="widget-content-left">
                <UncontrolledButtonDropdown>
                  <DropdownToggle color="link" className="p-0">
                    <img
                      width={42}
                      height={42}
                      className="rounded-circle"
                      src={profileImg ? profileImg : avatar1}
                      alt=""
                    />
                    <FontAwesomeIcon
                      className="ms-2 opacity-8"
                      icon={faAngleDown}
                    />
                  </DropdownToggle>
                  <DropdownMenu end className="rm-pointers dropdown-menu-lg">
                    <div className="dropdown-menu-header">
                      <div className="dropdown-menu-header-inner bg-info">
                        <div
                          className="menu-header-image opacity-2"
                          style={{
                            backgroundImage: "url(" + city3 + ")",
                          }}
                        />
                        <div className="menu-header-content text-start">
                          <div className="widget-content p-0">
                            <div className="widget-content-wrapper">
                              <div className="widget-content-left me-3">
                                <img
                                  width={42}
                                  height={42}
                                  className="rounded-circle"
                                  src={profileImg ? profileImg : avatar1}
                                  alt=""
                                />
                              </div>
                              <div className="widget-content-left">
                                <div className="widget-heading">
                                  {userDetail?.FirstName} {userDetail?.LastName}
                                </div>
                                <div className="widget-subheading opacity-8">
                                  {userDetail?.role}
                                </div>
                              </div>
                              <div className="widget-content-right me-2">
                                <Button
                                  onClick={() => logout()}
                                  className="btn-pill btn-shadow btn-shine"
                                  color="focus"
                                >
                                  Logout
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="scroll-area-md"
                      style={{
                        height:
                          Number(localStorage.getItem("userroleid")) === 1
                            ? "100px"
                            : "150px",
                      }}
                    >
                      <PerfectScrollbar>
                        <Nav vertical>
                          <NavItem className="mb-1">
                            <NavLink
                              href="javascript:void(0)"
                              onClick={() => setChangePwd(true)}
                            >
                              Change password
                            </NavLink>
                          </NavItem>
                          {Number(localStorage.getItem("userroleid")) !== 1 && (
                            <NavItem>
                              <NavLink
                                href="javascript:void(0)"
                                onClick={() => [setDeactivateConfirm(true)]}
                              >
                                Deactivate account
                              </NavLink>
                            </NavItem>
                          )}
                          <NavItem>
                            <NavLink href="javascript:void(0)">
                              Notifications
                              <Switch
                                onChange={() => toggleNotification(!isToggleOn)}
                                checked={isToggleOn}
                                className="m-1 ms-auto ml-auto"
                                id="normal-switch"
                              />
                            </NavLink>
                          </NavItem>
                        </Nav>
                      </PerfectScrollbar>
                    </div>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
              <div className="widget-content-left  ms-3 header-user-info">
                <div className="widget-heading">
                  {" "}
                  {userDetail.FirstName} {userDetail.LastName}
                </div>
                <div className="widget-subheading">{userDetail.role}</div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>

      <Modal size="md" isOpen={deactivateConfirm}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center rejected-success-text">
              Are you sure
            </div>
            <div className="mb-3 d-flex justify-content-center rejected-success-text">
              {" "}
              want to Deactivate account!!
            </div>
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    style={{ background: "#2f479b", borderColor: "#2f479b" }}
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => rejectReason()}
                  >
                    YES
                  </Button>
                  <Button
                    style={{ background: "#2f2e2e", borderColor: "#2f2e2e" }}
                    className="success-close-btn"
                    onClick={(evt) => setDeactivateConfirm(false)}
                  >
                    NO
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>

      <Modal size="md" isOpen={success}>
        <SuccessPopUp
          icon={"success"}
          message={"Push notification settings updated"}
          callBack={() => close()}
        />
      </Modal>

      <Modal size="md" isOpen={error}>
        <SuccessPopUp
          icon={"error"}
          message={"Something went wrong"}
          callBack={() => setError(false)}
        />
      </Modal>

      <Modal className="personal-information" size="md" isOpen={changePwd}>
        <ModalHeader toggle={() => closeModal()} charCode="Y">
          <strong className="card-title-text">Change Password</strong>
        </ModalHeader>
        <ModalBody>
          <ChangePassword
            callBack={() => closeChangePassword()}
            callBackError={() => closeModal()}
          />
        </ModalBody>
      </Modal>
      {rejectReasonModal && (
        <RejectReasonModal
          isRMOpen={rejectReasonModal}
          callBack={(e) => deactivate(e)}
          callBackError={() => closeModal()}
          title={"deactivating account"}
        />
      )}
      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => logout()}
        />
        {showAlert.description}
      </>
    </>
  );
}
