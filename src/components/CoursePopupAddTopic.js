import React from "react";
import { Button, Modal } from "react-bootstrap";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";
import getVideoId from "get-video-id";

const CoursePopupAddTopic = (props) => {
  const {
    show,
    onHide,
    topicTitle,
    youtubeURL,
    setYoutubeURL,
    topicContent,
    setTopicTitle,
    setTopicContent,
    selectedTitle,
    addTopic,
  } = props;

  const storage = firebase.storage();
  const storageRef = storage.ref();

  let counter = 1;
  let imageIDlist = [];

  const addImage = () => {
    let noImage = counter;
    imageIDlist.push(noImage);

    var newElement = document.createElement("div");
    newElement.id = "imageContainer" + noImage;

    var imageElement = document.createElement("div");
    imageElement.className = "form-group row mb-3";

    var imageLabel = document.createElement("label");
    imageLabel.className = "col-sm-3 col-form-label";

    var imageBold = document.createElement("b");
    imageBold.id = "imageLabel" + noImage;
    imageBold.innerHTML = "Image" + (imageIDlist.indexOf(noImage) + 1);

    imageLabel.appendChild(imageBold);
    imageElement.appendChild(imageLabel);

    var imageContainer = document.createElement("div");
    imageContainer.className = "col-sm-9";

    var image = document.createElement("img");
    image.id = "image" + noImage;
    image.width = "200";
    image.height = "200";

    imageContainer.appendChild(image);
    imageElement.appendChild(imageContainer);

    var inputImageElement = document.createElement("div");
    inputImageElement.className = "form-group row mb-3";

    var inputImageLabel = document.createElement("label");
    inputImageLabel.className = "col-sm-3 col-form-label";

    inputImageElement.appendChild(inputImageLabel);

    var inputImageContainer = document.createElement("div");
    inputImageContainer.className = "col-sm-9";

    var inputImage = document.createElement("input");
    inputImage.id = "inputImage" + noImage;
    inputImage.type = "file";
    inputImage.accept = "image/*";
    inputImage.onchange = (e) => {
      document.getElementById(image.id).src = window.URL.createObjectURL(
        e.target.files[0]
      );
    };

    var deleteImage = document.createElement("button");
    deleteImage.className = "btn btn-danger btn-sm";
    deleteImage.innerHTML = "Delete Image";
    deleteImage.onclick = () => {
      imageIDlist.splice(imageIDlist.indexOf(noImage), 1);
      imageIDlist.forEach((id) => {
        document.getElementById("imageLabel" + id).innerHTML =
          "Image" + (imageIDlist.indexOf(id) + 1);
      });
      document.getElementById(newElement.id).remove();
    };

    inputImageContainer.appendChild(inputImage);
    inputImageContainer.appendChild(deleteImage);
    inputImageElement.appendChild(inputImageContainer);

    newElement.appendChild(imageElement);
    newElement.appendChild(inputImageElement);

    document.getElementById("inputs").appendChild(newElement);

    counter += 1;
  };

  const checkImageEmpty = () => {
    for (let i = 0; i < imageIDlist.length; i++) {
      if (
        document.getElementById("image" + imageIDlist[i]).src.trim().length ===
        0
      ) {
        console.log("empty");
        document.getElementById("errorMessage").innerHTML =
          "Please make sure there are no empty fields.";
        return true;
      }
    }
    return false;
  };

  const checkYoutubeURL = () => {
    if (youtubeURL.trim().length > 0) {
      if (getVideoId(youtubeURL).id != null && youtubeURL.includes("youtu")) {
        document.getElementById("youtubeErrorMessage").innerHTML = "";
        return false;
      } else {
        document.getElementById("youtubeErrorMessage").innerHTML =
          "Please provide an valid youtube URL.";
        return true;
      }
    } else {
      return false;
    }
  };

  const isEmpty = async () => {
    if (
      checkYoutubeURL() ||
      topicTitle.trim().length === 0 ||
      topicContent.trim().length === 0 ||
      checkImageEmpty()
    ) {
      console.log("Topic Edit unsuccessful.");

      if (topicTitle.trim().length > 0 && topicContent.trim().length > 0) {
        document.getElementById("errorMessage").innerHTML = "";
      } else {
        document.getElementById("errorMessage").innerHTML =
          "Please make sure Topic title and Content was filled";
      }
    } else {
      document.getElementById("errorMessage").innerHTML = "";
      document.getElementById("youtubeErrorMessage").innerHTML = "";
      let topicID = uuidv4();
      let topic = {
        id: topicID,
        title: topicTitle,
        noImage: imageIDlist.length,
        content: topicContent,
      };

      if (youtubeURL.trim().length > 0) {
        let videoID = getVideoId(youtubeURL).id;
        let convertedYoutubeURL = "https://www.youtube.com/embed/" + videoID;

        topic["youtubeURL"] = convertedYoutubeURL;
      }

      for (let i = 1; i <= imageIDlist.length; i++) {
        let imageRef =
          "courses/" + selectedTitle + "/" + topicID + "/image" + i + ".png";
        topic["image" + i] = imageRef;

        const fileRef = storageRef.child(imageRef);
        await fileRef.put(
          document.getElementById("inputImage" + imageIDlist[i - 1]).files[0]
        );
      }

      addTopic(topicID, topic);
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
              Add Topic
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div id="inputs">
                <div class="form-group row mb-3">
                  <label class="col-sm-3 col-form-label">
                    <b>Topic title: </b>
                  </label>
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      value={topicTitle}
                      onChange={(e) => setTopicTitle(e.target.value)}
                    />
                  </div>
                </div>
                <div class="form-group row mb-3">
                  <label class="col-sm-3 col-form-label">
                    <b>Content:</b>
                  </label>
                  <div class="col-sm-9">
                    <div class="input-group">
                      <textarea
                        id="content"
                        rows="10"
                        class="form-control"
                        style={{ whiteSpace: "pre-wrap" }}
                        value={topicContent}
                        onChange={(e) => setTopicContent(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Tab") {
                            e.preventDefault();
                            e.target.value += "      ";
                          }
                        }}
                        aria-label="With textarea"
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div class="form-group row mb-3">
                  <label class="col-sm-3 col-form-label">
                    <b>Youtube URL: </b>
                  </label>
                  <div class="col-sm-9">
                    <input
                      type="text"
                      class="form-control"
                      value={youtubeURL}
                      onChange={(e) => setYoutubeURL(e.target.value)}
                    />
                  </div>
                </div>
                <div class="form-group row mt-3">
                  <div
                    id="youtubeErrorMessage"
                    style={{ color: "red" }}
                    class="col-sm-12"
                  />
                </div>
              </div>
              <div class="form-group row mt-4">
                <label class="col-sm-3 col-form-label" />
                <div class="col-sm-9">
                  <Button
                    onClick={() => {
                      addImage();
                    }}
                  >
                    Add Image
                  </Button>
                </div>
              </div>
              <div class="form-group row mt-3">
                <div
                  id="errorMessage"
                  style={{ color: "red" }}
                  class="col-sm-12"
                />
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => isEmpty()}>Add</Button>
            <Button variant="danger" onClick={onHide}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    </div>
  );
};

export default CoursePopupAddTopic;
