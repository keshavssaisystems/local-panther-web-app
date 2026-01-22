/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { Navigation } from "react-minimal-side-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import "./appsidebar.scss";
import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";
import { useDispatch } from "react-redux";
import sideBarIcons from "../../../assets/utils/sidebarimages";
import { clearFiltersOnPageLoad } from "_store/commonCustFiltersSlice";

export const AppSidebar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const menuDtoList = useSelector((x) => x?.auth?.menuList);

  const [menuItems, setMenuItems] = useState([]);
  const dispatch = useDispatch();
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

  const getActiveItemId = (pathname) => {
    if (pathname.startsWith("/customer-candidate-")) {
      return "/candidate-list"; // This should match the itemId of your sidebar menu
    }
    dispatch(clearFiltersOnPageLoad());
    return pathname;
  };

  return (
    <>
      {/* Sidebar Overlay */}

      <div
        className={`appsidebar  overflow-y-auto  bg-white ${props.isSidebarOpen ? "sidebar-open-main" : ""
          } `}
      // onMouseEnter={() => onEnterToSidebar()}
      // onMouseLeave={() => onLeaveToSidebar()}
      >
        <div
          className={`${props.isSidebarOpen ? "sidebar-open" : "sidebar-close"
            }`}
        >
          <Navigation
            activeItemId={getActiveItemId(location.pathname)}
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
