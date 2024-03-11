import React from "react";
import logo from './images/brand.png'; 

function Navbar() {
  return (
    <nav className="navbar">
      <img src={logo} alt="Logo" style={{ width: '300px', height: '100px' }} className="navbar-logo" />
      <h1 className="navbar-title">Navbar</h1>
    </nav>
  );
}

export default Navbar;

