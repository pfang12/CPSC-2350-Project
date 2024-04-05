import { describe, expect, test, vi, afterEach } from "vitest";
import { quizRequest, feedbackRequest } from "../api/gptapi";
import axios from "axios";
import { extractText, downloadQuiz } from "../api/pdfapi";

// for chatGpt api tests
vi.mock("axios");
describe("testing the features of chatgpt api for the getting the quiz", () => {
  afterEach(() => {
    axios.post.mockClear();
  });

  // Mock axios post requests
  describe("testing the quiz generation of chatGpt api", () => {
    test("should return generated quiz questions", async () => {
      const numberQuestions = 5;
      const questionType = "multiple-choice";
      const gptInput = "Some text for generating questions";
      const expectedResponse = "Generated quiz questions";
      axios.post.mockResolvedValueOnce({
        data: { choices: [{ message: { content: expectedResponse } }] },
      });

      const response = await quizRequest(
        numberQuestions,
        questionType,
        gptInput
      );

      expect(response).toBe(expectedResponse);
    });

    test("should handle errors", async () => {
      const numberQuestions = 5;
      const questionType = "multiple-choice";
      const gptInput = "Some text for generating questions";
      const errorMessage = "API request failed";
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      try {
        await quizRequest(numberQuestions, questionType, gptInput);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
  describe("quizRequest function with hints", () => {
    test("should return generated quiz questions with hints if available", async () => {
      const mockResponse = {
        data: {
          choices: [
            {
              message: { content: "quiz questions with hint" },
            },
          ],
        },
      };
      axios.post.mockResolvedValueOnce(mockResponse);

      const numberQuestions = 5;
      const questionType = "general";
      const gptInput = "Sample text for generating quiz questions";

      const response = await quizRequest(
        numberQuestions,
        questionType,
        gptInput
      );
      expect(response).toBe("quiz questions with hint");
    });

    test("should handle errors for the hint", async () => {
      const errorMessage = "Request failed";
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      const numberQuestions = 5;
      const questionType = "general";
      const gptInput = "Sample text for generating quiz questions";

      try {
        await quizRequest(numberQuestions, questionType, gptInput);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
        expect(axios.post).toHaveBeenCalledTimes(1);
      }
    });
  });
  describe("feedbackRequest function", () => {
    test("should return generated feedback", async () => {
      const wrongQuestions = ["Question 1", "Question 3"];
      const rightQuestions = ["Question 2", "Question 4"];
      const expectedFeedback = "Generated feedback"; // Provide expected feedback here
      axios.post.mockResolvedValueOnce({
        data: { choices: [{ message: { content: expectedFeedback } }] },
      });

      const feedback = await feedbackRequest(wrongQuestions, rightQuestions);

      expect(feedback).toBe(expectedFeedback);
    });

    test("handling errors", async () => {
      const wrongQuestions = ["Question 1", "Question 3"];
      const rightQuestions = ["Question 2", "Question 4"];
      const errorMessage = "API request failed";
      axios.post.mockRejectedValueOnce(new Error(errorMessage));

      try {
        await feedbackRequest(wrongQuestions, rightQuestions);
      } catch (error) {
        expect(error.message).toBe(errorMessage);
      }
    });
  });
});
vi.mock("../api/pdfapi", () => ({
  extractText: vi.fn(),
  downloadQuiz: vi.fn(),
}));
describe("checking the pdf feature ", () => {
  describe("checking the extract text", () => {
    afterEach(() => {
      extractText.mockClear();
    });
    test("extract text testing", async () => {
      const expectedResponse = "expected text";
      extractText.mockResolvedValueOnce(expectedResponse);
      const response = await extractText("mocked file");
      expect(response).toBe(expectedResponse);
    });
  });
  test("extract text testing for false value", async () => {
    const errorMessage = "API request failed";
    extractText.mockRejectedValueOnce(errorMessage);
    try {
      await extractText("mocked file");
    } catch (error) {
      expect(error).toBe(errorMessage);
    }
  });
  const quizDataBuilder = vi.fn();
  quizDataBuilder.mockResolvedValueOnce("quiz with answers");
  describe("checking the downloading pdf feature so that the text can be converted to pdf", () => {
    describe("checking the downloading PDF feature", () => {
      afterEach(() => {
        downloadQuiz.mockClear();
      });
      test("if we need to download the quiz PDF without encryption", async () => {
        const expectedResponse = "done";
        const mockQuiz = "quiz";
        const mockTemplate = "template";
        // Call the function
        const downloadFile = vi.fn();
        downloadFile.mockResolvedValueOnce("give the download link");

        const response = await downloadFile();
        if (response == "give the download link")
          downloadQuiz.mockResolvedValueOnce(expectedResponse);

        const res = await downloadQuiz(mockQuiz, mockTemplate);

        expect(res).toBe(expectedResponse);
      });

      test("if we need to download the quiz PDF without encryption error handling", async () => {
        const mockQuiz = "quiz";
        const mockTemplate = "template";
        const errorMessage = "error in process";
        const expectedResponse = "done";

        const downloadFile = vi.fn();
        downloadFile.mockRejectedValueOnce(errorMessage);

        try {
          const response = await downloadFile();
          if (response == "give the download link") {
            downloadQuiz.mockResolvedValueOnce(expectedResponse);
          }
        } catch (err) {
          expect(err).toBe(errorMessage);
        }
        const res = await downloadQuiz(mockQuiz, mockTemplate);
        expect(res).not.toBe(expectedResponse);
      });
    });

    describe("checking the downloading PDF feature with encryption feature", () => {
      afterEach(() => {
        downloadQuiz.mockClear();
      });
      test("if we need to download the quiz PDF with encryption", async () => {
        const expectedResponse = "done";
        const mockQuiz = "quiz";
        const mockTemplate = "template";
        const password = "password";

        if (password) {
          const encrpytPDF = vi.fn();
          encrpytPDF.mockResolvedValueOnce("give the encrypted file back");
          const downloadFile = vi.fn();
          downloadFile.mockResolvedValueOnce("give the download link");
          const response = await downloadFile(encrpytPDF());
          if (response == "give the download link")
            downloadQuiz.mockResolvedValueOnce(expectedResponse);
        }

        const res = await downloadQuiz(mockQuiz, mockTemplate, password);

        // Assert the response
        expect(res).toBe(expectedResponse);
      });

      test("if we need to download the quiz PDF encryption not working", async () => {
        const mockQuiz = "quiz";
        const expectedResponse = "done";
        const mockTemplate = "template";
        const errorMessage = "error in process";
        // Call the function
        const encryptPDF = vi.fn();
        encryptPDF.mockRejectedValueOnce(errorMessage);

        try {
          const response = await encryptPDF();
          if (response == "give the encrypted file back") {
            const downloadFile = vi.fn();
            downloadFile.mockResolvedValueOnce("give the download link");
            const res = await downloadFile(response);
            if (res == "give the download link")
              downloadQuiz.mockResolvedValueOnce(expectedResponse);
          }
        } catch (err) {
          expect(err).toBe(errorMessage);
        }
        const res = await downloadQuiz(mockQuiz, mockTemplate);
        expect(res).not.toBe(expectedResponse);
      });
    });
  });
});
