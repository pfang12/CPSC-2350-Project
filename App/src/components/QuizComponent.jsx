import Button from "react-bootstrap/esm/Button";
import { useContext, useState } from "react";
import { QuizContext } from "../context/QuizContext";

import AttemptingPart from "./AttemptingPart";
import { useNavigate } from "react-router-dom";

function QuizComponent() {
  const navigate = useNavigate();
  const { quiz, setQuiz } = useContext(QuizContext);

  const advancedQuiz = quiz.map((question) => ({
    ...question,
    userResponse: "",
    attempted: false,
  }));
  const [quizMaterial, setQuizMaterial] = useState(advancedQuiz);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const questionValue = quizMaterial[currentQuestionIndex];

  function backPage() {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  }

  function nextPage() {
    if (currentQuestionIndex < quizMaterial.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  }
  function passValue(value) {
    console.log(value);
    let updatedQuizMaterial = [...quizMaterial];
    questionValue.userResponse = value;
    questionValue.attempted = true;
    updatedQuizMaterial[currentQuestionIndex] = questionValue;
    setQuizMaterial[updatedQuizMaterial];

    // console.log(quizMaterial);
  }
  function submit() {
    setQuiz(quizMaterial);
    navigate("/result");
  }

  return (
    <div>
      <AttemptingPart
        question={questionValue}
        passValue={passValue}
        index={currentQuestionIndex}
      />
      <button type="button" className="btn btn-primary" onClick={backPage}>
        Back
      </button>
      <button type="button" className="btn btn-primary" onClick={nextPage}>
        Next
      </button>
      {quizMaterial.length - 1 == currentQuestionIndex ? (
        <button type="button" className="btn btn-primary" onClick={submit}>
          Submit
        </button>
      ) : (
        <></>
      )}
    </div>
  );
}

export default QuizComponent;
