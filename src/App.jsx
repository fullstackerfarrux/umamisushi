import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Orders from "./Pages/Orders";
import SinglePage from "./Pages/SinglePage";
import "./index.scss";
import Payment from "./Pages/Payment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:id" element={<Home />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/single-product/:id" element={<SinglePage />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </>
  );
}

export default App;
