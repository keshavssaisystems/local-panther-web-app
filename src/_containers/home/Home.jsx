import { useEffect } from "react";
import { useDispatch } from "react-redux";
import PageTitle from "../../_components/common/pagetitle";

import titlelogo from "../../assets/utils/images/candidate.svg";
import { userActions } from "_store";

export { Home };

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userActions.getAll());
  }, [dispatch]);

  return (
    <div>
      <PageTitle heading="Home" icon={titlelogo} />
      <p>You're logged in with Panther</p>
      <h3>Users from secure api end point:</h3>
    </div>
  );
}
