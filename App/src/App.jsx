import Home from "./pages/Home";
import { BrowserRouter as Router } from "react-router-dom";
function App() {
  return (
    <Router>
      <Home className="font-oswald" />
    </Router>
  );
}

export default App;
