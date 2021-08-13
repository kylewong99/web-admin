import React from "react";
import { Button, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const AdminPopupAdd = (props) => {
  const {
    email,
    password,
    confirmPassword,
    setEmail,
    setPassword,
    setConfirmPassword,
    onHide,
    show,
    addAdmin,
    emailError,
    passwordError,
    confirmPasswordError,
  } = props;

  return (
    <div>
      <Modal
        show={show}
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
                <b>Email:</b>
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
            {emailError.length > 0 && (
              <div class="form-group row mb-3">
                <div style={{color:"red"}} class="col-sm-12">{emailError}</div>
              </div>
            )}
            <div class="form-group row mb-3">
              <label for="inputPassword" class="col-sm-3 col-form-label">
                <b>Password:</b>
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
            {passwordError.length > 0 && (
              <div class="form-group row mb-3">
                <div style={{color:"red"}} class="col-sm-12">{passwordError}</div>
              </div>
            )}
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-3 col-form-label">
                <b>Confirm Password:</b>
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
            {confirmPasswordError.length > 0 && (
              <div class="form-group row mt-3">
                <div style={{color:"red"}} class="col-sm-12">{confirmPasswordError}</div>
              </div>
            )}
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={addAdmin}>Add</Button>
          <Button variant="danger" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPopupAdd;
