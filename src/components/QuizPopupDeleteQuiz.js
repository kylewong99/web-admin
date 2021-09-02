import React from "react";
import { Button, Modal } from "react-bootstrap";

const QuizPopupDeleteQuiz = (props) => {
  const { show, onHide, deleteQuiz } = props;

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
            Delete Quiz
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete this quiz?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteQuiz}>
            Delete
          </Button>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuizPopupDeleteQuiz;
