import React from "react";
import logo from "./images/logo.png";

function Navbar() {
  return (
    <nav className="px-4 py-2 border-b-2">
      <div className="flex items-center gap-2">
        <img
          src={logo}
          alt="logo"
          className="align-middle w-12 cursor-pointer"
        />
        <h1 className="text-shadow-2 font-bold text-4xl inline-block align-middle">
          IntelliQuiz
        </h1>
      </div>
    </nav>
  );
}

export default Navbar;
