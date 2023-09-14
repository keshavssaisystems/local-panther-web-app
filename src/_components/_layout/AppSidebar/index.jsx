/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { Navigation } from "react-minimal-side-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./appsidebar.scss";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const menuDtoList = useSelector((x) => x?.auth?.menuList);

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (menuDtoList) {
      let data = [];
      for (let variable of menuDtoList) {
        let obj = {
          itemId: variable.path,
          title: variable.menuname,
          userroleid: variable.userroleid,
          rolename: variable.rolename,
          menuicon: variable.menuicon,
          modulename: variable.modulename,
          pathname: variable.path,
          isview: variable.isview,
          isadd: variable.isadd,
          isedit: variable.isedit,
          isdelete: variable.isdelete,
          subMenuList: variable.subMenuList,
          elemBefore: () => <FontAwesomeIcon icon={faAngleRight} size="1x" />,
        };
        data.push(obj);
      }
      setMenuItems(data);
    }
  }, []);

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`appsidebar fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      />
      <div
        className={`appsidebar fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${
          isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
        }`}
      >
        <Navigation
          activeItemId={location.pathname}
          onSelect={({ itemId }) => {
            navigate(itemId);
          }}
          items={menuItems}
        />
      </div>
    </>
  );
};
