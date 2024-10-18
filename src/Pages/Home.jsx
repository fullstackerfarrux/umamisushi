import React, { useState } from "react";
import Header from "../Components/Header";
import Slider from "../Components/Slider";
import Products from "../Components/Products";
import { useParams } from "react-router-dom";

const Home = () => {
  const APP_VERSION = '1.0.0';
  const savedVersion = localStorage.getItem('app_version');
  if (savedVersion !== APP_VERSION) {
    // Clear localStorage if the version has changed
    localStorage.clear();

    // Store the new version to prevent clearing on every load
    localStorage.setItem('app_version', APP_VERSION);
  }
  const { id } = useParams();
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
