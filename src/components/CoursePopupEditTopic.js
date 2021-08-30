import React from "react";
import { Button, Modal } from "react-bootstrap";
import firebase from "firebase/app";

const CoursePopupEditTopic = (props) => {
  const {
    show,
    onHide,
    title,
    content,
    setTitle,
    setContent
  } = props;

  const topicID = localStorage.getItem("topicID");
  const courseID = localStorage.getItem("courseID");
  const imageURL = JSON.parse(localStorage.getItem("imageURL"));

  const storage = firebase.storage();


  const storageRef = storage.ref();
  const ref = firebase
    .firestore()
    .collection("courses")
    .doc(courseID)
    .collection("topics")
    .doc(topicID);

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
        return true;
      }
    }
    return false;
  };

  const isEmpty = async () => {
    if (
      title.trim().length === 0 ||
      content.trim().length === 0 ||
      checkImageEmpty()
    ) {
      document.getElementById("errorMessage").innerHTML =
        "Please make sure there are no empty fields.";
    } else {
      document.getElementById("errorMessage").innerHTML = "";
      let topic = {
        id: topicID,
        title: title,
        noImage: imageIDlist.length,
        content: content,
      };

      for (let i = 1; i <= imageIDlist.length; i++) {
        let imageRef =
          "courses/" + courseID + "/" + topicID + "/image" + i + ".png";
        topic["image" + i] = imageRef;

        if (
          document.getElementById("inputImage" + imageIDlist[i - 1]).files[0] !=
          undefined
        ) {
          const fileRef = storageRef.child(imageRef);
          await fileRef.put(
            document.getElementById("inputImage" + imageIDlist[i - 1]).files[0]
          );
        }
      }

      ref.set(topic).then(() => {
        onHide();
      });
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
              Edit Topic
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
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
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
                        style={{whiteSpace: "pre-wrap"}}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
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
                {imageURL != null && imageURL.map((image) => {
                  let noImage = counter;
                  imageIDlist.push(noImage);
                  let inputIDname = "inputImage" + noImage;
                  let imageIDname = "image" + noImage;
                  let imageContainerID = "imageContainer" + noImage;
                  let imageLabel = "imageLabel" + noImage;
                  counter += 1;
                  return (
                    <>
                      <div id={imageContainerID}>
                        <div class="form-group row mb-3">
                          <label class="col-sm-3 col-form-label">
                            <b id={imageLabel}>
                              Image{imageIDlist.indexOf(noImage) + 1} :
                            </b>
                          </label>
                          <div class="col-sm-9">
                            <img
                              id={imageIDname}
                              width="200"
                              height="200"
                              src={image}
                            />
                          </div>
                        </div>
                        <div class="form-group row mb-3">
                          <label class="col-sm-3 col-form-label" />
                          <div class="col-sm-9">
                            <input
                              id={inputIDname}
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                document.getElementById(imageIDname).src =
                                  window.URL.createObjectURL(e.target.files[0]);
                              }}
                            />
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => {
                                imageIDlist.splice(
                                  imageIDlist.indexOf(noImage),
                                  1
                                );
                                imageIDlist.forEach((id) => {
                                  document.getElementById(
                                    "imageLabel" + id
                                  ).innerHTML =
                                    "Image" + (imageIDlist.indexOf(id) + 1);
                                });
                                document
                                  .getElementById(imageContainerID)
                                  .remove();
                              }}
                            >
                              Delete Image
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })}
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

export default CoursePopupEditTopic;
