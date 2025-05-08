import React from "react";
import Link from "next/link";
import { FaCar } from "react-icons/fa";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between px-12 py-4 shadow-md mb-8">

      <Link href="/" className="flex items-center gap-3 group">
        <FaCar className="text-4xl text-blue-600 group-hover:scale-110 transition-transform" />
        <span className="text-2xl font-bold tracking-tight text-zinc-800 group-hover:text-blue-600 transition-colors">
          MyGarage
        </span>
      </Link>

      <ul className="flex items-center gap-8">
        <li>
          <Link
            href="/cars"
            className="text-lg font-medium text-zinc-600 hover:text-blue-600 transition-colors"
          >
            Garage
          </Link>
        </li>
        <li>
          <Link
            href="/cars/add"
            className="px-5 py-2 rounded-full bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Add Car
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
