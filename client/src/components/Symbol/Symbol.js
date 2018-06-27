import React from "react";

const Symbol = ({id, name, type, url, onClick}) => (
  <div className="col-xs-3 col-sm-3">
    <img className={type} alt={name} src={url} key={id} onClick={onClick}/>
  </div>
);

export default Symbol;