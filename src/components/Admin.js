import React, { useState, useEffect } from "react";
import firebase from "../firebase";
import { v4 as uuidv4 } from "uuid";

export default function Content() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState();

  // Get user collection from database
  const ref = firebase.firestore().collection("users");

  function getUser() {
    setLoading(true);
    ref.onSnapshot((querySnapShot) => {
      const users = [];
      querySnapShot.forEach((user) => {
        users.push(user.data());
      });
      setUsers(users);
      setLoading(false);
    });
  }

  // ADD FUNCTION
  function addUser(newUser) {
    ref
      .doc(newUser.id)
      .set(newUser)
      .catch((err) => {
        console.error(err);
      });
  }

  // DELETE FUNCTION
  function deleteUser(user) {
    ref
      .doc(user.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <>
      <div class="inputBox">
        <h3>Add New</h3>
        <input
          placeholder="Name"
          type="text"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Email"
          type="text"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button onClick={() => addUser({ name, email, id: uuidv4() })}>
          Submit
        </button>
      </div>

      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <h2>{user.age}</h2>
          <button onClick={() => deleteUser(user)}>X</button>
        </div>
      ))}
    </>
  );
}
