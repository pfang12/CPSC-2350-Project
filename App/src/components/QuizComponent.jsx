import Button from "react-bootstrap/esm/Button";
import { useContext, useState, useEffect } from "react";
import { QuizContext } from "../context/QuizContext";

import AttemptingPart from "./AttemptingPart";
import { useNavigate } from "react-router-dom";

function QuizComponent() {
  const navigate = useNavigate();
  const { quiz, setQuiz } = useContext(QuizContext);
  useEffect(() => {
    checkQuiz();
    updateAdvancedQuiz();
  }, [quiz]);

  function checkQuiz() {
    if (quiz.length === 0) {
      navigate("/*");
    }
  }

  const updateAdvancedQuiz = () => {
    const advancedQuiz = quiz
      ? quiz.map((question) => ({
          ...question,
          userResponse: "",
          attempted: false,
        }))
      : [];
    setQuizMaterial(advancedQuiz);
  };

  const [quizMaterial, setQuizMaterial] = useState([]);
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

  return quiz.length == 0 ? (
    <div>Something went wrong</div>
  ) : (
    <div>
      <AttemptingPart
        question={questionValue}
        passValue={passValue}
        index={currentQuestionIndex}
      />
      {currentQuestionIndex > 0 && (
        <button type="button" className="btn btn-primary" onClick={backPage}>
          Back
        </button>
      )}
      {currentQuestionIndex < quizMaterial.length - 1 && (
        <button type="button" className="btn btn-primary" onClick={nextPage}>
          Next
        </button>
      )}

      {quizMaterial.length - 1 == currentQuestionIndex && (
        <button type="button" className="btn btn-primary" onClick={submit}>
          Submit
        </button>
      )}
    </div>
  );
}

export default QuizComponent;
