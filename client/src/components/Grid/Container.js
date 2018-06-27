import React from "react";

export const Container = ({ fluid, style, children }) => (
  <div style={style} className={`container${fluid ? "-fluid" : ""} row align-items-center`}>
    {children}
  </div>
);
