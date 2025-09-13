import React, { useState, useEffect } from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import { users } from "_containers/admin/common/adminColumnsListing";
import PageTitle from "_components/common/pagetitle";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
} from "reactstrap";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { USPhoneNumber } from "_helpers/helper";
import "_containers/admin/common/adminListing.scss";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getUsers,
  getRoles,
  deleteUser,
  deleteRole,
  resetPassword,
} from "_containers/admin/_redux/adminListing.slice";
import errorIcon from "assets/utils/images/error_icon.png";
import successIcon from "assets/utils/images/success_icon.svg";
import { AddEditUser } from "./addEditUser";
import SweetAlert from "react-bootstrap-sweetalert";
import { settingsActions } from "_store";
import cx from "classnames";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { analytics } from "../../../firebase/index";
import { getCustomerDropdownList } from "_store";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
import { PaymentModal } from "_components/modal/paymentmodal";
import {
  getCustomers,
  verifyCustomer,
  updateIsVisibleToOthersById,
  updateIsCompanyAdminByUserId
} from "_containers/admin/_redux/adminListing.slice";

export default function AdminListing({ entity, isCompanyAdmin = false }) {
  const dispatch = useDispatch();

  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(0);
  let title,
    icon,
    columns = [];
  const [customerId, setCustomerId] = useState("");

  const { customerList = [] } = useSelector(
    (state) => state.adminReportReducer
  );
  useEffect(() => {
    loadData();
    dispatch(getRoles());
    dispatch(getCustomerDropdownList());
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Admin listing",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);
  const { data } = useSelector((state) => state?.adminListing ?? {});
  const rolesList = useSelector((state) => state.adminListing.rolesList);
  const totalRecords = useSelector((state) => state.adminListing?.totalRecords);
  const [error, setError] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editingData, setEditingData] = useState(null);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const [searchData, setSearchText] = useState("");

  const [roleid, setRoleId] = useState(0);
  const [status, setStatus] = useState("All");

  title = users.title;
  icon = companyLogo;
  columns = [
    {
      name: "User role",
      id: "rolename",
      selector: (row) => row.rolename,
      sortable: true,
    },
    {
      name: "User name",
      id: "userName",
      selector: (row) => row.firstname + " " + row.lastname,
      sortable: true,
    },
    // {
    //   name: "Last name",
    //   selector: (row) => row.lastname,
    //   sortable: true,
    // },

    {
      name: "Email",
      id: "email",
      cell: (row) => (
        <>
          {row.email}
          {row?.isactive === false && (
            <>
              <BsFillInfoCircleFill
                id={"rr_" + row?.userId}
                color="primary"
                className="ms-2"
              ></BsFillInfoCircleFill>
              <UncontrolledTooltip
                placement="bottom"
                target={"rr_" + row?.userId}
              >
                {row?.deactivationreason !== "" ||
                  row?.deactivationreason !== undefined
                  ? row?.deactivationreason
                  : "-"}
              </UncontrolledTooltip>
            </>
          )}
        </>
      ),
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone number",
      id: "phonenumber",
      selector: (row) =>
        row.phonenumber ? USPhoneNumber(row.phonenumber) : "-",
      sortable: true,
    },

    {
      name: "Company admin",
      id: "admin",
      selector: (row) => (

        <>
          {<>
            <div
              title="Make company admin"
              className="switch has-switch  me-2"
              data-on-label="ON"
              data-off-label="OFF"
              style={{
                verticalAlign: "bottom",
                opacity: row.userId === Number(JSON.parse(localStorage.getItem("userDetails"))?.UserId) ? "0.5" : "1",
                cursor: row.userId !== Number(JSON.parse(localStorage.getItem("userDetails"))?.UserId) ? "pointer" : "not-allowed",
              }}
              onClick={() => row.userId !== Number(JSON.parse(localStorage.getItem("userDetails"))?.UserId) && toggleCompanyAdmin(!row.iscompanyadmin, row)}
            >
              <div
                className={cx("switch-animate", {
                  "switch-on": row.iscompanyadmin,
                  "switch-off": !row.iscompanyadmin,
                })}
                size="sm"
                disabled={row.userId === Number(JSON.parse(localStorage.getItem("userDetails"))?.UserId)}
              >
                <input type="checkbox" />
                <span className="switch-left">ON</span>
                <label>&nbsp;</label>
                <span className="switch-right">OFF</span>
              </div>
            </div></>
          }
        </>
      ),
    },
    {
      name: "Visibility",
      id: "visibility",
      selector: (row) => (
        <>
          {<>
            <div
              title="Active/Inactive visibility"
              className="switch has-switch  me-2"
              data-on-label="ON"
              data-off-label="OFF"
              style={{ verticalAlign: "bottom", cursor: "pointer" }}
              onClick={() => toggleVisibility(!row.isvisibletoothers, row)}
            >
              <div
                className={cx("switch-animate", {
                  "switch-on": row.isvisibletoothers,
                  "switch-off": !row.isvisibletoothers,
                })}
                size="sm"
              >
                <input type="checkbox" />
                <span className="switch-left">ON</span>
                <label>&nbsp;</label>
                <span className="switch-right">OFF</span>
              </div>
            </div></>
          }
        </>
      ),
    },

    {
      name: "Billing",
      id: "billing",
      selector: (row) => (
        <>
          {row.billingdetailstatus ? (
            <Button color="link" onClick={() => onViewBilling(row)}>
              <span style={{ textDecoration: "underline" }}>View</span>
            </Button>
          ) : (
            <Button color="link" onClick={() => onAddBilling(row)}>
              <span style={{ textDecoration: "underline" }}>Add</span>
            </Button>
          )}
        </>
      ),
    },
    {
      name: "Action",
      id: "isactive",
      cell: (row) => (
        <div className="d-block">
          <div
            title="Active/Inactive user"
            className="switch has-switch  me-2"
            data-on-label="ON"
            data-off-label="OFF"
            style={{ verticalAlign: "bottom", cursor: "pointer" }}
            onClick={() => toggleNotification(!row.isactive, row)}
          >
            <div
              className={cx("switch-animate", {
                "switch-on": row.isactive,
                "switch-off": !row.isactive,
              })}
              size="sm"
            >
              <input type="checkbox" />
              <span className="switch-left">ON</span>
              <label>&nbsp;</label>
              <span className="switch-right">OFF</span>
            </div>
          </div>
          {row.userroleid !== 2 && row.userroleid !== 3 && (
            <BsPencil
              title="Edit user"
              style={{
                fontSize: "21px",
                verticalAlign: "top",
                cursor: "pointer",
              }}
              className="edit-icon me-2"
              onClick={(evt) => handleRowClick(row, "edit")}
            />
          )}
          {row.userroleid !== 2 && row.userroleid !== 3 && (
            <BsTrash3
              title="Delete user"
              className="edit-icon me-2"
              style={{
                fontSize: "21px",
                verticalAlign: "top",
                cursor: "pointer",
              }}
              onClick={() => deleteConfirm(row, "user")}
            />
          )}

          <FaEye
            title="View Details"
            style={{
              fontSize: "18px",
              cursor: "pointer",
              verticalAlign: "baseline",
            }}
            className="edit-icon me-2"
            onClick={(evt) => handleRowClick(row, "view")}
          />
          <i
            title="Reset password"
            style={{
              fontSize: "18px",
              verticalAlign: "baseline",
              fontWeight: "600",
              cursor: "pointer",
            }}
            className="pe-7s-refresh-2"
            onClick={() => resetUserPassword(row)}
          >
            {" "}
          </i>
        </div>
      ),
      sortable: false,
      minWidth: "200px",
    }
  ];

  useEffect(() => {
    if (isCompanyAdmin) {
      setRoleId(2);
    }
    loadData();
  }, [entity]);

  const loadData = async () => {
    setLoading(true);
    let urlParams = {
      pageNumber: pageNo,
      pageSize: pageSize,
      companyId: "",
    };
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }
    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (roleid !== 0) {
      urlParams.userRoleId = roleid;
    }
    if (isCompanyAdmin) {
      let userDetails = localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails"))
        : {};

      urlParams.companyId = Number(userDetails.CompanyId);
    }
    await dispatch(getUsers(urlParams));
    setLoading(false);
  };
  const customStyles = {
    headCells: {
      style: {
        color: "#2F479B",
        fontFamily: "Capitana",
        fontSize: "16px",
        fontWeight: "400",
      },
    },
  };

  const handleRowClick = async (row, check) => {
    setSelectedRowData(row);
    if (check === "view") {
      setViewMode(true);
    } else {
      setIsAddMode(false);
      setViewMode(false);
    }

    setOpenModal(true);
  };
  const [check, setCheck] = useState();
  const deleteConfirm = (row, check) => {
    setCheck(check);
    setSelectedRowData(row);
    setIsDelete(true);
  };

  const onAddClick = () => {
    setIsAddMode(true); // Open the modal
    setViewMode(false);
    setOpenModal(true);
  };

  const close = () => {
    setIsAddMode(false);
    setViewMode(false);
    setOpenModal(false);
    setSuccess(false);
    setEditingData(null); // Reset editing data
    setSelectedRowData(null);
  };
  const CloseModal = () => {
    close();
    loadData();
  };

  const toggleNotification = async function (value, row) {
    let id = row.userId;
    let data = {
      userId: id,
      isactive: value,
    };

    let response = await dispatch(settingsActions.deactivateUser({ id, data }));
    if (response.payload) {
      // showSweetAlert({
      //   title: `${response.payload.message}`,
      //   type: "success",
      // });
      dispatch(showSnackbar({
        message: response.payload.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      CloseModal();

    } else {
      // showSweetAlert({
      //   title: `${response.error.message}`,
      //   type: "error",
      // });

      dispatch(showSnackbar({
        message: response.error.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      CloseModal();
    }
  };

  const deleteUserData = async function () {
    let response;
    if (check === "user") {
      let id = selectedRowData.userId;
      response = await dispatch(deleteUser(id));
    } else if (check === "role") {
      let id = selectedRowData.userroleid;
      response = await dispatch(deleteRole(id));
    }
    if (response.payload) {
      setIsDelete(false);
      // showSweetAlert({
      //   title: response.payload.message,
      //   type: "success",
      // });
      dispatch(showSnackbar({
        message: response.payload.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      CloseModal();

    } else {
      // showSweetAlert({
      //   title: response.error.message,
      //   type: "error",
      // });
      dispatch(showSnackbar({
        message: response.error.message,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      CloseModal();
    }
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
    CloseModal();
  };

  const onClearSearch = async function () {
    setLoading(true);
    setSearchText("");

    let urlParams = {
      pageNumber: pageNo,
      pageSize: pageSize,
      companyId: "",
    };

    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (roleid !== 0) {
      urlParams.userRoleId = roleid;
    }
    if (isCompanyAdmin) {
      let userDetails = localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails"))
        : {};

      urlParams.companyId = Number(userDetails.CompanyId);
    }
    await dispatch(getUsers(urlParams));
    setLoading(false);
  };

  const getUsersList = async function () {
    setLoading(true);
    let urlParams = {
      pageNumber: pageNo,
      pageSize: pageSize,
      companyId: "",
    };
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }

    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (roleid !== 0) {
      urlParams.userRoleId = roleid;
    }
    if (isCompanyAdmin) {
      let userDetails = localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails"))
        : {};

      urlParams.companyId = Number(userDetails.CompanyId);
    }
    if (customerId && customerId !== "") {
      urlParams.companyId = customerId;
    }
    await dispatch(getUsers(urlParams));
    setLoading(false);
  };

  const onSelectRole = async (roleId) => {
    setLoading(true);
    setRoleId(parseInt(roleId));
    let urlParams = {
      userRoleId: roleId,
      pageNumber: 0,
      pageSize: pageSize,
      companyId: "",
    };
    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }
    if (isCompanyAdmin) {
      let userDetails = localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails"))
        : {};

      urlParams.companyId = Number(userDetails.CompanyId);
    }
    if (customerId && customerId !== "") {
      urlParams.companyId = customerId;
    }
    await dispatch(getUsers(urlParams));
    setLoading(false);
  };

  const onStatusSelect = async (check) => {
    setLoading(true);
    let urlParams = {
      pageSize: pageSize,
      pageNumber: pageNo,
      companyId: "",
    };
    if (check === "0") {
      setStatus("All");
    }
    if (check === "1") {
      urlParams.isActive = true;
      setStatus(true);
    }
    if (check === "2") {
      urlParams.isActive = false;
      setStatus(false);
    }
    if (roleid !== 0) {
      urlParams.userRoleId = roleid;
    }
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }
    if (isCompanyAdmin) {
      let userDetails = localStorage.getItem("userDetails")
        ? JSON.parse(localStorage.getItem("userDetails"))
        : {};

      urlParams.companyId = Number(userDetails.CompanyId);
    }
    if (customerId && customerId !== "") {
      urlParams.companyId = customerId;
    }
    await dispatch(getUsers(urlParams));
    setLoading(false);
  };

  const resetUserPassword = (row) => {
    let payload = {
      userId: row.userId,
      emailId: row.email,
      loggedInUserId: parseInt(
        JSON.parse(localStorage.getItem("userDetails"))?.UserId
      ),
    };
    let response = dispatch(resetPassword(payload));
    if (response?.error) {
      // showSweetAlert({
      //   title: response?.error?.message,
      //   type: "error",
      // });
      dispatch(showSnackbar({
        message: response?.error?.message,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    } else {
      // showSweetAlert({
      //   title: "Password has been sent to registered email ID",
      //   type: "success",
      // });
      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      CloseModal();

    }
  };

  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    getUserData(pagesize, pageNo);
  };

  const handlePageChange = async (page) => {
    setPageNo(page - 1);
    getUserData(pageSize, page - 1);
  };

  const getUserData = async (pageSize, pageNo) => {
    setLoading(true);

    let urlParams = {
      pageSize: pageSize,
      pageNumber: pageNo,
    };

    if (status !== "All") {
      urlParams.isActive = status;
    }

    if (roleid !== 0) {
      urlParams.userRoleId = roleid;
    }
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }
    await dispatch(getUsers(urlParams));

    setLoading(false);
  };

  const onCompanyChange = async (companyId) => {
    setLoading(true);
    let urlParams = {
      pageNumber: pageNo,
      pageSize: pageSize,
      companyId: "",
    };
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }

    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (roleid !== 0) {
      urlParams.userRoleId = roleid;
    }

    if (companyId) {
      urlParams.companyId = companyId;
    }
    await dispatch(getUsers(urlParams));
    setLoading(false);
  };

  const [openBDModal, setOpenBDModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const onAddBilling = (row) => {
    setSelectedCustomer(row);
    setOpenBDModal(true);
  };

  const onViewBilling = (row) => {
    setSelectedCustomer(row);
    setOpenBDModal(true);
  };

  const onCloseBDModal = () => {
    setOpenBDModal(false);
    // getCustomerDetails(pageSize, pageNo);
    setSelectedCustomer([]);
  };


  const toggleVisibility = async function (value, row) {
    let response = await dispatch(updateIsVisibleToOthersById(row.customerid));
    if (response?.payload) {
      dispatch(showSnackbar({
        message: response?.payload?.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

      getUsersList();
    } else {
      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  }

  const toggleCompanyAdmin = async function (value, row) {
    let response = await dispatch(updateIsCompanyAdminByUserId(row.userId));
    if (response?.payload) {
      dispatch(showSnackbar({
        message: response?.payload?.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));

      getUsersList();
    } else {
      dispatch(showSnackbar({
        message: GENERAL_MESSAGES.SOMETHING_WENT_WRONG,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
  }

  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle
            heading={entity === "roles" ? "Menu Mapping" : title}
            icon={icon}
          />
        </Col>

        <Col md="12">
          <Card className="mb-3">
            <CardBody>
              <Row className="mb-3">
                <Col
                  xxl={isCompanyAdmin ? 3 : 2}
                  xl={isCompanyAdmin ? 3 : 2}
                  md={isCompanyAdmin ? 4 : 3}
                  lg={isCompanyAdmin ? 3 : 2}
                  sm={12}
                  xs={12}
                >
                  <FormGroup>
                    <Input
                      type="select"
                      name="companyid"
                      value={roleid}
                      disabled={isCompanyAdmin}
                      onChange={(e) => onSelectRole(e.target.value)}
                    >
                      <option value={0}>All roles</option>
                      {rolesList?.length > 0 &&
                        rolesList?.map((options) => (
                          <option
                            key={options.userroleid}
                            value={options.userroleid}
                          >
                            {" "}
                            {options.rolename}{" "}
                          </option>
                        ))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col
                  xxl={isCompanyAdmin ? 3 : 2}
                  xl={isCompanyAdmin ? 3 : 2}
                  md={isCompanyAdmin ? 4 : 3}
                  lg={isCompanyAdmin ? 3 : 2}
                  sm={12}
                  xs={12}
                >
                  <FormGroup>
                    <Input
                      type="select"
                      name="status"
                      defaultValue="Active"
                      onChange={(e) => onStatusSelect(e.target.value)}
                    >
                      <option value={0}>All status</option>
                      <option value={1}>Active</option>
                      <option value={2}>In-active</option>
                    </Input>
                  </FormGroup>
                </Col>
                {!isCompanyAdmin && (
                  <Col xxl={2} xl={2} md={3} lg={2} sm={12} xs={12}>
                    <FormGroup>
                      <Input
                        type="select"
                        value={customerId}
                        name="customerid"
                        id="customerid"
                        placeholder="Customer ID"
                        onChange={(e) => {
                          onCompanyChange(e.target.value);
                          setCustomerId(e.target.value);
                        }}
                      >
                        <option value={""}>All Company</option>
                        {customerList?.length > 0 ? (
                          customerList.map((data) => (
                            <option value={data.companyid} key={data.companyid}>
                              {data.companyname}
                            </option>
                          ))
                        ) : (
                          <></>
                        )}
                      </Input>
                    </FormGroup>
                  </Col>
                )}
                {/* <Col className="col-1"></Col> */}
                <Col
                  className="right-align"
                  xxl={6}
                  xl={6}
                  md={12}
                  lg={8}
                  sm={12}
                  xs={12}
                >
                  <Button
                    style={{
                      background: "#2f479b",
                      borderColor: "#545cd8",
                    }}
                    className="input-group-text float-end mt-1"
                    onClick={() => onAddClick()}
                  >
                    Add User
                  </Button>
                  <div
                    className={cx(
                      "candidate-search-wrapper search-wrapper candidate-seacrh-mt float-end",
                      {
                        active: true,
                      }
                    )}
                  >
                    <div className="input-holder float-end">
                      <input
                        type="text"
                        className="search-input search-placeholder"
                        id="search-input"
                        value={searchData}
                        onInput={(evt) => setSearchText(evt.target.value)}
                        placeholder="Search.."
                      />
                      <button
                        className="btn-close"
                        onClick={(evt) => onClearSearch()}
                      />
                      <button
                        onClick={(evt) => getUsersList()}
                        className="search-icon"
                      >
                        <span />
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>

              <DataTable
                data={data}
                columns={columns}
                pagination
                fixedHeader
                progressPending={loading}
                customStyles={customStyles}
                paginationServer
                paginationTotalRows={totalRecords}
                onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
                onChangePage={(e) => handlePageChange(e)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      {success ? (
        <div>
          <Modal isOpen={success}>
            <Card>
              <CardBody>
                <div className="d-flex justify-content-center mb-3 mt-4">
                  <img src={successIcon} alt="success-icon" />
                </div>
                <div className="mb-0 d-flex justify-content-center popup-message">
                  {message}
                </div>

                <div className="margin-custom">
                  <Row>
                    <Col className="d-flex justify-content-center mb-4 ">
                      <Button className="" onClick={() => close()}>
                        OK
                      </Button>
                    </Col>
                  </Row>
                </div>
              </CardBody>
            </Card>
          </Modal>
        </div>
      ) : (
        <></>
      )}
      <Modal isOpen={error}>
        <Card>
          <CardBody>
            <div className="d-flex justify-content-center mb-3 mt-4">
              <img src={errorIcon} alt="success-icon" />
            </div>
            <div className="mb-0 d-flex justify-content-center popup-message">
              {message}
            </div>

            <div className="margin-custom">
              <Row>
                <Col className="d-flex justify-content-center mb-4 ">
                  <Button className="" onClick={() => setError(false)}>
                    OK
                  </Button>
                </Col>
              </Row>
            </div>
          </CardBody>
        </Card>
      </Modal>
      {openModal ? (
        <div>
          <Modal isOpen={openModal} size={entity === "roles" ? "md" : "lg"}>
            <ModalHeader toggle={() => close()} charCode="Y">
              <strong className="card-title-text">
                {!isAddMode
                  ? viewMode
                    ? "View User"
                    : `Edit User`
                  : `Add New User`}
              </strong>
            </ModalHeader>
            <ModalBody>
              {entity === "users" && (
                <AddEditUser
                  editingData={editingData}
                  isAddMode={isAddMode}
                  setIsAddMode={setIsAddMode}
                  data={selectedRowData}
                  isView={viewMode}
                  entity={entity}
                  callBack={() => CloseModal()}
                />
              )}
            </ModalBody>
          </Modal>
        </div>
      ) : (
        <></>
      )}

      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>

      <div>
        {isDelete && (
          <SweetAlert
            title={"Are you sure want to delete the user!!"}
            type="warning"
            showConfirm={false}
          >
            <div>
              <Row>
                <Col className="d-flex justify-content-center">
                  <Button
                    style={{ background: "#545CD8" }}
                    className="me-2 accept-modal-btn"
                    onClick={(evt) => deleteUserData()}
                  >
                    YES
                  </Button>
                  <Button
                    className="success-close-btn"
                    onClick={(evt) => setIsDelete(false)}
                  >
                    NO
                  </Button>
                </Col>
              </Row>
            </div>
          </SweetAlert>
        )}
      </div>

      {openBDModal ? (
        <PaymentModal
          isOpen={openBDModal}
          selectedCustomer={selectedCustomer}
          onClose={() => onCloseBDModal()}
          isAdmin={true}
        />
      ) : (
        <></>
      )}
    </>
  );
}
