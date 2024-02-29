import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "react-loaders";
import { Col, Row, Card, CardBody, Button, ButtonGroup } from "reactstrap";
import { getBullhornCandidateReportThunk } from "../_redux/report.slice";
import PageTitle from "_components/common/pagetitle";
import titlelogo from "assets/utils/images/candidate.svg";
import DataTable from "react-data-table-component";
import { NoDataFound } from "_components/common/nodatafound";
import "./adminreports.scss";
import customerIcons from "assets/utils/images/customer";

export function BullhornCandidate({ title }) {
  const [pageSize, setPageSize] = useState(10);
  const [pageNo, setPageNo] = useState(1);
  const dispatch = useDispatch();
  useEffect(() => {
    getBullhornData(pageSize, pageNo);
  }, []);
  const getBullhornData = async (pageSize, pageNo) => {
    await dispatch(getBullhornCandidateReportThunk({ pageSize, pageNo }));
  };
  const bullhornData = useSelector((state) => state?.adminReportReducer ?? {});
  let data =
    bullhornData?.bullhornCandidateData?.bullhornCandidateStagingList ===
    undefined
      ? []
      : bullhornData?.bullhornCandidateData?.bullhornCandidateStagingList;
  const totalRecords = bullhornData?.bullhornCandidateData?.totalRows;
  let loading =
    bullhornData?.bullhornLoading === undefined
      ? true
      : bullhornData?.bullhornLoading;
  const columns = [
    {
      name: <span className="table-title">Bullhorn Id</span>,
      sortable: true,
      selector: (row) => row.candidateid,
      minWidth: "8%",
    },
    {
      name: <span className="table-title">First name</span>,
      cell: (row) => (
        <span className="table-cell" title={row.firstname}>
          {row.firstname}
        </span>
      ),
      sortable: true,
      selector: (row) => row.firstname,
      minWidth: "8%",
    },
    {
      name: <span className="table-title">Last name</span>,
      cell: (row) => (
        <span className="table-cell" title={row.lastname}>
          {row.lastname}
        </span>
      ),
      sortable: true,
      selector: (row) => row.lastname,
      minWidth: "8%",
    },
    {
      name: <span className="table-title">Email</span>,
      sortable: true,
      cell: (row) => (
        <span className="table-cell" title={row.email}>
          {row.email}
        </span>
      ),
      selector: (row) => row.email,
      minWidth: "22%",
    },
    {
      name: <span className="table-title">Phone</span>,
      sortable: true,
      cell: (row) => (
        <span className="table-cell" title={row.phonenumber}>
          {row.phonenumber}
        </span>
      ),
      selector: (row) => row.phonenumber,
      minWidth: "10%",
    },
    {
      name: <span className="table-title">Address</span>,
      sortable: true,
      cell: (row) => (
        <span
          className="table-cell"
          title={row.address === null ? "" : row.address}
        >
          {row.address === null ? "" : row.address}{" "}
          {row.city === null ? "" : ", "}
          {row.city === null ? "" : row.city}
        </span>
      ),
      selector: (row) => (row.address === null ? "" : row.address),
      minWidth: "12%",
    },
    {
      name: <span className="table-title">State, country</span>,
      sortable: true,
      cell: (row) => (
        <span
          className="table-cell"
          title={row.state === null ? "" : row.state}
        >
          {row.state === null ? "" : row.state}{" "}
          {row.countryname === null ? "" : ", "}
          {row.countryname === null ? "" : row.countryname}
        </span>
      ),
      selector: (row) => (row.state === null ? "" : row.state),
      minWidth: "10%",
    },
    {
      name: <span className="table-title">Zip code</span>,
      sortable: true,
      selector: (row) => row.zipcode,
      minWidth: "7%",
    },
    {
      name: <span className="table-title">Ready to work immediately</span>,
      sortable: true,
      selector: (row) =>
        row.isreadytoworkimmediately === false ? "No" : "Yes",
      minWidth: "8%",
    },
    // {
    //   name: <span className="table-title">Send invitation</span>,
    //   cell: (row) => (
    //     <>
    //       <ButtonGroup>
    //         <Button
    //           size="sm"
    //           title="Send Invitation"
    //           className="btn-icon"
    //           color="success"
    //         >
    //           <img src={customerIcons?.list_accept} alt="list apply"></img>
    //         </Button>
    //         <Button
    //           size="sm"
    //           title="Resend Invitation"
    //           className="btn-icon"
    //           color="warning"
    //         >
    //           <img src={customerIcons?.list_accept} alt="list apply"></img>
    //         </Button>
    //       </ButtonGroup>
    //     </>
    //   ),
    //   minWidth: "7%",
    // },
  ];
  const customStyles = {
    headCells: {
      style: {
        color: "#000000",
        fontFamily: "Capitana",
        fontSize: "14px",
        fontWeight: "500",
      },
    },
  };

  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    getBullhornData(pagesize, pageNo);
  };

  const handlePageChange = async (page) => {
    setPageNo(page);
    getBullhornData(pageSize, page);
  };

  return (
    <>
      <PageTitle heading={title} icon={titlelogo} />
      <Row className="admin-report-calendar">
        <Col md="12" lg="12" xl="12">
          <Card className="mb-3">
            <CardBody>
              {loading ? (
                <Loader
                  type="line-scale-pulse-out-rapid"
                  className="d-flex justify-content-center"
                />
              ) : (
                <>
                  {data.length > 0 ? (
                    <DataTable
                      columns={columns}
                      data={data}
                      fixedHeader
                      pagination
                      progressPending={loading}
                      customStyles={customStyles}
                      paginationServer
                      paginationTotalRows={totalRecords}
                      onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
                      onChangePage={(e) => handlePageChange(e)}
                    />
                  ) : (
                    <Row className="center-align ">
                      <NoDataFound></NoDataFound>
                    </Row>
                  )}
                </>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
