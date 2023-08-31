import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { remoteActions } from "_store";

const DropdownremoteInput = () => {
  const dispatch = useDispatch();
  const remoteData = useSelector((state) => state.remote.user.data);

  useEffect(() => {
    dispatch(remoteActions.getRemote());
  }, [dispatch]);

  if (!remoteData) {
    // Data is not available yet, you might want to display a loading indicator here
    return <div>Loading...</div>;
  } else {
  }

  return (
    <div className="mb-3">
      <select>
        <option value="" disabled selected>
          Enter remote status
        </option>
        {remoteData.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DropdownremoteInput;
