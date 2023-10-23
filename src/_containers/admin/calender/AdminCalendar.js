import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../../_components/common/pagetitle";

import titlelogo from "../../../assets/utils/images/candidate.svg";

import { ReactBigCalender } from "_widgets";
import { useEffect } from "react";
import { scheduledInterviewListThunk } from "../_redux/report.slice";
import moment from "moment";

export function AdminCalendar({ title }) {
  const dispatch = useDispatch();
  const { scheduledInterviewList = [] } = useSelector((state) => state.adminReportReducer);

  useEffect(() => {
    dispatch(scheduledInterviewListThunk())

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const events = scheduledInterviewList.map((item) => {
    const startDate = moment(
      moment(item.scheduledate).format("MMM D, YYYY") +
        " " +
        item.starttime
    )
      .tz("America/New_York")
      .format("YYYY-MM-DD HH:mm:ss");

    const [duration] =
      item.duration !== undefined
        ? item.duration.split(" ")
        : [];
    const endDate = moment(startDate)
      .add(duration, "m")
      .format("YYYY-MM-DD HH:mm:ss");

    return {
      id: item.scheduleinterviewid,
      data: item,
      format: item.format,
      title: item.jobtitle,
      start: new Date(startDate),
      end: new Date(endDate),
      color:
        item.isaccepted === true &&
        item.isrejected === false
          ? "#14BD66"
          : item.isrejected === true
          ? "#FF406D"
          : "#F7B924",
    };
  })

  return (
    <div>
      <PageTitle heading={title} icon={titlelogo} />
      <p>{title}</p>
      <ReactBigCalender 
        events={events}
      />
    </div>
  );
}
