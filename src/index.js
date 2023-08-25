import "./polyfills";
import React from 'react';
import cx from "classnames";
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { HashRouter } from 'react-router-dom';

import { store } from './_store';
import { App } from './App';
import "./assets/base.scss";

// setup fake backend
import { fakeBackend } from './_helpers';
fakeBackend();

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <HashRouter>
                    <div
                        className={cx(
                            "app-container app-theme-white fixed-header fixed-sidebar fixed-footer closed-sidebar closed-sidebar-mobile sidebar-mobile-open body-tabs-shadow-btn"
                        )}>
                        <App />
                    </div>
            </HashRouter>
        </Provider>
    </React.StrictMode>
);
