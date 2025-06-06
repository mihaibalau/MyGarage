import React from "react";
import Link from "next/link";
import { FaCar } from "react-icons/fa";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-4 shadow-md mb-8">

      <Link href="/" className="flex items-center gap-3 group">
        <FaCar className="text-4xl text-teal-600" />
        <span className="text-2xl font-bold tracking-tight text-zinc-800">
          MyGarage
        </span>
      </Link>

      <ul className="flex items-center gap-8">
        <li>
          <Link
            href="/cars"
            className="text-lg font-medium text-zinc-600"
          >
            Garage
          </Link>
        </li>
        <li>
          <Link
            href="/cars/add"
            className="px-5 py-2 rounded-full bg-teal-600 text-white font-semibold"
          >
            Add Car
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
