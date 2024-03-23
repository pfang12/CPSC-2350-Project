import Button from "react-bootstrap/esm/Button";
import { useContext, useState, useEffect } from "react";
import { QuizContext } from "../context/QuizContext";

import AttemptingPart from "./AttemptingPart";
import { useNavigate } from "react-router-dom";

function QuizComponent() {
  const navigate = useNavigate();
  const { quiz, setQuiz } = useContext(QuizContext);
  const [missing, setMissing] = useState(-1);
  console.log(quiz);
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
    const index = quizMaterial.findIndex((e, i) => e.attempted === false);
    if (index == -1) {
      setQuiz(quizMaterial);
      navigate("/result");
    } else setMissing(index);
  }
  function submitAnyways() {
    setQuiz(quizMaterial);
    navigate("/result");
  }
  function goBack() {
    setMissing(-1);
    setCurrentQuestionIndex(missing);
  }
  return quiz.length == 0 || questionValue == null ? (
    <div>Something went wrong</div>
  ) : (
    <div className="px-6 py-10">
      <AttemptingPart
        question={questionValue}
        passValue={passValue}
        index={currentQuestionIndex}
      />
      <div className="flex gap-4">
        {currentQuestionIndex > 0 && missing == -1 && (
          <button
            type="button"
            className="text-md cursor-pointer  text-fontShade1 font-semibold py-2 px-4  bg-primaryShade2 transition duration-300 ease-in-out hover:bg-primaryShade3 rounded-md "
            onClick={backPage}
          >
            Back
          </button>
        )}
        {currentQuestionIndex < quizMaterial.length - 1 && (
          <button
            type="button"
            className="text-md cursor-pointer  text-fontShade1 font-semibold py-2 px-4  bg-primaryShade2 transition duration-300 ease-in-out hover:bg-primaryShade3 rounded-md "
            onClick={nextPage}
          >
            Next
          </button>
        )}

        {quizMaterial.length - 1 == currentQuestionIndex &&
          (missing == -1 ? (
            <button
              type="button"
              onClick={submit}
              className="text-md cursor-pointer  text-fontShade1 font-semibold py-2 px-4  bg-primaryShade2 transition duration-300 ease-in-out hover:bg-primaryShade3 rounded-md "
            >
              Submit
            </button>
          ) : (
            <div className="flex gap-2">
              <p className="">few question are still unanswered</p>
              <button
                type="button"
                onClick={submitAnyways}
                className="text-md cursor-pointer  text-fontShade1 font-semibold py-2 px-4  bg-primaryShade2 transition duration-300 ease-in-out hover:bg-primaryShade3 rounded-md "
              >
                Submit Anyways
              </button>
              <button
                type="button"
                onClick={goBack}
                className="text-md cursor-pointer  text-fontShade1 font-semibold py-2 px-4  bg-primaryShade2 transition duration-300 ease-in-out hover:bg-primaryShade3 rounded-md "
              >
                Attempt missing Answers
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}

export default QuizComponent;
