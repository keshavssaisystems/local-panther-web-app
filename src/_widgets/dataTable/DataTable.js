import React from "react";
import DataTable from "react-data-table-component";
const customStyles = {
  headRow: {
    style: {
      borderTopWidth: "0px",
    },
  },
  headCells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightWidth: "0px",
      },
      color: "rgb(47 71 155)",
    },
  },
  cells: {
    style: {
      "&:not(:last-of-type)": {
        borderRightWidth: "0px",
        cursor: "pointer",
      },
    },
  },
};

export function Table({
  columns,
  data,
  fixedHeader,
  fixedHeaderScrollHeight,
  progressPending,
  progressComponent,
  onRowClicked,
}) {

  return (
    <DataTable
      progressPending={progressPending}
      progressComponent={progressComponent}
      customStyles={customStyles}
      columns={columns}
      data={data}
      fixedHeader={fixedHeader}
      onRowClicked={onRowClicked}
      fixedHeaderScrollHeight={fixedHeaderScrollHeight}
    />
  );
}
