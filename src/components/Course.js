import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import firebase from "firebase/app";
import CourseEdit from "./CourseEdit";
import CoursePopupDeleteCourse from "./CoursePopupDeleteCourse";
import CoursePopupAddCourse from "./CoursePopupAddCourse";
import CoursePopupEditCourse from "./CoursePopupEditCourse";
import CoursePopupAddTopic from "./CoursePopupAddTopic";
import CoursePopupDeleteTopic from "./CoursePopupDeleteTopic";
import "firebase/storage";
import "./Course.css";
import { v4 as uuidv4 } from "uuid";

const Course = () => {
  const ref = firebase.firestore().collection("courses");
  const storage = firebase.storage();
  const storageRef = storage.ref();

  const [courses, setCourses] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [titles, setTitles] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [courseEdit, setCourseEdit] = useState("false");

  // Use for displaying and hiding popup modal
  const [modalAddCourseShow, setModalAddCourseShow] = useState();
  const [modalDeleteCourseShow, setModalDeleteCourseShow] = useState();
  const [modalEditCourseShow, setModalEditCourseShow] = useState();
  const [modalAddTopicShow, setModalAddTopicShow] = useState();
  const [modalDeleteTopicShow, setModalDeleteTopicShow] = useState();

  //Use in Add Course Page
  const [courseTitle, setCourseTitle] = useState("");
  const [image, setImage] = useState(null);

  //Use in Add Topic Page
  const [topicTitle, setTopicTitle] = useState("");
  const [topicContent, setTopicContent] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");

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
    setTopicContent("");
    setTopicTitle("");
    setYoutubeURL("");
    setImage(null);
  };

  // Get title of all courses
  const getTitle = async () => {
    return new Promise((resolve, reject) => {
      ref.onSnapshot((querySnapShot) => {
        const title = [];
        querySnapShot.forEach((courseTitle) => {
          title.push(courseTitle.data());
        });
        setTitles(title);
        console.log(selectedTitle);

        resolve(title);
      });
    });
  };

  // Get all courses from the selected quiz
  const getCourse = async () => {
    const title = await getTitle();

    if (title != null) {
      if (localStorage.getItem("courseID") === null) {
        localStorage.setItem("courseID", title[0].id);
      }
      if (localStorage.getItem("topicTitle") === null) {
        localStorage.setItem("topicTitle", title[0].title);
      }

      setSelectedTitle(localStorage.getItem("courseID"));

      let chosenTitle = "";

      if (selectedTitle.trim().length === 0) {
        chosenTitle = title[0].id;
      } else {
        chosenTitle = selectedTitle;
      }

      ref
        .doc(chosenTitle)
        .collection("topics")
        .onSnapshot((querySnapShot) => {
          const courses = [];
          querySnapShot.forEach((course) => {
            courses.push(course.data());
          });
          setCourses(courses);
        });
    }
  };

  const deleteTopic = () => {
    const courseID = localStorage.getItem("courseID");
    const topicID = localStorage.getItem("topicID");
    setModalDeleteTopicShow(false);
    ref.doc(courseID).collection("topics").doc(topicID).delete();
  };

  const deleteCourse = async () => {
    const courseID = localStorage.getItem("courseID");
    await ref.doc(courseID).delete();
    setModalDeleteCourseShow(false);

    const title = await getTitle();

    if (title.length === 0) {
      await setSelectedTitle("");
    } else {
      await setSelectedTitle(title[0].id);
      localStorage.setItem("courseTitle", title[0].title);
      localStorage.setItem("courseID", title[0].id);
    }
  };

  const addCourse = async () => {
    let courseID = uuidv4();
    const storageRef = storage.ref();
    const fileRef = storageRef.child("courses/" + courseID + ".png");
    await fileRef.put(image);

    let imagePath = "courses/" + courseID + ".png";
    ref
      .doc(courseID)
      .set({
        clicked: 0,
        id: courseID,
        image: imagePath,
        title: courseTitle,
      })
      .then(() => {
        setModalAddCourseShow(false);
        clearInputs();
      });
  };

  const getImage = async () => {
    let titleList = await getTitle();
    let courseID = selectedTitle;
    let chosenTitle = titleList.filter((item) => {
      return item.id === courseID;
    });

    const imageUrl = await storage
      .ref()
      .child(chosenTitle[0].image)
      .getDownloadURL();

    localStorage.setItem("courseImageURL", imageUrl);
  };

  const editCourse = async () => {
    let courseID = selectedTitle;
    if (image != null) {
      let imageRef = "courses/" + courseID + ".png";
      const fileRef = storageRef.child(imageRef);
      await fileRef.put(image);
    }

    ref
      .doc(courseID)
      .update({
        title: courseTitle,
      })
      .then(() => {
        localStorage.setItem("courseTitle", courseTitle);
        setModalEditCourseShow(false);
        clearInputs();
      });
  };

  const addTopic = (topicID, topic) => {
    ref
      .doc(selectedTitle)
      .collection("topics")
      .doc(topicID)
      .set(topic)
      .then(() => {
        setModalAddTopicShow(false);
        clearInputs();
      });
  };

  useEffect(() => {
    getCourse();
  }, [selectedTitle]);

  return (
    <>
      {courseEdit === "true" ? (
        <CourseEdit setCourseEdit={setCourseEdit} />
      ) : (
        <>
          <CoursePopupEditCourse
            show={modalEditCourseShow}
            courseTitle={courseTitle}
            image={image}
            setCourseTitle={setCourseTitle}
            setImage={setImage}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            editCourse={editCourse}
            onHide={() => {
              setModalEditCourseShow(false);
              clearInputs();
            }}
          />

          <CoursePopupAddTopic
            show={modalAddTopicShow}
            youtubeURL={youtubeURL}
            setYoutubeURL={setYoutubeURL}
            topicTitle={topicTitle}
            topicContent={topicContent}
            setTopicTitle={setTopicTitle}
            setTopicContent={setTopicContent}
            selectedTitle={selectedTitle}
            addTopic={addTopic}
            onHide={() => {
              setModalAddTopicShow(false);
              clearInputs();
            }}
          />

          <CoursePopupAddCourse
            show={modalAddCourseShow}
            courseTitle={courseTitle}
            image={image}
            setCourseTitle={setCourseTitle}
            setImage={setImage}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            addCourse={addCourse}
            onHide={() => {
              setModalAddCourseShow(false);
              clearInputs();
            }}
          />
          <CoursePopupDeleteCourse
            show={modalDeleteCourseShow}
            deleteCourse={deleteCourse}
            onHide={() => setModalDeleteCourseShow(false)}
          />
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
                  onClick={() => {
                    setModalAddCourseShow(true);
                  }}
                >
                  Create Course
                </Button>
                <Button
                  onClick={async () => {
                    await getImage();
                    if (localStorage.getItem("courseTitle") === null) {
                      let courseList = await getTitle();
                      let chosenTitle = courseList.filter((item) => {
                        return item.id === selectedTitle;
                      });
                      setCourseTitle(chosenTitle[0].title);
                    } else {
                      setCourseTitle(localStorage.getItem("courseTitle"));
                    }
                    setModalEditCourseShow(true);
                  }}
                >
                  Edit Course
                </Button>
                <Button
                  onClick={() => setModalDeleteCourseShow(true)}
                  variant="danger"
                  className="ms-2"
                >
                  Delete Course
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
                let courseTitle = document.getElementById(
                  e.target.value
                ).innerHTML;
                localStorage.setItem("courseTitle", courseTitle);
                setSelectedTitle(e.target.value);
                getCourse();
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
          <div class="table-responsive">
            <table class="table mt-1">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Topic Title</th>
                  <th style={{ textAlign: "right" }} scope="col">
                    <Button
                      onClick={() => {
                        setModalAddTopicShow(true);
                      }}
                    >
                      Add Topic
                    </Button>
                  </th>
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
                              variant="primary"
                              onClick={() => {
                                localStorage.setItem("topicID", course.id);
                                localStorage.setItem(
                                  "topicTitle",
                                  course.title
                                );
                                setCourseEdit("true");
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              className="ms-2"
                              onClick={() => {
                                setModalDeleteTopicShow(true);
                                localStorage.setItem("topicID", course.id);
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
          </div>
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
