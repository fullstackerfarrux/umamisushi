import React, { useState } from "react";
import Header from "../Components/Header";
import Slider from "../Components/Slider";
import Products from "../Components/Products";

const Home = () => {
  return (
    <>
      <div className="home">
        <Header />
        <Slider />
        <Products />
      </div>
    </>
  );
};

export default Home;
