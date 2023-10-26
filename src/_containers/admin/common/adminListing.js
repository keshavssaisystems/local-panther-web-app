import React, { useState, useEffect } from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import { customers, company, users, roles, menuMapping } from "_containers/admin/common/adminColumnsListing"
import PageTitle from "_components/common/pagetitle";
import { Row, Col, Card, CardBody, CardHeader, Button, FormGroup, InputGroup, Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import "_containers/admin/common/adminListing.scss"
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, getIndustries, getCustomers, getUsers, getRoles, getMenuMappings } from '_containers/admin/_redux/adminListing.slice'
import { addCustomer } from '_containers/admin/_redux/addCustomer.slice'


import { NewCompany } from "_components/common/newcompany";
import errorIcon from "assets/utils/images/error_icon.png";
import successIcon from "assets/utils/images/success_icon.svg";
import { NewCustomer } from "_components/common/addCustomer";
import AsyncSelect from 'react-select/async';
import { AddEditCustomer } from "./addEditCustomer";
import { AddEditCompany } from "./addEditCompany";
import { createEntityAdapter } from "@reduxjs/toolkit";

export const AdminListing = ({ entity }) => {
  const dispatch = useDispatch()
  const {
    data,
    industyList,
    industryCompanyMapping,
    loading = false } = useSelector((state) => state?.adminListing ?? {});

    const {
      companyDropdownData
    } = useSelector((state) => state?.addCustomer ?? {});

  let title, icon, listingTitle, columns = [], searchFilter = [], buttonsList = [];
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [isAddMode, setIsAddMode] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [editingData, setEditingData] = useState(null);
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
  switch (entity) {
    case "customers":
      title = customers.title;
      icon = companyLogo;
      columns = customers.columns;
      searchFilter = customers.searchFilter;
      buttonsList = customers.buttonsList;
      listingTitle = customers.listingTitle;
      break;
    case "company":
      title = company.title;
      icon = companyLogo;
      columns = company.columns;
      searchFilter = company.searchFilter;
      buttonsList = company.buttonsList;
      listingTitle = company.listingTitle;
      break;
    case "users":
      title = users.title;
      icon = companyLogo;
      columns = users.columns;
      searchFilter = users.searchFilter;
      buttonsList = users.buttonsList;
      listingTitle = users.listingTitle;
      break;
    case "roles":
      title = roles.title;
      icon = companyLogo;
      columns = roles.columns;
      searchFilter = roles.searchFilter;
      buttonsList = roles.buttonsList;
      listingTitle = roles.listingTitle;
      break;
    case "menuMapping":
      title = menuMapping.title;
      icon = companyLogo;
      columns = menuMapping.columns;
      searchFilter = menuMapping.searchFilter;
      buttonsList = menuMapping.buttonsList;
      listingTitle = menuMapping.listingTitle;
      break;
    default:
      break;
  }

  const urlParams = {
    isActive: true,
    pageSize: 50,
    pageNumber:1
  };

  useEffect(() => {
    if (entity === "company") {
      dispatch(getCompanies(urlParams))
    } else if (entity === "customers") {
      dispatch(getIndustries(urlParams))
      dispatch(getCustomers(urlParams))
    } else if (entity === "users") {
      dispatch(getUsers(urlParams))
    } else if (entity === "roles") {
      dispatch(getRoles(urlParams))
    } else if (entity === "menuMapping") {
      dispatch(getMenuMappings(urlParams))
    }
  }, [entity])

  const customStyles = {
    headCells: {
      style: {
        color: "#2F479B",
        fontFamily: "Capitana",
        fontSize: "16px",
        fontWeight: "400"
      },
    }
  };

  const handleRowClick = (row) => {
    setSelectedRowData(row);
    setIsAddMode(false); // Open the modal
    setOpenModal(true)
  };

  const onAddClick = () => {
    setIsAddMode(true); // Open the modal
    setOpenModal(true)
  };

  const onSearchClick = () => {
    console.log("Search is clicked")
  }

  const close = () => {
    setIsAddMode(false)
    setSuccess(false)
    setEditingData(null); // Reset editing data
  }

  const onUpdateNewComp = (evt, formType) => {
    // const newData = { ...formType === 'company' ? newCompData : newCustData };
    // newData[evt.target.name] = { value: evt.target.value, error: false };
    // formType === 'company' ? setNewCompData(newData) : setNewCustData(newData);
  };

  const onSaveClick = async (e) => {
    if ( isAddMode ) {
      // do something for  e.target.value in Add mode
    } else {
      // do something for  e.target.value in EDIT mode
    }
  };

  const [inputValue, setValue] = useState('');
  const [selectedValue, setSelectedValue] = useState(null);

  // handle input change event
  // onInputChange={handleInputChange}
  const handleInputChange = value => {
    // const newData = data.filter((ele)=>{
    //   console.log("NG ")
    // })
    // setTableData
    // setValue(value);
  };

  // handle selection
  const handleChange = e => {
    setSelectedValue(e.target.value);
  }

  const cardFilters = searchFilter.map(item => (
    < Col lg="3" md="3" sm="12" sx="12" >
      <Input name={item.id} type="select" onChange={handleChange}>
        { item.id === 'industry' ? industyList?.map((ele) => (
          <option key={ele} value={ele}>
            {ele}
          </option>
        )) : ''
          // : companyDropdown?.map((ele) => (
          //   <option key={ele} value={ele}>
          //     {ele}
          //   </option>
          // ))
      }
        <option value="">{item.name}</option>
      </Input>
    </Col >
  ))

  const cardButtons = buttonsList.map(item => (
    <Col lg="3" md="2" sm="12" sx="12">
      <FormGroup>
        <InputGroup>
          <div className="admin-list btn-actions-pane-right ">
            <Button className="mb-2 me-2  " color="primary" onClick={item.id === 'search' ? onSearchClick : onAddClick}>
              {item.name}
            </Button>
          </div>
        </InputGroup>
      </FormGroup>
    </Col>
  ))

  return (
    <>
      <Row>
        <Col md="12">
          <PageTitle heading={title} icon={icon} />
        </Col>
        <Col md="12">
          <Card className="mb-3">
            <CardHeader className="card-header-tab">
              <div className="card-header-title font-size-lg text-capitalize fw-normal">
                <i className="header-icon lnr-laptop-phone me-3 text-muted opacity-6"> {" "} </i>
                {listingTitle}
              </div>
            </CardHeader>
            <CardBody>
              <Row>
                {cardFilters}
                {cardButtons}
              </Row>
              <DataTable data={data}
                columns={columns}
                pagination
                fixedHeader
                fixedHeaderScrollHeight="400px"
                customStyles={customStyles}
                onRowClicked={handleRowClick}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
      {
        success ? <div>
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
        </div> : <></>
      }
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
      {openModal ? <div>
        <Modal isOpen={openModal}>
          <ModalHeader toggle={() => close()} charCode="Y">
            <strong className="card-title-text">
              {!isAddMode
                ? `Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}`
                : `Add New ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}
            </strong>
          </ModalHeader>
          <ModalBody>
            {entity === 'company1' && (
              <NewCompany
                editingData={editingData}
                isAddMode={isAddMode}
                data={newCompData}
                updateVal={(evt) => onUpdateNewComp(evt, 'company')}
              />
            )}
            {entity === 'company' && (
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

            {entity === 'customers' && (
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
          </ModalBody>
        </Modal>

      </div> : <></>}
    </>
  );
}
