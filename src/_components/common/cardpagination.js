import React from "react";
// import { Pagination, PaginationItem, PaginationLink } from "reactstrap";
import ResponsivePagination from "react-responsive-pagination";
import "./cardpagination.scss";

export function CardPagination(props) {
  var totalPages = Math.ceil(props.totalPages);

  // var pageIndex = props.pageIndex;

  // const renderPaginationItems = () => {
  //   const items = [];

  //   for (let page = 1; page <= totalPages; page++) {
  //     if (page <= 3 || page > totalPages - 3) {
  //       items.push(
  //         <PaginationItem
  //           className="middle-page"
  //           key={page}
  //           active={pageIndex === page}
  //         >
  //           <PaginationLink onClick={() => props.onCallBack(page)}>
  //             {page}
  //           </PaginationLink>
  //         </PaginationItem>
  //       );
  //     }
  //   }
  //   return items;
  // };

  return (
    <div className="pagination-cont">
      <ResponsivePagination
        total={totalPages}
        current={props.pageIndex}
        onPageChange={(page) => props.onCallBack(page)}
        maxWidth=""
        previousLabel="<"
        nextLabel=">"
      />
    </div>
    // <Pagination className="d-flex justify-content-center pagination-cont">
    //   <PaginationItem disabled={pageIndex === 1}>
    //     <PaginationLink
    //       previous
    //       onClick={() => props.onCallBack(pageIndex - 1)}
    //     />
    //   </PaginationItem>
    //   {renderPaginationItems()}
    //   <PaginationItem disabled={pageIndex === totalPages}>
    //     <PaginationLink next onClick={() => props.onCallBack(pageIndex + 1)} />
    //   </PaginationItem>
    // </Pagination>
  );
}
