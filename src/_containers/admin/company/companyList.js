import React, { useState, useEffect } from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import PageTitle from "_components/common/pagetitle";
import {
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
  ButtonGroup,
} from "reactstrap";
import "_containers/admin/common/adminListing.scss";
import cx from "classnames";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { dropdownActions, addCustomerActions } from "_store";
import { getCompanies, updateAllowDataSharing, updateCandidateNameVisibility, setCompanyActive } from "_containers/admin/_redux/adminListing.slice";
import SweetAlert from "react-bootstrap-sweetalert";
import { AddEditCompany } from "../common/addEditCompany";
import { useNavigate } from "react-router-dom";
import customerIcons from "assets/utils/images/customer";
import { FaEye } from "react-icons/fa";
import { analytics } from "../../../firebase/index";
import { PaymentModal } from "_components/modal/paymentmodal";
import { SNACKBAR_TYPES, SNACKBAR_POSITION, GENERAL_MESSAGES } from "_constants/snackbarMessages";
import { showSnackbar } from "_store/snackbar.slice";
import { settingsActions } from "_store"
import info from "assets/utils/images/info-circle-fill.svg";
import ConfirmModal from "_components/modal/confirmModal";
export const CompanyList = ({ isCompanyAdmin = false }) => {
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isView, setIsViewMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [currentRoleId, setCurrentRoleId] = useState(parseInt(JSON.parse(localStorage.getItem("userDetails"))?.UserroleId) || 0);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const [openBDModal, setOpenBDModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pendingToggle, setPendingToggle] = useState(null);
  const [showCandidateNameModal, setShowCandidateNameModal] = useState(false);
  const [pendingCandidateNameToggle, setPendingCandidateNameToggle] = useState(null);
  const [pendingCompanyToggle, setPendingCompanyToggle] = useState(null);
  const [showCompanyConfirmModal, setShowCompanyConfirmModal] = useState(false);

  let companyList = localStorage.getItem("companyList") ? JSON.parse(localStorage.getItem("companyList")) : [];
  const [isStaffingFirm, setIsStaffingFirm] = useState(companyList?.some(company => company.isstaffingfirm === true));

  const userDetails = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails"))
    : {};

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dropdownActions.getEmployeeCountThunk());
    getCompanyList(pageSize, pageNo);
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Admin company list",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [searchData, setSearchText] = useState("");

  const [status, setStatus] = useState("All");
  const { data } = useSelector((state) => state?.adminListing ?? {});
  const totalRecords = useSelector((state) => state.adminListing?.totalRecords);
  let title = "Companies";
  let icon = companyLogo;
  let columns = [
    {
      name: "Company",
      id: "name",
      selector: (row) => row.companyname,
      sortable: true,
      width: "20%",
    },
    {
      name: "Subsidiary count",

      cell: (row) => (
        <span
          style={{
            cursor: row.subsidiarycount !== 0 ? "pointer" : "not-allowed",
          }}
          className={row.subsidiarycount !== 0 ? "editrow" : ""}
          onClick={() => navigateTo(row)}
        >
          {row.subsidiarycount}
        </span>
      ),
      sortable: true,
      width: "10%"
    },

    {
      name: "Addresss",
      cell: (row) => (
        <span        >
          {getAddressString(row)}
        </span>
      ),
      sortable: true,
      width: "20%",
    },
    // {
    //   name: "City",
    //   id: "cityname",
    //   selector: (row) => row.cityname,
    //   sortable: true,
    // },

    // {
    //   name: "State",
    //   id: "cityname",
    //   selector: (row) => row.statename,
    //   sortable: true,
    // },
    // {
    //   name: "Address",
    //   id: "address",
    //   selector: (row) => row.address,
    //   sortable: true,
    // },
    // {
    //   name: "Zipcode",
    //   id: "phonenumber",
    //   selector: (row) => row.zipcode,
    //   sortable: true,
    // },
    {
      name: "Industry",
      selector: (row) => row.industry,
      sortable: true,
    },
    ...(currentRoleId === 1
      ? [
        {
          name: "Staffing Firm",
          selector: row => row.isstaffingfirm,
          cell: (row) => (
            <span
              style={{
                cursor: row.isstaffingfirm === true ? "pointer" : "not-allowed",
              }}
              onClick={() => navigateTo(row)}
            >
              {row.isstaffingfirm ? "Yes" : "No"}
            </span>
          ),
          sortable: true,
        },
      ]
      : []),
    ...(currentRoleId === 1 || isStaffingFirm
      ? [
        {
          name: "Allow Data Sharing with OpenWorX Ecosystem",
          cell: (row) => (
            <div
              style={{
                width: "100%",                // take full cell width
                display: "flex",
                justifyContent: "center",     // horizontal center
                alignItems: "center",         // vertical center
              }}
            >
              <div
                title="Allow Data Sharing with OpenWorX Ecosystem"
                className="switch has-switch"
                data-on-label="ON"
                data-off-label="OFF"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  openConfirmModal(
                    !row.isexcludecandidatesfromecosystem,
                    row
                  )
                }
              >
                {row.isstaffingfirm && (
                  <div
                    className={cx("switch-animate", {
                      "switch-on": !row.isexcludecandidatesfromecosystem,
                      "switch-off": row.isexcludecandidatesfromecosystem,
                    })}
                    size="sm"
                  >
                    <input type="checkbox" />
                    <span className="switch-left">ON</span>
                    <label>&nbsp;</label>
                    <span className="switch-right">OFF</span>
                  </div>
                )}
              </div>
            </div>
          ),
          sortable: true,
        }
      ] : []),
      
    {
      name: "Candidate Name Visibility",
      cell: (row) => (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            title="Candidate Name Visibility"
            className="switch has-switch"
            data-on-label="ON"
            data-off-label="OFF"
            style={{ cursor: "pointer" }}
            onClick={() =>
              openCandidateNameConfirmModal(
                !row.iscandidatenamevisible,
                row
              )
            }
          >
            <div
              className={cx("switch-animate", {
                "switch-on": row.iscandidatenamevisible,
                "switch-off": !row.iscandidatenamevisible,
              })}
              size="sm"
            >
              <input type="checkbox" />
              <span className="switch-left">ON</span>
              <label>&nbsp;</label>
              <span className="switch-right">OFF</span>
            </div>
          </div>
        </div>
      ),
      sortable: false,
      width: "12%",
    },
    {
      name: "Active",
      cell: (row) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            className="switch has-switch"
            onClick={() => {
              setPendingCompanyToggle({
                value: !row.isactive,
                row,
              });
              setShowCompanyConfirmModal(true);
            }}
          >
            <div
              className={cx("switch-animate", {
                "switch-on": row.isactive,
                "switch-off": !row.isactive,
              })}
            >
              <input type="checkbox" />
              <span className="switch-left">ON</span>
              <label>&nbsp;</label>
              <span className="switch-right">OFF</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <ButtonGroup>
            <Button
              size="sm"
              title="Edit company"
              className="btn-icon"
              color="warning"
              onClick={(e) => {
                setEditData(row);
                setOpenModal(true);
                setIsAddMode(false);
                setIsEdit(true);
                setIsViewMode(false);
              }}
            >
              <img src={customerIcons?.list_edit} alt="list approve"></img>
            </Button>

            <Button
              size="sm"
              title="View company"
              className="btn-icon"
              color="info"
              onClick={(e) => {
                setEditData(row);
                setOpenModal(true);
                setIsAddMode(false);
                setIsEdit(false);
                setIsViewMode(true);
              }}
            >
              <FaEye style={{ fontSize: "18px" }} />
            </Button>
            {isCompanyAdmin && (
              <>
                {row.billingdetailstatus ? (
                  <Button color="link" onClick={() => onViewBilling(row)} title="View Payment Details">
                    <span style={{ textDecoration: "underline" }}>Payment Details</span>
                  </Button>
                ) : (
                  <Button color="link" onClick={() => onAddBilling(row)} title="Add Payment Details">
                    <span style={{ textDecoration: "underline" }}>Payment Details</span>
                  </Button>
                )}
              </>
            )}
          </ButtonGroup>
        </div>
      ),
      sortable: false,
      width: "15%",
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        color: "#2F479B",
        fontFamily: "Capitana",
        fontSize: "15px",
        fontWeight: "400",
      },
    },
  };

  const addModal = () => {
    let obj = {
      companyid: 0,
      firstname: "",
      lastname: "",
      address: "",
      zipcode: "",
      phone: "",
      email: "",
      cityid: 0,
      stateid: 0,
      cityname: "",
      statename: "",
    };
    setIsAddMode(true);
    setIsViewMode(false);
    setIsEdit(false);
    setEditData(obj);
    setOpenModal(true);
  };

  const navigateTo = (row) => {
    if (row.subsidiarycount !== 0) {
      navigate(`/masters/subsidiary/${row.companyid}`);
    }
  };

  const closeModal = (event) => {
    setOpenModal(false);
    if (isCompanyAdmin) {
      dispatch(
        getCompanies({
          pageSize: pageSize,
          pageNumber: pageNo,
          companyId: Number(userDetails?.CompanyId),
        })
      );
    } else {
      dispatch(
        getCompanies({
          pageSize: pageSize,
          pageNumber: pageNo,
        })
      );
    }
  };

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
    getCompanyList(pageSize, pageNo);
    setSelectedCustomer([]);
  };

  const getCompanyList = async function (pageSize, pageNo) {
    setLoading(true);
    let urlParams = {
      pageSize: pageSize,
      pageNumber: pageNo,
      companyId: "",
    };
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }

    if (status !== "All") {
      urlParams.isActive = status;
    }

    if (isCompanyAdmin) {
      urlParams.companyId = Number(userDetails?.CompanyId);
    }

    await dispatch(getCompanies(urlParams));
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
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }
    if (isCompanyAdmin) {
      urlParams.companyId = Number(userDetails?.CompanyId);
    }
    await dispatch(getCompanies(urlParams));
    setLoading(false);
  };

  const onClearSearch = async function () {
    setSearchText("");

    let urlParams = {
      pageSize: pageSize,
      pageNumber: pageNo,
      companyId: "",
    };

    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (isCompanyAdmin) {
      urlParams.companyId = Number(userDetails?.CompanyId);
    }
    setLoading(true);
    await dispatch(getCompanies(urlParams));
    setLoading(false);
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
  };
  const postData = async (data) => {
    let res = await dispatch(addCustomerActions.addCustomer(data));
    setOpenModal(false);
    if (res.payload) {
      if (res.payload.statusCode === 201) {
        setSuccess(true);
        showSweetAlert({
          title: res.payload.data.statusMessage,
          type: "success",
        });
      } else {
        setError(true);
        showSweetAlert({
          title: res.payload.message,
          type: "error",
        });
      }
    } else {
      setError(true);
      showSweetAlert({
        title: res.error.message,
        type: "error",
      });
    }
  };
  const putData = async (data) => {
    let customerId = data.customerid;
    let res = await dispatch(
      addCustomerActions.updateCustomer({
        customerId: customerId,
        payload: data,
      })
    );
    setEditData({});
    setOpenModal(false);
    setIsEdit(false);
    if (res.payload) {
      dispatch(
        addCustomerActions.getCompaniesList({
          isActive: true,
          pageSize: pageSize,
          pageNumber: pageNo,
          companyId: 0,
        })
      );
      if (res.payload.statusCode === 201) {
        setSuccess(true);
        showSweetAlert({
          title: res.payload.data.statusMessage,
          type: "success",
        });
      } else {
        setError(true);
        showSweetAlert({
          title: res.payload.message,
          type: "error",
        });
      }
    } else {
      setError(true);
      showSweetAlert({
        title: res.error.message,
        type: "error",
      });
    }
  };

  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    getCompanyList(pagesize, pageNo);
  };
  const handlePageChange = async (page) => {
    setPageNo(page);
    getCompanyList(pageSize, page);
  };


  const openConfirmModal = async (value, row) => {
    setShowModal(true);
    setPendingToggle({ value, row });
  }

  const handleConfirm = async () => {
    if (!pendingToggle) return;

    const { value, row } = pendingToggle;
    await handleToggleExcludeCandidateFromEcosystems(value, row);
    setShowModal(false);
  };


  const openCandidateNameConfirmModal = (value, row) => {
    setShowCandidateNameModal(true);
    setPendingCandidateNameToggle({ value, row });
  };

  const handleCandidateNameConfirm = async () => {
    if (!pendingCandidateNameToggle) return;
    const { value, row } = pendingCandidateNameToggle;
    await handleToggleCandidateNameVisibility(value, row);
    setShowCandidateNameModal(false);
  };

  const handleToggleCandidateNameVisibility = async function (value, row) {
    let id = row.companyid;
    let data = {
      iscandidatenamevisible: value ? 1 : 0,
    };
    let response = await dispatch(updateCandidateNameVisibility({ id, payload: data }));
    if (response.payload) {
      dispatch(showSnackbar({
        message: response.payload.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    } else {
      dispatch(showSnackbar({
        message: response.error.message,
        type: SNACKBAR_TYPES.ERROR,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
    }
    getCompanyList(pageSize, pageNo);
  };

  const handleToggleExcludeCandidateFromEcosystems = async function (value, row) {
    let id = row.companyid;
    let data = {
      "isexcludecandidatesfromecosystem": value
    };

    let response = await dispatch(updateAllowDataSharing({ id, payload: data }));
    if (response.payload) {
      dispatch(showSnackbar({
        message: response.payload.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      getCompanyList(pageSize, pageNo);
    } else {
      dispatch(showSnackbar({
        message: response.error.message,
        type: SNACKBAR_TYPES.SUCCESS,
        position: SNACKBAR_POSITION.TOP_CENTER,
        autoClose: true,
        autoCloseDelay: 3000,
        maxWidth: 500,
      }));
      getCompanyList(pageSize, pageNo);
    }
  };

  const handleCompanyConfirm = async () => {
    if (!pendingCompanyToggle) return;

    const { value, row } = pendingCompanyToggle;
    const companyId = row.companyid;
    const dto = { isactive: value, reason: "" };

    let response = await dispatch(setCompanyActive({ companyId, dto }));
    setShowCompanyConfirmModal(false);
    setPendingCompanyToggle(null);

    if (response && response.payload) {
      dispatch(
        showSnackbar({
          message: response.payload.message,
          type: SNACKBAR_TYPES.SUCCESS,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        })
      );
      getCompanyList(pageSize, pageNo);
    } else {
      dispatch(
        showSnackbar({
          message: response?.error?.message || "Something went wrong",
          type: SNACKBAR_TYPES.ERROR,
          position: SNACKBAR_POSITION.TOP_CENTER,
          autoClose: true,
          autoCloseDelay: 3000,
          maxWidth: 500,
        })
      );
      getCompanyList(pageSize, pageNo);
    }
  };


  const getAddressString = (row) => {
    let address = "";
    if (row.address) {
      address += row.address;
    }
    if (row.cityname) {
      address += address ? `, ${row.cityname}` : row.cityname;
    }
    if (row.statename) {
      address += address ? `, ${row.statename}` : row.statename;
    }
    if (row.zipcode) {
      address += address ? `, ${row.zipcode}` : row.zipcode;
    }
    return address;
  };

  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading={title} icon={icon} />
        </Col>
        <Col md="12">
          <Card className="mb-3">
            <CardBody>
              <Row>
                <Col md={12}>
                  <Row className="mb-3">
                    <Col xxl={3} xl={3} md={12} lg={4} sm={12} xs={12}>
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
                    <Col xxl={9} xl={9} md={12} lg={8} sm={12} xs={12}>
                      {!isCompanyAdmin && (
                        <>
                          <Button
                            style={{ background: "#2f479b" }}
                            color={"primary"}
                            className="input-group-text float-end mt-1"
                            type="submit"
                            onClick={(e) => addModal()}
                          >
                            Add Company
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
                                onInput={(evt) =>
                                  setSearchText(evt.target.value)
                                }
                                placeholder="Search.."
                              />
                              <button
                                className="btn-close"
                                onClick={(evt) => onClearSearch()}
                              />
                              <button
                                onClick={(evt) =>
                                  getCompanyList(pageSize, pageNo)
                                }
                                className="search-icon"
                              >
                                <span />
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </Col>
                  </Row>
                </Col>
              </Row>
              <DataTable
                data={data}
                columns={columns}
                pagination
                fixedHeader
                customStyles={customStyles}
                progressPending={loading}
                responsive
                paginationServer
                paginationTotalRows={totalRecords}
                onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
                onChangePage={(e) => handlePageChange(e)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>

      {openModal ? (
        <AddEditCompany
          openModal={openModal}
          onClose={() => closeModal(false)}
          postData={(e) => postData(e)}
          isAddMode={isAddMode}
          isViewMode={isView}
          data={editData}
          putData={(e) => putData(e)}
          isCompanyAdmin={isCompanyAdmin}
        />
      ) : (
        <></>
      )}

      {success && (
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
      )}

      {error && (
        <>
          {" "}
          <SweetAlert
            title={showAlert.title}
            show={showAlert.show}
            type={showAlert.type}
            onConfirm={() => setError(false)}
          />
          {showAlert.description}
        </>
      )}
      {openBDModal && isCompanyAdmin ? (
        <PaymentModal
          isOpen={openBDModal}
          selectedCustomer={selectedCustomer}
          onClose={() => onCloseBDModal()}
          isAdmin={true}
          userId={userDetails?.InternalUserId}
          companyid={selectedCustomer?.companyid}
          isCompanyBilling={true}
        />
      ) : (
        <></>
      )}
      <ConfirmModal
        isOpen={showModal}
        title="Confirm data sharing update"
        icon={info}
        message={
          <>
            <p>This will update your data sharing settings.</p>
            <ul>
              <li>Existing jobs and candidates will not be affected</li>
              <li>The change applies only to newly posted jobs</li>
            </ul>
            <p>Do you want to continue?</p>
          </>
        }
        confirmText="Update Setting"
        cancelText="Cancel"
        onConfirm={handleConfirm}
        onCancel={() => setShowModal(false)}
        zIndex={1050}
      />
      <ConfirmModal
        isOpen={showCandidateNameModal}
        title="Confirm Candidate Name Visibility"
        icon={info}
        message={
          <>
            <p>This will update the candidate name visibility setting for this company.</p>
            <p>Do you want to continue?</p>
          </>
        }
        confirmText="Update Setting"
        cancelText="Cancel"
        onConfirm={() => {
          handleCandidateNameConfirm();
          setPendingCandidateNameToggle(null);
        }}
        onCancel={() => {
          setShowCandidateNameModal(false);
          setPendingCandidateNameToggle(null);
        }}
        zIndex={1050}
      />

      <ConfirmModal
        isOpen={showCompanyConfirmModal}
        title={pendingCompanyToggle?.value ? "Enable Company" : "Disable Company"}
        icon={info}
        message={
            <>
              {pendingCompanyToggle?.value ? (
                <p>This will enable the company and allow its users to login.</p>
              ) : (
                <p>This will disable the company and prevent all its users from logging in.</p>
              )}
              <p>Do you want to continue?</p>
            </>
          }
        confirmText={pendingCompanyToggle?.value ? "Enable" : "Disable"}
        cancelText="Cancel"
        onConfirm={() => {
          handleCompanyConfirm();
        }}
        onCancel={() => {
          setShowCompanyConfirmModal(false);
          setPendingCompanyToggle(null);
        }}
        zIndex={1050}
      />

    </>
  );
};
