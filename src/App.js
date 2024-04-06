import Conversations from "./Conversations";
import Flagged from "./Flagged";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Conversations />} exact />
      <Route path="/flagged" element={<Flagged />} exact />
    </Routes>
  );
}

export default App;
