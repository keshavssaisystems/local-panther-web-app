import React, { useEffect, useState } from "react";

const BuildInfo = () => {
  const [info, setInfo] = useState(undefined);

  useEffect(() => {
    let mounted = true;
    fetch("/build-info.json")
      .then((res) => {
        if (!res.ok) throw new Error("No build-info");
        return res.json();
      })
      .then((data) => {
        if (mounted) setInfo(data);
      })
      .catch(() => {
        const buildTime = process.env.REACT_APP_BUILD_TIME;
        const version = process.env.REACT_APP_VERSION || null;
        if (buildTime || version) {
          setInfo({ buildTime, version });
        } else {
          setInfo(null);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (info === undefined) {
    return (
      <div className="build-info p-4">
        <h3>Build info</h3>
        <p>Loading...</p>
      </div>
    );
  }

  if (info === null) {
    return (
      <div className="build-info p-4">
        <h3>Build info</h3>
        <p>Build timestamp not available (development mode or before first build).</p>
      </div>
    );
  }

  return (
    <div className="build-info p-4">
      <h3>Build info</h3>
      {info.version && <p>Version: {info.version}</p>}
      {info.buildTime ? (
        <p>Last build (UTC): {new Date(info.buildTime).toUTCString()}</p>
      ) : (
        <p>Build timestamp not available</p>
      )}
    </div>
  );
};

export default BuildInfo;
