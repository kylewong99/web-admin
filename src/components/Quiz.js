import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import "./Quiz.css";
import { Button } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Form } from "react-bootstrap";
import QuizPopupDelete from "./QuizPopupDelete";
import QuizPopupEdit from "./QuizPopupEdit";
import QuizPopupAddQuestion from "./QuizPopupAddQuestion";
import QuizPopupAddQuiz from "./QuizPopupAddQuiz";
import QuizPopupDeleteQuiz from "./QuizPopupDeleteQuiz";
import QuizPopupEditQuiz from "./QuizPopupEditQuiz";
import { v4 as uuidv4 } from "uuid";

const Quiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");

  //Use to display popup modals
  const [modalDeleteShow, setModalDeleteShow] = useState();
  const [modalEditShow, setModalEditShow] = useState();
  const [modalAddQuestionShow, setModalAddQuestionShow] = useState();
  const [modalAddQuizShow, setModalAddQuizShow] = useState();
  const [modalDeleteQuizShow, setModalDeleteQuizShow] = useState();
  const [modalEditQuizShow, setModalEditQuizShow] = useState();

  //Use in Add Quiz Page
  const [quizTitle, setQuizTitle] = useState("");
  const [image, setImage] = useState(null);

  // To show the questions details in the edit page
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [answer, setAnswer] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const ref = firebase.firestore().collection("quizzes");

  const storage = firebase.storage();
  const storageRef = storage.ref();

  const quizzesPerPage = 10;
  const pageVisited = pageNumber * quizzesPerPage;

  const pageCount = Math.ceil(quizzes.length / quizzesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  let counter = 0;

  // Get title of all quizzes
  const getTitle = async () => {
    return new Promise((resolve, reject) => {
      ref.onSnapshot((querySnapShot) => {
        const title = [];
        querySnapShot.forEach((quizTitle) => {
          title.push(quizTitle.data());
        });
        localStorage.setItem("quizzesList", JSON.stringify(title));
        setTitles(title);
        resolve(title);
      });
    });
  };

  // Get all questions from the selected quiz
  const getQuiz = async () => {
    const title = await getTitle();

    if (title != null) {
      if (localStorage.getItem("quizID") === null) {
        localStorage.setItem("quizID", title[0].id);
      }

      if (localStorage.getItem("quizTitle") === null) {
        localStorage.setItem("quizTitle", title[0].title);
      }

      setSelectedTitle(localStorage.getItem("quizID"));

      let chosenTitle = "";

      if (selectedTitle.trim().length === 0) {
        chosenTitle = title[0].id;
      } else {
        chosenTitle = selectedTitle;
      }

      console.log(chosenTitle);

      ref
        .doc(chosenTitle)
        .collection("questions")
        .onSnapshot((querySnapShot) => {
          const questions = [];
          querySnapShot.forEach((question) => {
            questions.push(question.data());
          });
          setQuizzes(questions);
        });
    }
  };

  const clearInputs = () => {
    setErrorMessage("");
    setQuizTitle("");
    setAnswer("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setQuestion("");
    setImage(null);
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

  const editQuestion = (updatedQuestion) => {
    ref
      .doc(selectedTitle)
      .collection("questions")
      .doc(updatedQuestion.id)
      .set(updatedQuestion)
      .then(() => {
        setModalEditShow(false);
        clearInputs();
      });
  };

  const addQuestion = (question) => {
    if (question.answer.trim().length === 0) {
      question.answer = question.optionA;
    }
    ref
      .doc(selectedTitle)
      .collection("questions")
      .doc(question.id)
      .set(question)
      .then(() => {
        setModalAddQuestionShow(false);
        clearInputs();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addQuiz = async () => {
    let quizID = uuidv4();
    const storageRef = storage.ref();
    const fileRef = storageRef.child("quizzes/quiz" + quizID + ".png");
    await fileRef.put(image);

    let imagePath = "quizzes/quiz" + quizID + ".png";
    ref
      .doc(quizID)
      .set({
        id: quizID,
        image: imagePath,
        title: quizTitle,
      })
      .then(() => {
        setModalAddQuizShow(false);
        clearInputs();
      });
  };

  const deleteQuiz = async () => {
    let quizID = localStorage.getItem("quizID");
    await ref.doc(quizID).delete();

    setModalDeleteQuizShow(false);

    let quizzesList = await getTitle();

    if (quizzesList.length === 0) {
      await setSelectedTitle("");
    } else {
      await setSelectedTitle(quizzesList[0].id);
      localStorage.setItem("quizTitle", quizzesList[0].title);
      localStorage.setItem("quizID", quizzesList[0].id);
    }
  };

  const getImage = async () => {
    let quizzesList = await getTitle();
    let quizID = selectedTitle;
    let chosenTitle = quizzesList.filter((item) => {
      return item.id === quizID;
    });

    const imageUrl = await storage
      .ref()
      .child(chosenTitle[0].image)
      .getDownloadURL();

    localStorage.setItem("quizImageURL", imageUrl);
  };

  const editQuiz = async () => {
    let quizID = selectedTitle;
    if (image != null) {
      let imageRef = "quizzes/" + quizID + ".png";
      const fileRef = storageRef.child(imageRef);
      await fileRef.put(image);
    }

    ref
      .doc(quizID)
      .update({
        title: quizTitle,
      })
      .then(() => {
        localStorage.setItem("quizTitle", quizTitle);
        setModalEditQuizShow(false);
        clearInputs();
      });
  };

  useEffect(() => {
    getQuiz();
  }, [selectedTitle]);

  return (
    <>
      <QuizPopupEditQuiz
        show={modalEditQuizShow}
        quizTitle={quizTitle}
        setQuizTitle={setQuizTitle}
        setImage={setImage}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        editQuiz={editQuiz}
        onHide={() => {
          setModalEditQuizShow(false);
          clearInputs();
        }}
      />

      <QuizPopupDeleteQuiz
        show={modalDeleteQuizShow}
        deleteQuiz={deleteQuiz}
        onHide={() => {
          setModalDeleteQuizShow(false);
        }}
      />

      <QuizPopupAddQuiz
        show={modalAddQuizShow}
        image={image}
        quizTitle={quizTitle}
        setImage={setImage}
        setQuizTitle={setQuizTitle}
        addQuiz={addQuiz}
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
        onHide={() => {
          setModalAddQuizShow(false);
          clearInputs();
        }}
      />

      <QuizPopupAddQuestion
        show={modalAddQuestionShow}
        onHide={() => {
          setModalAddQuestionShow(false);
          clearInputs();
        }}
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
        addQuestion={addQuestion}
      />

      <QuizPopupDelete
        show={modalDeleteShow}
        onHide={() => setModalDeleteShow(false)}
        deleteQuestion={() => deleteQuestion()}
      />
      <QuizPopupEdit
        show={modalEditShow}
        onHide={() => {
          setModalEditShow(false);
          clearInputs();
        }}
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

      <div class="row">
        <div class="col">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item active" aria-current="page">
                Quizzes
              </li>
            </ol>
          </nav>
        </div>
        <div class="col-auto">
          <div className="btn-toolbar">
            <Button
              className="me-2"
              onClick={() => {
                setModalAddQuizShow(true);
              }}
            >
              Create New Quiz
            </Button>
            <Button
              onClick={async () => {
                await getImage();
                if (localStorage.getItem("quizTitle") === null) {
                  let quizzesList = await getTitle();
                  let chosenTitle = quizzesList.filter((item) => {
                    return item.id === selectedTitle;
                  });
                  setQuizTitle(chosenTitle[0].title);
                } else {
                  setQuizTitle(localStorage.getItem("quizTitle"));
                }
                setModalEditQuizShow(true);
              }}
            >
              Edit Quiz
            </Button>
            <Button
              variant="danger"
              className="ms-2"
              onClick={() => {
                setModalDeleteQuizShow(true);
              }}
            >
              Delete Quiz
            </Button>
          </div>
        </div>
      </div>

      <Form.Group controlId="formBasicSelect">
        <Form.Label>
          <b>Select Quizzes Chapter</b>
        </Form.Label>
        <Form.Control
          as="select"
          value={selectedTitle}
          onChange={(e) => {
            console.log("e.target.value", e.target.value);
            localStorage.setItem("quizID", e.target.value);
            let quizTitle = document.getElementById(e.target.value).innerHTML;
            localStorage.setItem("quizTitle", quizTitle);
            setSelectedTitle(e.target.value);
          }}
        >
          {titles.map((title) => {
            return (
              <option id={title.id} value={title.id}>
                {title.title}
              </option>
            );
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
            <th style={{ textAlign: "right", width: "11%" }} scope="col">
              <Button
                onClick={() => {
                  setModalAddQuestionShow(true);
                }}
              >
                Add Question
              </Button>
            </th>
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
                    <td align="right">
                      <Button
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
                        className="ms-2"
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
