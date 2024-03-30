import { describe, expect, test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import InputComponent from "../components/InputComponent";
import { extractText, downloadQuiz } from "../api/pdfapi";
import { quizRequest } from "../api/gptapi";
import QuizContextProvider from "../context/QuizContext";
import { BrowserRouter } from "react-router-dom";

describe("for the button of file and text", () => {
  test("testing for the input component's buttons", () => {
    render(
      <QuizContextProvider>
        <BrowserRouter>
          <InputComponent />
        </BrowserRouter>
      </QuizContextProvider>
    );
    const buttonText = screen.getByRole("button", { name: /Text/i });
    const buttonFile = screen.getByRole("button", { name: /File/i });

    fireEvent.click(buttonFile);
    const inputField = screen.getByTestId("file-input");
    expect(inputField).toBeInTheDocument();
    fireEvent.click(buttonText);
    expect(inputField).not.toBeInTheDocument();
    // Example class for active state
  });
  test("file input component rendering based on variable value", () => {
    const fileState = "text";
    render(
      <QuizContextProvider>
        <BrowserRouter>
          <InputComponent fileState={fileState} />
        </BrowserRouter>
      </QuizContextProvider>
    );

    if (fileState === "file") {
      const inputField = screen.getByTestId("file-input");
      expect(inputField).toBeInTheDocument();
    } else {
      // If fileState is not "file", expect input file component not to be present
      const inputField = screen.queryByTestId("file-input");
      expect(inputField).not.toBeInTheDocument();
    }
  });
});

// for the extract button
vi.mock("../api/pdfapi", () => ({
  extractText: vi.fn(),
  downloadQuiz: vi.fn(),
}));

test("Extract Text button triggers text extraction function", async () => {
  // Render your component
  render(
    <QuizContextProvider>
      <BrowserRouter>
        <InputComponent />
      </BrowserRouter>
    </QuizContextProvider>
  );

  const buttonFile = screen.getByRole("button", { name: /File/i });

  fireEvent.click(buttonFile);

  const extractButton = screen.getByText("Extract Text");
  fireEvent.click(extractButton);

  expect(extractText).toHaveBeenCalled();

  await waitFor(() => expect(extractText).toHaveBeenCalledTimes(1));
});

// for the gpt api
vi.mock("../api/gptapi", () => ({
  quizRequest: vi.fn().mockResolvedValue({
    questions: [
      {
        question: "What is the capital city of canada?",
        options: ["vancouver", "ottawa", "winnipeg", "toronto"],
        answer: "ottawa",
        hint: "",
        explanation: "",
      },
      {
        question: "Capital city of canada is ottawa",
        options: ["true", "false"],
        answer: "true",
        hint: "",
        explanation: "",
      },
    ],
  }),
}));
describe("Submit Button", () => {
  test("API is called when the submit button is clicked", async () => {
    render(
      <QuizContextProvider>
        <BrowserRouter>
          <InputComponent />
        </BrowserRouter>
      </QuizContextProvider>
    );
    const inputField = screen.getByPlaceholderText("Write your text here..."); // Assuming this is your textarea placeholder
    const submitButton = screen.getByText("Submit");

    // Simulate changing the input value
    fireEvent.change(inputField, { target: { value: "Some input text" } });

    // Simulate clicking the submit button
    fireEvent.click(submitButton);

    // Wait for the API call to complete
    await waitFor(() => {
      expect(quizRequest).toHaveBeenCalledTimes(1); // Check if the API function is called once
      // You can also add more assertions here based on your requirements
    });
  });

  // To check for the submit button accesibility
});
describe("Submit Button", () => {
  test("Submit button is disabled when there is no input", () => {
    render(
      <QuizContextProvider>
        <BrowserRouter>
          <InputComponent />
        </BrowserRouter>
      </QuizContextProvider>
    );
    const submitButton = screen.getByText("Submit");

    expect(submitButton).toBeDisabled();
  });

  test("Submit button is enabled when there is input", () => {
    render(
      <QuizContextProvider>
        <BrowserRouter>
          <InputComponent />
        </BrowserRouter>
      </QuizContextProvider>
    );
    const inputField = screen.getByPlaceholderText("Write your text here..."); // Assuming this is your textarea placeholder

    fireEvent.change(inputField, { target: { value: "Some input text" } });
    const submitButton = screen.getByText("Submit");

    expect(submitButton).toBeEnabled();
  });
});
// vi.mock("./api/pdfapi", async (importOriginal) => {
//   const actual = await importOriginal();
//   return {
//     downloadQuiz: vi.fn(),
//     extractText: actual.extractText,
//   };
// });

// describe("InputComponent", () => {
//   test("Download PDF button calls downloadQuiz API", async () => {
//     // Mock any necessary context values
//     const mockQuizState = {
//       quiz: [], // Provide a sample quiz state
//       setQuiz: {
//         questions: [
//           {
//             question: "What is the capital city of canada?",
//             options: ["vancouver", "ottawa", "winnipeg", "toronto"],
//             answer: "ottawa",
//             hint: "",
//             explanation: "",
//           },
//           {
//             question: "Capital city of canada is ottawa",
//             options: ["true", "false"],
//             answer: "true",
//             hint: "",
//             explanation: "",
//           },
//         ],
//       }, // Mock setQuiz function
//     };
//     // Render the component with the context provider
//     render(
//       <QuizContextProvider value={mockQuizState}>
//         <BrowserRouter>
//           <InputComponent quiz />
//         </BrowserRouter>
//       </QuizContextProvider>
//     );
//     screen.debug();
//     // Simulate clicking the "Download PDF" button
//     const downloadButton = screen.getByText("Download PDF");
//     fireEvent.click(downloadButton);

//     // Assert that the downloadQuiz function is called with the correct parameters
//     await waitFor(() => {
//       expect(downloadQuiz)
//         .toHaveBeenCalledWith(
//           mockQuizState.quiz,
//           "/templates/quiz-wa-template.docx"
//         )
//         .toHaveBeenCalledTimes(1); // Check if the downloadQuiz function is called with the correct parameters
//       // You can add more assertions here based on the expected behavior
//     });
//   });
// });
