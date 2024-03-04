import Form from "react-bootstrap/Form";
export default function AttemptingPart({ question, passValue, index }) {
  console.log(question);

  return (
    <div>
      <div>
        <p>
          {index + 1} {question.question}
        </p>
      </div>
      <div>
        <Form>
          {question.options.map((value, index) => (
            <div key={`default-${value}`} className="mb-3">
              <Form.Check
                onClick={() => passValue(value)}
                type="radio"
                id={`default-radio-${index}`}
                label={`${index + 1} ${value}`}
                name="radioGroup" // Set the same name for all radio buttons in the group
              />
            </div>
          ))}
        </Form>
      </div>
    </div>
  );
}
