const path = require("path");
const fs = require("fs");
const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
import App from "../src/App";

const PORT = 8080;
const app = express();
const router = express.Router();

const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  console.log("lets go");
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const serverRenderer = (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("An error occurred");
    }
    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${ReactDOMServer.renderToString(<App />)}</div>`
      )
    );
  });
};
router.use("^/$", serverRenderer);

router.use(express.static(path.resolve(__dirname, "..", "build")));

app.use(router);

app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`);
});

const serverTest = () => {
  let db = admin.firestore();
  db.collection("admin")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        console.log(doc.id);
      });
    })
    .catch((err) => {
      console.log("error: ", err);
    });
};

app.get("/deleteAdmin", function (req, res) {
  let param = req.query.email;
  console.log(param);
  admin
    .auth()
    .getUserByEmail(param)
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log(`Successfully fetched user data: ${userRecord.toJSON().uid}`);
      let uid = userRecord.toJSON().uid;
      admin
        .auth()
        .deleteUser(uid)
        .then(() => {
          console.log("Successfully deleted user");
        })
        .catch((error) => {
          console.log("Error deleting user:", error);
        });
    })
    .catch((error) => {
      console.log("Error fetching user data:", error);
    });
});

app.get("/addAdmin", function (req, res) {
  let email = req.query.email;
  let password = req.query.password;

  admin
    .auth()
    .createUser({
      email: email,
      password: password
    })
    .then((userRecord) => {
      // See the UserRecord reference doc for the contents of userRecord.
      console.log("Successfully created new user:", userRecord.uid);
      res.send("success");
    })
    .catch((error) => {
      console.log("Error creating new user:", error);
    });
});