import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "react-loaders";

import { Col, Row, Card, CardBody } from "reactstrap";

import { getReportDataThunk } from "../_redux/report.slice";
import PageTitle from "../../../_components/common/pagetitle";
import titlelogo from "../../../assets/utils/images/candidate.svg";
import DataTable from "react-data-table-component";
import { NoDataFound } from "_components/common/nodatafound";
import { updateMonthstoYears } from "_helpers/helper";
import { BuildCVModal } from "_components/modal/buildcvmodal";
import "./adminreports.scss";

export function ATSCandidate({ title }) {
  const dispatch = useDispatch();
  let { id: reportId } = useParams();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const { reportData: data = [], loading = false } = useSelector(
    (state) => state?.adminReportReducer ?? {}
  );

  const getReportData = (isClearAll) => {
    let parameter = "";

    dispatch(getReportDataThunk({ reportId, parameter }));
  };

  useEffect(() => {
    getReportData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (data?.length > 0) {
      let filteredData = data.map((rec) => {
        return {
          Candidate: rec?.candidatename,
          Experience: rec.experience
            ? updateMonthstoYears(parseInt(rec.experience))
            : "",
          Skills: typeof rec?.skill === "string" && rec?.skill,
          Education: rec?.education,
          Certification: rec?.certification,
          "Matched Jobs": rec.matchedjobs,
          Address: rec.address,
        };
      });
    }
  }, [data]);

  const columns = [
    {
      name: <span className="table-title">First name</span>,
      cell: (row) => (
        <span className="table-cell" title={row.firstname}>
          {row.firstname}
        </span>
      ),
      sortable: true,
      selector: (row) => row.firstname,
      minWidth: "200px",
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
      minWidth: "200px",
    },

    {
      name: <span className="table-title">Email</span>,
      cell: (row) => (
        <span className="table-cell" title={row.email}>
          {row.email}
        </span>
      ),
      sortable: true,
      selector: (row) => row.email,
      minWidth: "200px",
    },

    {
      name: <span className="table-title">Phone</span>,
      cell: (row) => (
        <span className="table-cell" title={row.phonenumber}>
          {row.phonenumber}
        </span>
      ),
      selector: (row) => row.phonenumber,
      minWidth: "200px",
      sortable: true,
    },
    {
      name: <span className="table-title">City, State</span>,
      cell: (row) => (
        <span className="table-cell" title={row.city + row.state}>
          {row.city + row.state}
        </span>
      ),
      selector: (row) => row.city + ", " + row.state,
      minWidth: "200px",
      sortable: true,
    },

    {
      name: <span className="table-title">Address</span>,
      cell: (row) => (
        <span className="table-cell" title={row.address}>
          {row.address}
        </span>
      ),
      selector: (row) => row.address,
      minWidth: "200px",
      sortable: true,
    },

    {
      name: <span className="table-title">Ready to work immediately</span>,
      cell: (row) => (
        <span className="table-cell" title={row.isreadytoworkimmediately}>
          {row.isreadytoworkimmediately}
        </span>
      ),
      selector: (row) => row.isreadytoworkimmediately,
      minWidth: "200px",
      sortable: true,
    },
  ];

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
                      className="admin-list-view"
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
      <>
        {showProfileModal ? (
          <>
            <BuildCVModal
              isOpen={showProfileModal}
              onClose={() => setShowProfileModal(false)}
            />
          </>
        ) : (
          <></>
        )}
      </>
    </>
  );
}
