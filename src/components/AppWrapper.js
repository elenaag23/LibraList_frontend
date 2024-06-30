import React, { useState, useEffect } from "react";

const AppWrapper = ({ children }) => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1500);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1500);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return !isDesktop ? (
    <div
      style={{
        backgroundColor: "#6d7fcc",
        height: window.innerHeight,
      }}
    >
      {!isDesktop && (
        <div className="responsive">App is only available on desktop</div>
      )}
      {isDesktop && children}
    </div>
  ) : (
    <div>{children}</div>
  );
};

export default AppWrapper;
