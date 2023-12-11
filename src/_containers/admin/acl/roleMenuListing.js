import React, { useState, useEffect } from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import PageTitle from "_components/common/pagetitle";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import "_containers/admin/common/adminListing.scss";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getRoles,
  getMenuMappings,
  deleteRole,
  getRolesList,
} from "_containers/admin/_redux/adminListing.slice";
import errorIcon from "assets/utils/images/error_icon.png";
import successIcon from "assets/utils/images/success_icon.svg";
import SweetAlert from "react-bootstrap-sweetalert";
import cx from "classnames";
import { BsPencil } from "react-icons/bs";
import { FaEye } from "react-icons/fa";
import { AddEditMenuMapping } from "../common/addEditMenuMapping";
import { AddEditRole } from "../common/addEditRole";

export const RoleMenuListing = ({ entity }) => {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state?.adminListing ?? {});

  let icon,
    columns = [];
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

  icon = companyLogo;
  columns = [
    {
      name: "Role",
      id: "rolename",
      selector: (row) => row.rolename,
      sortable: true,
    },
    {
      name: "Description",
      id: "description",
      selector: (row) => <span title={row.description}>{row.description}</span>,
      sortable: true,
    },
    {
      name: "Action",
      id: "isactive",
      cell: (row) => (
        <div className="d-block w-100">
          {entity === "menuMapping" ? (
            <FaEye
              style={{ fontSize: "18px", cursor: "pointer" }}
              className="edit-icon me-2"
              onClick={(evt) => handleRowClick(row, "view")}
            />
          ) : (
            <></>
          )}
          <BsPencil
            style={{ fontSize: "18px", cursor: "pointer" }}
            className="edit-icon me-2"
            onClick={(evt) => handleRowClick(row, "edit")}
          />

          {/* {entity === "roles" ? (
            <BsTrash3
              style={{ fontSize: "18px" }}
              onClick={() => deleteConfirm(row, "role")}
            />
          ) : (
            <></>
          )} */}
        </div>
      ),
    },
  ];

  const urlParams = {
    pageNumber: 0,
  };

  useEffect(() => {
    setSearchText("");
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    dispatch(getRoles());
    await dispatch(getRolesList(urlParams));
    dispatch(getMenuMappings());
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
    let id = row.userroleid;
    await dispatch(getMenuMappings(id));
    setSelectedRowData(row);
    if (check === "view") {
      setViewMode(true);
    } else {
      setIsAddMode(false);
      setViewMode(false);
    }

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

  const deleteUserData = async function () {
    let response;

    let id = selectedRowData.userroleid;
    response = await dispatch(deleteRole(id));

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

    dispatch(getRolesList(urlParams));
  };

  const getUsersList = function () {
    let urlParams = {
      searchText: searchData,
      pageNumber: 0,
    };

    dispatch(getRolesList(urlParams));
  };

  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle
            heading={entity === "roles" ? "Roles" : "Menu mapping"}
            icon={icon}
          />
        </Col>

        <Col md="12">
          <Card className="mb-3">
            <CardBody>
              <Row className="mb-3">
                <Col className="col">
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
                        style={{ Left: "215px", top: "18px" }}
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
          <Modal isOpen={openModal} size={"md"}>
            <ModalHeader toggle={() => close()} charCode="Y">
              <strong className="card-title-text">
                {!isAddMode
                  ? entity === "roles"
                    ? "Edit role"
                    : viewMode
                    ? "View menu mapping"
                    : "Edit menu mapping"
                  : entity === "roles"
                  ? "Add new Role"
                  : `Add menu mapping`}
              </strong>
            </ModalHeader>
            <ModalBody>
              {entity === "menuMapping" && (
                <AddEditMenuMapping
                  editingData={editingData}
                  isAddMode={isAddMode}
                  setIsAddMode={setIsAddMode}
                  data={selectedRowData}
                  isView={viewMode}
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
            title={"Are you sure want to delete the role!!"}
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
