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
