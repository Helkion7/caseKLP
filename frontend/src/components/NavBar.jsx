import React from "react";
import { User, ChevronDown } from "lucide-react";

function NavBar() {
  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <a href="/" className="text-3xl font-bold text-gray-800">
            <span className="font-serif">klp</span>
          </a>

          {/* Main navigation links */}
          <div className="flex items-center space-x-6">
            <a
              href="/person"
              className="text-gray-900 border-b-2 border-gray-900 pb-1 font-medium"
            >
              Person
            </a>
            <a
              href="/virksomhet"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Virksomhet
            </a>

            <div className="h-6 border-l border-gray-300 mx-2"></div>

            <a
              href="/pension"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Pension
            </a>
            <a
              href="/fond"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Fond
            </a>
            <a
              href="/bank"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Bank
            </a>
            <a
              href="/forsikring"
              className="text-gray-600 hover:text-gray-900 font-medium"
            >
              Forsikring
            </a>
          </div>
        </div>

        {/* Right side links */}
        <div className="flex items-center space-x-6">
          <a
            href="/kontakt-oss"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Kontakt oss
          </a>
          <a
            href="/skjemaer"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Skjemaer
          </a>
          <a
            href="/sok"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Søk
          </a>

          <div className="border border-gray-300 rounded px-4 py-2 flex items-center space-x-2 hover:bg-gray-50">
            <User size={18} className="text-gray-700" />
            <span className="font-medium text-gray-800">Logg inn</span>
            <ChevronDown size={18} className="text-gray-600" />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
