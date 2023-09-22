import React from "react";
import { Table } from "reactstrap";
export const CandidateListView = (props) => {
  return (
    <Table className="mb-0 pl-1 pr-1" bordered>
      <thead>
        <tr>
          <th></th>
          <th>Profile</th>
          <th>Name</th>
          <th>Experience</th>
          <th>Skills</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        {props?.data?.length ? (
          props.data.map((data, ind) => {
            return (
              <tr key={data.email}>
                <td>{ind + 1}</td>
                <td>{data?.primaryskills}</td>
                <td>{data?.firstname + "  " + data?.lastname}</td>
                <td>{data?.experienceyears}</td>
                <td>{data?.secondaryskills}</td>
                <td>{data?.email}</td>
              </tr>
            );
          })
        ) : (
          <></>
        )}
      </tbody>
    </Table>
  );
};
