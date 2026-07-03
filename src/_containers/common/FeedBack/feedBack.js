import React, { useState } from "react";
import PageTitle from "_components/common/pagetitle";
import DataTable from "react-data-table-component";
import {
  Row,
  Col,
  Card,
  CardBody,
  Button,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faReply } from "@fortawesome/free-solid-svg-icons";
import AddFeedbackModal from "./AddFeedbackModal";
import AddResponseModal from "./AddResponseModal";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { feedbackActions } from "./feedback.slice";
import { AttachmentModal } from "./AttachmentModal";

const FeedBack = () => {
  
  const [showAddFeedback, setShowAddFeedback] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedResponseRow, setSelectedResponseRow] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openDocumentModal, setOpenDocumentModal] = useState(false);
  const [documentUrl, setDocumentUrl] = useState("");

  const dispatch = useDispatch();
  const { feedback_data_profile, loading,totalRows } = useSelector((state) => state.feedback);
  const selectedHiringManagerId = useSelector((state) => state.auth.selectedHiringManagerId);
  
  const userroleid = localStorage.getItem("userroleid");
   
  useEffect(() => {
    dispatch(
        feedbackActions.getFeedbackListThunk({
        pageNumber: page,
        pageSize: pageSize,
        userroleid: userroleid,
        })
    );
  }, [dispatch, page, pageSize, selectedHiringManagerId]);


  const columns = [
  {
    name: "Subject",
    cell: (row) => (
      <span title={row.subject}>
        {row.subject?.length > 50
          ? row.subject.substring(0, 50) + "..."
          : row.subject}
      </span>
    ),
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
        <span
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          onClick={() => {
            setDocumentUrl(row.fileurl);
            setOpenDocumentModal(true);
          }}
        >
          View File
        </span>
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
    cell: (row) => (
      <span title={row.response}>
        {row.response?.length > 50
          ? row.response.substring(0, 50) + "..."
          : row.response || ""}
      </span>
    ),
  },
  {
    name: "Response File",
    cell: (row) =>
      row.responsefileurl ? (
        <span
          style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
          onClick={() => {
            setDocumentUrl(row.responsefileurl);
            setOpenDocumentModal(true);
          }}
        >
          View File
        </span>
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

  if (userroleid === "1") {
    columns.splice(0, 0,
      {
        name: "Name",
        selector: (row) => row.submittername || "",
        cell: (row) => <span title={row.submittername}>{row.submittername || "-"}</span>,
      },
      {
        name: "Email",
        selector: (row) => row.submitteremail || "",
        cell: (row) => <span title={row.submitteremail}>{row.submitteremail || "-"}</span>,
      }
    );
    columns.push({
      name: "Add Response",
      cell: (row) => (
        <button
          title="Add Response"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#2f479b",
            fontSize: "16px",
            padding: "4px 8px",
          }}
          onClick={() => {
            setSelectedResponseRow(row);
            setShowResponseModal(true);
          }}
        >
          <FontAwesomeIcon icon={faReply} />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    });
  }

 
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
                {userroleid != "1" && (
                <Col md="12">
                <Button
                     style={{
                              background: "#2f479b",
                              borderColor: "#545cd8",
                             }}
                              className="input-group-text float-end mt-1"
                               onClick={() => setShowAddFeedback(true)}
                > Add Feedback
                </Button>
                </Col>)}
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

      <AddResponseModal
        isOpen={showResponseModal}
        toggle={() => {
          setShowResponseModal(false);
          setSelectedResponseRow(null);
        }}
        page={page}
        pageSize={pageSize}
        selectedRow={selectedResponseRow}
      />

      {openDocumentModal && (
        <AttachmentModal
          isOpen={openDocumentModal}
          onClose={() => setOpenDocumentModal(false)}
          url={documentUrl}
        />
      )}
    </div>
  );
};

export default FeedBack;