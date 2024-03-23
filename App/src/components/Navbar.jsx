import React from "react";
import logo from "./images/logo.png";

function Navbar() {
  return (
    <nav className="">
      <div className="">
        <img src={logo} alt="logo" className="w-20 " />
      </div>
    </nav>
  );
}

export default Navbar;
