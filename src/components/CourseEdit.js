import React, { useState, useEffect, setState } from "react";
import { Button, Image } from "react-bootstrap";
import "firebase/storage";
import firebase from "firebase/app";
import { useStateWithCallbackLazy } from "use-state-with-callback";

const CourseEdit = (props) => {
  const { setCourseEdit } = props;

  const [topics, setTopics] = useStateWithCallbackLazy([]);
  const [imageURL, setImageURL] = useStateWithCallbackLazy([]);

  const courseID = localStorage.getItem("courseID");
  const courseTitle = localStorage.getItem("courseTitle");
  const topicID = localStorage.getItem("topicID");

  let counter = 0;

  const storage = firebase.storage();

  const ref = firebase
    .firestore()
    .collection("courses")
    .doc(courseID)
    .collection("topics")
    .doc(topicID);

  const getTopic = async () => {
    ref.onSnapshot((topic) => {
      const topics = [];
      topics.push(topic.data());
      setTopics(topics, async () => {
        const imageList = await getImage(topics[0]);
        setImageURL(imageList);
      });
    });
  };

  const getImage = async (topics) => {
    const imageList = [];
    for (let i = 1; i <= topics.noImage; i++) {
      const imageURL = await storage
        .ref()
        .child(topics["image" + i])
        .getDownloadURL();
      imageList.push(imageURL);
    }

    return new Promise((resolve, reject) => {
      resolve(imageList);
    });
  };

  useEffect(() => {
    getTopic();
  }, []);

  return (
    <>
      <div class="row">
        <div class="col">
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <a onClick={() => setCourseEdit("false")} href="#">
                  Course
                </a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {courseTitle}
              </li>
            </ol>
          </nav>
        </div>
        <div class="col-auto">
          <div class="btn-group">
            <div className="btn-toolbar">
              <Button
                className="me-2"
                //   onClick={() => {
                //     setModalAddQuizShow(true);
                //   }}
              >
                Edit Topic
              </Button>
            </div>
            <div className="btn-toolbar">
              <Button
                className="me-2"
                variant="danger"
                //   onClick={() => {
                //     setModalAddQuizShow(true);
                //   }}
              >
                Delete Topic
              </Button>
            </div>
          </div>
        </div>
      </div>

      <table class="table">
        <tbody>
          {topics.map((topic) => {
            return (
              <>
                <tr key={topic.id}>
                  <th>Title</th>
                  {/* <td>{counter}</td> */}
                  <td>{topic.title}</td>
                </tr>
                <tr key={topic.id}>
                  <th>Content</th>
                  <td>{topic.content}</td>
                </tr>
                {imageURL.map((image) => {
                  counter += 1;
                  return (
                    <>
                      <tr>
                        <th>Image{counter}</th>
                        <td>
                          <img width="200" height="200" src={image} />
                        </td>
                      </tr>
                    </>
                  );
                })}
              </>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default CourseEdit;
