import React, { useEffect, useState } from "react";
import ReactCardFlip from "react-card-flip";

export default function AttemptingPart({ question, passValue, index }) {
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    if (question.attempted == true) setSelectedValue(question.userResponse);
    else setSelectedValue("");
  }, [question]);

  const handleOptionSelect = (option) => {
    console.log(option);
    setSelectedValue(option);
    passValue(option);
  };

  return (
    <div>
      <h1 className="text-2xl text-font">
        {index + 1}. {question.question}
      </h1>
      <div className="flex flex-col  gap-3 py-4 px-10 mb-6">
        {question.options.map((option, idx) => (
          <p
            key={idx}
            className={` px-2 py-2 w-4/6 justify-start cursor-pointer border border-gray-300 rounded-lg ${
              option == selectedValue ? "bg-primary" : "hover:bg-primaryShade3"
            } `}
            onClick={() => handleOptionSelect(option)}
          >
            {`${idx + 1}. ${option}`}
          </p>
        ))}
      </div>

      <div className="mb-8">
        <FlipCard
          key={`hint-${index}`} // Reset flip card when the question index changes
          text="Hint?"
          backText={question.hint || "No hints available."}
        />
      </div>
    </div>
  );
}

// FlipCard Component
function FlipCard({ text, backText }) {
  const [isFlipped, setIsFlipped] = useState(false);
  console.log(text);
  function handleClick() {
    setIsFlipped(!isFlipped);
  }

  return (
    <div>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical ">
        <div
          onClick={handleClick}
          className="px-10 py-6 bg-primaryShade3 w-4/6 text-center text-lg rounded-lg  "
        >
          {text}
        </div>

        <div
          onClick={handleClick}
          className="px-10 py-6 bg-primaryShade1 w-4/6  text-lg rounded-lg "
        >
          {backText}
        </div>
      </ReactCardFlip>
    </div>
  );
}
