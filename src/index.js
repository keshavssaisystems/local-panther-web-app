import "./polyfills";
import React from "react";
import cx from "classnames";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import { store } from "./_store";
import { App } from "./_containers/app/App";
import "./assets/base.scss";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <BrowserRouter>
      <div
        className={cx(
          "app-container app-theme-white fixed-header fixed-sidebar fixed-footer closed-sidebar closed-sidebar-mobile sidebar-mobile-open body-tabs-shadow-btn"
        )}
      >
        <App />
      </div>
    </BrowserRouter>
  </Provider>
);
