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
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getCustomers,
  verifyCustomer,
} from "_containers/admin/_redux/adminListing.slice";
import { settingsActions } from "_store";
import cx from "classnames";
import { dropdownActions, addCustomerActions } from "_store";
import { USPhoneNumber } from "_helpers/helper";
import { AddUpdateCustomer } from "./addUpdateCustomer";
import SweetAlert from "react-bootstrap-sweetalert";
import "./customer.scss";
import customerIcons from "assets/utils/images/customer";
import { BsPencil } from "react-icons/bs";

export const CustomerList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(false);

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dropdownActions.getCompanyListThunk());
    dispatch(dropdownActions.getEmployeeCountThunk());
    dispatch(dropdownActions.getStatusListThunk());
    getCustomerDetails(pageSize, pageNo);
  }, []);
  const [customerStatus, setCustomerStatus] = useState(0);
  const [companyId, setCompanyId] = useState(0);
  const [status, setStatus] = useState(0);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { data } = useSelector((state) => state?.adminListing ?? {});
  const totalRecords = useSelector((state) => state.adminListing?.totalRecords);
  const companyDropdown = useSelector((state) => state.dropdown.companyList);
  const candidateStatusList = useSelector((state) => state.dropdown.statusList);

  let title = "Customers";
  let icon = companyLogo;
  let columns = [
    {
      name: "Name",
      id: "name",
      cell: (row) => <div>{row.firstname + " " + row.lastname}</div>,
      sortable: true,
    },
    {
      name: "Company",
      id: "companyname",
      selector: (row) => row.companyname,
      sortable: true,
    },
    // {
    //   name: "Address",
    //   id: "address",
    //   selector: (row) => row.address,
    //   sortable: true,
    // },
    {
      name: "City, State",
      id: "cityname",
      selector: (row) =>
        row.cityname === "" && row.statename === ""
          ? ""
          : row.cityname === "" && row.statename !== ""
          ? row.statename
          : row.cityname !== "" && row.statename === ""
          ? row.cityname
          : row.cityname + ", " + row.statename,
      sortable: true,
    },
    {
      name: "Phone",
      id: "phonenumber",
      selector: (row) =>
        row.phonenumber ? USPhoneNumber(row.phonenumber) : "-",
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Customer status",
      selector: (row) => row.customerstatus,
      sortable: true,
    },
    {
      name: "Action",
      id: "isactive",
      cell: (row) => (
        <div>
          <div
            title="Active/Inactive user"
            className="switch has-switch  me-1"
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
            >
              <input type="checkbox" />
              <span className="switch-left">ON</span>
              <label>&nbsp;</label>
              <span className="switch-right">OFF</span>
            </div>
          </div>
          <ButtonGroup>
            {/* <BsPencil
            title="Edit user"
            style={{
              fontSize: "21px",
              verticalAlign: "middle",
              cursor: "pointer",
            }}
            className="edit-icon me-1"
            onClick={(e) => {
              setEditData(row);
              setOpenModal(true);
              setIsEdit(true);
            }}
          /> */}

            <Button
              // outline
              size="sm"
              title="Edit customer"
              className="btn-icon"
              color="warning"
              onClick={(e) => {
                setEditData(row);
                setOpenModal(true);
                setIsEdit(true);
              }}
            >
              <img src={customerIcons?.list_edit} alt="list approve"></img>
            </Button>

            {(row.customerstatusid === 1 || row.customerstatusid === 3) && (
              <Button
                // outline
                size="sm"
                title="Accept customer"
                className="btn-icon"
                color="success"
                onClick={() => onApprove(row, true)}
              >
                <img src={customerIcons?.list_accept} alt="list approve"></img>
              </Button>
            )}

            {row.customerstatusid === 1 && (
              <Button
                // outline
                size="sm"
                title="Reject customer"
                className="btn-icon"
                color="danger"
                onClick={() => onApprove(row, false)}
              >
                <img src={customerIcons?.list_reject} alt="list reject"></img>
              </Button>
            )}
          </ButtonGroup>
        </div>
      ),
      sortable: false,
    },
  ];

  const onApprove = async (row, check) => {
    let payload = {
      userid: row.userid,
      customerid: row.customerid,
      companyid: row.companyid,
      title: row.title,
      firstname: row.firstname,
      lastname: row.lastname,
      email: row.email,
      phonenumber: row.phonenumber,
      isactive: row.isactive,
      customerstatusid: check ? 2 : 3,
      currentUserId: JSON.parse(localStorage.getItem("userDetails"))?.UserId,
    };
    let response = await dispatch(verifyCustomer(payload));
    if (response.payload) {
      setSuccess(true);
      showSweetAlert({
        title: `${response.payload.message}`,
        type: "success",
      });
    } else {
      setError(true);
      showSweetAlert({
        title: `${response.error.message}`,
        type: "error",
      });
    }

    getCustomerDetails(pageSize, pageNo);
  };

  const toggleNotification = async function (value, row) {
    let id = row.userid;
    let data = {
      userId: id,
      isactive: value,
    };

    let response = await dispatch(settingsActions.deactivateUser({ id, data }));
    if (response.payload) {
      setSuccess(true);
      showSweetAlert({
        title: `${response.payload.message}`,
        type: "success",
      });
    } else {
      setError(true);
      showSweetAlert({
        title: `${response.error.message}`,
        type: "error",
      });
    }
  };

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
    setIsEdit(false);
    setEditData(obj);
    setOpenModal(true);
  };

  const getFilterValue = async (event) => {
    setLoading(true);
    event.preventDefault();

    let obj = {
      isActive: event.target.elements.status.value,
      pageSize: pageSize,
      pageNumber: pageNo,
      companyId: event.target.elements.companyid.value,
    };
    if (event.target.elements.customerStatus.value !== "All status") {
      obj.customerStatusId = Number(event.target.elements.customerStatus.value);
    }

    await dispatch(getCustomers(obj));
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
    getCustomerDetails(pageSize, pageNo);
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
      getCustomerDetails(pageSize, pageNo);
      if (res.payload.statusCode === 204) {
        setSuccess(true);
        showSweetAlert({
          title: res.payload.message,
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

  const handelInputChange = (data, check) => {
    if (check === "customerStatus") {
      if (data === "All status") {
        setCustomerStatus(0);
      } else {
        setCustomerStatus(Number(data));
      }
    } else if (check === "status") {
      setStatus(data);
    } else {
      setCompanyId(Number(data));
    }
  };
  const getCustomerDetails = async (pageSize, pageNo) => {
    setLoading(true);
    let obj = {
      pageSize: pageSize,
      pageNumber: pageNo,
    };
    if (customerStatus !== 0) {
      obj.customerStatusId = Number(customerStatus);
    }
    if (status !== 0) {
      obj.isActive = status;
    }
    if (companyId !== 0) {
      obj.companyId = companyId;
    }
    await dispatch(getCustomers(obj));
    setLoading(false);
  };

  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    getCustomerDetails(pagesize, pageNo);
  };
  const handlePageChange = async (page) => {
    setPageNo(page);
    getCustomerDetails(pageSize, page);
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
                <Col md={12} lg={10} sm={12}>
                  <Form onSubmit={(e) => getFilterValue(e)}>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Input
                            type="select"
                            name="companyid"
                            onChange={(e) =>
                              handelInputChange(e.target.value, "company")
                            }
                          >
                            <option value={0}>All companies</option>
                            {companyDropdown?.length > 0 &&
                              companyDropdown?.map((options) => (
                                <option
                                  key={options.companyid}
                                  value={options.companyid}
                                >
                                  {" "}
                                  {options.companyname}{" "}
                                </option>
                              ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Input
                            type="select"
                            name="status"
                            defaultValue="Active"
                            onChange={(e) =>
                              handelInputChange(e.target.value, "status")
                            }
                          >
                            <option value={true}>Active</option>
                            <option value={false}>In-active</option>
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col>
                        <FormGroup>
                          <Input
                            type="select"
                            name="customerStatus"
                            defaultValue="Active"
                            onChange={(e) =>
                              handelInputChange(
                                e.target.value,
                                "customerStatus"
                              )
                            }
                          >
                            <option key={0}>All status</option>
                            {candidateStatusList?.length > 0 &&
                              candidateStatusList?.map((options) => (
                                <option key={options.id} value={options.id}>
                                  {options.name}
                                </option>
                              ))}
                          </Input>
                        </FormGroup>
                      </Col>

                      <Col>
                        <Button
                          style={{ background: "#2f479b" }}
                          color={"primary"}
                          className="input-group-text"
                          type="submit"
                        >
                          Submit
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col md={12} lg={2} sm={12}>
                  <Button
                    style={{ background: "#2f479b" }}
                    color={"primary"}
                    className="input-group-text float-end"
                    type="submit"
                    onClick={(e) => addModal()}
                  >
                    Add customer
                  </Button>
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
        <AddUpdateCustomer
          openModal={openModal}
          onClose={() => setOpenModal(false)}
          postData={(e) => postData(e)}
          isEdit={isEdit}
          data={editData}
          putData={(e) => putData(e)}
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
    </>
  );
};
