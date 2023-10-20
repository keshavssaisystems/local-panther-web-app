import PageTitle from "../../../_components/common/pagetitle";

import titlelogo from "../../../assets/utils/images/candidate.svg";
import { ReactBigCalender } from "_widgets";
export function AdminCalendar({ title }) {

  return (
    <div>
      <PageTitle heading={title} icon={titlelogo} />
      <p>{title}</p>
      <ReactBigCalender />
    </div>
  );
}
