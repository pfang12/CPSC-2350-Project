import axios from "axios";

const jsonTemplate =
  "{questions: [{questions: [{'question': 'What is the capital city of canada?','options': ['vancouver', 'ottawa', 'winnipeg', 'toronto'],'answer': 'ottawa','hint':'','explanation':''},{'question': 'Capital city of canada is ottawa','options': ['true', 'false'],'answer': 'true','hint':'','explanation':'']}";

// function for generating prompt for the chatGpt
function generatePrompt(numberQuestions, questionType, gptInput) {
  //return `generate ${numberQuestions} questions of type ${questionType} based on this text: ${gptInput}. Return answer as json like: ${jsonTemplate} replacing single quotes with double quotes`;
  return `generate ${numberQuestions} questions of type ${questionType} based on this text: ${gptInput}. Return answer as json like: ${jsonTemplate} replacing single quotes with double quotes.  Provide a slight indication (or the primary cause) as a hint for each question and do not reveal the answer directly. Limit to 15 words. Also explain the answer to the question in not more than 50 words, do not refer to the text in any of the explanations and hints, you may use your database to explain. 
  (Refer to this example for hint:{ Question: What is the capital city of canada?;Hint: This city sits on the border of Ontario and Quebec.}, {Question: Canada shares its longest international land border with Mexico.; Hint: Look to the north for Canada's longest international land border.}`;
}

//function to call chat gpt
export const gptRequest = async (numberQuestions, questionType, gptInput) => {
  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_KEY;

  const prompt = generatePrompt(numberQuestions, questionType, gptInput);

  const data = {
    model: "gpt-4",
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
