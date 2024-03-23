import React, { useContext, useEffect } from "react";
import { QuizContext } from "../context/QuizContext";

import { useNavigate } from "react-router-dom";
function Result() {
  const { quiz } = useContext(QuizContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (quiz.length == 0) {
      homePage();
    }
  }, [quiz]);
  function homePage() {
    navigate("/*");
  }
  const getScore = () => {
    let score = 0;
    quiz.map((data) => {
      if (data.answer === data.userResponse) return score++;
    });
    return score;
  };

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl text-font mb-6 p-4">
        Your Score{" "}
        <span className="text-primary">
          {getScore()} / {quiz.length}
        </span>
      </h1>
      <div className="  px-4 py-2 border border-gray-300 rounded-lg bg-primaryShade4 mb-4">
        {quiz.map((data, i) => (
          <DisplayQuiz data={data} key={i} index={i + 1} />
        ))}
      </div>

      <button
        type="button"
        className="text-lg cursor-pointer  text-font font-semibold py-2 px-4  bg-primary transition duration-300 ease-in-out hover:bg-primaryShade1 rounded-md "
        onClick={homePage}
      >
        Home Page
      </button>
    </div>
  );
}
export const DisplayQuiz = ({ data, index }) => {
  return (
    <div className="mb-6">
      <div>
        <p className="text-lg mb-3">{data.question}</p>
      </div>
      <div className="px-4">
        {data.options.map((value, index) => (
          <div
            key={`default-${value}`}
            className={`mb-2 flex items-center gap-2 ${
              value == data.answer
                ? "bg-green-500"
                : value == data.userResponse && "bg-red-500"
            } rounded-md p-2`}
          >
            {value == data.answer ? (
              <span className="rounded-lg bg-green-700">✔️&nbsp;</span>
            ) : value == data.userResponse ? (
              <span className="rounded-lg bg-red-700">❌&nbsp;</span>
            ) : (
              <p className="w-7">&nbsp;</p>
            )}

            <p>{`${index + 1}. ${value}`}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Result;
