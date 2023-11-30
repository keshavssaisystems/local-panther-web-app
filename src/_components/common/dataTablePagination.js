import React from "react";

export function DataTableCustomPagination({
  rowsPerPage,
  rowCount,
  currentPage,
  onChangePage,
  totalRecords,
  pageIndex,
}) {
  const totalPages = Math.ceil(rowCount / rowsPerPage);

  return (
    <div className="float-end mt-3">
      <span className="me-4" style={{ cursor: "pointer" }}>
        {(pageIndex - 1) * rowsPerPage + 1} - {pageIndex * rowsPerPage} of{" "}
        {totalRecords}
      </span>
      <span
        className="me-2"
        style={{ cursor: "pointer" }}
        onClick={() => onChangePage(1)}
        disabled={currentPage === 1}
      >
        {"| <"}
      </span>
      <span
        style={{ cursor: "pointer" }}
        className="me-3"
        onClick={() => onChangePage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {"<"}
      </span>

      <span
        style={{ cursor: "pointer" }}
        className="me-2"
        onClick={() => onChangePage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {">"}
      </span>
      <span
        style={{ cursor: "pointer" }}
        className="me-4"
        onClick={() => onChangePage(totalPages)}
        disabled={currentPage === totalPages}
      >
        {"> |"}
      </span>
    </div>
  );
}
