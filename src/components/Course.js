import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import firebase from "firebase/app";
import CourseEdit from "./CourseEdit";
import CoursePopupDeleteTopic from "./CoursePopupDeleteTopic";
import "firebase/storage";
import "./Course.css";

const Course = () => {
  const [courses, setCourses] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("course1");
  const [collectionSize, setCollectionSize] = useState();
  const [errorMessage, setErrorMessage] = useState("");
  const [modalAddCourseShow, setModalAddCourseShow] = useState();
  const [modalDeleteTopicShow, setModalDeleteTopicShow] = useState();

  const [courseEdit, setCourseEdit] = useState("false");

  //Use in Add Course Page
  const [courseTitle, setCourseTitle] = useState();
  const [image, setImage] = useState(null);

  const ref = firebase.firestore().collection("courses");

  const storage = firebase.storage();
  const courseID = localStorage.getItem("courseID");
  const topicID = localStorage.getItem("topicID");

  const coursesPerPage = 10;
  const pageVisited = pageNumber * coursesPerPage;

  const pageCount = Math.ceil(courses.length / coursesPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  let counter = 0;

  const clearInputs = () => {
    setErrorMessage("");
    setCourseTitle("");
    setImage(null);
  };

  // Get title of all courses
  const getTitle = () => {
    ref.onSnapshot((querySnapShot) => {
      setCollectionSize(querySnapShot.size);
      const title = [];
      console.log(titles.length < 1);
      querySnapShot.forEach((courseTitle) => {
        title.push(courseTitle.data());
      });
      setTitles(title);
      console.log(selectedTitle);
    });
  };

  // Get all courses from the selected quiz
  const getCourse = () => {
    if (courseID.trim().length === 0 || courseID === undefined) {
      localStorage.setItem("courseID", "course1");
    }
    ref
      .doc(selectedTitle)
      .collection("topics")
      .onSnapshot((querySnapShot) => {
        const courses = [];
        querySnapShot.forEach((course) => {
          courses.push(course.data());
        });
        setCourses(courses);
      });
  };

  const deleteTopic = () => {
    setModalDeleteTopicShow(false);
    ref.doc(courseID).collection("topics").doc(topicID).delete();
  };

  const addCourse = async () => {};

  useEffect(() => {
    getTitle();
    getCourse();
  }, [selectedTitle]);

  return (
    <>
      {courseEdit === "true" ? (
        <CourseEdit setCourseEdit={setCourseEdit} />
      ) : (
        <>
          <CoursePopupDeleteTopic
            show={modalDeleteTopicShow}
            deleteTopic={deleteTopic}
            onHide={() => {
              setModalDeleteTopicShow(false);
            }}
          />
          <div class="row">
            <div class="col">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item active" aria-current="page">
                    Course
                  </li>
                </ol>
              </nav>
            </div>
            <div class="col-auto">
              <div className="btn-toolbar">
                <Button
                  className="me-2"
                  //   onClick={() => {
                  //     setModalAddQuizShow(true);
                  //   }}
                >
                  Create Course
                </Button>
              </div>
            </div>
          </div>
          <Form.Group controlId="formBasicSelect">
            <Form.Label>
              <b>Select Courses</b>
            </Form.Label>
            <Form.Control
              as="select"
              value={selectedTitle}
              onChange={(e) => {
                console.log("e.target.value", e.target.value);
                localStorage.setItem("courseID", e.target.value);
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
                <th scope="col">title</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {courses
                .slice(pageVisited, pageVisited + coursesPerPage)
                .map((course) => {
                  counter += 1;
                  return (
                    <>
                      <tr key={course.id}>
                        <td>{counter}</td>
                        <td>{course.title}</td>
                        <td align="right">
                          <Button
                            variant="danger"
                            onClick={() => {
                              setModalDeleteTopicShow(true);
                              localStorage.setItem("topicID", course.id);
                            }}
                          >
                            X
                          </Button>
                          <Button
                            variant="primary"
                            className="ms-2"
                            onClick={() => {
                              localStorage.setItem("topicID", course.id);
                              localStorage.setItem("courseTitle", course.title);
                              setCourseEdit("true");
                            }}
                          >
                            Edit
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
      )}
    </>
  );
};

export default Course;
