import React from "react";
import logo from "./images/logo.png";

function Navbar() {
  return (
    <nav className="py-2 ">
      <div className="flex items-center gap- border-b-2 border-primary">
        <img
          src={logo}
          alt="logo"
          className="align-middle w-12 cursor-pointer mb-4 py-2"
        />
        <h1 className="text-shadow-2 font-bold text-4xl inline-block align-middle ">
          IntelliQuiz
        </h1>
      </div>
    </nav>
  );
}

export default Navbar;
