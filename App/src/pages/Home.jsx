import InputComponent from "../components/InputComponent";
import QuizComponent from "../components/QuizComponent";
import Result from "../components/Result";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";

function Home() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/*" element={<InputComponent />} />
        <Route path="/attempt" element={<QuizComponent />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </div>
  );
}

export default Home;
