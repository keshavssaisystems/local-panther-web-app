import React, { useEffect, useState } from "react";

const OAuthSuccess = () => {
  const [closing, setClosing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.close();
      setClosing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (!closing) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          fontFamily: "sans-serif",
          color: "#333",
        }}
      >
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #86efac",
            borderRadius: 8,
            padding: "32px 40px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 12 }}>✓</div>
          <h2 style={{ margin: 0, marginBottom: 8, color: "#15803d" }}>
            Email Connected Successfully
          </h2>
          <p style={{ color: "#555", marginBottom: 0 }}>
            You can close this tab and return to the application.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontFamily: "sans-serif",
        color: "#555",
      }}
    >
      <p>Authentication successful. Closing…</p>
    </div>
  );
};

export default OAuthSuccess;
