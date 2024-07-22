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
  Button,
  ButtonGroup,
} from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { FaEnvelopeOpenText, FaEnvelope } from "react-icons/fa";
import customerIcons from "assets/utils/images/customer";
import DataTable from "react-data-table-component";
import { adminListingActions } from "_store";
import { USPhoneNumber } from "_helpers/helper";
import SweetAlert from "react-bootstrap-sweetalert";

export const AdmCandidateList = () => {
  const dispatch = useDispatch();
  const [searchData, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const candidateList = useSelector(
    (state) => state.adminListing?.candidateList
  );
  const candTotalRecords = useSelector(
    (state) => state.adminListing?.candTotalRecords
  );
  useEffect(() => {
    getCandidateListData(pageNo, pageSize);
  }, []);

  const onClearSearch = async function () {
    setSearchText("");
  };

  let title = "Candidates";
  let icon = companyLogo;
  let columns = [
    {
      name: "Name",
      id: "name",
      selector: (row) => row.firstname + " " + row.lastname,

      sortable: true,
    },

    {
      name: "Email",
      id: "cityname",
      selector: (row) => row.email,
      sortable: true,
    },

    {
      name: "Phone",
      id: "phone",
      selector: (row) =>
        row.phonenumber ? USPhoneNumber(row.phonenumber) : "",
      sortable: true,
    },
    {
      name: "City & State",
      id: "city",
      selector: (row) =>
        (row.cityname ? row.cityname : "") +
        " " +
        (row.statename ? "," + row.statename : ""),
      sortable: true,
    },
    {
      name: "Source",
      id: "source",
      selector: (row) => row.source,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <ButtonGroup>
            {row.status === 0 ? (
              <>
                <Button
                  // outline
                  size="sm"
                  title="Edit candidate"
                  className="btn-icon"
                  color="warning"
                  disabled
                  onClick={(e) => {}}
                >
                  <img src={customerIcons?.list_edit} alt="list approve"></img>
                </Button>

                <Button
                  // outline
                  size="sm"
                  title="Send Invitation"
                  className="btn-icon"
                  color="info"
                  onClick={(e) => {
                    sendEmailInvitation(row.candidateid);
                  }}
                >
                  <FaEnvelope style={{ fontSize: "18px" }} />
                </Button>
              </>
            ) : row.status === 1 ? (
              <>
                <Button
                  // outline
                  size="sm"
                  title="Edit candidate"
                  className="btn-icon"
                  color="warning"
                  disabled
                  onClick={(e) => {}}
                >
                  <img src={customerIcons?.list_edit} alt="list approve"></img>
                </Button>

                <Button
                  // outline
                  size="sm"
                  title="Re-Send Invitation"
                  className="btn-icon"
                  color="info"
                  onClick={(e) => {
                    sendEmailInvitation(row.candidateid);
                  }}
                >
                  <FaEnvelopeOpenText style={{ fontSize: "18px" }} />
                </Button>
              </>
            ) : (
              <></>
            )}
          </ButtonGroup>
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
  const getFilterValue = async (event) => {};

  const getCandidateListData = (pageNo, pageSize) => {
    dispatch(
      adminListingActions.getAdmCandidateList({
        isActive: true,
        pageSize: pageSize,
        pageNumber: pageNo,
      })
    );
  };
  const handlePerRowsChange = async (pagesize) => {
    setPageSize(pagesize);
    getCandidateListData(pageNo, pagesize);
  };
  const handlePageChange = async (page) => {
    setPageNo(page);
    getCandidateListData(page, pageSize);
  };

  const sendEmailInvitation = async (candidateid) => {
    let res = await dispatch(
      adminListingActions.sendEmailInvitation(candidateid)
    );

    if (res?.payload?.statusCode === 201) {
      getCandidateListData(pageNo, pageSize);
      showSweetAlert({
        title: res?.payload?.message
          ? res.payload.message
          : "Email Invitation sent successfully.",
        type: "success",
      });
    } else {
      showSweetAlert({
        title: res?.error?.message
          ? res?.error?.message
          : "Error while sending invitation",
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
                <Col md={12} lg={12} sm={12} style={{ paddingBottom: "1rem" }}>
                  <Button
                    style={{ background: "#2f479b" }}
                    color={"primary"}
                    className="input-group-text float-end mt-1"
                    type="submit"
                    disabled
                    // onClick={(e) => addModal()}
                  >
                    New Candidate
                  </Button>
                  <div
                    className={cx(
                      "candidate-search-wrapper search-wrapper candidate-seacrh-mt float-end",
                      {
                        active: true,
                      }
                    )}
                  >
                    {" "}
                    <div className="input-holder float-end">
                      <input
                        type="text"
                        className="search-input search-placeholder"
                        id="search-input"
                        value={searchData}
                        disabled
                        onInput={(evt) => setSearchText(evt.target.value)}
                        placeholder="Search.."
                      />
                      <button
                        className="btn-close"
                        onClick={(evt) => onClearSearch()}
                      />
                      <button
                        // onClick={(evt) => getCompanyList(pageSize, pageNo)}
                        className="search-icon"
                      >
                        <span />
                      </button>
                    </div>
                  </div>
                </Col>
              </Row>
              <DataTable
                data={candidateList}
                columns={columns}
                pagination
                fixedHeader
                customStyles={customStyles}
                // progressPending={loading}
                responsive
                paginationServer
                paginationTotalRows={candTotalRecords}
                onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
                onChangePage={(e) => handlePageChange(e)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
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
    </>
  );
};
