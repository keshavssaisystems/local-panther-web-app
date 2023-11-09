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
import { getCustomers } from "_containers/admin/_redux/adminListing.slice";
import { BsSearch } from "react-icons/bs";
import { dropdownActions, addCustomerActions } from "_store";
import { USPhoneNumber } from "_helpers/helper";
import { AddUpdateCustomer } from "./addUpdateCustomer";
import SweetAlert from "react-bootstrap-sweetalert";

export const CustomerList = () => {
  const [openModal, setOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState({});
  const [updateSuccessPopup, setUpdateSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "Customer added successfully!!!"
  );
  const [errorPopup, setErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    "Customer added successfully!!!"
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(dropdownActions.getCompanyListThunk());
    dispatch(dropdownActions.getStateListThunk());
    dispatch(
      getCustomers({
        isActive: true,
        pageSize: 1000,
        pageNumber: 1,
        companyId: 0,
      })
    );
  }, []);
  const { data } = useSelector((state) => state?.adminListing ?? {});
  const companyDropdown = useSelector((state) => state.dropdown.companyList);
  let title = "Customers";
  let icon = companyLogo;
  let columns = [
    {
      name: "Name",
      id: "name",
      cell: (row) => (
        <div
          onClick={(e) => {
            setEditData(row);
            setOpenModal(true);
            setIsEdit(true);
          }}
        >
          {row.firstname + " " + row.lastname}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Company",
      id: "companyname",
      selector: (row) => row.companyname,
      sortable: true,
    },
    {
      name: "Address",
      id: "address",
      selector: (row) => row.address,
      sortable: true,
    },
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
      selector: (row) => USPhoneNumber(row.phonenumber),
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
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
  const getFilterValue = (event) => {
    event.preventDefault();
    dispatch(
      getCustomers({
        isActive: event.target.elements.status.value,
        pageSize: 1000,
        pageNumber: 1,
        companyId: event.target.elements.companyid.value,
      })
    );
  };
  const postData = async (data) => {
    let res = await dispatch(addCustomerActions.addCustomer(data));

    setOpenModal(false);
    if (res.payload.statusCode === 204) {
      setSuccessMessage("Customer added successfully");
      setUpdateSuccess(true);
    } else {
      setErrorMessage(res.payload.message);
      setErrorPopup(true);
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
    if (res.payload.statusCode === 204) {
      setSuccessMessage("Customer added successfully");
      setUpdateSuccess(true);
    } else {
      setErrorMessage(res.payload.message);
      setErrorPopup(true);
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
                          <Input type="select" name="companyid">
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
                    onClick={(e) => setOpenModal(true)}
                  >
                    Add Customer
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
      <AddUpdateCustomer
        openModal={openModal}
        onClose={() => setOpenModal(false)}
        postData={(e) => postData(e)}
        isEdit={isEdit}
        editData={editData}
        putData={(e) => putData(e)}
      />
      {updateSuccessPopup === true && (
        <SweetAlert
          success
          title={successMessage}
          onConfirm={(e) => setUpdateSuccess(false)}
        ></SweetAlert>
      )}
    </>
  );
};
