import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Spinner,
} from "reactstrap";
import { BsPencil, BsTrash3 } from "react-icons/bs";
import { custJobListActions } from "_store";

export const AssignedJobHiringManagerModal = ({ isOpen, toggle, jobId }) => {
  const dispatch = useDispatch();
  const { jobAssigneesHiringManager = [], AHMloading, removeLoading, removeError } =
    useSelector((state) => state.custJobListReducer);
  useEffect(() => {
    if (isOpen && jobId) {
      dispatch(custJobListActions.getAssignedJobHiringManagerList({ jobId }));
    }
  }, [isOpen, jobId, dispatch]);

  const handleRemove = (jobassigneduserid) => {
    dispatch(
      custJobListActions.removeJobHiringManagerAssignment({ jobassigneduserid })
    ).then((result) => {
      if (result.meta.requestStatus === "fulfilled") {
        dispatch(
          custJobListActions.getAssignedJobHiringManagerList({ jobId })
        );
      }
    });
  };

  const getManagerName = (manager) => {
    if (manager.username) return manager.username;
    const full = `${manager.firstname || ""} ${manager.lastname || ""}`.trim();
    return full || "-";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "-";
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${mm}/${dd}/${yyyy}`;
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>Hiring Manager Assigned Job List</ModalHeader>
      <ModalBody>
        {removeError && (
          <div className="alert alert-danger py-2 mb-3" role="alert">
            {removeError}
          </div>
        )}
        {AHMloading ? (
          <div className="text-center py-4">
            <Spinner color="primary" />
          </div>
        ) : !jobAssigneesHiringManager ||
          jobAssigneesHiringManager.length === 0 ? (
          <p className="text-center text-muted py-4">No Data Found</p>
        ) : (
          <div style={{ maxHeight: "300px", overflowY: "auto" }}>
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Assigned Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {jobAssigneesHiringManager.map((manager, index) => (
                <tr key={manager.jobassigneduserid || index}>
                  <input type="hidden" value={manager.jobassigneduserid} />
                  <td>{index + 1}</td>
                  <td>{getManagerName(manager)}</td>
                  <td>{formatDate(manager.createddate)}</td>
                  <td>
                    {manager.isactive === true? (
                      <BsTrash3
                        size={21}
                        disabled={removeLoading}
                        onClick={() => !removeLoading && handleRemove(manager.jobassigneduserid)}
                        title="Remove Job Assignment"
                        style={{
                          color: "red",
                          verticalAlign: "top",
                          cursor: removeLoading ? "not-allowed" : "pointer",
                          opacity: removeLoading ? 0.5 : 1,
                        }}
                      />
                    ) : (
                      <span className="text-muted">Removed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};
