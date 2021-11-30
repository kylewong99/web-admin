import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "react-bootstrap";
import "./User.css";
import axios from "axios";
import firebase from "firebase/app";
import ReactPaginate from "react-paginate";
import UserPopupAddUser from "./UserPopupAddUser";
import UserPopupDeleteUser from "./UserPopupDeleteUser";
import UserViewProgress from "./UserViewProgress";
import LoadingPopup from "./LoadingPopup";

const User = () => {
  const [users, setUsers] = useState([]);
  const [modalAddUserShow, setModalAddUserShow] = useState();
  const [modalDeleteUserShow, setModalDeleteUserShow] = useState();
  const [userViewProgress, setUserViewProgress] = useState(false);
  const [modalLoadingShow, setModalLoadingShow] = useState();

  const [userID, setUserID] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [pageNumber, setPageNumber] = useState(0);

  const usersPerPage = 10;
  const pageVisited = pageNumber * usersPerPage;

  const pageCount = Math.ceil(users.length / usersPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const ref = firebase.firestore().collection("users");

  let counter = 0;

  const clearErrors = () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const clearInputs = () => {
    setUserID("");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const getUsers = () => {
    ref.onSnapshot((querySnapShot) => {
      const users = [];
      querySnapShot.forEach((user) => {
        users.push(user.data());
      });
      users.sort((a,b) => {
        return Date.parse(a.createdDate) < Date.parse(b.createdDate);
      })
      setUsers(users);
    });
  };

  const addUser = () => {
    let userID = uuidv4();
    clearErrors();
    if (username.trim().length > 0) {
      if (confirmPassword.length === password.length) {
        var options = {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "2-digit",
        };
        var today = new Date();

        let date = today.toLocaleDateString("en-US", options);

        axios
          .get("/addUser", {
            params: {
              email: email,
              password: password,
              username: username,
            },
          })
          .then(function (response) {
            console.log(response.data);
            if (response.data === "success") {
              ref
                .doc(userID)
                .set({
                  id: userID,
                  email: email,
                  username: username,
                  createdDate: date,
                })
                .catch((err) => {
                  console.log(err);
                });
              clearInputs();
            } else if (
              response.data ===
              "The email address is already in use by another account."
            ) {
              setEmailError(response.data);
            } else if (
              response.data === "The email address is improperly formatted."
            ) {
              setEmailError(response.data);
            } else if (
              response.data ===
              "The password must be a string with at least 6 characters."
            ) {
              setPasswordError(response.data);
            }
          });
      } else {
        setConfirmPasswordError(
          "Confirm password and password is not matched."
        );
      }
    } else {
      setUsernameError("Username cannot be empty.");
    }
  };

  const deleteUser = () => {
    clearInputs();
    setModalLoadingShow(true);
    axios
      .get("/deleteUser", {
        params: {
          email: email,
        },
      })
      .then(function (response) {
        ref
          .doc(userID)
          .delete()
          .catch((err) => {
            console.error(err);
          });
        if (users.slice(pageVisited, pageVisited + usersPerPage).length <= 1) {
          setPageNumber((previousPage) => previousPage - 1);
        }
      });
    setModalLoadingShow(false);
    setModalDeleteUserShow(false);
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div>
      <>
        {userViewProgress ? (
          <UserViewProgress
            setUserViewProgress={setUserViewProgress}
            username={username}
            userID={userID}
          />
        ) : (
          <>
            <LoadingPopup show={modalLoadingShow} />

            <UserPopupDeleteUser
              show={modalDeleteUserShow}
              onHide={() => {
                clearInputs();
                setModalDeleteUserShow(false);
              }}
              deleteUser={() => deleteUser()}
              email={email}
            />

            <UserPopupAddUser
              show={modalAddUserShow}
              onHide={() => {
                setModalAddUserShow(false);
              }}
              username={username}
              email={email}
              password={password}
              confirmPassword={confirmPassword}
              setUsername={setUsername}
              setEmail={setEmail}
              setPassword={setPassword}
              setConfirmPassword={setConfirmPassword}
              usernameError={usernameError}
              emailError={emailError}
              passwordError={passwordError}
              confirmPasswordError={confirmPasswordError}
              addUser={addUser}
            />
            <div class="row">
              <div class="col">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb">
                    <li class="breadcrumb-item active" aria-current="page">
                      Users
                    </li>
                  </ol>
                </nav>
              </div>
              <div class="col-auto">
                <div className="btn-toolbar">
                  <Button
                    variant="primary"
                    onClick={() => {
                      setUsername("");
                      setModalAddUserShow(true);
                    }}
                  >
                    Add New User
                  </Button>
                </div>
              </div>
            </div>
            <div class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th scope="col">No</th>
                    <th scope="col">Email</th>
                    <th scope="col">Username</th>
                    <th scope="col">Created Date</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {users
                    .slice(pageVisited, pageVisited + usersPerPage)
                    .map((user) => {
                      counter += 1;
                      return (
                        <>
                          <tr key={user.id}>
                            <td>{counter}</td>
                            <td>{user.email}</td>
                            <td>{user.username}</td>
                            <td>{user.createdDate}</td>
                            <td align="right">
                              <Button
                                variant="primary"
                                onClick={() => {
                                  setUserViewProgress(true);
                                  setUsername(user.username);
                                  setUserID(user.id);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="danger"
                                className="ms-2"
                                onClick={() => {
                                  setEmail(user.email);
                                  setUserID(user.id);
                                  setModalDeleteUserShow(true);
                                }}
                              >
                                X
                              </Button>
                            </td>
                          </tr>
                        </>
                      );
                    })}
                </tbody>
              </table>
            </div>
            <ReactPaginate
              previousLabel={"Previous"}
              nextLabel={"Next"}
              pageCount={pageCount}
              onPageChange={changePage}
              forcePage={pageNumber}
              containerClassName={"paginationBttns"}
              previousLinkClassName={"previousBttn"}
              nextLinkClassName={"nextBttn"}
              disabledClassName={"paginationDisabled"}
              activeClassName={"paginationActive"}
            />
          </>
        )}
      </>
    </div>
  );
};

export default User;
