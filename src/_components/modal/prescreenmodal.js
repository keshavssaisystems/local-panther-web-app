import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Col,
  Button,
  Label,
  Input,
  FormText,
} from "reactstrap";
import "./prescreen.scss";

export const PrescreenModal = (props) => {
  const [formData, setFormData] = useState([]);

  useEffect(() => {
    if (props?.data?.length > 0) {
      setFormData(JSON.parse(JSON.stringify(props?.data)));
    }
  }, [props.data]);
  const onSaveForm = () => {
    let data = [...formData];
    let invalid = false;
    let newData = data.map((x) => {
      if (x.answer === "") {
        invalid = true;
        x.error = true;
      } else {
        x.error = false;
      }
      return x;
    });
    setFormData(newData);
    if (invalid) {
      //do nothing
    } else if (!invalid && newData?.length > 0) {
      props.sendFormData(newData);
    }
  };

  const onInputUpdate = (e, index) => {
    let data = [...formData];
    data[index]["answer"] = e.target.value;
    data[index].error = e.target.value === "";
    setFormData(data);
  };

  return (
    <Modal
      toggle={() => props.onClose()}
      className="modal-reject-align prescreen-modal"
      isOpen={props.isOpen}
      backdrop="fade"
    >
      <ModalHeader toggle={() => props.onClose()}>
        <h3>
          <b>Pre-screen</b>
        </h3>
      </ModalHeader>
      <ModalBody style={{ maxHeight: "75vh", overflow: "auto" }}>
        {props.preScreenType === "pending" ? (
          <>
            {formData.length > 0 ? (
              <>
                {formData.map((data, index) => {
                  return (
                    <Row key={data.prescreenquestion}>
                      <Label>
                        <b className="modal-title">{data.prescreenquestion}</b>
                      </Label>
                      {data.iscustomquestion ? (
                        <>
                          <Label>
                            <Input
                              type="text"
                              value={data.answer}
                              onChange={(e) => onInputUpdate(e, index)}
                              invalid={data.error}
                            />
                          </Label>
                          {data.error ? (
                            <FormText color="danger">
                              Please provide answer
                            </FormText>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <Row sm={2} md={2} lg={2} xl={2}>
                          <Col sm={4} md={4} lg={2} xl={2}>
                            <Label check>
                              <Input
                                checked={data.answer === "Yes"}
                                type="radio"
                                value={"Yes"}
                                onChange={(e) => onInputUpdate(e, index)}
                              />{" "}
                              Yes
                            </Label>{" "}
                          </Col>
                          <Col>
                            <Label>
                              <Input
                                checked={data.answer === "No"}
                                type="radio"
                                value={"No"}
                                onChange={(e) => onInputUpdate(e, index)}
                              />{" "}
                              No
                            </Label>
                          </Col>
                          {data.error ? (
                            <FormText color="danger">
                              Please select answer
                            </FormText>
                          ) : (
                            <></>
                          )}
                        </Row>
                      )}
                    </Row>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </>
        ) : (
          <>
            {" "}
            {formData.length > 0 ? (
              <>
                {formData.map((data, index) => {
                  return (
                    <Row key={data.prescreenquestion}>
                      <Label>
                        <b className="modal-title">{data.prescreenquestion}</b>
                      </Label>
                      <Label>
                        <div
                          className="mb-2 me-2 badge bg-light modal-badge"
                          style={{ textTransform: "unset" }}
                        >
                          {data.answer}
                        </div>
                      </Label>
                    </Row>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </>
        )}
      </ModalBody>
      <ModalFooter>
        {props.preScreenType === "pending" ? (
          <Button color="primary" onClick={() => onSaveForm()}>
            Save
          </Button>
        ) : (
          <>
            {" "}
            <Button color="primary" onClick={() => props.onClose()}>
              Close
            </Button>
          </>
        )}
      </ModalFooter>
    </Modal>
  );
};
