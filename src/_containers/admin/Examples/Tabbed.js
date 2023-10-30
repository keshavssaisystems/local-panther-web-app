import React from "react";
import Tabs from "react-responsive-tabs";
import city3 from "assets/utils/images/dropdown-header/city3.jpg";

// Examples
// import TimelineEx from "_containers/admin/Examples/TabsContent/TimelineExample";
import { NoRecordFound } from "_widgets";

const tabsContent = [
  {
    title: "Day",
    content: <NoRecordFound />,
  },
  {
    title: "Week",
    content: <NoRecordFound />,
  },
];

function getTabs() {
  return tabsContent.map((tab, index) => ({
    title: tab.title,
    getContent: () => tab.content,
    key: index,
  }));
}

export const TabbedContent = ({ data = [] }) => {
    return (
      <>
        <div className="dropdown-menu-header mt-0 mb-0">
          <div className="dropdown-menu-header-inner bg-heavy-rain">
            <div className="menu-header-image opacity-1"
              style={{
                backgroundImage: "url(" + city3 + ")",
              }}/>
            <div className="menu-header-content text-dark">
              <h5 className="menu-header-title text-danger fsize-2">{data.length}</h5>
              <h6 className="menu-header-subtitle">
                <b className="text-bold">Missed today</b>
              </h6>
            </div>
          </div>
        </div>
        <div className="card-tabs-animated card-tabs-animated-inner">
          <Tabs tabsWrapperClass="body-tabs body-tabs-alt" transform={false} showInkBar={true} items={getTabs()}/>
        </div>
      </>
    );
  }
