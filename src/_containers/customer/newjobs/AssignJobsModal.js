import React, { useState, useMemo } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Label,
  Spinner,
} from "reactstrap";

export const AssignJobsModal = ({
  isOpen,
  onClose,
  selectedJobs = [],
  onAssign,
  isLoading,
  hiringManagers = [],
}) => {
  const [selectedHiringManagers, setSelectedHiringManagers] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Filter managers based on search
  const filteredManagers = useMemo(() => {
    return hiringManagers.filter((manager) =>
      manager.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, hiringManagers]);

  const handleCheckboxChange = (managerId) => {
    setSelectedHiringManagers((prev) =>
      prev.includes(managerId)
        ? prev.filter((id) => id !== managerId)
        : [...prev, managerId]
    );
  };

  const handleSelectAll = () => {
    if (selectedHiringManagers.length === filteredManagers.length) {
      setSelectedHiringManagers([]);
    } else {
      setSelectedHiringManagers(filteredManagers.map((m) => m.id));
    }
  };

  const handleAssign = () => {
    if (selectedHiringManagers.length === 0) {
      setError("Please select at least one hiring manager.");
      return;
    }

    setError("");
    onAssign(selectedJobs, selectedHiringManagers);
    
  };

  const handleClose = () => {
    setSelectedHiringManagers([]);
    setSearch("");
    setError("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="md" centered>
      <ModalHeader toggle={handleClose}>
        Assign Jobs to Hiring Managers
      </ModalHeader>

      <ModalBody>
        {/* Search */}
        <FormGroup>
          <Input
            type="text"
            placeholder="Search hiring manager..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={isLoading}
          />
        </FormGroup>

        {/* Select All */}
        {filteredManagers.length > 0 && (
          <div className="mb-2">
            <Label style={{ cursor: "pointer" }}>
              <Input
                type="checkbox"
                checked={
                  selectedHiringManagers.length ===
                  filteredManagers.length
                }
                onChange={handleSelectAll}
                disabled={isLoading}
              />{" "}
              Select All
            </Label>
          </div>
        )}

        {/* Scrollable List */}
        <div
          style={{
            maxHeight: "250px",
            minHeight: "200px",
            overflowY: "auto",
            border: "1px solid #dee2e6",
            borderRadius: "6px",
            padding: "10px",
          }}
        >
          {filteredManagers.length > 0 ? (
            filteredManagers.map((manager) => (
              <div key={manager.id} className="mb-2">
                <Label style={{ cursor: "pointer", width: "100%" }}>
                  <Input
                    type="checkbox"
                    checked={selectedHiringManagers.includes(manager.id)}
                    onChange={() => handleCheckboxChange(manager.id)}
                    disabled={isLoading}
                  />{" "}
                  {manager.name}
                </Label>
              </div>
            ))
          ) : (
            <div className="text-muted text-center">
              No hiring managers found
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-danger mt-2" style={{ fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        {/* Summary */}
            {/* <div className="mt-3 text-muted" style={{ fontSize: "0.9rem" }}>
            <strong>{selectedJobs?.length || 0}</strong> job(s) selected •{" "}
            <strong>{selectedHiringManagers.length}</strong> manager(s) selected
            </div> */}
      </ModalBody>

      <ModalFooter>
        <Button color="secondary" onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>

        <Button
          color="primary"
          onClick={handleAssign}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner size="sm" /> Assigning...
            </>
          ) : (
            "Assign"
          )}
        </Button>
      </ModalFooter>
    </Modal>
  );
};