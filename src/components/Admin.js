import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Admin.css";
import { Button } from "react-bootstrap";
import AdminPopupAdd from "./AdminPopupAdd";
import AdminPopupDelete from "./AdminPopupDelete";
import firebase from "firebase/app";
import axios from "axios";
import ReactPaginate from "react-paginate";
import LoadingPopup from "./LoadingPopup";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [modalAddShow, setModalAddShow] = useState();
  const [modalDeleteShow, setModalDeleteShow] = useState();
  const [modalLoadingShow, setModalLoadingShow] = useState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const adminsPerPage = 10;
  const pageVisited = pageNumber * adminsPerPage;

  const pageCount = Math.ceil(admins.length / adminsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const ref = firebase.firestore().collection("admin");

  let counter = 0;

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
  };

  const clearInputs = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const getAdmin = () => {
    ref.onSnapshot((querySnapShot) => {
      const admins = [];
      querySnapShot.forEach((admin) => {
        admins.push(admin.data());
      });
      setAdmins(admins);
    });
  };

  // ADD FUNCTION
  const addAdmin = () => {
    const newAdmin = { email, id: uuidv4() };
    clearErrors();
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
            clearInputs();
            ref
              .doc(newAdmin.id)
              .set(newAdmin)
              .catch((err) => {
                console.log(err);
              });
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
      setConfirmPasswordError("Confirm password and password is not matched.");
    }
  };

  const deleteAdmin = (admin) => {
    setModalLoadingShow(true);
    axios
      .get("/deleteUser", {
        params: {
          email: admin.adminEmail,
        },
      })
      .then(function (response) {
        ref
          .doc(admin.id)
          .delete()
          .catch((err) => {
            console.error(err);
          });
        if (
          admins.slice(pageVisited, pageVisited + adminsPerPage).length <= 1
        ) {
          setPageNumber((previousPage) => previousPage - 1);
        }
      });
    setModalLoadingShow(false);
    setModalDeleteShow(false);
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <>
      <LoadingPopup show={modalLoadingShow} />

      <AdminPopupAdd
        show={modalAddShow}
        onHide={() => setModalAddShow(false)}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        setEmail={setEmail}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        addAdmin={addAdmin}
        emailError={emailError}
        passwordError={passwordError}
        confirmPasswordError={confirmPasswordError}
      />

      <AdminPopupDelete
        show={modalDeleteShow}
        onHide={() => setModalDeleteShow(false)}
        deleteAdmin={deleteAdmin}
      />
      <div class="row">
        <div class="col">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active" aria-current="page">
                Admins
              </li>
            </ol>
          </nav>
        </div>
        <div class="col-auto">
          <div className="btn-toolbar">
            <Button variant="primary" onClick={() => setModalAddShow(true)}>
              Add New Admin
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
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {admins
              .slice(pageVisited, pageVisited + adminsPerPage)
              .map((admin) => {
                counter += 1;
                return (
                  <>
                    <tr key={admin.id}>
                      <td>{counter}</td>
                      <td>{admin.email}</td>
                      <td align="right">
                        <Button
                          variant="danger"
                          onClick={() => {
                            setModalDeleteShow(true);
                            localStorage.setItem("deleteEmail", admin.email);
                            localStorage.setItem("deleteAdminId", admin.id);
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
  );
};

export default Admin;
