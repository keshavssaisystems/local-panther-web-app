
import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Table } from "_widgets";


export function Popup({ isOpen, title, columns, data, setIsOpen }) {

  return (
    <div>
    <Modal isOpen={isOpen} fade={true} fullscreen={true}>
      <ModalHeader toggle={() => setIsOpen(false)}>{title}</ModalHeader>
      <ModalBody>
        <Table 
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
