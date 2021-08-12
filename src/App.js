import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import "./App.css";
import Index from "./components/Index";
import Login from "./components/Login";
import firebase from "./firebase";

function App() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Get admin collection from database
  const ref = firebase.firestore().collection("admin");

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
  };

  const checkAdminStatus = () => {
    clearErrors();
    const admins = [];
    ref.where("email", "==", email).onSnapshot((querySnapShot) => {
      querySnapShot.forEach((admin) => {
        admins.push(admin.data());
      });
      console.log(admins.length);
      if (admins.length > 0) {
        handleLogin();
      } else {
        setPasswordError("The email or password is invalid.");
      }
    });
  };

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        console.log(err.code);
        switch (err.code) {
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            console.log(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handleLogout = () => {
    firebase.auth().signOut();
    console.log("Logout");
  };

  const authListener = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        clearInputs();
        setUser(user);
      } else {
        setUser("");
      }
    });
  };

  useEffect(() => {
    authListener();
  }, []);

  return (
    <>
      {user ? (
        <Index handleLogout={handleLogout} />
      ) : (
        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          checkAdminStatus={checkAdminStatus}
          emailError={emailError}
          passwordError={passwordError}
        />
      )}
    </>
  );
}

export default App;
