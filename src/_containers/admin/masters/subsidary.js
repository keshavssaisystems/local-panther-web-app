import React, { useState, useEffect } from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import PageTitle from "_components/common/pagetitle";
import { Row, Col, Card, CardBody, FormGroup, Input, Button } from "reactstrap";
import cx from "classnames";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { dropdownActions, addCustomerActions } from "_store";
import { getSubsidary } from "_containers/admin/_redux/adminListing.slice";
import SweetAlert from "react-bootstrap-sweetalert";
import { AddEditSubsidary } from "./addEditSubsidary";
import { getLocationText } from "_helpers/helper";
import { editSubsidiary } from "_containers/admin/_redux/addCustomer.slice";
import { useParams } from "react-router-dom";
import { analytics } from "../../../firebase/index";

export const SubsidaryList = (props) => {
  const { id } = useParams();
  const [openModal, setOpenModal] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dropdownActions.getCompanyListThunk());
    dispatch(dropdownActions.getEmployeeCountThunk());
    getSubsidaryList(pageSize, pageNo);
    if (analytics) {
      analytics.logEvent("page_visit", {
        page_title: "Admin subsidiary list",
        page_location: window.location.pathname,
        page_path: window.location.pathname,
      });
    }
  }, []);
  const companyDropdown = useSelector((state) => state.dropdown.companyList);
  const [companyId, setCompanyId] = useState(id ? id : 0);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [searchData, setSearchText] = useState("");

  const [status, setStatus] = useState("All");
  const { data } = useSelector((state) => state?.adminListing ?? {});
  const totalRecords = useSelector((state) => state.adminListing?.totalRecords);
  let title = "Subsidaries";
  let icon = companyLogo;
  let columns = [
    {
      name: "Company name",
      id: "companyname",
      cell: (row) => (
        <div
          className="editrow"
          onClick={(e) => {
            setEditData(row);
            setOpenModal(true);
            setIsAddMode(false);
          }}
        >
          {row.companyname}
        </div>
      ),
      sortable: true,
    },

    {
      name: "Subsidiary name",
      id: "subsidiaryname",
      selector: (row) => row.subsidiaryname,
      sortable: true,
    },

    {
      name: "Address",
      id: "address",
      selector: (row) => row.address,
      sortable: true,
    },
    {
      name: "City, State, Country",
      id: "cityname",
      selector: (row) => getLocationText(row),
      sortable: true,
    },
    {
      name: "Zip code",
      id: "zipcode",
      selector: (row) => row.zipcode,
      sortable: true,
    },
    {
      name: "Action",
      id: "isactive",
      cell: (row) => (
        <div className="d-block w-100">
          <div
            title="Active/Inactive subsidiary"
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
      subsidary: "",
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
    setEditData(obj);
    setOpenModal(true);
  };

  const closeModal = (event) => {
    setOpenModal(false);
    getSubsidaryList(pageSize, pageNo);
  };

  const getSubsidaryList = async function (pagesize, pageno) {
    setLoading(true);
    let urlParams = {
      pageSize: pagesize,
      pageNumber: pageno,
    };

    if (companyId !== 0) {
      urlParams.companyid = companyId;
    }
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }

    if (status !== "All") {
      urlParams.isActive = status;
    }
    await dispatch(getSubsidary(urlParams));
    setLoading(false);
  };

  const onStatusSelect = async (selected, check) => {
    setLoading(true);
    let urlParams = {
      pageSize: pageSize,
      pageNumber: pageNo,
    };
    if (selected === "company") {
      setCompanyId(Number(check));
      if (check !== "0") {
        urlParams.companyid = Number(check);
      }
      if (status) {
        urlParams.isActive = true;
      }
    } else {
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
      if (companyId !== 0) {
        urlParams.companyid = companyId;
      }
    }
    if (searchData !== "") {
      urlParams.searchText = searchData;
    }
    await dispatch(getSubsidary(urlParams));
    setLoading(false);
  };

  const onClearSearch = async function () {
    setSearchText("");

    let urlParams = {
      pageSize: pageSize,
      pageNumber: pageNo,
    };

    if (status !== "All") {
      urlParams.isActive = status;
    }
    if (companyId !== 0) {
      urlParams.companyid = companyId;
    }
    setLoading(true);
    await dispatch(getSubsidary(urlParams));
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
    if (res.payload) {
      dispatch(
        getSubsidary({
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

  const toggleNotification = async function (value, row) {
    let payload = {
      subsidiaryid: row.subsidiaryid,
      companyid: Number(row.companyid),
      subsidiaryname: row.subsidiaryname,
      address: row.address,
      zipcode: row.zipcode,
      cityid: Number(row.cityid),
      stateid: Number(row.stateid),
      countryid: Number(row.countryid),
      isactive: value,
      currentuserid: Number(
        JSON.parse(localStorage.getItem("userDetails"))?.UserId
      ),
    };
    let response;

    let id = row.subsidiaryid;
    response = await dispatch(editSubsidiary({ id, payload }));

    if (response.payload) {
      setSuccess(true);
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
    } else {
      setError(true);
      showSweetAlert({
        title: "Something went wrong, please try again later",
        type: "warning",
      });
    }
    getSubsidaryList(pageSize, pageNo);
  };

  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    getSubsidaryList(pagesize, pageNo);
  };
  const handlePageChange = async (page) => {
    setPageNo(page);
    getSubsidaryList(pageSize, page);
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
              <Row className="mb-3">
                <Col xxl={3} xl={3} md={12} lg={4} sm={12} xs={12}>
                  <FormGroup>
                    <Input
                      type="select"
                      name="companyid"
                      onChange={(e) =>
                        onStatusSelect("company", e.target.value)
                      }
                    >
                      <option value={0}>All companies</option>
                      {companyDropdown?.length > 0 &&
                        companyDropdown?.map((options) => (
                          <option
                            selected={
                              id ? options.companyid === Number(id) : ""
                            }
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

                <Col xxl={2} xl={2} md={12} lg={3} sm={12} xs={12}>
                  <FormGroup>
                    <Input
                      type="select"
                      name="status"
                      defaultValue="Active"
                      onChange={(e) => onStatusSelect("status", e.target.value)}
                    >
                      <option value={0}>All status</option>
                      <option value={1}>Active</option>
                      <option value={2}>In-active</option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col xxl={7} xl={7} md={12} lg={5} sm={12} xs={12}>
                  <Button
                    style={{ background: "#2f479b" }}
                    color={"primary"}
                    className="input-group-text float-end mt-1"
                    type="submit"
                    onClick={(e) => addModal()}
                  >
                    Add Subsidiary
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
                        onClick={(evt) => getSubsidaryList(pageSize, pageNo)}
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
        <AddEditSubsidary
          openModal={openModal}
          onClose={() => closeModal(false)}
          postData={(e) => postData(e)}
          isAddMode={isAddMode}
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
