import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions, getHiringMangersList } from "_store";

/**
 * ViewAsBar — global "View as:" switcher shown in the app header for company admins.
 *
 * Allows selecting any hiring manager from any page. The auth context switch
 * (switchToHiringManagerThunk / switchBackToAdminThunk) updates Redux state
 * which each page observes via its own [selectedHiringManagerId] effects.
 */
export function ViewAsBar() {
  const dispatch = useDispatch();

  const isCompanyAdmin = useSelector((state) => state.auth.isCompanyAdmin);
  const selectedHiringManagerId = useSelector((state) => state.auth.selectedHiringManagerId);
  const isSwitching = useSelector((state) => state.auth.isSwitching);
  const hiringManagers = useSelector(
    (state) => state?.customerReportReducer?.companyHiringManagers || []
  );

  // Local controlled value — updated immediately so the <select> never freezes
  const [dropdownValue, setDropdownValue] = useState(
    localStorage.getItem("selectedHiringManagerId") || "all"
  );

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setDropdownValue(selectedHiringManagerId ? String(selectedHiringManagerId) : "all");
  }, [selectedHiringManagerId]);

  // Load HM list once on mount if not already populated
  useEffect(() => {
    if (hiringManagers.length === 0) {
      const companyId = Number(localStorage.getItem("companyid"));
      if (companyId) {
        dispatch(getHiringMangersList({ companyId, endpoint: "allUserListByCompany" }));
      }
    }
  }, [dispatch]);

  const handleChange = async (e) => {
    const value = e.target.value;
    if (value === dropdownValue) return;

    const previousValue = dropdownValue;

    if (value === "all") {
      localStorage.removeItem("selectedHiringManagerName");
    } else {
      const selectedHM = hiringManagers.find((hm) => String(hm.id) === value);
      if (selectedHM) localStorage.setItem("selectedHiringManagerName", selectedHM.name);
    }

    setDropdownValue(value);

    const originalAdminUserId = localStorage.getItem("adminOriginalUserId");

    if (!value || value === "all") {
      if (originalAdminUserId) {
        const result = await dispatch(authActions.switchBackToAdminThunk());
        if (result?.error) { setDropdownValue(previousValue); return; }
      }
    } else {
      const result = await dispatch(authActions.switchToHiringManagerThunk(parseInt(value)));
      if (result?.error) { setDropdownValue(previousValue); return; }
    }
  };

  const handleReset = () => handleChange({ target: { value: "all" } });

  // Only visible to company admins — mirrors the original dashboard guard
  if (!isCompanyAdmin) return null;

  return (
    <div
      className="view-as-bar"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        marginRight: "12px",
      }}
    >
      <label
        htmlFor="viewAsBarSelect"
        style={{ fontSize: "14px", fontWeight: 500, marginBottom: 0, whiteSpace: "nowrap", color: "#495057" }}
      >
        View as:
      </label>
      <select
        id="viewAsBarSelect"
        className="form-select form-select-sm"
        value={dropdownValue}
        onChange={handleChange}
        disabled={isSwitching}
        style={{ fontSize: "13px", minWidth: 160, maxWidth: 220 }}
      >
        <option value="all">Select a Hiring Manager</option>
        {/* Ghost option: keeps the select stable while the full list loads after a reload */}
        {dropdownValue !== "all" && !hiringManagers.some((hm) => String(hm.id) === dropdownValue) && (
          <option value={dropdownValue}>
            {localStorage.getItem("selectedHiringManagerName") || dropdownValue}
          </option>
        )}
        {hiringManagers.map((hm) => (
          <option key={hm.id} value={hm.id}>
            {hm.name}
          </option>
        ))}
      </select>

      {isSwitching && (
        <span
          className="spinner-border spinner-border-sm text-primary"
          role="status"
          aria-hidden="true"
          style={{ width: "14px", height: "14px" }}
        />
      )}

      {!isSwitching && dropdownValue !== "all" && (
        <button
          type="button"
          onClick={handleReset}
          title="Reset to all users"
          style={{
            padding: 0,
            fontSize: "13px",
            fontWeight: 400,
            border: "none",
            background: "transparent",
            color: "#2F479B",
            cursor: "pointer",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Reset
        </button>
      )}
    </div>
  );
}
