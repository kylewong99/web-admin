import React, { useState, useEffect, useRef } from "react";
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";
import "./Admin.css";
import { Button, Modal } from "react-bootstrap";
import AdminPopupAdd from "./AdminPopupAdd";

export default function Content() {
  const [admins, setAdmins] = useState([]);
  const [modalShow, setModalShow] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Get admin collection from database
  const ref = firebase.firestore().collection("admin");

  const AdminPopupAdds = () => {
    return (
      <Modal
        show={modalShow}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Add New Admin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="form-group row mb-3">
              <label for="staticEmail" class="col-sm-3 col-form-label">
                Email
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label for="inputPassword" class="col-sm-3 col-form-label">
                Password
              </label>
              <div class="col-sm-9">
                <input
                  type="password"
                  class="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-3 col-form-label">
                Confirm Password
              </label>
              <div class="col-sm-9">
                <input
                  type="password"
                  class="form-control"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => addAdmin({ email, id: uuidv4() })}>Add</Button>
          <Button variant="danger" onClick={() => setModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
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
  const addAdmin = () => {
    const newAdmin = { email, id: uuidv4() };
    clearErrors();
    if (confirmPassword.length == password.length) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
          ref
            .doc(newAdmin.id)
            .set(newAdmin)
            .then(() => {
              clearInputs();
            })
            .catch((err) => {
              console.error(err);
            });
        })
        .catch((err) => {
          switch (err.code) {
            case "auth/email-already-in-use":
            case "auth/invalid-email":
              setEmailError(err.message);
              break;
            case "auth/weak-password":
              setPasswordError(err.message);
              break;
          }
        });
    } else {
      setConfirmPasswordError("Invalid confirm password.");
    }
  };

  // DELETE FUNCTION
  function deleteUser(user) {
    ref
      .doc(user.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getAdmin();
  }, []);

  return (
    <>
      <Button variant="primary" onClick={() => setModalShow(true)}>
        Add New
      </Button>

      <AdminPopupAdd
        show={modalShow}
        onHide={() => setModalShow(false)}
        email={email}
        password={password}
        confirmPassword={confirmPassword}
        setEmail={setEmail}
        setPassword={setPassword}
        setConfirmPassword={setConfirmPassword}
        addAdmin={addAdmin}
      />

      {admins.map((admin) => (
        <div key={admin.id}>
          <h2>{admin.email}</h2>
          {/* <button onClick={() => deleteUser(user)}>X</button> */}
        </div>
      ))}
    </>
  );
}
