
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

export function Table({columns, data}) {
    return (
        <DataTable
            customStyles={customStyles}
            columns={columns}
            data={data}
        />
    );
}
