import React from "react";
import { Button, Modal } from "react-bootstrap";

const AdminPopupDelete = (props) => {

   const {
       show,
       onHide,
       deleteAdmin
   } = props;

   const email = localStorage.getItem("deleteEmail");
   const adminId = localStorage.getItem("deleteAdminId");

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
            Delete Admin
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete {email}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => deleteAdmin({id: adminId, adminEmail: email})}>Delete</Button>
          <Button onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminPopupDelete;
