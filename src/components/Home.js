import React from "react";
import Posts  from "./Posts";


export const Home = (props) => {
  
  return (
    <div className="container">
      <Posts showAlert={props.showAlert}/>
    </div>
  );
};