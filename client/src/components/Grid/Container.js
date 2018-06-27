import React from "react";

export const Container = ({ fluid, height, children }) => (
  <div style={{height: height}} className={`container${fluid ? "-fluid" : ""} row align-items-center`}>
    {children}
  </div>
);
