import React from "react";
import { Form, FormGroup } from "reactstrap";
import cx from "classnames";

export function FilterSearch({ placeholder, searchValue }) {
  const getSearchValue = (event) => {
    event.preventDefault();
    searchValue(event.target.elements.search.value);
  };
  const removeSearchValue = () => {
    searchValue("");
  };
  return (
    <>
      <Form onSubmit={getSearchValue}>
        <FormGroup>
          <div
            className={cx("search-wrapper float-end", { active: true })}
            style={{ marginTop: "4px" }}
          >
            <div className="input-holder">
              <input
                type="text"
                className="search-input"
                id="search"
                name="search"
                placeholder={placeholder}
              />
              <button className="search-icon">
                <span />
              </button>
            </div>
            <button
              style={{ left: "220px" }}
              className="btn-close"
              onClick={removeSearchValue}
            />
          </div>
        </FormGroup>
      </Form>
    </>
  );
}
