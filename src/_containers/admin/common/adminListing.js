import React, { useState, useEffect } from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import {
  customers,
  company,
  users,
  roles,
  menuMapping,
} from "_containers/admin/common/adminColumnsListing";
import PageTitle from "_components/common/pagetitle";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Button,
  FormGroup,
  InputGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { BsSearch } from "react-icons/bs";
import { USPhoneNumber } from "_helpers/helper";
import "_containers/admin/common/adminListing.scss";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getCompanies,
  getIndustries,
  getCustomers,
  getUsers,
  getRoles,
  getMenuMappings,
  deleteUser,
  deleteRole,
  getRolesList,
} from "_containers/admin/_redux/adminListing.slice";
import { addCustomer } from "_containers/admin/_redux/addCustomer.slice";

import { NewCompany } from "_components/common/newcompany";
import errorIcon from "assets/utils/images/error_icon.png";
import successIcon from "assets/utils/images/success_icon.svg";
import { NewCustomer } from "_components/common/addCustomer";
import AsyncSelect from "react-select/async";
import { AddEditCustomer } from "./addEditCustomer";
import { AddEditUser } from "./addEditUser";
import { AddEditCompany } from "./addEditCompany";
import SweetAlert from "react-bootstrap-sweetalert";
import { settingsActions } from "_store";
import cx from "classnames";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { async } from "q";
import { AddEditRole } from "./addEditRole";
import { FiPlus } from "react-icons/fi";
import { FaEye } from "react-icons/fa";

export const AdminListing = ({ entity }) => {
  const dispatch = useDispatch();
  const {
    data,
    industyList,
    industryCompanyMapping,
    loading = false,
  } = useSelector((state) => state?.adminListing ?? {});

  const { companyDropdownData } = useSelector(
    (state) => state?.addCustomer ?? {}
  );

  let title,
    icon,
    listingTitle,
    columns = [],
    searchFilter = [],
    buttonsList = [];
  useEffect(() => {
    dispatch(getRoles());
  }, []);

  const rolesList = useSelector((state) => state.adminListing.rolesList);
  const [error, setError] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);

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
  const [newCompData, setNewCompData] = useState({
    // ... other fields
    newCompName: { value: "", error: false },
    newIndusName: { value: "", error: false },
    newCompDesc: { value: "" },
    newCompEmp: { value: "" },
    newCompAdd: { value: "" },
    newCompState: { value: 0 },
    newCompCity: { value: 0 },
    newCompCountry: { value: 0 },
    newCompLog: { value: 0 },
    newCompZip: { value: "" },
    newCompEmail: { value: "" },
    newCompPhonenum: { value: "" },
  });
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
      name: "First name",
      id: "firstName",
      selector: (row) => row.firstname,
      sortable: true,
    },
    {
      name: "Last name",
      selector: (row) => row.lastname,
      sortable: true,
    },

    {
      name: "Email",
      id: "email",
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
      name: "Action",
      id: "isactive",
      cell: (row) => (
        <div className="d-block w-100">
          <div
            className="switch has-switch  me-2"
            data-on-label="ON"
            data-off-label="OFF"
            style={{ verticalAlign: "bottom" }}
            onClick={() => toggleNotification(!row.isactive, row)}
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

          <BsPencil
            style={{ fontSize: "21px", verticalAlign: "top" }}
            className="edit-icon me-2"
            onClick={(evt) => handleRowClick(row, "edit")}
          />
          <BsTrash3
            style={{ fontSize: "21px", verticalAlign: "top" }}
            onClick={() => deleteConfirm(row, "user")}
          />
        </div>
      ),
      sortable: false,
    },
  ];

  const urlParams = {
    pageNumber: 0,
  };

  useEffect(() => {
    loadData();
  }, [entity]);

  const loadData = () => {
    dispatch(getUsers(urlParams));
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

  const onSearchClick = () => {
    console.log("Search is clicked");
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
  const onUpdateNewComp = (evt, formType) => {
    // const newData = { ...formType === 'company' ? newCompData : newCustData };
    // newData[evt.target.name] = { value: evt.target.value, error: false };
    // formType === 'company' ? setNewCompData(newData) : setNewCustData(newData);
  };

  const onSaveClick = async (e) => {
    if (isAddMode) {
      // do something for  e.target.value in Add mode
    } else {
      // do something for  e.target.value in EDIT mode
    }
  };

  const [inputValue, setValue] = useState("");
  const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  // onInputChange={handleInputChange}
  const handleInputChange = (value) => {
    // const newData = data.filter((ele)=>{
    //   console.log("NG ")
    // })
    // setTableData
    // setValue(value);
  };

  // handle selection
  const handleChange = (e) => {
    setSelectedValue(e.target.value);
  };

  const cardFilters = searchFilter.map((item) => (
    <Col lg="3" md="3" sm="12" sx="12">
      <Input name={item.id} type="select" onChange={handleChange}>
        {
          item.id === "industry"
            ? industyList?.map((ele) => (
                <option key={ele} value={ele}>
                  {ele}
                </option>
              ))
            : ""
          // : companyDropdown?.map((ele) => (
          //   <option key={ele} value={ele}>
          //     {ele}
          //   </option>
          // ))
        }
        <option value="">{item.name}</option>
      </Input>
    </Col>
  ));

  const toggleNotification = async function (value, row) {
    let id = row.userId;
    let data = {
      userId: id,
      isactive: value,
    };

    let response = await dispatch(settingsActions.deactivateUser({ id, data }));
    if (response.payload) {
      showSweetAlert({
        title: `${response.payload.message}`,
        type: "success",
      });
    } else {
      showSweetAlert({
        title: `${response.error.message}`,
        type: "error",
      });
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
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
    } else {
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
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

  const onClearSearch = function () {
    setSearchText("");

    let urlParams = {
      pageNumber: 0,
    };

    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (roleid !== 0) {
      urlParams.userRoleId = roleid;
    }

    dispatch(getUsers(urlParams));
  };

  const getUsersList = function () {
    let urlParams = {
      pageNumber: 0,
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

    dispatch(getUsers(urlParams));
  };

  const onSelectRole = (roleId) => {
    setRoleId(parseInt(roleId));
    let urlParams = {
      userRoleId: roleId,
      pageNumber: 0,
    };
    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }
    dispatch(getUsers(urlParams));
  };

  const onStatusSelect = (check) => {
    let urlParams = {
      pageNumber: 0,
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
    dispatch(getUsers(urlParams));
  };

  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle
            heading={entity === "roles" ? "Menu mapping" : title}
            icon={icon}
          />
        </Col>

        <Col md="12">
          <Card className="mb-3">
            <CardBody>
              <Row className="mb-3">
                <Col>
                  <FormGroup>
                    <Input
                      type="select"
                      name="companyid"
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
                <Col className="col-3">
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
                <Col className="col-1"></Col>
                <Col className="col">
                  <Button
                    style={{
                      background: "#2f479b",
                      borderColor: "#545cd8",
                    }}
                    className="input-group-text float-end mt-1"
                    onClick={() => onAddClick()}
                  >
                    Add user
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
                // fixedHeaderScrollHeight="400px"
                customStyles={customStyles}
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
                  ? entity === "roles"
                    ? "Edit menu mapping"
                    : `Edit user`
                  : `Add new user`}
              </strong>
            </ModalHeader>
            <ModalBody>
              {entity === "company1" && (
                <NewCompany
                  editingData={editingData}
                  isAddMode={isAddMode}
                  data={newCompData}
                  updateVal={(evt) => onUpdateNewComp(evt, "company")}
                />
              )}
              {entity === "company" && (
                <AddEditCompany
                  editingData={editingData}
                  isAddMode={isAddMode}
                  setIsAddMode={setIsAddMode}
                  data={selectedRowData}
                  // data={newCustData}
                  entity={entity}
                  // updateVal={(evt) => onUpdateNewComp(evt, 'customer')}
                />
              )}

              {entity === "customers" && (
                <AddEditCustomer
                  editingData={editingData}
                  isAddMode={isAddMode}
                  setIsAddMode={setIsAddMode}
                  data={selectedRowData}
                  // data={newCustData}
                  entity={entity}
                  // updateVal={(evt) => onUpdateNewComp(evt, 'customer')}
                />
              )}

              {entity === "users" && (
                <AddEditUser
                  editingData={editingData}
                  isAddMode={isAddMode}
                  setIsAddMode={setIsAddMode}
                  data={selectedRowData}
                  // data={newCustData}
                  entity={entity}
                  // updateVal={(evt) => onUpdateNewComp(evt, 'customer')}
                  callBack={() => CloseModal()}
                />
              )}

              {entity === "roles" && (
                <AddEditRole
                  editingData={editingData}
                  isAddMode={isAddMode}
                  setIsAddMode={setIsAddMode}
                  data={selectedRowData}
                  isView={viewMode}
                  // data={newCustData}
                  entity={entity}
                  // updateVal={(evt) => onUpdateNewComp(evt, 'customer')}
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
    </>
  );
};
