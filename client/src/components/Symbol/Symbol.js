import React from "react";

const Symbol = ({id, name, url, onClick}) => (
  <div className="col-sm-3">
    <img alt={name} src={url} key={id} onClick={onClick}/>
  </div>
);

export default Symbol;