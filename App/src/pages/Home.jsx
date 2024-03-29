import InputComponent from "../components/InputComponent";
import QuizComponent from "../components/QuizComponent";
import Result from "../components/Result";
import { Route, Routes } from "react-router-dom";
import Navbar from "../components/Navbar";
import Divider from "../components/Divider";

function Home() {
  return (
    <div className="px-10 py-2 font-oswald w-8/12 grid grid-cols-12">
      <Navbar />
      <Divider />
      <Routes>
        <Route path="/*" element={<InputComponent />} />
        <Route path="/attempt" element={<QuizComponent />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </div>
  );
}

export default Home;
