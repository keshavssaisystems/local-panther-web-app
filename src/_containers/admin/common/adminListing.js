import React, { useState } from "react";
import companyLogo from "assets/utils/images/candidate.svg";
import { customers, company, users, roles, menuMapping } from "_containers/admin/common/adminColumnsListing"
import PageTitle from "_components/common/pagetitle";
import { Row, Col, Card, CardBody, CardHeader, Button, FormGroup, InputGroup, Input, Modal, ModalHeader, ModalBody } from "reactstrap";
import "_containers/admin/common/adminListing.scss"
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies, getCustomers } from '_containers/admin/_redux/adminListing.slice'
import { useEffect } from "react";
import { NewCompany } from "_components/common/newcompany";
import errorIcon from "assets/utils/images/error_icon.png";
import successIcon from "assets/utils/images/success_icon.svg";
import { NewCustomer } from "_components/common/addCustomer";


export const AdminListing = ({ entity }) => {
  const dispatch = useDispatch()
  const {
    data,
    loading = false } = useSelector((state) => state?.adminListing ?? {});

  let title, icon, listingTitle, columns = [], searchFilter = [], buttonsList = [];

  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const [addComp, setAddComp] = useState(false)
  const [editMode, setEditMode] = useState(false)
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

  const [newCustData, setNewCustData] = useState({
    // ... other fields for customer form
    custFName: { value: "", error: false },
    custLName: { value: "", error: false },
    // ... other fields for customer form
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
    pageSize: 500,
  };

  useEffect(() => {
    // dispatch(getCustomers(urlParams));
    if (entity === "company") {
      dispatch(getCompanies(urlParams))
    } else if (entity === "customers") {
      dispatch(getCustomers(urlParams))
    }
  }, [])


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
    setEditMode(true);
    setAddComp(true); // Open the modal
  };

  const onAddClick = () => {

    setEditMode(false); // Reset edit mode
    setAddComp(true); // Open the modal
  };

  const close = () => {
    setAddComp(false)
    setSuccess(false)
    setEditMode(false); // Reset edit mode
    setEditingData(null); // Reset editing data
  }



  const onUpdateNewComp = (evt, formType) => {
    const newData = { ...formType === 'company' ? newCompData : newCustData };
    newData[evt.target.name] = { value: evt.target.value, error: false };

    // Update the state based on the form type
    formType === 'company' ? setNewCompData(newData) : setNewCustData(newData);
  };

  const onSaveClick = async () => {
    if (entity === 'company') {

      if (newCompData.newCompName.value === "") {
        newCompData.newCompName.error = true;
      }
      if (newCompData.newIndusName.value === "") {
        newCompData.newIndusName.error = true;
      }
      if (newCompData.newCompAdd.value === "") {
        newCompData.newCompAdd.error = true;
      }
      if (newCompData.newCompCity.value === "") {
        newCompData.newCompCity.error = true;
      }
      if (newCompData.newCompCountry.value === "") {
        newCompData.newCompCountry.error = true;
      }
      if (newCompData.newCompName.error || newCompData.newIndusName.error || newCompData.newCompEmail.error || newCompData.newCompEmp.error || newCompData.newCompPhonenum.error
        || newCompData.newCompAdd.error || newCompData.newCompState.error || newCompData.newCompState.error || newCompData.newCompCountry.error || newCompData.newCompZip.error || newCompData.newCompDesc.error) {

        return;
      }
    } if (entity === 'customers') {
      // ... existing validation logic for customer form

      if (newCustData.custFName.error || newCustData.custLName.error) {
        return;
      }

      // Handle submission for customer form
    }
  };

  const cardFilters = (searchFilter).map(item => (
    < Col lg="3" md="3" sm="12" sx="12" >
      <Input name={item.id} type="select">
        <option value="">{item.name}</option>
      </Input>
    </Col >
  ))

  const cardButtons = (buttonsList).map(item => (
    <Col lg="3" md="2" sm="12" sx="12">
      <FormGroup>
        <InputGroup>
          <div className="admin-list btn-actions-pane-right ">
            <Button className="mb-2 me-2  " color="primary" onClick={onAddClick}>
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
      {addComp ? <div>
        <Modal isOpen={addComp}>
          <ModalHeader toggle={() => close()} charCode="Y">
            <strong className="card-title-text">
              {editMode
                ? `Edit ${entity.charAt(0).toUpperCase() + entity.slice(1)}`
                : `Add New ${entity.charAt(0).toUpperCase() + entity.slice(1)}`}
            </strong>
          </ModalHeader>
          <ModalBody>
            {entity === 'company' && (
              <NewCompany
                editingData={editingData}
                editMode={editMode}
                data={newCompData}
                updateVal={(evt) => onUpdateNewComp(evt, 'company')}
              />
            )}
            {entity === 'customers' && (
              <NewCustomer
                editingData={editingData}
                editMode={editMode}
                data={newCustData}
                updateVal={(evt) => onUpdateNewComp(evt, 'customer')}
              />
            )}
            <Button color="primary" onClick={() => onSaveClick()}>
              {editMode ? 'Update' : 'Submit'} {/* Conditional label */}
            </Button>
          </ModalBody>
        </Modal>

      </div> : <></>}
    </>
  );
}
