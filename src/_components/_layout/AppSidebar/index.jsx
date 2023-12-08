/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { Navigation } from "react-minimal-side-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./appsidebar.scss";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

import sideBarIcons from "../../../assets/utils/sidebarimages";

export const AppSidebar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuDtoList = useSelector((x) => x?.auth?.menuList);

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (menuDtoList) {
      const menuItems = menuDtoList?.map(
        ({ path, menuname: title, subMenuList = [], ...rest }) => ({
          itemId: path,
          pathname: path,
          title,
          ...rest,
          elemBefore: () => (
            <img src={sideBarIcons[rest.menuicon]} alt="icons" />
          ),
          ...(subMenuList?.length
            ? {
                subNav: subMenuList.map(({ submenuname: title, path }) => ({
                  title,
                  itemId: path,
                  elemBefore: () => <FontAwesomeIcon icon={faBars} />,
                })),
              }
            : {}),
        })
      );

      setMenuItems(menuItems);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onNavigate = (itemId) => {
    if (window.screen.width < 768) {
      props.setIsSidebarOpen(false);
      navigate(itemId);
    } else {
      navigate(itemId);
    }
  };
  return (
    <>
      {/* Sidebar Overlay */}

      <div
        className={`appsidebar  overflow-y-auto  bg-white ${
          props.isSidebarOpen ? "sidebar-open-main" : ""
        } `}
        // onMouseEnter={() => onEnterToSidebar()}
        // onMouseLeave={() => onLeaveToSidebar()}
      >
        <div
          className={`${
            props.isSidebarOpen ? "sidebar-open" : "sidebar-close"
          }`}
        >
          <Navigation
            activeItemId={location.pathname}
            onSelect={({ itemId }) => {
              onNavigate(itemId);
            }}
            items={menuItems}
          />
        </div>
      </div>
    </>
  );
};
