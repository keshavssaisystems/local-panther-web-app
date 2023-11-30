import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  addRole,
  updateRole,
} from "_containers/admin/_redux/adminListing.slice";

import { Form, FormGroup, Label, Row, Col, Button, Input } from "reactstrap";

export const AddEditRole = (props) => {
  const { entity, isAddMode, data, isView } = props;
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [save, setSave] = useState(false);
  const dispatch = useDispatch();
  const rolesList = useSelector((state) => state.adminListing.rolesList);

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const createEntity = async (e) => {
    setSave(true);
    if (role === "") {
      return;
    }
    e.preventDefault();
    let rolesData = {
      userroleid: 0,
      rolename: role,
      description: description,
      isactive: true,
      currentUserId: parseInt(
        JSON.parse(localStorage.getItem("userDetails"))?.UserId
      ),
    };
    let response;
    if (isAddMode) {
      response = await dispatch(addRole(rolesData));
    } else {
      let roleId = data?.userroleid;
      rolesData.userroleid = roleId;
      response = await dispatch(updateRole({ rolesData, roleId }));
    }

    if (response.payload) {
      showSweetAlert({
        title: response.payload.message,
        type: "success",
      });
    } else {
      showSweetAlert({
        title: response.error.message,
        type: "error",
      });
    }
  };

  const handleInputChange = (data, check) => {
    if (check === "role") {
      setRole(data);
    } else {
      setDescription(data);
    }
  };
  const showSweetAlert = ({ title, type }) => {
    let data = { ...showAlert };
    data.title = title;
    data.type = type;
    data.show = true;
    SetShowAlert(data);
  };

  const closeSweetAlert = () => {
    let data = { ...showAlert };
    data.title = "";
    data.type = "";
    data.show = false;
    SetShowAlert(data);
    props.callBack();
  };

  useEffect(() => {
    if (!isAddMode) {
      setRole(data.rolename);
      setDescription(data.description);
    }
  }, []);

  return (
    <>
      <Row>
        <Form>
          <Row>
            <Col md={12}>
              <FormGroup>
                <Label for="role">
                  User role <span style={{ color: "red" }}>* </span>
                </Label>
                {/* <select
                  name="role"
                  placeholder="role"
                  className={`field-input placeholder-text form-control ${
                    save && roleId === 0
                      ? "is-invalid error-text"
                      : "input-text"
                  }`}
                  disabled={isAddMode ? false : true}
                  onInput={(e) => handleInputChange(e.target.value, "role")}
                >
                  <option key={0} value="">
                    {" "}
                    Select role{" "}
                  </option>
                  {rolesList?.length > 0 &&
                    rolesList?.map((options) => (
                      <option
                        selected={options.userroleid === roleId}
                        key={options.userroleid}
                        value={options.userroleid}
                      >
                        {options.rolename}
                      </option>
                    ))}
                </select> */}

                <Input
                  type="text"
                  name="role"
                  placeholder="Enter description"
                  maxLength={50}
                  className={`field-input placeholder-text form-control ${
                    save && role === "" ? "is-invalid error-text" : "input-text"
                  }`}
                  value={role}
                  disabled={true}
                  onInput={(e) => handleInputChange(e.target.value, "role")}
                />

                <div className="invalid-feedback">
                  {save && role === "" ? "Role is required" : ""}
                </div>
              </FormGroup>
            </Col>
            <Col md={12}>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  placeholder="Enter description"
                  maxLength={100}
                  className={`field-input placeholder-text form-control`}
                  value={description}
                  onInput={(e) =>
                    handleInputChange(e.target.value, "description")
                  }
                />
              </FormGroup>
            </Col>
          </Row>

          <Button
            type="button"
            className="mt-3 float-end"
            color="primary"
            onClick={(e) => createEntity(e)}
          >
            {/* disabled={formState.isSubmitting} */}
            {isAddMode ? "Submit" : "Update"}
          </Button>
        </Form>
      </Row>
      <>
        {" "}
        <SweetAlert
          title={showAlert.title}
          show={showAlert.show}
          type={showAlert.type}
          onConfirm={() => closeSweetAlert()}
        />
        {showAlert.description}
      </>
    </>
  );
};
