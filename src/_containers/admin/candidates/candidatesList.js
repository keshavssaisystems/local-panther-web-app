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
import { FaEye } from "react-icons/fa";
import customerIcons from "assets/utils/images/customer";
import DataTable from "react-data-table-component";

export const AdmCandidateList = () => {
  let data = [
    {
      name: "test",
      email: "test@gmail.com",
      phone: "5678999322",
      address: "albama, California",
      Source: "admin",
      status: "",
    },
  ];
  const dispatch = useDispatch();
  const [searchData, setSearchText] = useState("");
  useEffect(() => {
    // dispatch(dropdownActions.getCompanyListThunk());
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
      selector: (row) => row.name,

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
      selector: (row) => row.phone,
      sortable: true,
    },
    {
      name: "City & State",
      id: "city",
      selector: (row) => row.address,
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
            <Button
              // outline
              size="sm"
              title="Edit candidate"
              className="btn-icon"
              color="warning"
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
              onClick={(e) => {}}
            >
              <FaEye style={{ fontSize: "18px" }} />
            </Button>
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
                <Col md={12} lg={12} sm={12}>
                  <Button
                    style={{ background: "#2f479b" }}
                    color={"primary"}
                    className="input-group-text float-end mt-1"
                    type="submit"
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
                data={data}
                columns={columns}
                pagination
                fixedHeader
                customStyles={customStyles}
                // progressPending={loading}
                responsive
                paginationServer
                // paginationTotalRows={totalRecords}
                // onChangeRowsPerPage={(e) => handlePerRowsChange(e)}
                // onChangePage={(e) => handlePageChange(e)}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};
