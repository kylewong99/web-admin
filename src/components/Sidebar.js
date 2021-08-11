import React, { useState, useEffect } from "react";
import "./Sidebar.css";

const Sidebar = (props) => {
  
  const {setPage, handleLogout} = props;

  return (
    <>
      <div class="sidebar-container">
        <button onClick={() => setPage("admin")}>
          <h1>Admin</h1>
        </button>

        <button onClick={() => setPage("user")}>
          <h1>Users</h1>
        </button>

        <button onClick={handleLogout}>
          <h1>Logout</h1>
        </button>
      </div>
    </>
  );
}

export default Sidebar;
