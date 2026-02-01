import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage.jsx";
import Catalog from "./pages/Catalog/Catalog.jsx";
import CamperDetails from "./pages/CamperDetails/CamperDetails.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/catalog/:id" element={<CamperDetails />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;