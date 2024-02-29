import React from "react";
import { Modal, ModalBody, Button } from "reactstrap";
import paymentIcons from "assets/utils/images/payment";
import { history } from "_helpers";
export const BillDetailRemModal = (props) => {
  const onRedirectPage = () => {
    let userId = localStorage.getItem("userDetails")
      ? Number(JSON.parse(localStorage.getItem("userDetails")).InternalUserId)
      : 0;
    history.navigate("/payment/" + userId);
    props.onClose();
  };
  return (
    <Modal
      size="lg"
      toggle={() => props.onClose()}
      isOpen={props.isOpen}
      backdrop={true}
      fade={true}
      style={{ minWidth: "300px", maxWidth: "450px" }}
    >
      {/* <ModalHeader toggle={() => props.onClose()}>
        Billing Details Reminder
      </ModalHeader> */}
      <ModalBody style={{ maxHeight: "60vh", overflow: "auto" }}>
        <div style={{ textAlign: "center" }} className="pt-4 pb-4">
          <img src={paymentIcons.info} alt="infomation" />
        </div>
        <div>
          Unlock the power of our advanced AI matching system. Add your billing
          details to access the best candidate matches for your job
          opportunities. This feature requires updated billing information.
        </div>
        <div style={{ textAlign: "center" }} className="pt-4 pb-4">
          <Button
            color="link"
            style={{ textDecoration: "underline" }}
            onClick={() => props.onClose()}
          >
            Remind me later
          </Button>
          <Button color="primary" onClick={() => onRedirectPage()}>
            Update
          </Button>
        </div>
      </ModalBody>
      {/* <ModalFooter>
        <Button color="link" onClick={() => props.onClose()}>
          Remind me later
        </Button>
        <Button color="primary" onClick={() => props.onClose()}>
          Update
        </Button>
      </ModalFooter> */}
    </Modal>
  );
};
