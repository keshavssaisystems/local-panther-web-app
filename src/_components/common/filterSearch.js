import React, { useState } from "react";
import { Form, FormGroup } from "reactstrap";
import cx from "classnames";

export function FilterSearch({ placeholder, searchValue }) {
  const [showButton, setShowButton] = useState(false);
  const getSearchValue = (event) => {
    event.preventDefault();
    searchValue(event.target.elements.search.value);
  };
  const removeSearchValue = (event) => {
    event.preventDefault();
    event.target.form[0].value = "";
    searchValue("");
  };

  const onSearch = (event) => {
    if (event.target.value.length > 0) {
      setShowButton(true);
    } else {
      setShowButton(false);
    }
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
                onChange={(e) => onSearch(e)}
              />
              <button className="search-icon">
                <span />
              </button>
            </div>
            {showButton === true && (
              <button
                style={{ left: "220px", padding: "0px" }}
                className="btn-close close-button"
                onClick={(e) => removeSearchValue(e)}
              />
            )}
          </div>
        </FormGroup>
      </Form>
    </>
  );
}
