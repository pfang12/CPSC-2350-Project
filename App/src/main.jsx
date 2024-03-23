import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import QuizContextProvider from "./context/QuizContext.jsx";

//removable code
import "./styles/global.css";
import "bootstrap/dist/css/bootstrap.min.css";
// till here

ReactDOM.createRoot(document.getElementById("root")).render(
  <QuizContextProvider>
    <App />
  </QuizContextProvider>
);
