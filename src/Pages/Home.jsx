import React, { useState } from "react";
import Header from "../Components/Header";
import Slider from "../Components/Slider";
import Products from "../Components/Products";
import { useParams } from "react-router-dom";

const Home = () => {
  const { id } = useParams();
  console.log(id);
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
