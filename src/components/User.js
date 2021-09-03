import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "react-bootstrap";
import "./User.css";
import axios from "axios";
import firebase from "firebase/app";
import UserPopupAddUser from "./UserPopupAddUser";

const User = () => {
  const [users, setUsers] = useState([]);
  const [modalAddUserShow, setModalAddUserShow] = useState();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const ref = firebase.firestore().collection("users");

  const clearErrors = () => {
    setUsernameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const clearInputs = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const addUser = () => {
    let userID = uuidv4();
    clearErrors();
    if (username.trim().length > 0) {
      if (confirmPassword.length === password.length) {
        axios
          .get("/addUser", {
            params: {
              email: email,
              password: password,
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

  return (
    <div>
      <>
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
                  User
                </li>
              </ol>
            </nav>
          </div>
          <div class="col-auto">
            <div className="btn-toolbar">
              <Button
                variant="primary"
                onClick={() => setModalAddUserShow(true)}
              >
                Add New User
              </Button>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default User;
