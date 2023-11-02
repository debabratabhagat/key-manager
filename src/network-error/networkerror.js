import React from "react";
// import "./networkerror.css";

const NetworkError = () => {
  return (
    <>
      <div className="error-container">
        <div className="error-icon">&#9888;</div>
        <div className="error-message">Network Error</div>
        <div className="network-waves">
          <div className="wave"></div>
          <div className="wave"></div>
          <div className="wave"></div>
        </div>
      </div>
    </>
  );
};

export default NetworkError;
