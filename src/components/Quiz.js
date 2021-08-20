import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "./Quiz.css";
import { Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Form } from "react-bootstrap";
import QuizPopupDelete from "./QuizPopupDelete";
import QuizPopupEdit from "./QuizPopupEdit";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [modalDeleteShow, setModalDeleteShow] = useState();
  const [modalEditShow, setModalEditShow] = useState();
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("quiz1");

  // To show the questions details in the edit page
  const [question, setQuestion] = useState();
  const [optionA, setOptionA] = useState();
  const [optionB, setOptionB] = useState();
  const [optionC, setOptionC] = useState();
  const [optionD, setOptionD] = useState();
  const [answer, setAnswer] = useState();
  const [errorMessage, setErrorMessage] = useState("");

  const ref = firebase.firestore().collection("quizzes");

  const quizzesPerPage = 10;
  const pageVisited = pageNumber * quizzesPerPage;

  const pageCount = Math.ceil(quizzes.length / quizzesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  let counter = 0;

  // Get title of all quizzes
  const getTitle = () => {
    ref.onSnapshot((querySnapShot) => {
      const title = [];
      console.log(titles.length < 1);
      querySnapShot.forEach((quizTitle) => {
        title.push(quizTitle.data());
      });
      setTitles(title);
      console.log(selectedTitle);
    });
  };

  // Get all questions from the selected quiz
  const getQuiz = () => {
    ref
      .doc(selectedTitle)
      .collection("questions")
      .onSnapshot((querySnapShot) => {
        const questions = [];
        querySnapShot.forEach((question) => {
          questions.push(question.data());
        });
        setQuizzes(questions);
      });
  };

  const deleteQuestion = () => {
    var docID = localStorage.getItem("docID");

    ref
      .doc(selectedTitle)
      .collection("questions")
      .doc(docID)
      .delete()
      .then(() => {
        if (
          quizzes.slice(pageVisited, pageVisited + quizzesPerPage).length <= 1
        ) {
          setPageNumber((previousPage) => previousPage - 1);
        }
        setModalDeleteShow(false);
      });
  };

  const isEmpty = () => {};

  const editQuestion = (updatedQuestion) => {

    ref
      .doc(selectedTitle)
      .collection("questions")
      .doc(updatedQuestion.id)
      .set(updatedQuestion)
      .then(() => {
        setModalEditShow(false);
      });
  };

  useEffect(() => {
    getTitle();
    getQuiz();
  }, [selectedTitle]);

  return (
    <>
      <QuizPopupDelete
        show={modalDeleteShow}
        onHide={() => setModalDeleteShow(false)}
        deleteQuestion={() => deleteQuestion()}
      />
      <QuizPopupEdit
        show={modalEditShow}
        onHide={() => setModalEditShow(false)}
        question={question}
        optionA={optionA}
        optionB={optionB}
        optionC={optionC}
        optionD={optionD}
        answer={answer}
        errorMessage={errorMessage}
        setQuestion={setQuestion}
        setOptionA={setOptionA}
        setOptionB={setOptionB}
        setOptionC={setOptionC}
        setOptionD={setOptionD}
        setAnswer={setAnswer}
        setErrorMessage={setErrorMessage}
        editQuestion={editQuestion}
      />
      <Form.Group controlId="formBasicSelect">
        <Form.Label>
          <b>Select Quizzes Chapter</b>
        </Form.Label>
        <Form.Control
          as="select"
          value={selectedTitle}
          onChange={(e) => {
            console.log("e.target.value", e.target.value);
            setSelectedTitle(e.target.value);
          }}
        >
          {titles.map((title) => {
            return <option value={title.id}>{title.title}</option>;
          })}
        </Form.Control>
      </Form.Group>
      <table class="table">
        <thead>
          <tr>
            <th scope="col">No</th>
            <th scope="col">Questions</th>
            <th scope="col">Option A</th>
            <th scope="col">Option B</th>
            <th scope="col">Option C</th>
            <th scope="col">Option D</th>
            <th scope="col">Answer</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {quizzes
            .slice(pageVisited, pageVisited + quizzesPerPage)
            .map((quiz) => {
              counter += 1;
              return (
                <>
                  <tr key={quiz.id}>
                    <td>{counter}</td>
                    <td>{quiz.question}</td>
                    <td>{quiz.optionA}</td>
                    <td>{quiz.optionB}</td>
                    <td>{quiz.optionC}</td>
                    <td>{quiz.optionD}</td>
                    <td>{quiz.answer}</td>
                    <td>
                      <Button
                        className="me-2"
                        onClick={() => {
                          ref
                            .doc(selectedTitle)
                            .collection("questions")
                            .doc(quiz.id)
                            .get()
                            .then((quiz) => {
                              setQuestion(quiz.data().question);
                              setOptionA(quiz.data().optionA);
                              setOptionB(quiz.data().optionB);
                              setOptionC(quiz.data().optionC);
                              setOptionD(quiz.data().optionD);
                              setAnswer(quiz.data().answer);
                            })
                            .then(() => {
                              setModalEditShow(true);
                              localStorage.setItem("docID", quiz.id);
                            });
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => {
                          setModalDeleteShow(true);
                          localStorage.setItem("question", quiz.question);
                          localStorage.setItem("docID", quiz.id);
                        }}
                      >
                        X
                      </Button>
                    </td>
                  </tr>
                </>
              );
            })}
        </tbody>
      </table>
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        forcePage={pageNumber}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </>
  );
};

export default Quiz;
