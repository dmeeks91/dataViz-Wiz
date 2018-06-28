import React from "react";

const Jumbotron = ({ children }) => (
  <div
    style={{ clear: "both", paddingTop: 5, textAlign: "center" }}
    className="jumbotron"
  >
    {children}
  </div>
);

export default Jumbotron;
