import React from "react";
import "./Login.css";
import firebase from "../firebase";

const Login = (props) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    handleLogin,
    hasAccount,
    setHasAccount,
    emailError,
    passwordError,
  } = props;

  return (
    <>
      <div class="row h-100">
        <div class="col-12 my-auto">
          <div class="card w-50 mx-auto">
            <img src="https://seeklogo.com/images/C/cute-dog-logo-9A80384024-seeklogo.com.png" width="250" height="250" class="img-center"/>
            <h1 id="title">Go Green</h1>
            <div class="container">
              <div class="row justify-content-center">
                <div class="col-6">
                  <b>Email:</b>
                </div>
                <input
                  class="col-6"
                  type="text"
                  autofocus
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <p>{emailError}</p>
              <div class="row justify-content-center">
                <div class="col-6">
                  <b>Password:</b>
                </div>
                <input
                  class="col-6"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <p>{passwordError}</p>
            </div>
            <button onClick={handleLogin}>Submit</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
