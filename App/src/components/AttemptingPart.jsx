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

  const colors = [
    "bg-iqLightGreen",
    "bg-iqLightRed",
    "bg-iqLightYellow",
    "bg-iqLightBlue",
  ];
  const selectedColors = ["bg-iqGreen", "bg-iqRed", "bg-iqYellow", "bg-iqBlue"];

  // option == selectedValue ? full color : normal color

  return (
    <div className="w-full">
      <h1 className="text-header text-dPurple mb-3">
        {index + 1}. {question.question}
      </h1>
      <div className="grid grid-cols-2 gap-4 w-full">
        {question.options.map((option, idx) => (
          <div
            key={idx}
            className={`text-center text-button py-10 w-full justify-start cursor-pointer rounded-lg drop-shadow-lg ${
              option == selectedValue
                ? `inner-border-3 inner-border-amethyst text-seasalt ${selectedColors[idx]}`
                : colors[idx]
            }`}
            onClick={() => handleOptionSelect(option)}
          >
            {option}
          </div>
        ))}
      </div>

      <div className="mb-10">
        <FlipCard
          key={`hint-${index}`} // Reset flip card when the question index changes
          text="Click here for a hint!"
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
    <div className="mt-10">
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical ">
        <div
          onClick={handleClick}
          className="py-10 bg-thistle w-full text-center text-button rounded-lg cursor-pointer"
        >
          {text}
        </div>

        <div
          onClick={handleClick}
          className="py-10 bg-magnolia inner-border-3 inner-border-amethyst text-center w-full text-button font-garamond rounded-lg cursor-pointer"
        >
          {backText}
        </div>
      </ReactCardFlip>
    </div>
  );
}
