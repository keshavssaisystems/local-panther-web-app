import React from "react";
import {
  Modal,
  Button,
  Row,
  Col,
  Card,
  CardBody
} from "reactstrap";

const ConfirmModal = ({
  isOpen,
  title = "Confirm action",
  message,
  icon,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      isOpen={isOpen}
      backdrop="static"   // prevent accidental close
      keyboard={true}     // ESC closes
    >
      <Card>
        <CardBody className="p-4">

          {/* Header */}
          <div className="d-flex align-items-start mb-3">
            {icon && (
              <img
                src={icon}
                alt="info"
                style={{ width: 20, marginRight: 12 }}
              />
            )}
            <h5 className="fw-bold mb-0">{title}</h5>
          </div>

          {/* Body */}
          <div className="text-muted mb-4">
            {typeof message === "string" ? <p>{message}</p> : message}
          </div>

          {/* Footer */}
          <Row className="justify-content-end">
            <Col className="d-flex justify-content-end gap-2">
              <Button
                // outline
                color="secondary"
                style={{ minWidth: 120 }}
                onClick={onCancel}
              >
                {cancelText}
              </Button>

              <Button
                style={{
                  backgroundColor: "#2f479b",
                  borderColor: "#2f479b",
                  minWidth: 160
                }}
                className="fw-semibold"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
            </Col>
          </Row>

        </CardBody>
      </Card>
    </Modal>
  );
};

export default ConfirmModal;
