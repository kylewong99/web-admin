import React from "react";
import { Button, Modal } from "react-bootstrap";

const QuizPopupDelete = (props) => {
  const { show, onHide, deleteQuestion } = props;

  const question = localStorage.getItem("question");

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
          <h5>Are you sure you want to delete question below:</h5>
          {question}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="danger"
            onClick={deleteQuestion}
          >
            Delete
          </Button>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuizPopupDelete;
