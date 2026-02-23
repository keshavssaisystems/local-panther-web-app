import React, { useState } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  FormGroup,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

export const AssignJobsModal = ({
  isOpen,
  onClose,
  selectedJobs,
  onAssign,
  isLoading,
  hiringManagers = [],
}) => {
  const [selectedHiringManagers, setSelectedHiringManagers] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (managerId) => {
    setSelectedHiringManagers((prevSelected) => {
      if (prevSelected.includes(managerId)) {
        return prevSelected.filter((id) => id !== managerId);
      } else {
        return [...prevSelected, managerId];
      }
    });
  };

  const handleAssign = () => {
    if (selectedHiringManagers.length === 0) {
      alert("Please select at least one hiring manager");
      return;
    }
    onAssign(selectedJobs, selectedHiringManagers);
    setSelectedHiringManagers([]);
  };

  const handleClose = () => {
    setSelectedHiringManagers([]);
    setDropdownOpen(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="md" centered>
      <ModalHeader toggle={handleClose} style={{ borderBottom: "1px solid #dee2e6" }}>
        Assign Jobs To
      </ModalHeader>
      <ModalBody style={{ padding: "20px" }}>
        <FormGroup>
          <Label style={{ fontWeight: 600, marginBottom: "12px", display: "block" }}>
            Hiring Manager
          </Label>
          <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
            <DropdownToggle
              caret
              style={{
                borderColor: "#0D6EFD",
                borderRadius: "4px",
                padding: "8px 12px",
                backgroundColor: "#fff",
                color: "#000",
                border: "1px solid #0D6EFD",
                width: "100%",
                textAlign: "left",
              }}
            >
              {selectedHiringManagers.length === 0
                ? "-- Select Hiring Managers --"
                : `${selectedHiringManagers.length} selected`}
            </DropdownToggle>
            <DropdownMenu
              style={{
                width: "100%",
                maxHeight: "250px",
                overflowY: "auto",
                borderRadius: "4px",
                border: "1px solid #0D6EFD",
              }}
            >
              {hiringManagers && hiringManagers.length > 0 ? (
                hiringManagers.map((manager) => (
                  <DropdownItem key={manager.id} toggle={false}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Input
                        type="checkbox"
                        id={`manager-${manager.id}`}
                        checked={selectedHiringManagers.includes(manager.id)}
                        onChange={() => handleCheckboxChange(manager.id)}
                        style={{ marginRight: "8px", cursor: "pointer" }}
                      />
                      <Label
                        for={`manager-${manager.id}`}
                        style={{ marginBottom: "0", cursor: "pointer", flex: 1 }}
                      >
                        {manager.name}
                      </Label>
                    </div>
                  </DropdownItem>
                ))
              ) : (
                <DropdownItem disabled>No hiring managers available</DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        </FormGroup>
        <div style={{ marginTop: "16px", fontSize: "0.9rem", color: "#666" }}>
          <strong>Selected Jobs:</strong> {selectedJobs.length} job(s) selected
        </div>
        <div style={{ marginTop: "8px", fontSize: "0.9rem", color: "#0D6EFD" }}>
          <strong>Selected Hiring Managers:</strong> {selectedHiringManagers.length}
        </div>
      </ModalBody>
      <ModalFooter style={{ borderTop: "1px solid #dee2e6", paddingTop: "16px" }}>
        <Button
          color="secondary"
          onClick={handleClose}
          style={{
            backgroundColor: "#6C757D",
            borderColor: "#6C757D",
            borderRadius: "4px",
          }}
          disabled={isLoading}
        >
          Close
        </Button>
        <Button
          color="primary"
          onClick={handleAssign}
          style={{
            backgroundColor: "#2F479B",
            borderColor: "#0D6EFD",
            borderRadius: "4px",
            border: "1px solid #0D6EFD",
          }}
          disabled={isLoading || selectedHiringManagers.length === 0}
        >
          {isLoading ? "Assigning..." : "Assign"}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
