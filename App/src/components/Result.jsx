import React, { useContext, useEffect } from "react";
import { QuizContext } from "../context/QuizContext";
import Form from "react-bootstrap/Form";
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
    <div>
      <h1>
        Your Score {getScore()} / {quiz.length}
      </h1>
      {quiz.map((data, i) => (
        <DisplayQuiz data={data} key={i} index={i + 1} />
      ))}

      <button type="button" className="btn btn-primary" onClick={homePage}>
        Home Page
      </button>
    </div>
  );
}
export const DisplayQuiz = ({ data, index }) => {
  return (
    <div>
      <div>
        <p>{data.question}</p>
      </div>
      <div>
        <Form>
          {data.options.map((value, index) => (
            <div key={`default-${value}`} className="mb-3">
              <Form.Check
                type="radio"
                id={`default-radio-${index}`}
                label={`${index + 1} ${value}`}
                name="radioGroup"
                style={{
                  backgroundColor:
                    data.answer === value && data.userResponse === value
                      ? "lightgreen"
                      : data.answer === value
                      ? "red"
                      : "white",
                }}
                checked={data.userResponse === value}
                readOnly
              />
            </div>
          ))}
        </Form>
      </div>
    </div>
  );
};

export default Result;
