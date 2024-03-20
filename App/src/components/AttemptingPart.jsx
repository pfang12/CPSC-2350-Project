import React, { useEffect, useState } from "react";
import { Card, Button } from "react-bootstrap";
import "../styles/AttemptingPart.css";

export default function AttemptingPart({ question, passValue, index }) {
  const [selectedValue, setSelectedValue] = useState("");

  useEffect(() => {
    setSelectedValue("");
  }, [question]);

  const handleOptionSelect = (option) => {
    console.log(option);
    question.userResponse = option;
    setSelectedValue(option);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          {index + 1}. {question.question}
        </Card.Title>
        <div className="options">
          {question.options.map((option, idx) => (
            <Button
              key={idx}
              variant={option === selectedValue ? "info" : "outline-primary"}
              className="option-button"
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </Button>
          ))}
        </div>

        <div className="hint-clarification">
          <FlipCard
            key={`hint-${index}`} // Reset flip card when the question index changes
            text="Hint?"
            backText={question.hint || "No hints available."}
          />
        </div>
      </Card.Body>
    </Card>
  );
}

// FlipCard Component
function FlipCard({ text, backText }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className={`flip-card ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">{text}</div>
        <div className="flip-card-back">{backText}</div>
      </div>
    </div>
  );
}
