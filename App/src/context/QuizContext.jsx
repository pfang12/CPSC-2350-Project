import React, { createContext, useState } from "react";

export const QuizContext = createContext(null);

const QuizContextProvider = (props) => {
  const [quiz, setQuiz] = useState();
  if (!quiz) {
    setQuiz(props.defaultQuiz || []);
  }
  console.log(quiz);
  return (
    <QuizContext.Provider value={{ quiz, setQuiz }}>
      {props.children}
    </QuizContext.Provider>
  );
};
export default QuizContextProvider;
