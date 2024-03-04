import axios from "axios";

const jsonTemplate =
  "{questions: [{'question': '','options': ['', '', '', ''],'answer': ''},{'question': '','options': ['', '', '', ''],'answer': ''}]}";

// function for generating prompt for the chatGpt
function generatePrompt(numberQuestions, questionType, gptInput) {
  return `generate ${numberQuestions} questions of type ${questionType} based on this text: ${gptInput}. Return answer as json like: ${jsonTemplate} replacing single quotes with double quotes`;
}

//function to call chat gpt
export const gptRequest = async (numberQuestions, questionType, gptInput) => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY;

  const prompt = generatePrompt(numberQuestions, questionType, gptInput);

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
