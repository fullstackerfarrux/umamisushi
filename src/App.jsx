import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import Orders from "./Pages/Orders";
import SinglePage from "./Pages/SinglePage";
import Payment from "./Pages/Payment";
import "./index.scss";

function App() {
  return (
    <>
      <Routes>
        <Route path="/:id" element={<Home />} />
        <Route path="/order" element={<Orders />} />
        <Route path="/single-product/:id" element={<SinglePage />} />
        <Route path="/payment" element={<Payment />} />
      </Routes>
    </>
  );
}

export default App;
