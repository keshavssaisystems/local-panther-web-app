import React, { useState, useEffect } from "react";

import { useDispatch, useSelector } from "react-redux";
import { authActions } from "_store";
import { CustJobDetail } from "_containers/customer/newjobs/custjobdetails";
import { useParams } from "react-router-dom";
import { AppHeader } from "_components/_layout/AppHeader";
import { NoDataFound } from "_components/common/nodatafound";
import "./sharejob.scss";

export const ShareJobDetails = (props) => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const shareJobDetail = useSelector((state) => state.auth.shareJobDetail);
  console.log(shareJobDetail);
  useEffect(() => {
    getJobDetail();
  }, []);
  const getJobDetail = () => {
    dispatch(authActions.getShareJobDetails(id));
  };
  return (
    <>
      {" "}
      <div
        style={{ maxWidth: "60vw", margin: "auto" }}
        className={!props.authUser ? "share-job-cont" : ""}
      >
        {shareJobDetail.length > 0 ? (
          <>
            <>
              <CustJobDetail
                jobDetails={shareJobDetail}
                isShare={true}
                isModal={true}
              ></CustJobDetail>
            </>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
