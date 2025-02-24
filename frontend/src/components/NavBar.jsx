import React from "react";
import { User, ChevronDown } from "lucide-react";

function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          <a href="/" className="text-3xl font-bold text-gray-800">
            <span className="font-serif">klp</span>
          </a>

          <div className="flex items-center space-x-6">
            <a
              href="/account"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Account
            </a>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="/about"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            About us
          </a>
          <a
            href="/login"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Login
          </a>
          <a
            href="/register"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Register
          </a>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
