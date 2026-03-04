import React from "react";
import { useNavigate } from "react-router-dom";
import { getTimezoneDateTime } from "_helpers/helper";
import publishedIcon from "assets/utils/images/job-detail-icons/published.svg";
import matchedIcon from "assets/utils/images/job-detail-icons/matched.svg";
import maybeIcon from "assets/utils/images/job-detail-icons/maybe.svg";
import likedIcon from "assets/utils/images/job-detail-icons/liked.svg";
import appliedIcon from "assets/utils/images/job-detail-icons/applied.svg";
import scheduledIcon from "assets/utils/images/job-detail-icons/scheduled.svg";
import offersIcon from "assets/utils/images/job-detail-icons/offers.svg";
import acceptedIcon from "assets/utils/images/job-detail-icons/accepted.svg";
import rejectedIcon from "assets/utils/images/job-detail-icons/rejected.svg";
import presentIcon from "assets/utils/images/job-detail-icons/present.svg";
// Reuse the same scoped wizard styles used in custjobdetails
import "../../_containers/customer/newjobs/newjobs.scss";

/**
 * JobPipelineTimeline
 *
 * Reusable component that mirrors the renderSteps logic from CustJobDetail.
 *
 * Props:
 *  - job            {object} Full job-detail object (jobDetail[0] from Redux)
 *  - hiringManagerId {string} Used in navigation URLs
 */
export function JobPipelineTimeline({ job, hiringManagerId }) {
  const navigate = useNavigate();

  if (!job) return null;

  // Determine staffing-firm flag the same way custjobdetails does
  let companyList = [];
  try {
    const stored = localStorage.getItem("companyList");
    if (stored) companyList = JSON.parse(stored);
  } catch (_) {}
  const isStaffingFirm = companyList.some((c) => c.isstaffingfirm === true);

  // ---------- Build steps (identical structure to custjobdetails.js) ----------
  const steps = [
    {
      name: "Published",
      count: getTimezoneDateTime(
        job?.publisheddate === null
          ? job?.jobcreatedatetime
          : job?.publisheddate,
        "MM/DD/YYYY"
      ),
      icon: publishedIcon,
      // No navigation action for Published (matches custjobdetails behaviour)
    },
    {
      name: "Matched",
      count: job?.totalRecommendedCandidates ?? 0,
      action: `/customer-candidate-matched/${job?.jobid}/${hiringManagerId}`,
      icon: matchedIcon,
    },
    {
      name: "Maybe",
      count: job?.totalMaybeCandidates ?? 0,
      action: `/customer-candidate-maybe/${job?.jobid}/${hiringManagerId}`,
      icon: maybeIcon,
    },
    {
      name: "Liked",
      count: job?.totalLikedCandidates ?? 0,
      action: `/customer-candidate-liked/${job?.jobid}/${hiringManagerId}`,
      icon: likedIcon,
    },
    {
      name: "Applied",
      count: job?.totalAppliedCandidates ?? 0,
      action: `/customer-candidate-applied/${job?.jobid}/${hiringManagerId}`,
      icon: appliedIcon,
    },
    ...(isStaffingFirm
      ? [
          {
            name: "Presented",
            count:
              job?.totalpresentedcandidates == null ||
              job?.totalpresentedcandidates === undefined
                ? 0
                : job?.totalpresentedcandidates,
            action: `/customer-candidate-presented/${job?.jobid}/${hiringManagerId}`,
            icon: presentIcon,
          },
        ]
      : []),
    {
      name: "Scheduled",
      count: job?.totalScheduledCandidates ?? 0,
      action: `/customer-candidate-scheduled/${job?.jobid}/${hiringManagerId}`,
      icon: scheduledIcon,
    },
    {
      name: "Offer",
      count: job?.totalOfferedCandidates ?? 0,
      action: `/customer-candidate-offers/${job?.jobid}/${hiringManagerId}`,
      icon: offersIcon,
    },
    {
      name: "Accepted",
      count: job?.totalAcceptedCandidates ?? 0,
      action: `/customer-candidate-accepted/${job?.jobid}/${hiringManagerId}`,
      icon: acceptedIcon,
    },
    {
      name: "Declined",
      count: job?.totalRejectedCandidates ?? 0,
      action: `/customer-candidate-rejected/${job?.jobid}/${hiringManagerId}`,
      icon: rejectedIcon,
    },
  ];

  // ---------- renderSteps (mirrors custjobdetails exactly) ----------
  const navigateTo = (action) => {
    if (action) navigate(action);
  };

  const renderSteps = () =>
    steps.map((s, i) => (
      <li className="form-wizard-step-done" key={i} value={i}>
        <span
          className="count-details"
          onClick={() => navigateTo(s.action)}
          style={{ cursor: s.action ? "pointer" : "default" }}
        >
          {s.count}
        </span>
        <em onClick={() => navigateTo(s.action)}></em>
        <span
          onClick={() => navigateTo(s.action)}
          style={{ cursor: s.action ? "pointer" : "default" }}
        >
          {s.name}
        </span>
        <div>
          <img
            src={s.icon}
            alt={s.name}
            onClick={() => navigateTo(s.action)}
            style={{ cursor: s.action ? "pointer" : "default" }}
          />
        </div>
      </li>
    ));

  // ------------------------------------------------------------------
  return (
    <div className="job-detail-cont">
      <div className="forms-wizard-alt ms-3 me-3">
        <ol className="forms-wizard">{renderSteps()}</ol>
      </div>
    </div>
  );
}
