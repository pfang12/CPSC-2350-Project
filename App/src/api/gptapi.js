import axios from "axios";

const jsonTemplate =
  "{questions: [{questions: [{'question': 'What is the capital city of canada?','options': ['vancouver', 'ottawa', 'winnipeg', 'toronto'],'answer': 'ottawa','hint':'','explanation':''},{'question': 'Capital city of canada is ottawa','options': ['true', 'false'],'answer': 'true','hint':'','explanation':'']}";

// function for generating prompt to generate the quiz
function generateQuiz(numberQuestions, questionType, gptInput) {
  //return `generate ${numberQuestions} questions of type ${questionType} based on this text: ${gptInput}. Return answer as json like: ${jsonTemplate} replacing single quotes with double quotes`;
  return `generate ${numberQuestions} questions of type ${questionType} based on this text: ${gptInput}. Return answer as json like: ${jsonTemplate} replacing single quotes with double quotes.  Provide a slight indication (or the primary cause) as a hint for each question and do not reveal the answer directly. Limit to 15 words. Also explain the answer to the question in not more than 50 words, do not refer to the text in any of the explanations and hints, you may use your database to explain. 
  (Refer to this example for hint:{ Question: What is the capital city of canada?;Hint: This city sits on the border of Ontario and Quebec.}, {Question: Canada shares its longest international land border with Mexico.; Hint: Look to the north for Canada's longest international land border.}`;
}

// function for generating prompt to generate the feedback
function generateFeedback(wrongQuestions, rightQuestions) {
  return `For the given quiz, user attempted these questions wrong: ${wrongQuestions} and these questions right: 
  ${rightQuestions} Can you provide feedback to the user based on the attempts in about 100 words. 
  Let the user know where they did great and where more effort is required for learning. 
  Appreciate the user based on the following grading criteria : 95>= outstanding, 85>= excellent, 75>=good, 
  65>= Average, 50>= Below average, 50 < work hard(fail). Don't use the scale in feedback`
}

//function to call chatgpt to generate quiz
export const quizRequest = async (numberQuestions, questionType, gptInput) => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY;

  const prompt = generateQuiz(numberQuestions, questionType, gptInput);

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    console.log(response.data.choices[0].message.content);
    // setGptResponse(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error: ", error);
  }
};

//function to call chatgpt to generate feedback
export const feedbackRequest = async (wrongQuestions, rightQuestions) => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY;

  const prompt = generateFeedback(wrongQuestions, rightQuestions);

  const data = {
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  };

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );
    console.log(response.data.choices[0].message.content);
    // setGptResponse(response.data.choices[0].message.content);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error: ", error);
  }
};