import React, { useState, useEffect, setState } from "react";
import { Button, Image } from "react-bootstrap";
import "firebase/storage";
import firebase from "firebase/app";
import CoursePopupDeleteTopic from "./CoursePopupDeleteTopic";
import CoursePopupEditTopic from "./CoursePopupEditTopic";

const CourseEdit = (props) => {
  const { setCourseEdit } = props;

  const [topics, setTopics] = useState([]);
  const [imageURL, setImageURL] = useState([]);
  const [modalDeleteTopicShow, setModalDeleteTopicShow] = useState();
  const [modalEditTopicShow, setModalEditTopicShow] = useState();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [youtubeURL, setYoutubeURL] = useState("");

  const courseID = localStorage.getItem("courseID");
  const topicTitle = localStorage.getItem("topicTitle");
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

  const deleteTopic = () => {
    setModalDeleteTopicShow(false);
    setCourseEdit("false");
    ref.delete();
  };

  const getTopic = async () => {
    ref.onSnapshot(async (topic) => {
      const topics = [];
      let imageList = [];
      topics.push(topic.data());
      console.log(topics);
      setTopics(topics);
      if (topics[0] != undefined) {
        if (topics[0].noImage > 0) {
          imageList = await getImage(topics[0]);
        }
      }
      console.log(imageList);
      setImageURL(imageList);
    });
  };

  const getImage = async (topics) => {
    const imageList = [];
    if (topics != undefined) {
      for (let i = 1; i <= topics.noImage; i++) {
        console.log("how");
        const imageURL = await storage
          .ref()
          .child(topics["image" + i])
          .getDownloadURL();
        imageList.push(imageURL);
      }
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
      <CoursePopupEditTopic
        show={modalEditTopicShow}
        title={title}
        content={content}
        youtubeURL={youtubeURL}
        setYoutubeURL={setYoutubeURL}
        setTitle={setTitle}
        setContent={setContent}
        onHide={() => {
          setModalEditTopicShow(false);
        }}
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
              <li class="breadcrumb-item">
                <a onClick={() => setCourseEdit("false")} href="#">
                  Course
                </a>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {courseTitle}
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {topicTitle}
              </li>
            </ol>
          </nav>
        </div>
        <div class="col-auto">
          <div class="btn-group">
            <div className="btn-toolbar">
              <Button
                className="me-2"
                onClick={() => {
                  localStorage.setItem("imageURL", JSON.stringify(imageURL));
                  setModalEditTopicShow(true);
                  setTitle(topics[0].title);
                  setContent(topics[0].content);
                  if (topics[0].youtubeURL != undefined) {
                    setYoutubeURL(topics[0].youtubeURL);
                  }
                }}
              >
                Edit Topic
              </Button>
            </div>
            <div className="btn-toolbar">
              <Button
                className="me-2"
                variant="danger"
                onClick={() => {
                  setModalDeleteTopicShow(true);
                }}
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
                <tr>
                  <th>Title</th>
                  <td>{topic.title}</td>
                </tr>
                <tr key={topic.id}>
                  <th>Content</th>
                  <td style={{ wordBreak: "break-word" }}>
                    {topic.content != undefined &&
                      topic.content
                        .replaceAll(/ /g, "\u00a0")
                        .split("\n")
                        .map((item) => {
                          return (
                            <>
                              {item}
                              <br />
                            </>
                          );
                        })}
                  </td>
                </tr>
                {topic.youtubeURL != undefined && (
                  <tr>
                    <th>Youtube URL</th>
                    <td>
                      <a href={topic.youtubeURL}>{topic.youtubeURL}</a>
                    </td>
                  </tr>
                )}
                {imageURL.length > 0 &&
                  imageURL.map((image) => {
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
