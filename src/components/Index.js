import React, { useState, useEffect } from "react";
import "./Index.css";
import Sidebar from "./Sidebar";
import Admin from "./Admin";
import User from "./User";

const Index = (props) => {
  const [selectedPage, setSelectedPage] = useState("admin");

  const {handleLogout} = props;

  const setPage = (page) => {
    setSelectedPage(page);
  }

  return (
    <>
      <h1>{selectedPage}</h1>
      <div class="container-fluid">
        <div class="row">
          <div class="col">
            <h1>Go Green</h1>
          </div>
        </div>
      </div>
      <div style={{ float: "left" }}>
        <Sidebar setPage={setPage} handleLogout={handleLogout} />
      </div>
      <div style={{ float: "right" }}>
        {(() => {
          switch (selectedPage) {
            case ('admin'):
              return <Admin />
            case ('user'):
              return <User />
            default:
              return <Admin />
          }
        })()}
      </div>
    </>
  );
}

export default Index;
