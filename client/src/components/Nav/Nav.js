import React from "react";

const timestyle = {
  color: "white"
}

const Nav = ( {title, page, time} ) => (
  <nav id="navBar" className="navbar navbar-expand-lg navbar-dark bg-primary">
    <a className="navbar-brand" href="/dashboard">
      {title}
    </a>
    {(page === "play") ? <div className="nav navbar-nav navbar-right" style={timestyle}>{time}</div> : <div></div>}
  </nav>
);

export default Nav;
