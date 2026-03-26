import React, { useState } from "react";
import PageTitle from "_components/common/pagetitle";
import DataTable from "react-data-table-component";
import {
  Row,
  Col,
  Card,
  CardBody,
  FormGroup,
  Input,
  Button,
} from "reactstrap";
import AddFeedbackModal from "./AddFeedbackModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { feedbackActions } from "./feedback.slice";

const FeedBack = () => {
  
  const [searchData, setSearchText] = useState("");
  const [status, setStatus] = useState(0);
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const dispatch = useDispatch();
  const { feedback_data_profile, loading,totalRows } = useSelector((state) => state.feedback);

   
  useEffect(() => {
    dispatch(
        feedbackActions.getFeedbackListThunk({
        pageNumber: page,
        pageSize: pageSize,
        })
    );
  }, [page, pageSize]);


  const columns = [
  {
    name: "Subject",
    selector: (row) => row.subject,
  },
  {
    name: "Feedback",
    cell: (row) => (
        <span title={row.feedback}>
        {row.feedback?.length > 50
            ? row.feedback.substring(0, 50) + "..."
            : row.feedback}
        </span>
        ),
  },
  {
    name: "Attachment",
    cell: (row) =>
      row.fileurl ? (
        <a href={row.fileurl} target="_blank" rel="noreferrer">
          View File
        </a>
      ) : (
        ""
      ),
  },
  {
    name: "Status",
    selector: (row) => row.feedbackstatusname,
  },

  {
    name: "Response",
    selector: (row) => row.response || "",
  },
  {
    name: "Response File",
    cell: (row) =>
      row.responsefileurl ? (
        <a href={row.responsefileurl} target="_blank" rel="noreferrer">
          View File
        </a>
      ) : (
        ""
      ),
  },
  {
    name: "Created Date",
    selector: (row) =>
      new Date(row.createddate).toLocaleDateString(),
  },
];

 
  return (
    <div>
      <Row>
        <Col md="12">
          <PageTitle heading="Feedback List" />
        </Col>

        <Col md="12">
          <Card className="mb-3">
            <CardBody>

              
              <Row className="mb-3">
                <Col md="12">
                <Button
                     style={{
                              background: "#2f479b",
                              borderColor: "#545cd8",
                             }}
                              className="input-group-text float-end mt-1"
                               onClick={() => setShowAddFeedback(true)}
                > Add FeedBack
                </Button>
                </Col>
              </Row>

              <div className="table-scroll-wrapper">
                <DataTable
                  columns={columns}
                  data={feedback_data_profile}
                  pagination
                  paginationServer
                  paginationTotalRows={totalRows}
                  onChangePage={(page) => setPage(page)}
                  onChangeRowsPerPage={(newPerPage) => {
                    setPageSize(newPerPage);
                    setPage(1); // reset to first page
                  }}
                  progressPending={loading}
                />
              </div>

            </CardBody>
          </Card>
        </Col>
      </Row>

      <AddFeedbackModal
        isOpen={showAddFeedback}
        toggle={() => setShowAddFeedback(false)}
        page={page}             
        pageSize={pageSize}
      />
    </div>
  );
};

export default FeedBack;