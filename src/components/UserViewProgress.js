import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import ReactPaginate from "react-paginate";

const UserViewProgress = (props) => {
  const { setUserViewProgress, username, userID } = props;

  const [userProgress, setUserProgress] = useState([]);

  const [pageNumber, setPageNumber] = useState(0);

  const quizResultsPerPage = 10;
  const pageVisited = pageNumber * quizResultsPerPage;

  const pageCount = Math.ceil(userProgress.length / quizResultsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  let counter = 0;

  const ref = firebase.firestore().collection("users").doc(userID);

  const getProgress = () => {
    ref.onSnapshot((user) => {
      const userInfo = [];
      let attemptedQuiz = [];
      let quizInfo = [];
      let userProgressDetails = [];
      userInfo.push(user.data());

      if (userInfo[0].attemptedQuiz != undefined) {
        attemptedQuiz = userInfo[0].attemptedQuiz.split("|");

        for (let i = 0; i < attemptedQuiz.length; i++) {
          quizInfo = attemptedQuiz[i].split("-");
          let quizResultDetail = {
            quizID : quizInfo[0],
            quizTitle: quizInfo[1],
            noAttempt: userInfo[0][quizInfo[0] + "NoAttempt"],
            highestScore: userInfo[0][quizInfo[0] + "HighestScore"],
            latestAttempt:
              userInfo[0][
                quizInfo[0] +
                  "Attempt" +
                  parseInt(userInfo[0][quizInfo[0] + "NoAttempt"]) +
                  "DateTime"
              ],
          };
          userProgressDetails.push(quizResultDetail);
        }
        setUserProgress(userProgressDetails);
      }
      console.log(userProgress);
    });
  };

  useEffect(() => {
    getProgress();
  }, []);

  return (
    <div>
      <>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <a onClick={() => setUserViewProgress(false)} href="#">
                Users
              </a>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {username}
            </li>
          </ol>
        </nav>
        {userProgress.length === 0 ? (
          <>
            <h3>This user haven't took any quiz.</h3>
          </>
        ) : (
          <>
            <table class="table mt-1">
              <thead>
                <tr>
                  <th scope="col">No</th>
                  <th scope="col">Quiz Title</th>
                  <th scope="col">No Attempt</th>
                  <th scope="col">Highest Score</th>
                  <th scope="col">Latest Attempt</th>
                </tr>
              </thead>
              <tbody>
                {userProgress
                  .slice(pageVisited, pageVisited + quizResultsPerPage)
                  .map((quizDetail) => {
                    counter += 1;
                    return (
                      <>
                        <tr key={quizDetail.quizID}>
                          <td>{counter}</td>
                          <td>{quizDetail.quizTitle}</td>
                          <td>{quizDetail.noAttempt}</td>
                          <td>{quizDetail.highestScore} %</td>
                          <td>{quizDetail.latestAttempt}</td>
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
    </div>
  );
};

export default UserViewProgress;
