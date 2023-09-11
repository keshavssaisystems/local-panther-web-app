/* eslint-disable react/display-name, jsx-a11y/click-events-have-key-events */
import { Navigation } from "react-minimal-side-navigation";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Icon from "awesome-react-icons";
import React, { useEffect, useState } from "react";

import "react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css";

export const AppSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const authUser = useSelector((x) => console.log('x >> ', x));
  
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    let data = []
    /* for (var i = 0; i < authUser.data.menuDtoList.length; i++) {
      let obj = {
        itemId: authUser.data.menuDtoList[i].path,
        title: authUser.data.menuDtoList[i].menuname,
        userroleid: authUser.data.menuDtoList[i].userroleid,
        rolename: authUser.data.menuDtoList[i].rolename,
        menuicon: authUser.data.menuDtoList[i].menuicon,
        modulename: authUser.data.menuDtoList[i].modulename,
        pathname: authUser.data.menuDtoList[i].path,
        isview: authUser.data.menuDtoList[i].isview,
        isadd: authUser.data.menuDtoList[i].isadd,
        isedit: authUser.data.menuDtoList[i].isedit,
        isdelete: authUser.data.menuDtoList[i].isdelete,
        subMenuList: authUser.data.menuDtoList[i].subMenuList
      }
      data.push(obj)
    }

    setMenuItems(data) */
  }, []);

  return (
    <>
      {/* Sidebar Overlay */}
      <div
        onClick={() => setIsSidebarOpen(false)}
        className={`fixed inset-0 z-20 block transition-opacity bg-black opacity-50 lg:hidden ${isSidebarOpen ? "block" : "hidden"
          }`}
      />


      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 ease-out transform translate-x-0 bg-white border-r-2 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "ease-out translate-x-0" : "ease-in -translate-x-full"
          }`}
      >
        <Navigation
          activeItemId={location.pathname}
          onSelect={({ itemId }) => {
            navigate(itemId);
          }}
          items={menuItems}
          // items={[
          //   {
          //     title: "Home",
          //     itemId: "/",
          //     elemBefore: () => <Icon name="coffee" />
          //   },
          //   {
          //     title: "Open Jobs",
          //     itemId: "/JobList",
          //     elemBefore: () => <Icon name="cloud-snow" />
          //   },
          //   {
          //     title: "Candidate List",
          //     itemId: "/candidate-list",
          //     elemBefore: () => <Icon name="coffee" />
          //   },
          //   {
          //     title: "Create Job",
          //     itemId: "/create-job",
          //     elemBefore: () => <Icon name="cloud-snow" />
          //   },
          //   {
          //     title: "Recommended Job List",
          //     itemId: "/recommended-job",
          //     elemBefore: () => <Icon name="cloud-snow" />,
          //   },
          //   {
          //     title: "About",
          //     itemId: "/about",
          //     elemBefore: () => <Icon name="user" />,
          //     subNav: [
          //       {
          //         title: "Projects",
          //         itemId: "/about/projects",
          //         // Optional
          //         elemBefore: () => <Icon name="cloud-snow" />
          //       },
          //       {
          //         title: "Members",
          //         itemId: "/about/members",
          //         elemBefore: () => <Icon name="coffee" />
          //       }
          //     ]
          //   },
          //   {
          //     title: "Next",
          //     itemId: "/next",
          //     elemBefore: () => <Icon name="user" />,
          //     subNav: [
          //       {
          //         title: "Next 1",
          //         itemId: "/next/next-1",
          //         // Optional
          //         elemBefore: () => <Icon name="cloud-snow" />
          //       },
          //       {
          //         title: "Next 2",
          //         itemId: "/next/next-2",
          //         elemBefore: () => <Icon name="coffee" />
          //       }
          //     ]
          //   },

          // ]}
        />
      </div>
    </>
  );
};
