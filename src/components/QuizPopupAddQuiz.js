import React from "react";
import { Button, Modal } from "react-bootstrap";

const QuizPopupAddQuiz = (props) => {
  const {
    show,
    onHide,
    image,
    quizTitle,
    setImage,
    setQuizTitle,
    addQuiz,
    errorMessage,
    setErrorMessage,
  } = props;

  const isEmpty = () => {
    if (quizTitle.trim().length === 0 || image === null) {
      setErrorMessage("Please make sure there are no empty fields.");
    } else {
      addQuiz(quizTitle);
    }
  };

  return (
    <div>
      <>
        <Modal
          show={show}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">
              Add Quiz
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div class="form-group row mb-3">
                <label class="col-sm-3 col-form-label">
                  <b>Quiz title:</b>
                </label>
                <div class="col-sm-9">
                  <input
                    type="text"
                    class="form-control"
                    value={quizTitle}
                    onChange={(e) => setQuizTitle(e.target.value)}
                  />
                </div>
              </div>
              <div class="form-group row mb-3">
                <label class="col-sm-3 col-form-label">
                  <b>Quiz Cover Page Image:</b>
                </label>
                <div class="col-sm-9">
                  <img id="image" width="200" height="200" />
                </div>
              </div>
              <div class="form-group row mb-3">
                <label class="col-sm-3 col-form-label"></label>
                <div class="col-sm-9">
                  <input
                    id="inputImage"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                      document.getElementById("image").src =
                        window.URL.createObjectURL(e.target.files[0]);
                    }}
                  />
                </div>
              </div>
              {errorMessage.length > 0 && (
                <div class="form-group row mt-3">
                  <div style={{ color: "red" }} class="col-sm-12">
                    {errorMessage}
                  </div>
                </div>
              )}
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => isEmpty()}>Save</Button>
            <Button variant="danger" onClick={onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
};

export default QuizPopupAddQuiz;
