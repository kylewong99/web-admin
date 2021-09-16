import React, { useState } from "react";
import "./Index.css";
import Admin from "./Admin";
import User from "./User";
import Quiz from "./Quiz";
import Course from "./Course";
import firebase from "firebase/app";
import "firebase/auth";

const Index = (props) => {
  const [selectedPage, setSelectedPage] = useState("admin");

  const { handleLogout } = props;

  const email = firebase.auth().currentUser.email;

  const setPage = (page) => {
    setSelectedPage(page);
  };

  return (
    <>
      <div class="container-fluid">
        <div class="row h-100 flex-nowrap">
          <div class="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark">
            <div class="sticky-top">
              <div class="d-flex flex-column align-items-start align-items-sm-start px-3 text-white min-vh-100">
                <div class="mt-4 d-flex align-items-center pb-3 mb-md-0 me-md-auto text-white text-decoration-none">
                  <span class="fs-3 d-sm-inline">
                    <b>GO GREEN</b>
                  </span>
                </div>
                <ul
                  class="nav nav-pills flex-column mb-sm-auto mb-0 align-items-start align-items-sm-start"
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
                      <span class="d-sm-inline">Admins</span>
                    </div>
                  </li>
                  <li class="nav-item">
                    <div
                      onClick={() => setPage("user")}
                      id="sidebar-content"
                      class="nav-link align-middle px-0"
                    >
                      <i
                        style={{ fontSize: "1.5rem", marginRight: "10px" }}
                        class="bi bi-people-fill"
                      ></i>
                      <span class="d-sm-inline">Users</span>
                    </div>
                  </li>
                  <li class="nav-item">
                    <div
                      onClick={() => setPage("course")}
                      id="sidebar-content"
                      class="nav-link align-middle px-0"
                    >
                      <i
                        style={{ fontSize: "1.22rem", marginRight: "10px" }}
                        class="fas fa-chalkboard-teacher"
                      ></i>
                      <span class="d-sm-inline">Courses</span>
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
                      <span class="d-sm-inline">Quizes</span>
                    </div>
                  </li>
                  <li id="logout" class="nav-item">
                    <div
                      onClick={handleLogout}
                      id="logout"
                      class="nav-link align-middle px-0"
                    >
                      <i
                        style={{ fontSize: "1.5rem", color: "red", marginRight: "10px" }}
                        class="bi bi-box-arrow-right"
                      ></i>
                      <span style={{color: "red"}}class="ms-1 d-sm-inline">Logout</span>
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
