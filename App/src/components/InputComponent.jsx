import { useEffect, useState } from "react";
import { gptRequest } from "../api/gptapi";
import { extractText } from "../api/pdfapi";

// bootstrap
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";

function InputComponent() {
  const [fileState, setFileState] = useState("text");
  const [file, setFile] = useState(null);
  const [numberQuestions, setNumberQuestions] = useState("5");
  const [questionType, setQuestionType] = useState("multiple choice");

  const [gptInput, setGptInput] = useState("");
  const [gptResponse, setGptResponse] = useState(null);

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
  const gptCallResponse = async () => {
    const res = await gptRequest(numberQuestions, questionType, gptInput);
    setGptResponse(res);
  };
  function getQuiz() {
    if (fileState === "file" && file) {
      console.log(file);

      const extract = async () => {
        const res = await extractText(file);
        setGptInput(res);
      };
      extract();
    } else {
      gptCallResponse();
    }

    console.log("submitted Quiz");
  }

  useEffect(() => {
    if (fileState === "file" && gptInput !== "") {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      gptCallResponse();
    }
  }, [fileState, gptInput]);

  return (
    <div className="p-4">
      {/* buttons */}
      <div className="mb-4">
        <Button
          variant="outline-primary"
          onClick={() => changeState("text")}
          className="me-2"
        >
          text
        </Button>
        <Button variant="outline-primary" onClick={() => changeState("file")}>
          File
        </Button>
      </div>
      {/* Input field */}
      <div>
        <Form>
          {fileState == "text" ? (
            <Form.Group
              className="mb-3 "
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Control
                as="textarea"
                rows={7}
                placeholder="Enter the Text"
                onChange={changeGptInput}
              />
            </Form.Group>
          ) : (
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control
                type="file"
                accept=".txt, .docx, .doc, .pdf"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </Form.Group>
          )}
          <div className="d-flex justify-content-between">
            <Form.Select className="w-25" onChange={numQuestion}>
              <option>Number of Questions</option>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </Form.Select>
            <Form.Select className="w-25" onChange={typeQuestion}>
              <option>Type</option>
              <option value="multiple choice">Multi-choice Questions</option>
              <option value="true or false">True/False</option>
            </Form.Select>
            <Button variant="outline-primary" onClick={() => getQuiz()}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
      <p>{gptResponse}</p>
    </div>
  );
}

export default InputComponent;
