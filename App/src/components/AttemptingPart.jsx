import React, { useEffect, useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import '../styles/AttemptingPart.css';

export default function AttemptingPart({ question, passValue, index, goToNextQuestion }) {
  const [selectedValue, setSelectedValue] = useState('');
  const [revealAnswer, setRevealAnswer] = useState(false);

  useEffect(() => {
    setSelectedValue('');
    setRevealAnswer(false);
  }, [question]);

  const handleOptionSelect = (option) => {
    setSelectedValue(option);
  };

  const handleSubmit = () => {
    passValue(selectedValue);
    setRevealAnswer(true);
  };

  const getButtonVariant = (option) => {
    if (revealAnswer) {
      if (option === question.answer) {
        return 'success';
      }
      if (option === selectedValue) {
        return 'danger';
      }
      return 'outline-secondary';
    }
    return option === selectedValue ? 'info' : 'outline-primary';
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
              variant={getButtonVariant(option)}
              className="option-button"
              onClick={() => handleOptionSelect(option)}
              disabled={revealAnswer}
            >
              {option}
            </Button>
          ))}
        </div>
        {!revealAnswer && (
          <Button variant="primary" onClick={handleSubmit} className="submit-button">
            Submit
          </Button>
        )}
        <div className="hint-clarification">
          <FlipCard
          key={`clarification-${index}`} // Reset flip card when the question index changes
          text="Need clarification?"
          backText={question.clarification || "No clarification available."}
          />
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
    <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={() => setIsFlipped(!isFlipped)}>
      <div className="flip-card-inner">
        <div className="flip-card-front">
          {text}
        </div>
        <div className="flip-card-back">
          {backText}
        </div>
      </div>
    </div>
  );
}



