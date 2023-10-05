import React from "react";
import {
  Pagination,
  PaginationItem,
  PaginationLink,
  Card,
  CardBody,
} from "reactstrap";

export function CustomPagination(props) {
  var totalPages = props.totalPages;
  var pageIndex = props.pageIndex;

  const renderPaginationItems = () => {
    const items = [];

    for (let page = 1; page <= totalPages; page++) {
      items.push(
        <PaginationItem key={page} active={pageIndex === page}>
          <PaginationLink onClick={() => props.onCallBack(page)}>
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Card className="mb-2 pagination-cont">
      <CardBody>
        <Pagination
          aria-label="Page navigation example"
          className="text-center float-end"
        >
          <PaginationItem disabled={pageIndex == 1}>
            <PaginationLink
              previous
              onClick={() => props.onCallBack(pageIndex - 1)}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem disabled={pageIndex === totalPages}>
            <PaginationLink
              next
              onClick={() => props.onCallBack(pageIndex + 1)}
            />
          </PaginationItem>
        </Pagination>
      </CardBody>
    </Card>
  );
}
