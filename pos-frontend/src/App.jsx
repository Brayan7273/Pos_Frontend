import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./assets/pages/Login";
import ProductsList from "./assets/pages/ProductsList";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/productsList" element={<ProductsList />} />
      </Routes>
    </Router>
  );
}

export default App;
