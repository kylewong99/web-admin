import React, { useState, useEffect, useRef } from "react";
import firebase from "firebase/app";
import "./Quiz.css";
import { Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Form } from "react-bootstrap";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [modalDeleteShow, setModalDeleteShow] = useState();
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState();

  const ref = firebase.firestore().collection("quizzes");

  const quizzesPerPage = 10;
  const pageVisited = pageNumber * quizzesPerPage;

  const pageCount = Math.ceil(quizzes.length / quizzesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  let counter = 0;

  const getQuizTitle = () => {
    ref.onSnapshot((querySnapShot) => {
      const title = [];
      querySnapShot.forEach((quizTitle) => {
        title.push(quizTitle.data());
      });
      setTitles(title);
      console.log(selectedTitle);
      if (selectedTitle == undefined) {
        setSelectedTitle("Environmental Issues");
      }
    });
  };

  const getQuiz = () => {
    var query;
    if (selectedTitle == undefined) {
      query = ref.where("title", "==", "Environmental Issues");
    } else {
      query = ref.where("title", "==", selectedTitle);
    }
    query.onSnapshot((querySnapShot) => {
      const questions = [];
      querySnapShot.forEach((quiz) => {
        quiz.ref.collection("questions").onSnapshot((querySnapShot) => {
          querySnapShot.forEach((quiz) => {
            questions.push(quiz.data());
          });
          console.log(questions.length);
          setQuizzes(questions);
        });
      });
    });
  };

  useEffect(() => {
    getQuizTitle();
    getQuiz();
  }, [selectedTitle]);

  return (
    <>
      <Form.Group controlId="formBasicSelect">
        <Form.Label><b>Select Quizzes Chapter</b></Form.Label>
        <Form.Control
          as="select"
          value={selectedTitle}
          onChange={(e) => {
            console.log("e.target.value", e.target.value);
            setSelectedTitle(e.target.value);
          }}
        >
          {titles.map((title) => {
            return (
            <option key={title.id} value={title.title}>
              {title.title}
            </option>
          )})}
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
                        variant="danger"
                        onClick={() => {
                          setModalDeleteShow(true);
                          //   localStorage.setItem("deleteEmail", admin.email);
                          //   localStorage.setItem("deleteAdminId", admin.id);
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
