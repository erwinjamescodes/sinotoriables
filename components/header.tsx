"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="border-b bg-primary text-white px-4 sm:px-6 md:px-6 lg:px-24 h-16 fixed w-full z-50">
      <div className="flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6 justify-between w-full">
          <Link href="/" className={`flex items-center gap-2`}>
            <span className="text-xl font-bold">SinoToriables PH</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            <Link
              href="/candidates"
              className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname === "/candidates" ? "text-gray-300 font-bold" : ""
              }`}
            >
              Candidates
            </Link>
            <Link
              href="/my-list"
              className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname === "/my-list" ? "text-gray-300 font-bold" : ""
              }`}
            >
              My List
            </Link>
            <Link
              href="/analytics"
              className={`text-sm font-medium transition-colors hover:text-gray-300 ${
                pathname === "/analytics" ? "text-gray-300 font-bold" : ""
              }`}
            >
              Analytics
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors hover:text-gray-300 ${
                pathname === "/about" ? "text-gray-300 font-bold" : ""
              }`}
            >
              About
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-primary py-4 px-4 border-t border-gray-700">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/candidates"
              className={`text-sm font-medium transition-colors hover:text-gray-300 py-2 ${
                pathname === "/candidates" ? "text-gray-300 font-bold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Candidates
            </Link>
            <Link
              href="/my-list"
              className={`text-sm font-medium transition-colors hover:text-gray-300 py-2 ${
                pathname === "/my-list" ? "text-gray-300 font-bold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              My List
            </Link>
            <Link
              href="/analytics"
              className={`text-sm font-medium transition-colors hover:text-gray-300 py-2 ${
                pathname === "/analytics" ? "text-gray-300 font-bold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Analytics
            </Link>
            <Link
              href="/about"
              className={`text-sm transition-colors hover:text-gray-300 py-2 ${
                pathname === "/about" ? "text-gray-300 font-bold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
