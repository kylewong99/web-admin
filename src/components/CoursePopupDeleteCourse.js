import React from "react";
import { Button, Modal } from "react-bootstrap";

const CoursePopupDeleteCourse = (props) => {
  const { show, onHide, deleteCourse } = props;

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
            Delete Course
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Are you sure you want to delete this course?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={deleteCourse}>
            Delete
          </Button>
          <Button onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CoursePopupDeleteCourse;
