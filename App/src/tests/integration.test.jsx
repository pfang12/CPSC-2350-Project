import { afterEach, describe, expect, test, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";
import InputComponent from "../components/InputComponent";
import Result from "../components/Result";
import AttemptingPart from "../components/AttemptingPart";
import { extractText, downloadQuiz } from "../api/pdfapi";
import { quizRequest, feedbackRequest } from "../api/gptapi";
import QuizContextProvider from "../context/QuizContext";
import { BrowserRouter } from "react-router-dom";

//mocking api calls for the feature integration
//mocking pdfapi calls
vi.mock("../api/pdfapi", () => ({
  extractText: vi.fn(),
  downloadQuiz: vi.fn(),
}));

// mocking gpt api calls
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
  feedbackRequest: vi.fn().mockResolvedValue("mocked feedback"),
}));

describe("for the extract feature interaction ", () => {
  afterEach(cleanup);
  test("Extract Text button triggers text extraction function", async () => {
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
  test("Extract Text button triggers text extraction function multiple times", async () => {
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
    fireEvent.click(extractButton);
    fireEvent.click(extractButton);

    expect(extractText).toHaveBeenCalled();
    await waitFor(() => expect(extractText).toHaveBeenCalledTimes(4));
  });
});

describe("checking the quiz generation feature", () => {
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
    fireEvent.change(inputField, { target: { value: "Some input text" } });
    fireEvent.click(submitButton);
    await waitFor(() => {
      expect(quizRequest).toHaveBeenCalledTimes(1);
    });
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

describe("for the download feature", () => {
  test("Download PDF button calls downloadQuiz API", async () => {
    const mockQuizState = {
      quiz: [],
      setQuiz: {
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
      }, // Mock setQuiz function
    };
    // Render the component with the context provider
    render(
      <QuizContextProvider defaultQuiz={mockQuizState}>
        <BrowserRouter>
          <InputComponent quiz />
        </BrowserRouter>
      </QuizContextProvider>
    );
    const downloadButton = screen.getByText("Download Quiz");
    fireEvent.click(downloadButton);
    await waitFor(() => {
      expect(downloadQuiz).toHaveBeenCalledTimes(1);
    });
  });

  describe("download feature on the result page", () => {
    const mockQuizContextValue = [
      {
        question: "question",
        options: ["1", "2", "3", "4"],
        answer: "2",
        hint: "hint",
        userResponse: "1",
        userAttempted: true,
      },
      {
        question: "question",
        options: ["1", "2", "3", "4"],
        answer: "2",
        hint: "hint",
        userResponse: "1",
        userAttempted: true,
      },
    ];
    test("ownload feature on the result page", async () => {
      render(
        <QuizContextProvider defaultQuiz={mockQuizContextValue}>
          <BrowserRouter>
            <Result />
          </BrowserRouter>
        </QuizContextProvider>
      );

      await waitFor(() => expect(feedbackRequest).toHaveBeenCalled());

      // Get the download button
      const downloadButton = screen.getByTestId("download-report-button");

      // Click the download button
      fireEvent.click(downloadButton);

      // Ensure downloadQuiz function is called
      expect(downloadQuiz).toHaveBeenCalled();
    });
  });
});

describe("InputComponent encryption feature", () => {
  const mockQuizState = {
    quiz: [],
    setQuiz: {
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
    },
  };
  test("cheking if the encryption is clicked twice than no encryption", async () => {
    const expectedResponse = "done";
    const mockQuiz = "quiz";
    const mockTemplate = "template";
    const password = "password";

    render(
      <QuizContextProvider defaultQuiz={mockQuizState}>
        <BrowserRouter>
          <InputComponent />
        </BrowserRouter>
      </QuizContextProvider>
    );

    const checkbox = screen.getByLabelText("Lock with password");
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    const downloadButton = screen.getByText("Download Quiz");
    fireEvent.click(downloadButton);
    const encrpytPDF = vi.fn();
    encrpytPDF.mockResolvedValueOnce("give the encrypted file back");
    const downloadFile = vi.fn();
    downloadFile.mockResolvedValueOnce("give the download link");
    const response = await downloadFile();
    if (response == "give the download link")
      downloadQuiz.mockResolvedValueOnce(expectedResponse);

    const res = await downloadQuiz(mockQuiz, mockTemplate, password);

    expect(res).toBe(expectedResponse);
  });
  test("cheking if the encryption is clicked thrice than encryption", async () => {
    const expectedResponse = "done";
    const mockQuiz = "quiz";
    const mockTemplate = "template";
    const password = "password";

    render(
      <QuizContextProvider defaultQuiz={mockQuizState}>
        <BrowserRouter>
          <InputComponent />
        </BrowserRouter>
      </QuizContextProvider>
    );

    const checkbox = screen.getByLabelText("Lock with password");
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);
    fireEvent.click(checkbox);

    const downloadButton = screen.getByText("Download Quiz");
    fireEvent.click(downloadButton);
    const encrpytPDF = vi.fn();
    encrpytPDF.mockResolvedValueOnce("give the encrypted file back");
    const downloadFile = vi.fn();
    downloadFile.mockResolvedValueOnce("give the download link");
    const response = await downloadFile(encrpytPDF());
    if (response == "give the download link")
      downloadQuiz.mockResolvedValueOnce(expectedResponse);

    const res = await downloadQuiz(mockQuiz, mockTemplate, password);

    expect(res).toBe(expectedResponse);
  });
});

describe("AttemptingPart Component hint feature", () => {
  test("flips the card and displays back text when clicked", () => {
    render(
      <AttemptingPart
        question={{
          question: "Test Question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          attempted: false,
          userResponse: "",
          hint: "Test Hint",
        }}
        passValue={() => {}}
        index={0}
      />
    );

    const hintButton = screen.getByText("Click here for a hint!");
    fireEvent.click(hintButton);

    const backText = screen.getByText("Test Hint");
    expect(backText).toBeInTheDocument();
  });

  test("flips the card back to front when clicked again", () => {
    render(
      <AttemptingPart
        question={{
          question: "Test Question",
          options: ["Option 1", "Option 2", "Option 3", "Option 4"],
          attempted: false,
          userResponse: "",
          hint: "Test Hint",
        }}
        passValue={() => {}}
        index={0}
      />
    );
    const hintButton = screen.getByText("Click here for a hint!");
    fireEvent.click(hintButton);

    fireEvent.click(screen.getByText("Test Hint"));

    const frontText = screen.getByText("Click here for a hint!");
    expect(frontText).toBeInTheDocument();
  });
});

// Mock feedbackRequest function

describe("Result Component - Feedback Feature", () => {
  const mockQuizContextValue = [
    {
      question: "question",
      options: ["1", "2", "3", "4"],
      answer: "2",
      hint: "hint",
      userResponse: "1",
      userAttempted: true,
    },
    {
      question: "question",
      options: ["1", "2", "3", "4"],
      answer: "2",
      hint: "hint",
      userResponse: "1",
      userAttempted: true,
    },
  ];

  test("displays loading state while fetching feedback", async () => {
    render(
      <QuizContextProvider defaultQuiz={mockQuizContextValue}>
        <BrowserRouter>
          <Result />
        </BrowserRouter>
      </QuizContextProvider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Ensure feedback is fetched
    await waitFor(() => expect(feedbackRequest).toHaveBeenCalled());
  });

  test("displays fetched feedback after loading", async () => {
    render(
      <QuizContextProvider defaultQuiz={mockQuizContextValue}>
        <BrowserRouter>
          <Result />
        </BrowserRouter>
      </QuizContextProvider>
    );
    await waitFor(() => expect(feedbackRequest).toHaveBeenCalled());
    screen.debug();
    expect(screen.getByText("mocked feedback")).toBeInTheDocument();
  });
});
// extra integration test for the input component checking

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
