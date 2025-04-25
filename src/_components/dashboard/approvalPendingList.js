import React, { useState, useEffect } from "react";
import { Card, CardBody, ButtonGroup, Button } from "reactstrap";
import "./dashboard.scss";
import { BsPeopleFill } from "react-icons/bs";
import DataTable from "react-data-table-component";
import { USPhoneNumber } from "_helpers/helper";
import customerIcons from "assets/utils/images/customer";
import { useDispatch, useSelector } from "react-redux";
import { adminDashboardSliceActions } from "_store";
import { verifyCustomer } from "_containers/admin/_redux/adminListing.slice";
import SweetAlert from "react-bootstrap-sweetalert";

export function ApprovalPendingList() {
  const dispatch = useDispatch();
  useEffect(() => {
    getEmployerApprovalPendingList(10, 1);
  }, []);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });
  const getEmployerApprovalPendingList = async function (pagesize, pageno) {
    await dispatch(
      adminDashboardSliceActions.getEmployerApprovalPendingListThunk({
        pageSize: pagesize,
        pageNo: pageno,
      })
    );
  };
  const employerApprovalPendingList = useSelector(
    (state) =>
      state.adminDashboard?.employerApprovalPendingList?.customerDetailsList
  );
  const employerApprovalPendingTotalRecords = useSelector(
    (state) => state.adminDashboard?.employerApprovalPendingList?.totalRows
  );
  const customStyles = {
    border: "none",
    boxShadow: "none",
    table: {
      style: {
        border: "none",
        boxShadow: "none",
      },
    },
    cells: {
      style: {
        border: "none",
        boxShadow: "none",
      },
    },
    rows: {
      style: {
        fontSize: "13px",
        fontWeight: 400,
        minHeight: "48px",
        "&:not(:last-of-type)": {
          border: "none",
        },
      },
      denseStyle: {
        minHeight: "32px",
      },
    },
    headCells: {
      style: {
        color: "#2F479B",
        fontFamily: "Capitana",
        fontSize: "13px",
        fontWeight: "400",
        border: "none",
        boxShadow: "none",
        "&:not(:last-of-type)": {
          border: "none",
        },
      },
    },
  };
  let columns = [
    {
      name: "Name",
      id: "name",
      cell: (row) => <div>{row.firstname + " " + row.lastname}</div>,
      sortable: true,
      width: "18%",
    },
    {
      name: "Company",
      id: "companyname",
      selector: (row) => row.companyname,
      sortable: true,
      width: "17%",
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
      width: "18%",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "20%",
    },
    {
      name: "Phone",
      id: "phonenumber",
      selector: (row) =>
        row.phonenumber ? USPhoneNumber(row.phonenumber) : "-",
      sortable: true,
      width: "15%",
    },
    {
      name: "Accept / Decline",
      cell: (row) => (
        <ButtonGroup>
          <Button
            size="sm"
            title="Accept employer"
            className="btn-icon"
            color="success"
            onClick={() => onApprove(row, true)}
          >
            <img src={customerIcons?.list_accept} alt="list approve"></img>
          </Button>
          <Button
            size="sm"
            title="Decline employer"
            className="btn-icon"
            color="danger"
            onClick={() => onApprove(row, false)}
          >
            <img src={customerIcons?.list_reject} alt="list reject"></img>
          </Button>
        </ButtonGroup>
      ),
      sortable: false,
      width: "12%",
      align: "center",
    },
  ];
  const handlePageChange = async (page) => {
    setPageNo(page);
    getEmployerApprovalPendingList(pageSize, page);
  };
  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    getEmployerApprovalPendingList(pagesize, pageNo);
  };
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
      isactive: true,
      customerstatusid: check ? 2 : 3,
      currentUserId: Number(
        JSON.parse(localStorage.getItem("userDetails"))?.UserId
      ),
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
        title: `${
          response.error.message === "500"
            ? "Something went wrong!"
            : response.error.message
        }`,
        type: "error",
      });
    }

    getEmployerApprovalPendingList(pageSize, pageNo);
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
    getEmployerApprovalPendingList(pageSize, pageNo);
  };
  return (
    <>
      <Card className="mb-3 chart-fixed-height approval-pending-list">
        <CardBody className="p-0">
          <div className="card-header-title font-size-lg mt-3 ms-4 text-capitalize fw-normal stats-title">
            <BsPeopleFill className="me-2 mb-1 approval-icon" />
            Employer Approval Pending List
          </div>
          <div className="divider mt-2"></div>
          <div className="ms-2 me-2">
            <DataTable
              data={employerApprovalPendingList}
              columns={columns}
              fixedHeader
              customStyles={customStyles}
              responsive
              pagination
              rowsPerPage={5}
              paginationServer
              paginationTotalRows={employerApprovalPendingTotalRecords}
              onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
              onChangePage={(e) => handlePageChange(e)}
              paginationRowsPerPageOptions={[10]}
            />
          </div>
        </CardBody>
      </Card>
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
}
