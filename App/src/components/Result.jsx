import React, { useContext } from "react";
import { QuizContext } from "../context/QuizContext";
import Form from "react-bootstrap/Form";
function Result() {
  const { quiz, setQuiz } = useContext(QuizContext);

  const getScore = () => {
    let score = 0;
    quiz.map((data) => {
      if (data.answer === data.userResponse) return score++;
    });
    return score;
  };
  return (
    <div>
      {quiz.map((data, i) => (
        <DisplayQuiz data={data} key={i} index={i + 1} />
      ))}
      <h1>
        your score {getScore()} / {quiz.length}
      </h1>
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
                    data.answer === value ? "lightgreen" : "white",
                }}
                checked={data.userResponse === value}
              />
            </div>
          ))}
        </Form>
      </div>
    </div>
  );
};

export default Result;
