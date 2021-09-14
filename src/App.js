import React, { useState, useEffect } from "react";
import "./App.css";
import Index from "./components/Index";
import Login from "./components/Login";
import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

function App() {
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const firebaseConfig = {
    apiKey: "AIzaSyDT6zycBbllbLqRt1ZfcwjAjaxbRR6qq0w",
    authDomain: "go-green-3620b.firebaseapp.com",
    projectId: "go-green-3620b",
    storageBucket: "go-green-3620b.appspot.com",
    messagingSenderId: "793344993579",
    appId: "1:793344993579:web:cdc05c8917ee1f7a73fd6e",
  };

  if (!firebase.apps.length) {
    console.log("oh my gosssd");
    firebase.initializeApp(firebaseConfig);
  } else {
    firebase.app();
  }

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
          default:
            setPasswordError(err.message);
        }
      });
  };

  const handleLogout = () => {
    console.log("logout");
    firebase.auth().signOut();
    clearInputs();
  };

  const authListener = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
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
