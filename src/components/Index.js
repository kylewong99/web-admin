import React, { useState } from "react";
import "./Index.css";
import Admin from "./Admin";
import User from "./User";
import Quiz from "./Quiz";
import Course from "./Course";

const Index = (props) => {
  const [selectedPage, setSelectedPage] = useState("admin");

  const { email, handleLogout } = props;

  const setPage = (page) => {
    setSelectedPage(page);
  };

  return (
    <>
      <div class="container-fluid">
        <div class="row h-100 flex-nowrap">
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
                  <div
                    onClick={() => setPage("admin")}
                    id="sidebar-content"
                    class="nav-link align-middle px-0"
                  >
                    <i
                      style={{ fontSize: "1.5rem", marginRight: "10px" }}
                      class="bi bi-person-badge"
                    ></i>
                    <span class="ms-1 d-none d-sm-inline">Admin</span>
                  </div>
                </li>
                <li class="nav-item">
                  <div
                    onClick={() => setPage("user")}
                    id="sidebar-content"
                    class="nav-link align-middle px-0"
                  >
                    <i
                      style={{ fontSize: "1.5rem", marginRight: "11px" }}
                      class="bi bi-people-fill"
                    ></i>
                    <span class="ms-1 d-none d-sm-inline">User</span>
                  </div>
                </li>
                <li class="nav-item">
                  <div
                    onClick={() => setPage("course")}
                    id="sidebar-content"
                    class="nav-link align-middle px-0"
                  >
                    <i
                      style={{ fontSize: "1.3rem", marginRight: "10px" }}
                      class="fas fa-chalkboard-teacher"
                    ></i>
                    <span class="ms-1 d-none d-sm-inline">Courses</span>
                  </div>
                </li>
                <li class="nav-item">
                  <div
                    onClick={() => setPage("quiz")}
                    id="sidebar-content"
                    class="nav-link align-middle px-0"
                  >
                    <i
                      style={{ fontSize: "1.5rem", marginRight: "10px" }}
                      class="fas fa-puzzle-piece"
                    ></i>
                    <span class="ms-1 d-none d-sm-inline">Quizes</span>
                  </div>
                </li>
                <li class="nav-item">
                  <div
                    onClick={handleLogout}
                    id="sidebar-content"
                    class="nav-link align-middle px-0"
                  >
                    <i
                      style={{ fontSize: "1.5rem", marginRight: "12px" }}
                      class="bi bi-box-arrow-right"
                    ></i>
                    <span class="ms-1 d-none d-sm-inline">Logout</span>
                  </div>
                </li>
              </ul>
              <hr />
              <div class="pb-4">
                <div class="d-flex align-items-center text-white text-decoration-none text-wrap mb-2">
                  <span>
                    <h2>Welcome,</h2> {email}
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
                case "course":
                  return <Course />;
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
