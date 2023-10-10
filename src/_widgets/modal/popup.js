
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table } from "_widgets";
import Loader from 'react-loaders';

export function Popup({ isOpen, title, columns, data, setIsOpen, scheduledLoading }) {

  return (
    <div>
    <Modal isOpen={isOpen} fade={true} fullscreen={true}>
      <ModalHeader toggle={() => setIsOpen(false)}>{title}</ModalHeader>
      <ModalBody>
        <Table 
          progressPending={scheduledLoading}
          progressComponent={<Loader type="line-scale-pulse-out-rapid" className="d-flex justify-content-center" />}
          columns={columns}
          data={data}
          fixedHeader
          fixedHeaderScrollHeight="610px"
        />
      </ModalBody>
      <ModalFooter>
        {/* <Button color="primary" onClick={toggle}>
          Do Something
        </Button>{' '} */}
        <Button color="secondary" onClick={() => setIsOpen(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  </div>
  );
}
