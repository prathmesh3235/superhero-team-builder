// pages/login.js
import React from "react";
import "../src/app/globals.css";
import SuperheroLandingPage from "../components/SuperHeroLandingPage";
import Footer from "../components/Footer";


const Login = () => {

  return (
    <div className="min-h-screen bg-gray-900 text-white relative scroll-smooth">
      <SuperheroLandingPage/>
      <Footer />
    </div>
  );
};

export default Login;
