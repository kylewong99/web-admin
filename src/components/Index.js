import React, { useState, useEffect } from "react";
import "./Index.css";
import Admin from "./Admin";
import User from "./User";
import Quiz from "./Quiz";

const Index = (props) => {
  const [selectedPage, setSelectedPage] = useState("admin");

  const { handleLogout } = props;

  const userEmail = localStorage.getItem("email");

  const setPage = (page) => {
    setSelectedPage(page);
  };

  const test = () => {
    console.log(userEmail);
  };

  return (
    <>
      <div class="container-fluid">
        <div class="row flex-nowrap">
          <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div class="d-flex flex-column align-items-center align-items-sm-start px-3 pt-2 text-white min-vh-100">
              <div class="d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                <span class="fs-5 d-none d-sm-inline">
                  <b>GO GREEN</b>
                </span>
              </div>
              <ul
                class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-center align-items-sm-start"
                id="menu"
              >
                <li class="nav-item">
                  <div id="sidebar-content" class="nav-link align-middle px-0">
                    <i class="fs-4 bi-house"></i>{" "}
                    <span
                      onClick={() => setPage("admin")}
                      class="ms-1 d-none d-sm-inline"
                    >
                      Admin
                    </span>
                  </div>
                </li>
                <li class="nav-item">
                  <div id="sidebar-content" class="nav-link align-middle px-0">
                    <i class="fs-4 bi-house"></i>{" "}
                    <span
                      onClick={() => setPage("user")}
                      class="ms-1 d-none d-sm-inline"
                    >
                      User
                    </span>
                  </div>
                </li>
                <li class="nav-item">
                  <div id="sidebar-content" class="nav-link align-middle px-0">
                    <i class="fs-4 bi-house"></i>{" "}
                    <span onClick={test} class="ms-1 d-none d-sm-inline">
                      Courses
                    </span>
                  </div>
                </li>
                <li class="nav-item">
                  <div id="sidebar-content" class="nav-link align-middle px-0">
                    <i class="fs-4 bi-house"></i>{" "}
                    <span
                      onClick={() => setPage("quiz")}
                      class="ms-1 d-none d-sm-inline"
                    >
                      Quizes
                    </span>
                  </div>
                </li>
                <li class="nav-item">
                  <div id="sidebar-content" class="nav-link align-middle px-0">
                    <i class="fs-4 bi-house"></i>{" "}
                    <span
                      onClick={handleLogout}
                      class="ms-1 d-none d-sm-inline"
                    >
                      Logout
                    </span>
                  </div>
                </li>
              </ul>
              <hr />
              <div class="pb-4">
                <div class="d-flex align-items-center text-white text-decoration-none text-wrap mb-2">
                  <span>
                    <h2>Welcome,</h2> {userEmail}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="col py-3">
            {(() => {
              switch (selectedPage) {
                case "admin":
                  return <Admin />;
                case "user":
                  return <User />;
                case "quiz":
                  return <Quiz />;
                default:
                  return <Admin />;
              }
            })()}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;
