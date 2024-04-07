import { useContext, useState, useRef } from "react";
import { quizRequest } from "../api/gptapi";
import { extractText, downloadQuiz } from "../api/pdfapi";
import { QuizContext } from "../context/QuizContext";
import Divider from "../components/Divider";
import LoadingSpinner from "../components/LoadingSpinner";

import { useNavigate } from "react-router-dom";

function InputComponent() {
  const { quiz, setQuiz } = useContext(QuizContext);
  const navigate = useNavigate();
  const [fileState, setFileState] = useState("text");
  const [numberQuestions, setNumberQuestions] = useState("5");
  const [questionType, setQuestionType] = useState("multiple choice");
  const [gptInput, setGptInput] = useState("");
  const [ansCheckbox, setAnsCheckbox] = useState(false);
  const [pwdCheckbox, setPwdCheckbox] = useState(false);
  const [pwd, setPwd] = useState("");
  const [isDownloadLoading, setDownloadLoading] = useState(false);
  const fileInputRef = useRef(null);

  function changeState(val) {
    setFileState(val);
  }

  function numQuestion(e) {
    setNumberQuestions(e.target.value);
  }
  function typeQuestion(e) {
    setQuestionType(e.target.value);
  }
  function changeGptInput(e) {
    setGptInput(e.target.value);
  }

  function setPwdValue(e) {
    setPwd(e.target.value);
  }

  const gptCallResponse = async () => {
    setQuiz(["loading"]);
    console.log(gptInput);
    const res = await quizRequest(numberQuestions, questionType, gptInput);
    console.log(res);
    let jres;
    if (typeof res === "string") {
      jres = JSON.parse(res);
    } else {
      jres = res;
    }
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
    setDownloadLoading(true);

    const download = async () => {
      let status = "in progress";
      let templatePath = "";

      if(questionType === "multiple choice"){
        templatePath = ansCheckbox ? "/CPSC-2350-Project/templates/quiz-mcq-wa-template.docx" : "/CPSC-2350-Project/templates/quiz-mcq-na-template.docx"
      } else if(questionType === "true/false") {
        templatePath = ansCheckbox ? "/CPSC-2350-Project/templates/quiz-tf-wa-template.docx" : "/CPSC-2350-Project/templates/quiz-tf-na-template.docx"
      }

      if (pwdCheckbox && pwd) {
        status = await downloadQuiz(quiz, templatePath, pwd);
      } else {
        status = await downloadQuiz(quiz, templatePath);
      }

      if (status === "done") {
        setDownloadLoading(false);
        setPwdCheckbox(false);
        setAnsCheckbox(false);
        setPwd("");
      }
    };

    download();
  }

  //Clear the Text Input box
  function clearTextarea() {
    setGptInput("");
  }

  return (
    <div className="col-span-12">
      <h1 className="text-header text-dPurple mb-3">Enter Your Text</h1>
      <div className="flex justify-between w-320">
        <button
          onClick={() => changeState("text")}
          className={`${
            fileState === "text"
              ? "inner-border-3 inner-border-amethyst text-dPurple bg-magnolia cursor-default"
              : "text-seasalt bg-amethyst hover:bg-thistle hover:text-dPurple"
          } text-center w-150 py-1 text-button rounded-md mb-5 drop-shadow-lg`}
        >
          Text
        </button>

        <button
          onClick={() => changeState("file")}
          className={`${
            fileState === "file"
              ? "inner-border-3 inner-border-amethyst text-dPurple bg-magnolia cursor-default"
              : "text-seasalt bg-amethyst hover:bg-thistle hover:text-dPurple"
          } text-center w-150 py-1 text-button rounded-md mb-5 drop-shadow-lg`}
        >
          File
        </button>
      </div>
      {/* Input field */}

      <div>
        {fileState == "file" && (
          <div className="flex justify-between my-5 drop-shadow-md">
            <div className="w-4/5 bg-seasalt rounded-md">
              <input
                data-testid="file-input"
                type="file"
                accept=".pdf"
                ref={fileInputRef}
                className="font-oswald text-dPurple text-button"
              />
            </div>

            <button
              className="text-seasalt bg-amethyst text-center w-150 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple"
              onClick={gettingFileValue}
            >
              Extract Text
            </button>
          </div>
        )}

        <div className="flex flex-col">
          <textarea
            id="message"
            placeholder={`${
              fileState === "text"
                ? "Write your text here..."
                : "Your extracted text will appear here..."
            }`}
            name="message"
            rows="10"
            disabled={fileState === "file"}
            required
            value={gptInput}
            className="bg-seasalt font-garamond text-body text-dPurple w-full drop-shadow-md rounded-xl p-1 mb-2"
            onChange={changeGptInput}
          ></textarea>
          <button
            className="text-dPurple bg-magnolia text-center w-150 py-1 text-button rounded-md inner-border-3 inner-border-amethyst drop-shadow-lg hover:bg-thistle hover:text-dPurple hover:inner-border-thistle mb-10"
            onClick={clearTextarea}
          >
            Clear
          </button>
        </div>

        <Divider />
        <div className="flex justify-between">
          <div className="w-225 flex flex-col">
            <h1 className="text-header text-dPurple mb-5">Question Options</h1>
            <div className="flex justify-between mb-3">
              <label
                htmlFor="numQuestions"
                className="text-button text-dPurple"
              >
                Number:
              </label>
              <input
                id="numQuestions"
                type="number"
                min="5"
                max="30"
                defaultValue="5"
                onChange={numQuestion}
                className="w-70 ml-5 pl-1 text-dPurple bg-seasalt drop-shadow-md rounded-md text-button "
              />
            </div>
            <div className="flex justify-between mb-5">
              <label
                htmlFor="typeQuestions"
                className="text-button text-dPurple"
              >
                Type:
              </label>
              <select
                id="typeQuestions"
                className="bg-seasalt drop-shadow-md rounded-md text-button pr-2 text-dPurple"
                onChange={typeQuestion}
              >
                <option value="multiple choice">Multiple Choice </option>
                <option value="true/false">True/False</option>
              </select>
            </div>
            <button
              onClick={() => getQuiz()}
              disabled={!gptInput}
              className="text-seasalt bg-amethyst text-center w-150 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple"
            >
              Submit
            </button>
          </div>
          <div>
            {/*First condition: quiz.length == 0 Second condition: quiz[0] != "loading" */}
            {quiz.length == 0 ? (
              <div></div>
            ) : quiz[0] != "loading" && !isDownloadLoading ? (
              <div className="">
                <h1 className="text-header text-dPurple mb-5">
                  Your Quiz Is Ready!
                </h1>
                <button
                  onClick={() => attemptQuiz()}
                  className="text-seasalt bg-iqRed text-center w-150 py-1 text-button rounded-md drop-shadow-lg hover:bg-iqLightRed hover:text-dPurple mb-5"
                >
                  Take Quiz
                </button>
                <br />
                <div className="flex">
                  <button
                    onClick={() => downloadPdf()}
                    className="text-seasalt bg-amethyst text-center w-150 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple mb-1"
                  >
                    Download Quiz
                  </button>
                  <div>
                    <input
                      type="checkbox"
                      id="checkboxPdfAnswer"
                      onChange={() => setAnsCheckbox(!ansCheckbox)}
                      className="w-8"
                    />
                    <label
                      htmlFor="checkboxPdfAnswer"
                      className="text-body text-dPurple"
                    >
                      Include answers
                    </label>
                    <br />
                    <input
                      type="checkbox"
                      id="checkboxPassword"
                      onChange={() => setPwdCheckbox(!pwdCheckbox)}
                      className="w-8"
                    />
                    <label
                      htmlFor="checkboxPassword"
                      className="text-body text-dPurple"
                    >
                      Lock with password
                    </label>
                  </div>
                </div>
                {pwdCheckbox ? (
                  <input
                    type="password"
                    placeholder="Write your password"
                    onChange={setPwdValue}
                    className="bg-seasalt text-dPurple rounded-lg font-garamond drop-shadow-lg px-0.5 py-1 w-150 mt-1.5"
                  />
                ) : (
                  <></>
                )}
              </div>
            ) : (
              <div>
                <h1 className="text-header text-dPurple mb-5">Loading...</h1>
                <LoadingSpinner />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default InputComponent;
