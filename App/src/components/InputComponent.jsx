import React from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import { useState } from "react";

function InputComponent() {
  const [fileState, setFileState] = useState("text");
  const [numberQuestions, setNumberQuestions] = useState("5");
  const [questionType, setQuestionType] = useState("multi");
  function changeState(val) {
    setFileState(val);
  }
  function numQuestion(e) {
    setNumberQuestions(e.target.value);
  }
  function typeQuestion(e) {
    setQuestionType(e.target.value);
  }
  function getQuiz() {
    console.log("submitted Quiz");
  }
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
              />
            </Form.Group>
          ) : (
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Control type="file" accept=".txt, .docx, .doc, .pdf" />
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
              <option value="multi">Multi-choice Questions</option>
              <option value="true">True/False</option>
            </Form.Select>
            <Button variant="outline-primary" onClick={() => getQuiz()}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default InputComponent;
