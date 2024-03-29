import { useContext, useEffect } from "react";
import { QuizContext } from "../context/QuizContext";

import { useNavigate } from "react-router-dom";
import Divider from "./Divider";
function Result() {
    const { quiz } = useContext(QuizContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (quiz.length == 0) {
            homePage();
        }
    }, [quiz]);
    function homePage() {
        navigate("/*");
    }
    const getScore = () => {
        let score = 0;
        quiz.map((data) => {
            if (data.answer === data.userResponse) return score++;
        });
        return score;
    };

    return (
        <div className="col-span-12">
            <h1 className="text-4xl text-dPurple mb-6">
                Your Score{" "}
                <span className="text-amethyst">
                    {getScore()} / {quiz.length}
                </span>
            </h1>
            <div className="flex gap-4 mb-10">
                <button className="text-seasalt bg-amethyst text-center w-150 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple" onClick={homePage}>Home Page</button>
                <button className="text-dPurple bg-magnolia inner-border-3 inner-border-amethyst text-center px-2 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple hover:inner-border-thistle">Download Report</button>
            </div>
            <Divider /> 
            <div>
                {quiz.map((data, i) => (
                    <DisplayQuiz data={data} key={i} index={i + 1} />
                ))}
            </div>
            <Divider />
            <h1 className="text-header text-dPurple">Feedback</h1>
            {/*The feedback text goes here*/}
            <button
                type="button"
                className="text-seasalt bg-amethyst text-center w-150 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple my-6 mr-4"
                onClick={homePage}
            >
                Home Page
            </button>
            <button className="text-dPurple bg-magnolia inner-border-3 inner-border-amethyst text-center px-2 py-1 text-button rounded-md drop-shadow-lg hover:bg-thistle hover:text-dPurple hover:inner-border-thistle">Download Report</button>
            </div>
    );
}
export const DisplayQuiz = ({ data, index }) => {
    return (
        <div className="mb-10">
            <div>
                <p className="text-button text-dPurple mb-3">{index}. {data.question}</p>
            </div>
            <div>
                {data.options.map((value, index) => (
                    <div
                        key={`default-${value}`}
                        className={`mb-2 flex items-center gap-2 rounded-md p-2 inner-border-3 ${
                            value == data.answer
                                ? "bg-iqLightGreen inner-border-iqGreen"
                                : value == data.userResponse 
                                ? "bg-iqLightRed inner-border-iqRed"
                                : "bg-seasalt inner-border-thistle"
                        }`}
                    >
                
                        <p className="text-body">{`${value}`}</p>
                    </div>
                ))}
            </div>
            <div>
                {data.options.map((value, index) => (
                    <div key={`explanation-${value}`}>
                        {value == data.answer && value == data.userResponse ? (
                            ""
                        ) : data.answer == value ? (
                            <p>{data.explanation}</p>
                        ) : (
                            ""
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Result;
