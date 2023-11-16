import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import axios from "axios";
import {
  addRole,
  updateRole,
} from "_containers/admin/_redux/adminListing.slice";
// import { getState } from '_store/dropdownstate.slice'

import {
  Form,
  FormGroup,
  Label,
  Row,
  Col,
  FormText,
  Button,
  Input,
  Collapse,
} from "reactstrap";
import { async } from "q";

export const AddEditRole = (props) => {
  const { entity, isAddMode, data } = props;
  const userId = data?.userId;
  const [roleId, setRoleId] = useState(0);
  const [menuId, setMenuId] = useState(0);
  const dispatch = useDispatch();
  const { companyDropdownData } = useSelector(
    (state) => state?.addCustomer ?? {}
  );
  const rolesList = useSelector((state) => state.adminListing.rolesList);
  const menuList = useSelector((state) => state.adminListing.menuList);

  const [showAlert, SetShowAlert] = useState({
    show: false,
    type: "success",
    title: "",
    description: "",
  });

  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  const validationSchema = Yup.object().shape({
    // description: Yup.string().required("Description is required").max(500),
    menuid: Yup.string().required("Menu is required"),
    roleid: Yup.string().required("User role is required"),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, setValue, getValues, formState } =
    useForm(formOptions);
  const { errors, isSubmitting } = formState;

  const createEntity = async (payload) => {
    let rolesData = {
      userroleid: payload.roleid,
      rolename: rolesList?.find(
        (x) => x.userroleid === parseInt(payload.roleid)
      )?.rolename,
      description: payload.description,
      isactive: true,
      currentUserId: JSON.parse(localStorage.getItem("userDetails"))?.UserId,
    };
    let response;
    if (isAddMode) {
      response = await dispatch(addRole(rolesData));
    } else {
      let id = rolesData.userroleid;
      response = await dispatch(updateRole({ rolesData, id }));
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
  function updateEntity(customerId, data) {
    // update entity here
  }

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
      setValue("roleid", data["userroleid"]);
      setRoleId(data["userroleid"]);

      setValue("menuid", data["menuid"]);
      setMenuId(data["menuid"]);
    }
  }, []);

  const selectMenu = (data) => {
    setValue("menuid", data);
    setMenuId(data);
  };

  const onCheckboxChange = (data) => {};

  return (
    <>
      <Row>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row>
            <Col md={4}>
              <FormGroup>
                <Label for="role">
                  User role <span style={{ color: "red" }}>* </span>
                </Label>
                <select
                  name="role"
                  placeholder="role"
                  className={`field-input placeholder-text form-control ${
                    errors?.roleid && roleId === 0
                      ? "is-invalid error-text"
                      : "input-text"
                  }`}
                  {...register("roleid")}
                  disabled={true}
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
                  {errors?.roleid && roleId === 0?.message}
                </div>
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="role">
                  Menu <span style={{ color: "red" }}>* </span>
                </Label>
                <select
                  name="role"
                  placeholder="role"
                  className={`field-input placeholder-text form-control ${
                    errors?.menuid && roleId === 0
                      ? "is-invalid error-text"
                      : "input-text"
                  }`}
                  {...register("menuid")}
                  onChange={(evt) => selectMenu(evt.target.value)}
                >
                  <option key={0} value="">
                    {" "}
                    Select role{" "}
                  </option>
                  {menuList?.length > 0 &&
                    menuList?.map((options) => (
                      <option
                        selected={options.menuid === menuId}
                        key={options.menuid}
                        value={options.menuid}
                      >
                        {options.menuname}
                      </option>
                    ))}
                </select>
                <div className="invalid-feedback">
                  {errors?.menuid && menuId === 0?.message}
                </div>
              </FormGroup>
            </Col>
          </Row>
          {/* <Row>
            <div>
              {menuList?.lenght >
                0?.map((item, index) => (
                  <div>
                    <Input
                      type="checkbox"
                      id={item.menuid}
                      label={item.menuname}
                      checked={item.checked}
                      onChange={() => onCheckboxChange(item.menuid)}
                    />

                    <button onClick={() => toggleCollapse()}>
                      {isOpen ? "Collapse" : "Expand"}
                    </button>
                    <Collapse isOpen={isOpen}>
                      {item.submenu.map((childNode) => (
                        <Input
                          type="checkbox"
                          id={childNode.menuid}
                          label={childNode.menuname}
                          checked={childNode.checked}
                          onChange={() => onCheckboxChange(childNode.menuid)}
                        />
                      ))}
                    </Collapse>
                  </div>
                ))}
            </div>
          </Row> */}
          {/* <Row>
            <Col>
              <FormGroup>
                <Label for="prefix">
                  Description <span style={{ color: "red" }}>* </span>
                </Label>
                <Input
                  style={{ height: "100px" }}
                  placeholder="Enter description"
                  name="description"
                  type="textarea"
                  id="description"
                  maxLength={500}
                  className="field-input placeholder-text form-control"
                  {...register("description")}
                  onInput={(e) => handleInputChange(e.target.value)}
                />
                <span className="dropdown-placeholder float-end">
                  {getValues("description")
                    ? getValues("description").length
                    : 0}
                  /500
                </span>
                <div className="invalid-feedback">
                  {errors?.description?.message}
                </div>
              </FormGroup>
            </Col>
          </Row> */}

          <Button type="submit" color="primary">
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
