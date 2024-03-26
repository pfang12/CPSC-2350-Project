import { useContext, useState, useRef } from "react";
import { gptRequest } from "../api/gptapi";
import { extractText, downloadQuiz } from "../api/pdfapi";
import { QuizContext } from "../context/QuizContext";

import { useNavigate } from "react-router-dom";

function InputComponent() {
  const { quiz, setQuiz } = useContext(QuizContext);
  const navigate = useNavigate();
  const [fileState, setFileState] = useState("text");
  const [numberQuestions, setNumberQuestions] = useState("5");
  const [questionType, setQuestionType] = useState("multiple choice");
  const [gptInput, setGptInput] = useState("");
  const [checkbox, setCheckbox] = useState(false);
  const [fileInputRef, setInputRef] = useState(null);

  function changeState(val) {
    setFileState(val);
  }
  console.log(fileInputRef);

  function numQuestion(e) {
    setNumberQuestions(e.target.value);
  }
  function typeQuestion(e) {
    setQuestionType(e.target.value);
  }
  function changeGptInput(e) {
    setGptInput(e.target.value);
  }
  const gptCallResponse = async () => {
    setQuiz(["loading"]);
    console.log(gptInput);
    const res = await gptRequest(numberQuestions, questionType, gptInput);
    console.log(res);
    const jres = JSON.parse(res);
    console.log(jres.questions);
    setQuiz(jres.questions);
  };
  function gettingFileValue() {
    const fileValue = fileInputRef.current.files[0];
    console.log(fileValue);
    const extract = async () => {
      setGptInput("loading....");
      const res = await extractText(fileValue);
      setGptInput(res);
    };
    extract();
  }

  function getQuiz() {
    gptCallResponse();
    console.log("submitted Quiz");
  }

  function attemptQuiz() {
    navigate("/attempt");
  }
  //download function
  function downloadPdf() {
    const download = async () => {
      await downloadQuiz(quiz, "/templates/quiz-wa.docx");
    };

    download();
    /*if (checkbox) {
      //for the answer key
    } else {
      //without the answer key
    }*/
  }

  return (
    <div className=" py-8 flex flex-col">
      <h1 className=" text-2xl mb-6">Enter your Text</h1>
      {/* buttons */}
      <div className="mb-12 flex gap-4">
        <button
          onClick={() => changeState("text")}
          className={`text-lg cursor-pointer px-10 py-1 bg-primary drop-shadow-2xl transition duration-200 outline outline-primary outline-4  ease-in-out hover:bg-primaryShade3 hover:outline-primaryShade3 hover:text-font rounded-md ${
            fileState == "text" ? " bg-primaryShade4 text-font " : "text-white"
          }`}
        >
          Text
        </button>

        <button
          onClick={() => changeState("file")}
          className={`text-lg cursor-pointer   px-10 py-1 bg-primary transition duration-200 outline outline-primary outline-4  ease-in-out hover:bg-primaryShade3 hover:outline-primaryShade3 hover:text-font rounded-md ${
            fileState == "file" ? "bg-primaryShade4 text-font " : "text-white"
          }`}
        >
          File
        </button>
      </div>
      {/* Input field */}

      <div>
        {fileState == "file" && (
          <div className="flex items-center gap-5 mb-8">
            <div>
              <input
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                onChange={(e) => setInputRef(e.target.files[0])}
                className=" font-garamound file:font-oswald file:text-lg file:bg-primary file:hover:bg-primaryShade3 file:hover:text-font file:text-white rounded-md file:px-10 file:py-2 w-96 file:rounded-md file:border-none bg-white text-font file:cursor-pointer cursor-pointer "
              />
            </div>

            {fileInputRef && (
              <button
                className="text-md cursor-pointer  text-white  py-2 px-4  bg-primary transition duration-300 ease-in-out hover:bg-primaryShade3 hover:text-font rounded-md "
                onClick={gettingFileValue}
              >
                Generate Text
              </button>
            )}
          </div>
        )}

        <textarea
          id="message"
          placeholder="either enter text or generate from file"
          name="message"
          rows="10"
          required
          value={gptInput}
          className=" rounded-lg mx-5 my-10  w-4/5 bg-primaryShade3 text-font border-none text-md font-garamound"
          onChange={changeGptInput}
        ></textarea>
        <div className="flex items-center justify-between mx-5 mb-20 ">
          <select
            className="w-52 origin-bottom py-2 px-2 bg-primaryShade2 border-none text-font rounded-lg"
            onChange={numQuestion}
          >
            <option>Number of Questions:</option>
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <select
            className="w-52 py-2 px-2 origin-bottom bg-primaryShade2 border-none text-font rounded-lg"
            onChange={typeQuestion}
          >
            <option>Type: </option>
            <option value="multiple choice">multiple-choice </option>
            <option value="true/false">True/False</option>
          </select>
          <button
            onClick={() => getQuiz()}
            disabled={!gptInput}
            className="text-md cursor-pointer  text-fontShade1 font-semibold py-2 px-4  bg-primaryShade2 transition duration-300 ease-in-out hover:bg-primaryShade3 rounded-md "
          >
            Submit
          </button>
        </div>
      </div>
      {quiz.length == 0 ? (
        <div></div>
      ) : quiz[0] != "loading" ? (
        <div className="flex gap-5 items-center">
          <button
            onClick={() => attemptQuiz()}
            className="text-md cursor-pointer  text-fontShade1 font-semibold py-2 px-4  bg-primaryShade2 transition duration-300 ease-in-out hover:bg-primaryShade3 rounded-md "
          >
            take Quiz
          </button>
          <button
            onClick={() => downloadPdf()}
            className="text-md cursor-pointer  text-fontShade1 font-semibold py-2 px-4 ml-4 bg-primaryShade2 transition duration-300 ease-in-out hover:bg-primaryShade3 rounded-md "
          >
            Download the pdf file
          </button>
          <input
            type="checkbox"
            id="checkboxPdfAnswer"
            onChange={() => setCheckbox(!checkbox)}
          />
          <label htmlFor="checkboxPdfAnswer">With Answers</label>
        </div>
      ) : (
        <p className="text-2xl">...loading</p>
      )}
    </div>
  );
}

export default InputComponent;
