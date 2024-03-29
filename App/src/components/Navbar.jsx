import React from "react";
import brand from "./images/brand.png";

function Navbar() {
  return (
      <div className="col-span-12">
        <img
          src={brand}
          alt="Intelliquiz Logo"
          className="w-300"
        />
      </div>
  );
}

export default Navbar;
