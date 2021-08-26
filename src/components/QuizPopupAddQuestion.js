import React from "react";
import { Button, Modal } from "react-bootstrap";
import { v4 as uuidv4 } from "uuid";

const QuizPopupAddQuestion = (props) => {
  const {
    show,
    onHide,
    question,
    optionA,
    optionB,
    optionC,
    optionD,
    answer,
    errorMessage,
    setQuestion,
    setOptionA,
    setOptionB,
    setOptionC,
    setOptionD,
    setAnswer,
    setErrorMessage,
    addQuestion,
  } = props;

  const isEmpty = () => {
    if (
      question.trim().length === 0 ||
      optionA.trim().length === 0 ||
      optionB.trim().length === 0 ||
      optionC.trim().length === 0 ||
      optionD.trim().length === 0
    ) {
      setErrorMessage("Please make sure there are no empty fields.");
    } else {
      if (answer.trim().length === 0) {
        setAnswer(optionA);
      }
      addQuestion({
        answer: answer,
        id: uuidv4(),
        optionA: optionA,
        optionB: optionB,
        optionC: optionC,
        optionD: optionD,
        question: question,
      });
    }
  };

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
            Add Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="form-group row mb-3">
              <label class="col-sm-3 col-form-label">
                <b>Question:</b>
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label class="col-sm-3 col-form-label">
                <b>Option A:</b>
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  value={optionA}
                  onChange={(e) => setOptionA(e.target.value)}
                />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label class="col-sm-3 col-form-label">
                <b>Option B:</b>
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  value={optionB}
                  onChange={(e) => setOptionB(e.target.value)}
                />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label class="col-sm-3 col-form-label">
                <b>Option C:</b>
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  value={optionC}
                  onChange={(e) => setOptionC(e.target.value)}
                />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label class="col-sm-3 col-form-label">
                <b>Option D:</b>
              </label>
              <div class="col-sm-9">
                <input
                  type="text"
                  class="form-control"
                  value={optionD}
                  onChange={(e) => setOptionD(e.target.value)}
                />
              </div>
            </div>
            <div class="form-group row mb-3">
              <label class="col-sm-3 col-form-label">
                <b>Answer:</b>
              </label>
              <div class="col-sm-9">
                <form>
                  <div class="form-group">
                    <select
                      class="form-control"
                      id="exampleFormControlSelect1"
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                      }}
                    >
                      <option value={optionA}>Option A</option>
                      <option value={optionB}>Option B</option>
                      <option value={optionC}>Option C</option>
                      <option value={optionD}>Option D</option>
                    </select>
                  </div>
                </form>
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
          <Button onClick={() => isEmpty()}>
            Add
          </Button>
          <Button variant="danger" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default QuizPopupAddQuestion;
