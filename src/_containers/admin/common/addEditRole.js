import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import {
  addRole,
  updateRole,
} from "_containers/admin/_redux/adminListing.slice";

import { Form, FormGroup, Label, Row, Col, Button, Input } from "reactstrap";

import TreeView from "react-treeview";

export const AddEditRole = (props) => {
  const { entity, isAddMode, data, isView } = props;
  const userId = data?.userId;
  const [roleId, setRoleId] = useState(0);
  const [description, setDescription] = useState("");
  const [save, setSave] = useState(false);
  const dispatch = useDispatch();
  const rolesList = useSelector((state) => state.adminListing.rolesList);
  useEffect(() => {}, []);

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const createEntity = async (e) => {
    setSave(true);
    if (roleId === 0) {
      return;
    }
    e.preventDefault();
    let rolesData = {
      userroleid: roleId,
      rolename: rolesList?.find((x) => x.userroleid === roleId)?.rolename,
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
      setRoleId(parseInt(data));
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

  const onSubmit = (data) => {
    return createEntity(data);
  };

  useEffect(() => {
    if (!isAddMode) {
      setRoleId(data.userroleid);
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
                <select
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
                </select>
                <div className="invalid-feedback">
                  {save && roleId === 0 ? "Role is required" : ""}
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
                  className={`field-input placeholder-text form-control`}
                  // className={`field-input placeholder-text form-control ${
                  //   errors?.menuid && roleId === 0
                  //     ? "is-invalid error-text"
                  //     : "input-text"
                  // }`}
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
