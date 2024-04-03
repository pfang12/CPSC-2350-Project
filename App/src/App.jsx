import Home from "./pages/Home";
import { HashRouter as Router } from "react-router-dom";
function App() {
  return (
    <Router>
      <div className="flex justify-center">
      <Home className="font-oswald" />
      </div>
    </Router>
  );
}

export default App;
