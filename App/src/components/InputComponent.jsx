import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/Form";
import axios from 'axios';
import { useEffect, useState } from "react";
import pdfHandler from "../scripts/pdfHandler";

function InputComponent() {
  const [fileState, setFileState] = useState("text");
  const [file, setFile] = useState(null);
  const [numberQuestions, setNumberQuestions] = useState("5");
  const [questionType, setQuestionType] = useState("multiple choice");

  const [gptInput, setGptInput] = useState("")
  const [gptResponse, setGptResponse] = useState(null);

  const jsonTemplate = "{'questions': [{'question': '','options': ['', '', '', ''],'answer': ''},{'question': '','options': ['', '', '', ''],'answer': ''}]}";

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

  function generatePrompt(){

    return `generate ${numberQuestions} questions of type ${questionType} based on this text: ${gptInput}. Return answer as json like: ${jsonTemplate}`
  }

  function getQuiz() {

    if(fileState === "file" && file){
      console.log(file);

      const extractText = async () => {
        const signed_token = await pdfHandler.authPDF_API();
        
        const server_data = await pdfHandler.startServer("extract", signed_token);

        const {task, server} = server_data

        const server_file_data = await pdfHandler.uploadToServer(file, task, server, signed_token);

        const server_filename = server_file_data.server_filename;
        
        await pdfHandler.processFile(file.name, server_filename, task, server, "extract", signed_token);

        const extracted_text = await pdfHandler.downloadFiles(task, server, signed_token)

        setGptInput(extracted_text)
      }
      extractText();
    } else {
      gptRequest();
    }
    
    console.log("submitted Quiz");
  }

  const gptRequest = async () => {
    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY;
    
    const prompt = generatePrompt();

    const data = {
      model:"gpt-3.5-turbo",
      messages: [{role:"user", content: prompt}],
    }

    try{
      const response = await axios.post('https://api.openai.com/v1/chat/completions', data, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      });
      console.log(response.data.choices[0].message.content);
      setGptResponse(response.data.choices[0].message.content)
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  useEffect(() => {
    if(fileState === "file" && gptInput !== ""){
      // eslint-disable-next-line react-hooks/exhaustive-deps
      gptRequest();
    }
  }, [fileState, gptInput])

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
              <Form.Control type="file" accept=".txt, .docx, .doc, .pdf" onChange={(e) => setFile(e.target.files[0])}/>
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
