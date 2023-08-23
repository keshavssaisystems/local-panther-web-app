import React from "react";
import { Card, CardBody, Pagination, PaginationItem,PaginationLink } from "reactstrap";

export function JobListPagination({total, current, onChangePage, maxCount}) {
    let item = [];
    for(let page=1; page<=total/maxCount; page++){
        item.push(<PaginationItem>
            <PaginationLink key={page} onClick={() => onChangePage(page)} active={(page === current).toString()} >{page}</PaginationLink>
        </PaginationItem>)
    }
    return (
        <>
            <Card className="mb-2">
                <CardBody >
                    <Pagination aria-label="Page navigation example" className="text-center">
                    { current > 1 &&
                        <PaginationItem>
                            <PaginationLink previous onClick={() => onChangePage(current - 1)}/>
                        </PaginationItem>
                    }
                    {item}                 
                    { current < total &&
                        <PaginationItem>
                            <PaginationLink next onClick={() => onChangePage(current + 1)} />
                        </PaginationItem>
                    }
                    </Pagination>
                </CardBody>
            </Card>
        </>
    );
}
