import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import SweetAlert from "react-bootstrap-sweetalert";
import MetisMenu from "react-metismenu";
import {
  addRole,
  updateMenuMapping,
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
  CardFooter,
  ModalFooter,
} from "reactstrap";

export const AddEditMenuMapping = (props) => {
  const { entity, isAddMode, data, isView } = props;
  const userId = data?.userId;
  const [roleId, setRoleId] = useState(0);
  const [menuId, setMenuId] = useState(0);
  const dispatch = useDispatch();
  const { companyDropdownData } = useSelector(
    (state) => state?.addCustomer ?? {}
  );
  const rolesList = useSelector((state) => state.adminListing.rolesList);
  const menuList_temp = useSelector((state) => state.adminListing.menuList);
  const [menuList, setMenuList] = useState([]);
  useEffect(() => {
    if (menuList_temp) {
      let filtered_data = menuList_temp?.roleMenuMappingList?.map(
        ({ ...rest }) => {
          return {
            userrolemenuid: rest.userrolemenuid,
            userroleid: rest.userroleid,
            userrolename: rest.userrolename,
            menuid: rest.menuid,
            menuname: rest.menuname,
            submenuid: rest.submenuid,
            submenuname: rest.submenuname,
            isview: rest.isview,
            isadd: rest.isadd,
            isedit: rest.isedit,
            isdelete: rest.isdelete,
            isactive: rest.isactive,
            currentUserId: JSON.parse(localStorage.getItem("userDetails"))
              ?.UserId,
            collapsed: rest.subMenuList?.length > 0 ? true : false,

            subMenuList: rest.subMenuList.map(({ ...item }) => {
              return {
                collapsed: true,
                submenuid: item.submenuid,
                submenuname: item.submenuname,
                description: item.description,
                menuicon: item.menuicon,
                modulename: item.modulename,
                path: item.path,
                menuid: item.menuid,
                isactive: item.isactive,
                currentUserId: JSON.parse(localStorage.getItem("userDetails"))
                  ?.UserId,
              };
            }),
          };
        }
      );

      setMenuList(filtered_data);
    }
  }, [menuList_temp]);

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
    roleid: Yup.string(),
  });

  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit, reset, setValue, getValues, formState } =
    useForm(formOptions);
  const { errors, isSubmitting } = formState;

  const createEntity = async (e) => {
    e.preventDefault();

    let rolesData = [];
    menuList?.map(({ ...rest }) => {
      if (rest.subMenuList.length === 0) {
        rolesData.push({
          userrolemenuid: rest.userrolemenuid,
          userroleid: rest.userroleid,
          submenuid: 0,
          menuid: rest.menuid,
          isview: true,
          isadd: true,
          isedit: true,
          isdelete: true,
          isactive: rest.isactive,
          currentUserId: parseInt(
            JSON.parse(localStorage.getItem("userDetails"))?.UserId
          ),
          subMenuList: [],
        });
      } else {
        const isKeyTrueForAll = rest.subMenuList.some(
          (item) => item["isactive"] === true
        );
        if (isKeyTrueForAll) {
          rolesData.push({
            userrolemenuid: rest.userrolemenuid,
            userroleid: rest.userroleid,
            submenuid: 0,
            menuid: rest.menuid,
            isview: true,
            isadd: true,
            isedit: true,
            isdelete: true,
            isactive: true,
            currentUserId: parseInt(
              JSON.parse(localStorage.getItem("userDetails"))?.UserId
            ),
            subMenuList: [],
          });
        }

        rest.subMenuList.map(({ ...subMenuItem }) => {
          rolesData.push({
            userrolemenuid: rest.userrolemenuid,
            userroleid: rest.userroleid,
            menuid: rest.menuid,
            submenuid: subMenuItem.submenuid,
            isview: true,
            isadd: true,
            isedit: true,
            isdelete: true,
            isactive: subMenuItem.isactive,
            currentUserId: parseInt(
              JSON.parse(localStorage.getItem("userDetails"))?.UserId
            ),
            subMenuList: [],
          });
        });
      }
    });

    let response;

    let id = rolesData[0].userroleid;
    response = await dispatch(updateMenuMapping({ rolesData, id }));

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

  const toggleCustom = (index) => {
    let menuData = [...menuList];
    menuData[index].collapsed = !menuData[index].collapsed;
    setMenuList(menuData);
  };

  const handleMenuSelect = (check, index, menuIndex) => {
    let menuData = [...menuList];
    if (check === "menu") {
      menuData[index].isactive = !menuData[index].isactive;
      if (menuData[index].isactive) {
        menuData[index].subMenuList.map(
          (item, childIndex) => (item.isactive = true)
        );
      } else {
        menuData[index].subMenuList.map(
          (item, childIndex) => (item.isactive = false)
        );
      }
    } else {
      menuData[menuIndex].subMenuList[index].isactive =
        !menuData[menuIndex].subMenuList[index].isactive;

      const keyToCheck = "isactive";

      const isKeyTrueForAll = menuData[menuIndex].subMenuList.some(
        (item) => item[keyToCheck] === true
      );
      if (isKeyTrueForAll) {
        menuData[menuIndex].isactive = true;
      } else {
        menuData[menuIndex].isactive = false;
      }
    }
    setMenuList(menuData);
  };

  return (
    <>
      <Row>
        <Form>
          <Row>
            <Col>
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
            {/* <Col md={4}>
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
            </Col> */}
          </Row>
          <Row>
            <Col className={isView ? "disabled-col" : ""}>
              <Label for="role">
                Menus <span style={{ color: "red" }}>* </span>
              </Label>
              {menuList?.length > 0 ? (
                <div>
                  {menuList.map((item, index) => (
                    <div>
                      <div>
                        <label
                          class="form-check-label form-label"
                          for="checkbox2"
                          style={{ marginLeft: "20px" }}
                        >
                          <i
                            className={
                              !item.collapsed
                                ? "pe-7s-angle-right arrow"
                                : "pe-7s-angle-down arrow"
                            }
                            onClick={() => toggleCustom(index)}
                          />
                          <input
                            type="checkbox"
                            class="form-check-input me-1"
                            checked={item.isactive}
                            onClick={() => handleMenuSelect("menu", index, "")}
                          />{" "}
                          {item.menuname}
                        </label>
                      </div>

                      <Collapse
                        isOpen={item.collapsed}
                        data-parent="#exampleAccordion"
                        id="exampleAccordion1"
                      >
                        {item.subMenuList.map((child, childIndex) => (
                          <div style={{ paddingLeft: "20px" }}>
                            <Input
                              type="checkbox"
                              className="m-2"
                              checked={child.isactive}
                              onClick={() =>
                                handleMenuSelect("submenu", childIndex, index)
                              }
                            >
                              {" "}
                            </Input>
                            <Label className="mt-1">{child.submenuname}</Label>
                            <br />
                          </div>
                        ))}
                      </Collapse>
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </Col>

            {/* <CheckboxTree nodes={menuList} /> */}
          </Row>
          {!isView && (
            <Button
              type="button"
              className="mt-3 float-end"
              color="primary"
              onClick={(e) => createEntity(e)}
            >
              {/* disabled={formState.isSubmitting} */}
              {isAddMode ? "Submit" : "Update"}
            </Button>
          )}
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
