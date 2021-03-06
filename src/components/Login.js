import React from "react";
import "./Login.css";
import logo from "../GoGreenLogo.png";

const Login = (props) => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    checkAdminStatus,
    emailError,
    passwordError,
  } = props;

  return (
    <>
      <div style={{ height: "100vh"}} class="container-fluid">
        <div  class="row h-100">
          <div class="col-12 my-auto">
            <div class="card w-50 mx-auto">
              <img
                src={"static/media/GoGreenLogo.59937424.png"}
                width="250"
                height="250"
                class="img-fluid mx-auto"
              />
              <h1 class="mx-auto">Go Green</h1>
              <form>
                <div class="form-group row mb-3 ms-3 me-3">
                  <label for="staticEmail" class="col-sm-3 col-form-label">
                    <b>Email:</b>
                  </label>
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      autofocus
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      id="staticEmail"
                    />
                  </div>
                </div>
                {emailError.length > 0 && (
                  <div class="form-group row mb-3 ms-3 me-3">
                    <div style={{ color: "red" }} class="col-sm-12">
                      {emailError}
                    </div>
                  </div>
                )}
                <div class="form-group row mb-3 ms-3 me-3">
                  <label for="inputPassword" class="col-sm-3 col-form-label">
                    <b>Password:</b>
                  </label>
                  <div class="col-sm-9">
                    <input
                      type="password"
                      class="form-control"
                      id="inputPassword"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {passwordError.length > 0 && (
                  <div class="form-group row mb-3 ms-3 me-3">
                    <div style={{ color: "red" }} class="col-sm-12">
                      {passwordError}
                    </div>
                  </div>
                )}
                <div class="form-group row mb-3 ms-4 me-4">
                  <button
                    class="btn btn-primary"
                    type="button"
                    onClick={checkAdminStatus}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
