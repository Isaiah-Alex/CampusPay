import React from "react";
import Lottie from "lottie-react";
import loading from "../assets/loadingAnimation.json";

const Loader = () => {
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(14, 14, 14, 0.74)", // semi-transparent
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999
    }}>
      <div style={{ width: 150 }}>
        <Lottie animationData={loading} loop={true} />
      </div>
    </div>
  );
};

export default Loader;
