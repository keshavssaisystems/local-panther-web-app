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
} from "reactstrap";
import "_containers/admin/common/adminListing.scss";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { BsSearch } from "react-icons/bs";
import { dropdownActions, addCustomerActions } from "_store";
import { getCompanies } from "_containers/admin/_redux/adminListing.slice";
import { USPhoneNumber } from "_helpers/helper";
import SweetAlert from "react-bootstrap-sweetalert";
import { AddEditCompany } from "../common/addEditCompany";

export const CompanyList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [updateSuccessPopup, setUpdateSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Company added successfully!!!"
  );
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Company added successfully!!!"
  );
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dropdownActions.getEmployeeCountThunk());
    dispatch(
      getCompanies({
        pageSize: 1000,
        pageNumber: 1,
      })
    );
  }, []);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const { data } = useSelector((state) => state?.adminListing ?? {});
  let title = "Companies";
  let icon = companyLogo;
  let columns = [
    {
      name: "Company",
      id: "name",
      cell: (row) => (
        <div
          className="editrow"
          onClick={(e) => {
            setEditData(row);
            setOpenModal(true);
            setIsAddMode(false);
            setIsEdit(true);
          }}
        >
          {row.companyname}
        </div>
      ),
      sortable: true,
    },

    {
      name: "City",
      id: "cityname",
      selector: (row) => row.cityname,
      sortable: true,
    },

    {
      name: "City",
      id: "cityname",
      selector: (row) => row.statename,
      sortable: true,
    },
    {
      name: "Zipcode",
      id: "phonenumber",
      selector: (row) => row.zipcode,
      sortable: true,
    },
    {
      name: "Industry",
      selector: (row) => row.industry,
      sortable: true,
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
    setIsEdit(false);
    setEditData(obj);
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    dispatch(
      getCompanies({
        pageSize: 1000,
        pageNumber: 1,
      })
    );
  };

  const getFilterValue = (event) => {
    event.preventDefault();
    dispatch(
      getCompanies({
        searchText: event.target.elements.search.value,
        isActive: event.target.elements.status.value,
        pageSize: 1000,
        pageNumber: 1,
      })
    );
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
          pageSize: 1000,
          pageNumber: 1,
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
                <Col md={10}>
                  <Form onSubmit={(e) => getFilterValue(e)}>
                    <Row>
                      <Col>
                        <FormGroup>
                          <Input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search.."
                          ></Input>
                        </FormGroup>
                      </Col>
                      <Col>
                        <FormGroup>
                          <Input
                            type="select"
                            name="status"
                            defaultValue="Active"
                          >
                            <option value={true}>Active</option>
                            <option value={false}>In-active</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col>
                        <Button
                          color={"primary"}
                          className="input-group-text"
                          type="submit"
                        >
                          <BsSearch className="mb-1" /> Search
                        </Button>
                      </Col>
                    </Row>
                  </Form>
                </Col>
                <Col>
                  <Button
                    color={"primary"}
                    className="input-group-text float-end"
                    type="submit"
                    onClick={(e) => addModal()}
                  >
                    Add company
                  </Button>
                </Col>
              </Row>
              <DataTable
                data={data}
                columns={columns}
                pagination
                fixedHeader
                customStyles={customStyles}
                responsive
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
