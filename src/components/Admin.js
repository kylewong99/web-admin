import React, { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import "./Admin.css";
import { Button, Modal } from "react-bootstrap";
import AdminPopupAdd from "./AdminPopupAdd";
import AdminPopupDelete from "./AdminPopupDelete";
import * as admin from "firebase-admin";
import firebase from "firebase/app";
import axios from "axios";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [modalAddShow, setModalAddShow] = useState();
  const [modalDeleteShow, setModalDeleteShow] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [pageNumber, setPageNumber] = useState(0);

  const ref = firebase.firestore().collection("admin");

  let counter = 0;

  const testServer = () => {
    axios
      .get("/deleteAdmin", {
        params: {
          email: "bar",
        },
      })
      .then(function (response) {
        console.log(response.data);
      });
  };

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
  // const addAdmin = () => {
  //   const newAdmin = { email, id: uuidv4() };
  //   clearErrors();
  //   if (confirmPassword.length == password.length) {
  //     firebase
  //       .auth()
  //       .createUserWithEmailAndPassword(email, password)
  //       .then(() => {
  //         ref
  //           .doc(newAdmin.id)
  //           .set(newAdmin)
  //           .then(() => {
  //             clearInputs();
  //           })
  //           .catch((err) => {
  //             console.error(err);
  //           });
  //       })
  //       .catch((err) => {
  //         switch (err.code) {
  //           case "auth/email-already-in-use":
  //           case "auth/invalid-email":
  //             setEmailError(err.message);
  //             break;
  //           case "auth/weak-password":
  //             setPasswordError(err.message);
  //             break;
  //         }
  //       });
  //   } else {
  //     setConfirmPasswordError("Invalid confirm password.");
  //   }
  // };

  const addAdmin = () => {
    const newAdmin = { email, id: uuidv4() };
    if (confirmPassword.length == password.length) {
      axios
        .get("/addAdmin", {
          params: {
            email: email,
            password: password,
          },
        })
        .then(function (response) {
          console.log(response.data);
          if (response.data == "success") {
            ref
              .doc(newAdmin.id)
              .set(newAdmin)
              .catch((err) => {
                console.log(err);
              });
          }
        });
    }
  };

  const deleteAdmin = (admin) => {
    axios
      .get("/deleteAdmin", {
        params: {
          email: admin.adminEmail,
        },
      })
      .then(function (response) {});
    ref
      .doc(admin.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
    setModalDeleteShow(false);
  };

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <>
      <Button variant="primary" onClick={() => setModalAddShow(true)}>
        Add New
      </Button>

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
      <table class="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Email</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {admins.slice(pageNumber, pageNumber + 10).map((admin) => {
            counter += 1;
            return (
              <>
                <tr key={admin.id}>
                  <p>{admins.length}</p>
                  <td>{counter}</td>
                  <td>{admin.email}</td>
                  <td>
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
    </>
  );
};

export default Admin;
