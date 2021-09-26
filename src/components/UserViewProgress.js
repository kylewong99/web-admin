import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import ReactPaginate from "react-paginate";
import LoadingPopup from "./LoadingPopup";

const UserViewProgress = (props) => {
  const { setUserViewProgress, username, userID } = props;

  const [userProgress, setUserProgress] = useState([]);

  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useState();
  const [modalLoadingShow, setModalLoadingShow] = useState();

  const quizResultsPerPage = 10;
  const pageVisited = pageNumber * quizResultsPerPage;

  const pageCount = Math.ceil(userProgress.length / quizResultsPerPage);
  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  let counter = 0;

  const ref = firebase.firestore().collection("users").doc(userID);
  const quizRef = firebase.firestore().collection("quizzes");

  const getQuizTitle = () => {
    return new Promise((resolve, reject) => {
      quizRef.onSnapshot((querySnapShot) => {
        const title = [];
        querySnapShot.forEach((quiz) => {
          title.push(quiz.data());
        });
        resolve(title);
      });
    });
  };

  const getProgress = async () => {
    setLoading(true);
    setModalLoadingShow(true);
    let titleList = await getQuizTitle();
    ref.onSnapshot((user) => {
      const userInfo = [];
      let attemptedQuiz = [];
      let userProgressDetails = [];
      userInfo.push(user.data());

      if (userInfo[0].attemptedQuiz != undefined) {
        attemptedQuiz = userInfo[0].attemptedQuiz.split("|");

        for (let i = 0; i < attemptedQuiz.length; i++) {
          let quizID = attemptedQuiz[i];

          let quizInfo = titleList.filter((quiz) => {
            return quiz.id === quizID;
          });

          let quizTitle = quizInfo[0].title;

          if (quizTitle === undefined) {
            continue;
          }

          let quizResultDetail = {
            quizID: quizID,
            quizTitle: quizTitle,
            noAttempt: userInfo[0][quizID + "NoAttempt"],
            highestScore: userInfo[0][quizID + "HighestScore"],
            latestAttempt:
              userInfo[0][
                quizID +
                  "Attempt" +
                  parseInt(userInfo[0][quizID + "NoAttempt"]) +
                  "DateTime"
              ],
          };
          userProgressDetails.push(quizResultDetail);
        }
        setUserProgress(userProgressDetails);
      }
    });
    setLoading(false);
    setModalLoadingShow(false);
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

        <LoadingPopup show={modalLoadingShow} />

        {modalLoadingShow === true ? (
          <></>
        ) : (
          <>
            {userProgress.length === 0 ? (
              <h3>This user haven't took any quiz.</h3>
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
        )}
      </>
    </div>
  );
};

export default UserViewProgress;
