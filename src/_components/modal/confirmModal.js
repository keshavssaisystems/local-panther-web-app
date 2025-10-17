import React from "react";
import { Modal, Button, Row, Col, Card, CardBody } from "reactstrap";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "Do you want to continue?",
  icon,
  confirmText = "YES",
  cancelText = "NO",
  onConfirm,
  onCancel
}) => {
  return (
    <Modal
      className=""
    //   size="md"
      isOpen={isOpen}
      
      backdrop={true}
      fade={true}
    >
      <Card >
        <CardBody className="text-center p-4">
          {icon && (
            <div className="d-flex justify-content-center mb-3">
              <img
                src={icon}
                alt="modal-icon"
                className="img-fluid"
                style={{ maxWidth: "80px", height: "auto" }}
              />
            </div>
          )}

          <h5 className="fw-bold mb-2">{title}</h5>
          <p className="text-muted mb-4">{message}</p>

          <Row>
            <Col className="d-flex justify-content-center flex-wrap gap-2">
              <Button
                style={{
                  backgroundColor: "#2f479b",
                  borderColor: "#2f479b",
                  minWidth: "100px"
                }}
                className="fw-semibold"
                onClick={onConfirm}
              >
                {confirmText}
              </Button>
              <Button
                style={{
                  backgroundColor: "#2f2e2e",
                  borderColor: "#2f2e2e",
                  minWidth: "100px"
                }}
                className="fw-semibold"
                onClick={onCancel}
              >
                {cancelText}
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Modal>
  );
};

export default ConfirmModal;
