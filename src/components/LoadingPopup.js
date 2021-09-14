import React from "react";
import { Modal } from "react-bootstrap";

const LoadingPopup = (props) => {
  const { show } = props;

  return (
    <div>
      <Modal
        show={show}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body>
          <div style={{textAlign: "center"}}>
            <h3 style={{marginBottom: 30}}>Loading</h3>
            <div
              class="spinner-border text-secondary"
              style={{ width: "5rem", height: "5rem" }}
              role="status"
            >
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default LoadingPopup;
