import React, { createContext, useState } from "react";

export const QuizContext = createContext(null);

const QuizContextProvider = (props) => {
  const [quiz, setQuiz] = useState();
  console.log(quiz);
  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {props.children}
    </QuizContext.Provider>
  );
};
export default QuizContextProvider;
